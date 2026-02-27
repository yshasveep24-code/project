import { tokenize, TokenType } from '../parser/regexTokenizer.js';
import { validate } from '../parser/regexValidator.js';
import { toPostfix } from '../parser/regexToPostfix.js';
import { evaluate } from '../parser/postfixEvaluator.js';

let errors = 0;

function assert(condition, message) {
    if (!condition) {
        console.error(`❌ FAIL: ${message}`);
        errors++;
    } else {
        console.log(`✅ PASS: ${message}`);
    }
}

function runTests() {
    console.log("Running manual regression tests for '?' operator...");

    try {
        // 1. Tokenizer test
        const tokens = tokenize("ab?c");
        assert(
            tokens.length === 4 &&
            tokens[0].value === 'a' &&
            tokens[1].value === 'b' &&
            tokens[2].type === TokenType.QUESTION &&
            tokens[3].value === 'c',
            "Tokenizer emits QUESTION for ab?c"
        );

        // 2. Build test
        const tokens2 = tokenize("a?b");
        validate(tokens2);
        const postfix = toPostfix(tokens2);
        const automaton = evaluate(postfix);
        assert(
            automaton && automaton.alphabet.has('a') && automaton.alphabet.has('b'),
            "a?b builds an automaton and alphabet contains a and b"
        );

        // 3. Validation rejection test
        let caughtError = false;
        try {
            const tokens3 = tokenize("a?*");
            validate(tokens3);
        } catch (e) {
            caughtError = true;
            assert(
                e.message.includes('Invalid consecutive quantifiers'),
                "Validation rejects a?*"
            );
        }
        assert(caughtError, "Validation throws an error for a?*");

        // 4. Existing operator sanity
        const tokens4 = tokenize("(a|b)+c*");
        validate(tokens4);
        const postfix4 = toPostfix(tokens4);
        const automaton4 = evaluate(postfix4);
        assert(
            automaton4 !== null,
            "(a|b)+c* still builds without error"
        );

    } catch (e) {
        console.error("❌ Unexpected Error:", e);
        errors++;
    }

    if (errors > 0) {
        console.error(`\n❌ Tests failed with ${errors} errors.`);
        process.exit(1);
    } else {
        console.log(`\n🎉 All tests passed successfully!`);
        process.exit(0);
    }
}

runTests();
