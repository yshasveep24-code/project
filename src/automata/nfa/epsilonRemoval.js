/**
 * epsilonRemoval.js
 * Converts an ε-NFA to an NFA without epsilon transitions.
 * 
 * Algorithm:
 * For each state q, and each symbol a:
 *   NFA_delta(q, a) = ε-Closure(move(ε-Closure(q), a))
 * 
 * Acceptance: q is accepting if ε-Closure(q) contains any accepting state.
 * Start state remains the same.
 */

import { Automaton } from '../model/Automaton.js';
import { Transition } from '../model/Transition.js';
import { State } from '../model/State.js';
import { getEpsilonClosure } from './epsilonClosure.js';
import { move } from './move.js';
import { EPSILON } from '../epsilonNFA/epsilonUtils.js';

export function removeEpsilons(eNFA) {
    const nfa = new Automaton();

    // Map oldId -> newState
    const stateMap = new Map();

    for (const oldState of eNFA.states) {
        const newState = new State(oldState.label);
        newState.id = oldState.id;
        newState.label = oldState.label || `q${oldState.id}`;
        stateMap.set(oldState.id, newState);
        nfa.addState(newState);
    }

    // Set start state
    nfa.setStartState(stateMap.get(eNFA.startState.id));

    // Calculate Transitions and Acceptance
    const alphabet = eNFA.alphabet; // Non-epsilon symbols only

    // Track already-added transitions to prevent duplicates
    const addedTransitions = new Set();

    for (const oldState of eNFA.states) {
        const newState = stateMap.get(oldState.id);
        const closure = getEpsilonClosure(oldState);

        // 1. Acceptance
        // q is accepting if ε-Closure(q) contains any accepting state
        for (const s of closure) {
            if (s.isAccepting) {
                newState.isAccepting = true;
                nfa.acceptStates.add(newState);
                break;
            }
        }

        // 2. Transitions
        // For each symbol 'a' in alphabet:
        //   Target = ε-Closure(Move(ε-Closure(q), a))
        for (const symbol of alphabet) {
            const moveResult = move(closure, symbol);
            const targetStates = getEpsilonClosure(moveResult);

            for (const targetOld of targetStates) {
                const targetNew = stateMap.get(targetOld.id);

                // Explicit duplicate check using a string key
                const transKey = `${newState.id}-${symbol}-${targetNew.id}`;
                if (!addedTransitions.has(transKey)) {
                    addedTransitions.add(transKey);

                    // Manually create and add transition to avoid
                    // any reference-equality issues in Automaton.addTransition
                    const transition = new Transition(newState, targetNew, symbol);
                    newState.addTransition(transition);

                    // Add states and alphabet to automaton
                    nfa.addState(newState);
                    nfa.addState(targetNew);
                }
            }
        }
    }

    nfa.alphabet = new Set(alphabet);
    return nfa;
}
