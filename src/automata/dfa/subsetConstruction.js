/**
 * subsetConstruction.js
 * Converts an NFA to a DFA using the Subset Construction algorithm.
 */

import { Automaton } from '../model/Automaton.js';
import { State } from '../model/State.js';
import { move } from '../nfa/move.js';
import { getStateSetKey } from '../utils/stateSet.js';
// We might need epsilon closure if the input is ε-NFA, but usually we convert to NFA first
// or we do Subset Construction directly on ε-NFA (calling E-Closure).
// The task structure has "epsilonRemoval" as a step, so we assume input here is NFA (no epsilon).
// BUT, to be robust, we can handle epsilon if present, or assume explicit stage flow.
// Task requirement 3: "NFA -> DFA via subset construction".
// So input is NFA.

export function toDFA(nfa) {
    const dfa = new Automaton();
    dfa.alphabet = nfa.alphabet; // Same alphabet

    // Map of Set-of-IDs (stringified) -> DFA State
    const statesMap = new Map();
    const unprocessedStates = [];

    // 1. Start State = { nfa.startState } (since it's NFA without epsilon, or handled before)
    // If input was ε-NFA, start would be E-Closure(start).
    // Let's assume input is from epsilonRemoval, so it's ready.
    // BUT wait, epsilonRemoval returns an NFA where transitions encompass epsilon paths.
    // So current start state is sufficient.

    const startSet = new Set([nfa.startState]);
    const startKey = getStateSetKey(startSet);

    const dfaStart = new State(startKey); // Temp label
    dfaStart.metadata.nfaStates = Array.from(startSet).map(s => s.id);

    dfa.setStartState(dfaStart);
    statesMap.set(startKey, dfaStart);
    unprocessedStates.push(startSet);

    // We use a lazy dead-state: only create Φ if something actually needs it.
    let deadState = null;
    const emptyKey = getStateSetKey(new Set());

    while (unprocessedStates.length > 0) {
        const currentSet = unprocessedStates.shift();
        const currentKey = getStateSetKey(currentSet);
        const dfaState = statesMap.get(currentKey);

        // Mark accepting if any state in the set is accepting
        for (const s of currentSet) {
            if (s.isAccepting) {
                dfaState.isAccepting = true;
                dfa.acceptStates.add(dfaState);
                break;
            }
        }

        // For each symbol
        for (const symbol of dfa.alphabet) {
            const nextSet = move(currentSet, symbol);

            if (nextSet.size === 0) {
                // Lazy-create the dead state only on first need
                if (!deadState) {
                    deadState = new State(emptyKey);
                    deadState.label = 'Φ';
                    deadState.isDead = true;
                    deadState.metadata.nfaStates = [];
                    statesMap.set(emptyKey, deadState);
                    dfa.addState(deadState);
                    // Enqueue so its self-loops get added
                    unprocessedStates.push(new Set());
                }
                dfa.addTransition(dfaState, deadState, symbol);
            } else {
                const nextKey = getStateSetKey(nextSet);
                let nextDfaState = statesMap.get(nextKey);

                if (!nextDfaState) {
                    nextDfaState = new State(nextKey);
                    nextDfaState.metadata.nfaStates = Array.from(nextSet).map(s => s.id);
                    statesMap.set(nextKey, nextDfaState);
                    dfa.addState(nextDfaState);
                    unprocessedStates.push(nextSet);
                }

                dfa.addTransition(dfaState, nextDfaState, symbol);
            }
        }
    }

    return dfa;
}




