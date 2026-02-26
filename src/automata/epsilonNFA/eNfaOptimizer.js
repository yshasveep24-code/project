/**
 * eNfaOptimizer.js
 * Minimizes an ε-NFA resulting from Thompson's Construction by:
 *   1. Compressing epsilon chains (merging states connected only by ε)
 *   2. Removing unreachable states
 *   3. Removing dead states
 */

import { Automaton } from '../model/Automaton.js';
import { State } from '../model/State.js';
import { Transition } from '../model/Transition.js';

export function optimizeENFA(enfa) {
    let result = compressEpsilonChains(enfa);
    result = removeUnreachableStates(result);
    result = removeDeadStates(result);
    return result;
}

// ─── Pass 1: Compress Epsilon Chains ─────────────────────────────────────────
// Thompson's construction creates many "helper" states connected solely by epsilon.
// If state A has exactly ONE transition, which is ε to state B,
// and A is not the start/accept state (or we handle them carefully),
// we can move all of B's outgoing transitions to A, and bypass B.

function compressEpsilonChains(enfa) {
    let changed = true;
    let currentNfa = enfa;

    // We do this iteratively until no more compressions can be made.
    while (changed) {
        changed = false;

        const tryMerge = () => {
            const statesArr = Array.from(currentNfa.states);

            for (const state of statesArr) {
                // If the state has exactly ONE outgoing transition AND it's an epsilon
                if (state.transitions.length === 1 && state.transitions[0].symbol === 'ε') {
                    const target = state.transitions[0].to;

                    // Don't merge a state into itself (loop)
                    if (state.id === target.id) continue;

                    // We must be careful if the target is an accepting state
                    // If target is accepting, A must become accepting if we bypass it

                    // Also, we shouldn't merge if target is the start state 
                    // (though structurally this shouldn't happen with 1 outgoing e-edge from start)
                    if (target.id === currentNfa.startState.id) continue;

                    // Perform the merge:
                    // 1. Give state all of target's transitions
                    // 2. Clear state's old single epsilon transition
                    // 3. If target was accepting, state becomes accepting

                    const newTransitions = target.transitions.map(t => new Transition(state, t.to, t.symbol));
                    state.transitions = newTransitions; // replace the old e-transition

                    if (target.isAccepting) {
                        state.isAccepting = true;
                    }

                    // We just bypassed `target` from `state`.
                    // We don't delete `target` yet because other states might point to it.
                    // The unreachable state pass will clean up `target` if it's now orphaned.
                    return true; // We made a change
                }
            }
            return false;
        };

        changed = tryMerge();
    }

    return currentNfa;
}

// ─── Pass 2: Remove Unreachable States ───────────────────────────────────────
function removeUnreachableStates(enfa) {
    const reachable = new Set();
    const queue = [enfa.startState];
    reachable.add(enfa.startState.id);

    while (queue.length > 0) {
        const state = queue.shift();
        for (const t of state.transitions) {
            if (!reachable.has(t.to.id)) {
                reachable.add(t.to.id);
                queue.push(t.to);
            }
        }
    }

    return rebuildAutomaton(enfa, reachable);
}

// ─── Pass 3: Remove Dead States ──────────────────────────────────────────────
function removeDeadStates(enfa) {
    const reverseAdj = new Map();
    for (const state of enfa.states) {
        for (const t of state.transitions) {
            if (!reverseAdj.has(t.to.id)) reverseAdj.set(t.to.id, []);
            reverseAdj.get(t.to.id).push(state);
        }
    }

    const alive = new Set();
    const queue = [];

    for (const state of enfa.states) {
        if (state.isAccepting) {
            alive.add(state.id);
            queue.push(state);
        }
    }

    while (queue.length > 0) {
        const state = queue.shift();
        const predecessors = reverseAdj.get(state.id) || [];
        for (const pred of predecessors) {
            if (!alive.has(pred.id)) {
                alive.add(pred.id);
                queue.push(pred);
            }
        }
    }

    // Always keep start state
    alive.add(enfa.startState.id);
    return rebuildAutomaton(enfa, alive);
}

// ─── Helper: Rebuild Automaton ───────────────────────────────────────────────
function rebuildAutomaton(original, keepSet) {
    const newAutomaton = new Automaton();
    const newStateMap = new Map();

    for (const oldState of original.states) {
        if (!keepSet.has(oldState.id)) continue;

        const ns = new State(oldState.label);
        ns.id = oldState.id;
        ns.isAccepting = oldState.isAccepting;
        newStateMap.set(oldState.id, ns);
        newAutomaton.addState(ns);
    }

    const newStart = newStateMap.get(original.startState.id);
    if (newStart) {
        newAutomaton.setStartState(newStart);
    }

    for (const oldState of original.states) {
        if (!keepSet.has(oldState.id)) continue;
        const fromNew = newStateMap.get(oldState.id);

        for (const t of oldState.transitions) {
            if (keepSet.has(t.to.id)) {
                const toNew = newStateMap.get(t.to.id);
                fromNew.addTransition(new Transition(fromNew, toNew, t.symbol));
                if (t.symbol !== 'ε') {
                    newAutomaton.alphabet.add(t.symbol);
                }
            }
        }
    }

    return newAutomaton;
}
