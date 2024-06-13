import { Operator } from './Operator.js'
import Handlebars from 'handlebars'
import { BlankNode, Iri, LanguageDataType, Literal } from '../types.js'
import { forEach } from 'most'

export class ExtendOp extends Operator {
    generateMapping(key, mapping) {
        // In function so recursion is possible

        if (key.charAt(0) === '?') key = key.slice(1) // Remove ? When we have a *variable* attribute
        let regex = /\{([^}]+)}/g // Match text between curly brackets.
        const innerFunction =
            mapping.inner_function != null
                ? this.generateMapping(key, mapping.inner_function)
                : null

        switch (mapping.type) {
            case 'Iri':
                return (obj) => {
                    innerFunction(obj)
                    obj[key] = new Iri(obj[key])
                }

            case 'Literal':
                const dtypeFunction =
                    mapping.dtype_function != null
                        ? this.generateMapping(key, mapping.inner_function)
                        : null
                const langtypeFunction =
                    mapping.langtype_function != null
                        ? this.generateMapping(key, mapping.inner_function)
                        : null

                return (obj) => {
                    innerFunction(obj)
                    if (dtypeFunction !== null) {
                        dtypeFunction(obj)
                    }
                    if (langtypeFunction !== null) {
                        langtypeFunction(obj)
                    }
                    obj[key] = new Literal(obj[key])
                }

            case 'BlankNode':
                return (obj) => {
                    innerFunction(obj)
                    obj[key] = new BlankNode(obj[key])
                }

            case 'UriEncode':
                return (obj) => {
                    innerFunction(obj)

                    obj[key] = encodeURI(obj[key])
                        .replace(',', '%2C')
                        .replace('(', '%28')
                        .replace(')', '%29') // Encode URI, Maybe manually in the future to match RML mapper.
                }

            case 'Reference':
                return (obj) => {
                    obj[key] = obj[mapping.value]
                }

            case 'Constant':
                return (obj) => {
                    obj[key] = mapping.value
                }

            case 'TemplateString':
                // Match text between curly brackets.
                let template_string = mapping.value.replace(
                    regex,
                    (match, content) => `{{[${content}]}}`,
                ) // Double brackets for HandleBars.
                let template = Handlebars.compile(template_string)
                return (obj) => {
                    obj[key] = template(obj)
                }

            case 'TemplateFunctionValue':
                let template_string_2 = mapping.template.replace(
                    regex,
                    (match, content) => `{{[${content}]}}`,
                ) // Double brackets for HandleBars.
                let template2 = Handlebars.compile(template_string_2)
                let var_function_pairs = {}
                for (let pair of mapping.variable_function_pairs) {
                    let variable = pair[0]
                    let ext_func = pair[1]
                    ext_func = this.generateMapping(key, ext_func)
                    var_function_pairs[variable] = ext_func
                }

                return (obj) => {
                    for (let variable in var_function_pairs) {
                        var_function_pairs[variable] = var_function_pairs(obj)[key]
                    }
                    obj[key] = template2(var_function_pairs)
                }

            case 'Concatenate':
                const left_function = this.generateMapping(
                    key,
                    mapping.left_value,
                )
                const right_function = this.generateMapping(
                    key,
                    mapping.right_value,
                )
                return (obj) => {
                    const left_value = left_function(obj)[key]
                    const right_value = right_function(obj)[key]
                    obj[key] = left_value + mapping.separator + right_value
                }

            default:
                throw Error(
                    `Type (${mapping.type}) found in extend operator not supported!`,
                )
        }
    }

    constructor(id, config) {
        super(id, config)
        this.extensions = []
        for (let key in config) {
            this.extensions.push(this.generateMapping(key, config[key]))
        }
    }

    next(v) {
        this.extensions.forEach((extend) => {
            extend(v)
        })
        this.push(v)
    }
}
