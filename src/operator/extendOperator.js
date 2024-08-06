import { Operator } from './Operator.js'
import Handlebars from 'handlebars'
import {
    BlankNode,
    DataTypedLiteral,
    Iri,
    LanguageLiteral,
    Literal,
} from '../types.js'
import { forEach } from 'most'

export class ExtendOp extends Operator {
    generateMapping(key, extend_func) {
        // In function so recursion is possible

        if (key.charAt(0) === '?') key = key.slice(1) // Remove ? When we have a *variable* attribute
        //let regex = /[^\\]({[^}]+[^\\]})/g // Match text between curly brackets.
        let regex = /({[^\\{\\}]*})/g
        let left_escaped_curly_regex = /\\\\\{/g
        let right_escaped_curly_regex = /\\\\}/g
        const innerFunction =
            extend_func.inner_function != null
                ? this.generateMapping(key, extend_func.inner_function)
                : null

        switch (extend_func.type) {
            case 'Iri':
                return (obj) => {
                    innerFunction(obj)
                    let iri_value = ''
                    if (
                        extend_func.base_iri != null &&
                        URL.canParse(obj[key], extend_func.base_iri) &&
                        !URL.canParse(obj[key], undefined)
                    ) {
                        iri_value = extend_func.base_iri + obj[key]
                    } else {
                        iri_value = obj[key]
                    }
                    if ( iri_value.search(" ") >= 0 ) {
                        obj[key] = undefined
                    } else {
                        obj[key] = new Iri(iri_value)
                    }
                }

            case 'Literal':
                const dtypeFunction =
                    extend_func.dtype_function != null
                        ? this.generateMapping(key, extend_func.dtype_function)
                        : null
                const langtypeFunction =
                    extend_func.langtype_function != null
                        ? this.generateMapping(
                              key,
                              extend_func.langtype_function,
                          )
                        : null

                return (obj) => {
                    innerFunction(obj)
                    let literal_value = obj[key]
                    let obj_value = new Literal(literal_value)
                    if (dtypeFunction !== null) {
                        dtypeFunction(obj)
                        obj_value = new DataTypedLiteral(
                            literal_value,
                            obj[key],
                        )
                    } else if (langtypeFunction !== null) {
                        langtypeFunction(obj)
                        obj_value = new LanguageLiteral(literal_value, obj[key])
                    }
                    obj[key] = obj_value
                }

            case 'BlankNode':
                return (obj) => {
                    innerFunction(obj)
                    obj[key] = new BlankNode(obj[key])
                }

            case 'UriEncode':
                return (obj) => {
                    innerFunction(obj)

                    obj[key] = encodeURIComponent(obj[key])
                        .replace(',', '%2C')
                        .replace('(', '%28')
                        .replace(')', '%29') // Encode URI, Maybe manually in the future to match RML mapper.
                }

            case 'Reference':
                return (obj) => {
                    obj[key] = obj[extend_func.value]
                }

            case 'Constant':
                return (obj) => {
                    obj[key] = extend_func.value
                }

            case 'TemplateString':
                // Match text between curly brackets.
                //let template_string = mapping.value.replace(
                //    regex,
                //    (match, content) => `{{[${content}]}}`,
                //) // Double brackets for HandleBars.
                //let template = Handlebars.compile(template_string)
                let value = extend_func.value.replace(
                    left_escaped_curly_regex,
                    '\\{',
                )
                value = value.replace(right_escaped_curly_regex, '\\}')
                return (sol_map) => {
                    let result = value.replace(
                        regex,
                        (match, captured, offset, full_string) => {
                            let key = captured.substring(1, captured.length - 1)
                            return sol_map[key]
                        },
                    )
                    result = result.replace(/\\{/g, '{')
                    result = result.replace(/\\}/g, '}')
                    sol_map[key] = result
                }

            case 'TemplateFunctionValue':
                let template = extend_func.template.replace(
                    left_escaped_curly_regex,
                    '\\{',
                )
                template = template.replace(right_escaped_curly_regex, '\\}')

                let var_function_pairs = {}
                for (let pair of extend_func.variable_function_pairs) {
                    let variable = pair[0]
                    let ext_func = pair[1]
                    ext_func = this.generateMapping(key, ext_func)
                    var_function_pairs[variable] = ext_func
                }

                return (obj) => {
                    let temp_val = {}
                    for (let variable in var_function_pairs) {
                        let nest_func = var_function_pairs[variable]
                        nest_func(obj)
                        temp_val[variable] = obj[key]
                    }

                    let result = template.replace(
                        regex,
                        (match, captured, offset, full_string) => {
                            let key = captured.substring(1, captured.length - 1)
                            return temp_val[key]
                        },
                    )
                    result = result.replace(/\\{/g, '{')
                    result = result.replace(/\\}/g, '}')

                    obj[key] = result
                }

            case 'Concatenate':
                const left_function = this.generateMapping(
                    key,
                    extend_func.left_value,
                )
                const right_function = this.generateMapping(
                    key,
                    extend_func.right_value,
                )
                return (obj) => {
                    left_function(obj)
                    const left_value = obj[key]
                    right_function(obj)
                    const right_value = obj[key]
                    obj[key] = left_value + extend_func.separator + right_value
                }

            default:
                throw Error(
                    `Type (${extend_func.type}) found in extend operator not supported!`,
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
