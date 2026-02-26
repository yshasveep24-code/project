/**
 * nfaOptimizer.js
 * Reduces an NFA (after epsilon removal) by:
 *   1. Removing unreachable states (BFS from start)
 *   2. Removing dead states (states that cannot reach any accepting state)
 *   3. Merging equivalent states (heuristic: same transitions + same accept status)
 */

import { Automaton } from '../model/Automaton.js';
import { Transition } from '../model/Transition.js';
import { State } from '../model/State.js';

/**
 * Run all three optimization passes on the given NFA.
 * Returns a new, optimized Automaton.
 */
export function optimizeNFA(nfa) {
    let result = removeUnreachableStates(nfa);
    result = removeDeadStates(result);
    result = mergeEquivalentStates(result);
    return result;
}

// ─── Pass 1: Remove Unreachable States ───────────────────────────────────────
// BFS from start state; any state not visited is unreachable → delete it.

function removeUnreachableStates(nfa) {
    const reachable = new Set();
    const queue = [nfa.startState];
    reachable.add(nfa.startState.id);

    while (queue.length > 0) {
        const state = queue.shift();
        for (const t of state.transitions) {
            if (!reachable.has(t.to.id)) {
                reachable.add(t.to.id);
                queue.push(t.to);
            }
        }
    }

    // Build new automaton keeping only reachable states
    return rebuildAutomaton(nfa, reachable);
}

// ─── Pass 2: Remove Dead States ──────────────────────────────────────────────
// A state is dead if it cannot reach ANY accepting state via forward transitions.
// We do a reverse reachability search: start from all accepting states, walk
// edges backwards, mark everything reachable. Anything not marked is dead.

function removeDeadStates(nfa) {
    // Build reverse adjacency: toId -> [fromState]
    const reverseAdj = new Map();
    for (const state of nfa.states) {
        for (const t of state.transitions) {
            if (!reverseAdj.has(t.to.id)) reverseAdj.set(t.to.id, []);
            reverseAdj.get(t.to.id).push(state);
        }
    }

    // BFS backward from accepting states
    const alive = new Set();
    const queue = [];

    for (const state of nfa.states) {
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

    // Always keep the start state (even if it looks "dead") to avoid empty automaton
    alive.add(nfa.startState.id);

    return rebuildAutomaton(nfa, alive);
}

// ─── Pass 3: Merge Equivalent States (Heuristic) ────────────────────────────
// Two states are heuristically equivalent if:
//   - Both accepting, or both non-accepting
//   - For every symbol, they go to the exact same set of target state IDs
// This is a conservative approximation — not guaranteed minimal, but safe.

function mergeEquivalentStates(nfa) {
    const statesArr = Array.from(nfa.states);
    const alphabet = Array.from(nfa.alphabet);

    // Build a signature for each state: "accept|sym1:{id1,id2}|sym2:{id3}|..."
    function signature(state) {
        const parts = [state.isAccepting ? '1' : '0'];
        for (const sym of alphabet) {
            const targets = state.transitions
                .filter(t => t.symbol === sym)
                .map(t => t.to.id)
                .sort((a, b) => a - b);
            parts.push(`${sym}:{${targets.join(',')}}`);
        }
        return parts.join('|');
    }

    // Group states by signature
    const sigGroups = new Map();
    for (const state of statesArr) {
        const sig = signature(state);
        if (!sigGroups.has(sig)) sigGroups.set(sig, []);
        sigGroups.get(sig).push(state);
    }

    // Check if any groups have > 1 state (meaning merge is possible)
    let needsMerge = false;
    for (const group of sigGroups.values()) {
        if (group.length > 1) { needsMerge = true; break; }
    }
    if (!needsMerge) return nfa; // Nothing to merge

    // Build merge map: old state id -> representative state
    const mergeMap = new Map(); // oldId -> representativeState
    for (const group of sigGroups.values()) {
        // Pick the first state as the representative (prefer start state)
        let representative = group[0];
        for (const s of group) {
            if (s.isStart || s.id === nfa.startState.id) {
                representative = s;
                break;
            }
        }
        for (const s of group) {
            mergeMap.set(s.id, representative);
        }
    }

    // Build new automaton with merged states
    const newAutomaton = new Automaton();

    // Create fresh state objects for each representative
    const newStateMap = new Map(); // repId -> new State
    for (const rep of new Set(mergeMap.values())) {
        const ns = new State(rep.label);
        ns.id = rep.id;
        ns.label = rep.label;
        ns.isAccepting = rep.isAccepting;
        newStateMap.set(rep.id, ns);
        newAutomaton.addState(ns);
    }

    // Set start state
    const startRep = mergeMap.get(nfa.startState.id);
    const newStart = newStateMap.get(startRep.id);
    newAutomaton.setStartState(newStart);

    // Add transitions (remapped to representatives, deduped)
    const addedTransitions = new Set();
    for (const oldState of statesArr) {
        const fromRep = mergeMap.get(oldState.id);
        const fromNew = newStateMap.get(fromRep.id);

        for (const t of oldState.transitions) {
            const toRep = mergeMap.get(t.to.id);
            const toNew = newStateMap.get(toRep.id);
            const key = `${fromNew.id}-${t.symbol}-${toNew.id}`;

            if (!addedTransitions.has(key)) {
                addedTransitions.add(key);
                fromNew.addTransition(new Transition(fromNew, toNew, t.symbol));
            }
        }
    }

    newAutomaton.alphabet = new Set(nfa.alphabet);
    return newAutomaton;
}

// ─── Helper: Rebuild automaton keeping only states in the keepSet ─────────────

function rebuildAutomaton(nfa, keepSet) {
    const newAutomaton = new Automaton();
    const newStateMap = new Map(); // oldId -> new State

    // Create new states for kept states
    for (const oldState of nfa.states) {
        if (!keepSet.has(oldState.id)) continue;

        const ns = new State(oldState.label);
        ns.id = oldState.id;
        ns.label = oldState.label;
        ns.isAccepting = oldState.isAccepting;
        newStateMap.set(oldState.id, ns);
        newAutomaton.addState(ns);
    }

    // Set start state
    const newStart = newStateMap.get(nfa.startState.id);
    if (newStart) {
        newAutomaton.setStartState(newStart);
    }

    // Add only transitions where both from and to are in keepSet
    for (const oldState of nfa.states) {
        if (!keepSet.has(oldState.id)) continue;
        const fromNew = newStateMap.get(oldState.id);

        for (const t of oldState.transitions) {
            if (keepSet.has(t.to.id)) {
                const toNew = newStateMap.get(t.to.id);
                fromNew.addTransition(new Transition(fromNew, toNew, t.symbol));
            }
        }
    }

    newAutomaton.alphabet = new Set(nfa.alphabet);
    return newAutomaton;
}
