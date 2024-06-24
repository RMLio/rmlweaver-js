import * as assert from 'assert'
import fs from 'fs'
import { Executor } from '../src/executor.js'
import { parseOperator } from '../src/operator/operatormanager.js'
import { FileNotFoundError } from '../src/utils.js'
import { BlankNode, Iri, Literal } from '../src/types.js'
import { dirname } from 'path'

// Default testing function. Will execute a dot file and catch the target sinks output, then check if it equals the target_output data.
export function dotFileTest(dot_file, target_output) {
    return async () => {
        global.dot_directory = dirname(dot_file)

        if (!fs.existsSync(dot_file)) {
            return assert.ok(true, 'Something went wrong')
        }

        const dot_contents = fs.readFileSync(dot_file, 'utf8')

        const executor = new Executor(dot_contents)
        const output = await executor.run_tests()

        const correct_output = fs
            .readFileSync(target_output, 'utf8')
            .split('\n')
            .filter(
                (string) => string.charAt(0) !== '#' && string.trim() !== '',
            )
            .map((line) => line.trim().replace('  ', ' '))
        assert.deepEqual(
            Array.from(new Set(output.sort())),
            Array.from(correct_output.sort()),
        )
    }
}

export function lineAmountTest(dot_file, lines) {
    return async () => {
        // options:
        global.count_lines = true
        global.skipProjection = true
        global.outputFile = './output.txt'
        global.extend_dup_removal = true
        global.dup_removal = true

        global.dot_directory = dirname(dot_file)
        const dotContents = fs.readFileSync(dot_file, 'utf8')

        const executor = new Executor(dotContents)
        await executor.run_tests(false)

        assert.strictEqual(
            global.lineAmount,
            lines,
            'Amount of lines pushed does not match expected amount.',
        )
    }
}

export function throwErrorTest(dot_file, className) {
    return async () => {
        const executor = new Executor(fs.readFileSync(dot_file, 'utf8'))

        assert.rejects(executor.run_tests).catch((err) => {
            console.log(
                'Executing did not throw error of type: ' +
                    err +
                    className.namea,
            )
            throw err
        })
    }
}

// Operator Test consists of json file, in this file we have a json object with the operator, the input and the expected output.
// These are under the fields operator(object), input(list) and output(list).
export function operatorTest(json_file) {
    return async () => {
        const test_data = JSON.parse(fs.readFileSync(json_file, 'utf8'))
        const operator_obj = test_data.operator
        const operator = parseOperator(
            operator_obj.id,
            operator_obj.operator.type,
            operator_obj.operator.config,
        )

        let testOutput = []
        operator.setPush((obj) => testOutput.push(obj)) // Catch the output in a list
        operator.start() // Start the operator

        const input = test_data.input
        input.forEach((entry) => {
            Object.keys(entry).forEach((key) => {
                if (typeof entry[key] == 'object') {
                    switch (entry[key].type) {
                        case 'Iri':
                            entry[key] = new Iri(entry[key].value)
                            break
                        case 'Literal':
                            entry[key] = new Literal(entry[key].value)
                            break
                        case 'BlankNode':
                            entry[key] = new BlankNode(entry[key].value)
                            break
                        case '':
                            break
                    }
                }
            })
        })
        input.forEach((obj) => operator.next(obj))
        const expectedOutput = test_data.output

        assert.deepEqual(testOutput, expectedOutput)
    }
}
