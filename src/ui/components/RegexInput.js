/**
 * RegexInput.js
 * Handles regex input and validation.
 */

import { appState } from '../../app/state.js';
import { tokenize } from '../../parser/regexTokenizer.js';
import { validate } from '../../parser/regexValidator.js';
import { toPostfix } from '../../parser/regexToPostfix.js';
import { evaluate } from '../../parser/postfixEvaluator.js';
import { removeEpsilons } from '../../automata/nfa/epsilonRemoval.js';
import { optimizeNFA } from '../../automata/nfa/nfaOptimizer.js';
import { optimizeENFA } from '../../automata/epsilonNFA/eNfaOptimizer.js';
import { toDFA } from '../../automata/dfa/subsetConstruction.js';
import { minimizeDFA } from '../../automata/dfa/dfaMinimizer.js';
import { renameStates } from '../../automata/dfa/dfaStateNaming.js';

export class RegexInput {
    constructor() {
        this.input = document.getElementById('regex-input');
        this.btn = document.getElementById('visualize-btn');

        this.btn.addEventListener('click', () => this.process());

        // Trigger visualize on Enter key
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.process();
            }
        });
    }

    process() {
        const regex = this.input.value.trim();
        if (!regex) return;

        // Check for complexity: Kleene star (*) OR > 4 distinct alphabets
        const alphabets = new Set(regex.match(/[a-zA-Z0-9]/g) || []);
        const hasKleene = regex.includes('*');

        if (hasKleene || alphabets.size > 4) {
            const toastContainer = document.getElementById('toast-container');
            if (toastContainer) {
                const toast = document.createElement('div');
                toast.className = 'toast toast-warning';
                // User requested specific message
                toast.innerHTML = '⚠️ <strong>Complexity Alert:</strong><br>The diagram may not be clearly visible due to complexity.<br>Try visualizing multiple times to get a better layout.';

                // Make it stay longer due to length
                toastContainer.appendChild(toast);
                setTimeout(() => toast.remove(), 6000);
            }
        }

        try {
            // 1. Parse & Validate
            const tokens = tokenize(regex);
            validate(tokens);
            const postfix = toPostfix(tokens);

            // 2. Build Automata
            // ε-NFA
            const rawEnfa = evaluate(postfix);
            const enfa = optimizeENFA(rawEnfa); // Remove redundant epsilon chains & dead states

            // NFA (epsilon removal + optimization)
            const rawNfa = removeEpsilons(enfa);
            const nfa = optimizeNFA(rawNfa); // Remove unreachable, dead, and merge equivalent states

            // DFA (subset construction)
            const rawDfa = toDFA(nfa);
            renameStates(rawDfa); // Rename raw DFA first for logging/verification

            // Minimized DFA (Hopcroft's Algorithm)
            const minDfa = minimizeDFA(rawDfa);
            renameStates(minDfa); // Rename the minimized DFA states

            // Update State
            appState.setState({
                regex: regex,
                currentStage: 'minDfa', // Auto-switch to final stage
                automata: {
                    enfa: enfa,
                    nfa: nfa,
                    dfa: rawDfa,
                    minDfa: minDfa
                }
            });
            console.log('Automata generated and stage switched to minDfa.');

        } catch (e) {
            console.error('Regex error:', e);
            // Show error as toast or inline
            const toastContainer = document.getElementById('toast-container');
            if (toastContainer) {
                const toast = document.createElement('div');
                toast.className = 'toast toast-error';
                toast.textContent = e.message || 'Invalid regex';
                toastContainer.appendChild(toast);
                setTimeout(() => toast.remove(), 5000);
            }
        }
    }
}
