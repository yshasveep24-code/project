
import { tokenize } from '../parser/regexTokenizer.js';
import { toPostfix } from '../parser/regexToPostfix.js';
import { evaluate } from '../parser/postfixEvaluator.js';
import { removeEpsilons } from '../automata/nfa/epsilonRemoval.js';

console.log('Testing Regex: a|a|aa');
try {
    const tokens = tokenize('a|a|aa');
    const postfix = toPostfix(tokens);
    const enfa = evaluate(postfix);
    const nfa = removeEpsilons(enfa);

    console.log('--- NFA Transitions (Debug) ---');
    let transitions = [];
    for (const s of nfa.states) {
        for (const t of s.transitions) {
            const entry = `Transition: ${t.from.label} -> ${t.to.label} [${t.symbol}]`;
            console.log(entry);
            transitions.push({ key: `${s.id}-${t.symbol}-${t.to.id}`, label: entry });
        }
    }

    const seen = new Set();
    let dups = 0;
    for (const t of transitions) {
        if (seen.has(t.key)) {
            console.error(`DUPLICATE FOUND: ${t.label}`);
            dups++;
        }
        seen.add(t.key);
    }

    if (dups === 0) {
        console.log('✅ No duplicate transitions found.');
    } else {
        console.error(`❌ Found ${dups} duplicate transitions!`);
    }

} catch (e) {
    console.error(e);
}
