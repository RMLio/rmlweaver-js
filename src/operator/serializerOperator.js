import { Operator } from './Operator.js'

export class SerializerOp extends Operator {
    constructor(id, config) {
        super(id, config)
        let templates
        switch (config.format) {
            case 'NTriples':
                templates = parseTemplate(config.template)
                break
            case 'NQuads':
                templates = parseTemplate(config.template)
                break
            default:
                throw Error(
                    `Serialiser formatting type: "${config.format}" not supported.`,
                )
        }
        this.serializers = templates.map((templateString) =>
            generateQuadTemplate(templateString),
        )
        if (global.dup_removal) {
            this.seen = new Set()
            this.next = (v) => {
                this.serializers.forEach((func) => {
                    const triple = func(v)
                    // Efficiently detect if item was already passed through this function
                    if (!this.seen.has(triple) && triple != null) {
                        this.seen.add(triple)
                        this.push(triple)
                    }
                })
            }
        } else {
            this.next = (v) => {
                this.serializers.forEach((func) => {
                    const triple = func(v)
                    if (triple != null) {
                        this.push(triple)
                    }
                })
            }
        }
    }
}

function parseTemplate(template) {
    const fields = template.split(/\s+/)
    let templates = [[]]
    let currIndex = 0
    fields.forEach((value) => {
        value = value.trim().replace(/\\n/g, '')
        if (value.charAt(0) === '.') {
            currIndex++
            templates[currIndex] = [value.slice(1)]
        } else {
            templates[currIndex].push(value)
        }
    })
    return templates.slice(0, -1).map((list) => list.join(' '))
}

export function generateQuadTemplate(template) {
    template = template.trim() // Remove '.' on the end
    const fields = template.split(' ')
    const variables = [] // Hold the indices of fields containing variables. So we can change these later.
    const tags = new Array(fields.length).fill('') // Hold the indices of fields containing language tags.
    let values = fields.map((value, index) => {
        // extract langtag and datatpe using regex
        const langTag = value.match(/@([a-zA-Z]+(-[a-zA-Z0-9]+)*)/)
        const dataType = value.match(/\^\^<(.+)>/)

        // remove langtag and datatype from value
        value = value.replace(/@([a-zA-Z]+(-[a-zA-Z0-9]+)*)/, '')
        value = value.replace(/\^\^<(.+)>/, '')

        // add tags to respective fields
        if (langTag) {
            tags[index] = langTag[0]
        }
        if (dataType) {
            if (tags[index] !== undefined) {
                tags[index] += dataType[0]
            } else {
                tags[index] = dataType[0]
            }
        }

        if (value.charAt(0) === '?') {
            variables.push([index, value.slice(1)])
            return '' // Empty value.
        } else {
            return value
        }
    })
    if (tags !== {}) {
        return (obj) => {
            let error_flag = false
            variables.forEach((i) => {
                if (
                    obj[i[1]] === undefined ||
                    obj[i[1]].render() === undefined
                ) {
                    error_flag = true
                } else {
                    values[i[0]] = obj[i[1]].render() + tags[i[0]]
                }
            })

            if (values.includes('') || error_flag) {
                return undefined
            } else {
                return values.join(' ') + ' .'
            }
        }
    } else {
        return (obj) => {
            variables.forEach((i) => {
                if (obj[i[1]] === undefined) {
                    return null
                }
                values[i[0]] = obj[i[1]].render()
            })
            return values.join(' ') + ' .'
        }
    }
}
