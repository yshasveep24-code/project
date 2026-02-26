/**
 * dfaMinimizer.js
 * Implements Hopcroft's algorithm to minimize a DFA.
 */

import { Automaton } from '../model/Automaton.js';
import { State } from '../model/State.js';
import { Transition } from '../model/Transition.js';

export function minimizeDFA(dfa) {
    const states = Array.from(dfa.states);
    const alphabet = Array.from(dfa.alphabet);

    // Filter out unreachable states first (Subset construction shouldn't produce them,
    // but good to be safe before minimization).
    const reachable = getReachableStates(dfa);
    const reachableStates = states.filter(s => reachable.has(s.id));

    // 1. Initial Partition: Accepting states (F) and Non-Accepting states (Q \ F)
    let P = [
        reachableStates.filter(s => s.isAccepting),
        reachableStates.filter(s => !s.isAccepting)
    ].filter(group => group.length > 0);

    let W = [...P];

    // Build reverse transitions for efficient splitting
    // reverseAdj[symbol][targetStateId] = array of source states
    const reverseAdj = {};
    for (const sym of alphabet) {
        reverseAdj[sym] = new Map();
    }

    for (const state of reachableStates) {
        for (const t of state.transitions) {
            if (alphabet.includes(t.symbol)) {
                if (!reverseAdj[t.symbol].has(t.to.id)) {
                    reverseAdj[t.symbol].set(t.to.id, []);
                }
                reverseAdj[t.symbol].get(t.to.id).push(state);
            }
        }
    }

    // 2. Refinement
    while (W.length > 0) {
        const A = W.shift();
        const A_ids = new Set(A.map(s => s.id));

        for (const sym of alphabet) {
            // Find all states X that transition into A on symbol sym
            const X = new Set();
            for (const a of A) {
                const sources = reverseAdj[sym].get(a.id) || [];
                for (const s of sources) {
                    X.add(s);
                }
            }

            if (X.size === 0) continue;

            const nextP = [];
            for (const Y of P) {
                // Split Y into Intersection and Difference
                const intersection = Y.filter(s => X.has(s));
                const difference = Y.filter(s => !X.has(s));

                if (intersection.length > 0 && difference.length > 0) {
                    nextP.push(intersection);
                    nextP.push(difference);

                    // Update W
                    const Y_idx = W.indexOf(Y);
                    if (Y_idx !== -1) {
                        W.splice(Y_idx, 1);
                        W.push(intersection);
                        W.push(difference);
                    } else {
                        if (intersection.length <= difference.length) {
                            W.push(intersection);
                        } else {
                            W.push(difference);
                        }
                    }
                } else {
                    nextP.push(Y);
                }
            }
            P = nextP;
        }
    }

    // 3. Build the minimized DFA
    const minDfa = new Automaton();
    minDfa.alphabet = new Set(dfa.alphabet);

    // Map old state IDs to new group representing state
    const stateToGroup = new Map();
    const groupToNewState = new Map();

    for (let i = 0; i < P.length; i++) {
        const group = P[i];

        // Use the first state's properties as representative, but check if any is start/dead
        let isStart = false;
        let isAccepting = false;
        let isDead = false;

        for (const s of group) {
            if (s.id === dfa.startState.id) isStart = true;
            if (s.isAccepting) isAccepting = true;
            if (s.isDead) isDead = true;
        }

        const newState = new State();
        newState.isAccepting = isAccepting;
        if (isDead) { // Preserve Dead State visual flag if all merged states were dead or included phi
            newState.isDead = true;
            newState.label = 'Φ';
        }

        groupToNewState.set(i, newState);
        minDfa.addState(newState);

        if (isStart) {
            minDfa.setStartState(newState);
        }

        for (const s of group) {
            stateToGroup.set(s.id, i);
        }
    }

    // Add transitions
    const addedTransitions = new Set();
    for (const group of P) {
        const rep = group[0]; // Representative of the group
        const fromGroupIdx = stateToGroup.get(rep.id);
        const fromState = groupToNewState.get(fromGroupIdx);

        for (const t of rep.transitions) {
            const toGroupIdx = stateToGroup.get(t.to.id);
            if (toGroupIdx !== undefined) { // Unreachable states won't be in a group
                const toState = groupToNewState.get(toGroupIdx);
                const transKey = `${fromGroupIdx}-${t.symbol}-${toGroupIdx}`;

                if (!addedTransitions.has(transKey)) {
                    addedTransitions.add(transKey);
                    fromState.addTransition(new Transition(fromState, toState, t.symbol));
                }
            }
        }
    }

    return minDfa;
}

function getReachableStates(dfa) {
    const reachable = new Set();
    const queue = [dfa.startState];
    reachable.add(dfa.startState.id);

    while (queue.length > 0) {
        const state = queue.shift();
        for (const t of state.transitions) {
            if (!reachable.has(t.to.id)) {
                reachable.add(t.to.id);
                queue.push(t.to);
            }
        }
    }
    return reachable;
}
