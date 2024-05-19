import {Operator} from "./Operator.js";
import Handlebars from 'handlebars';
import {BlankNode, Iri, LanguageDataType, Literal} from "../types.js";

export class ExtendOp extends Operator {
    generateMapping(key, mapping) { // In function so recursion is possible

        if (key.charAt(0) === '?') key = key.slice(1) // Remove ? When we have a *variable* attribute

        const innerFunction = mapping.inner_function != null ? this.generateMapping(key, mapping.inner_function) : null;

        switch (mapping.type) {

            case('Iri'):
                return obj => {
                    innerFunction(obj);
                    obj[key] = new Iri(obj[key]);
                };

            case('Literal'):
                const dtypeFunction = mapping.dtype_function != null ? this.generateMapping(key, mapping.inner_function) : null;
                const langtypeFunction = mapping.langtype_function != null ? this.generateMapping(key, mapping.inner_function) : null;


                return obj => {
                    innerFunction(obj);
                    if(dtypeFunction !== null){
                        dtypeFunction(obj)
                    }
                    if(langtypeFunction !== null){
                        langtypeFunction(obj)
                    }
                    obj[key] = new Literal(obj[key]);
                };

            case('BlankNode'):
                return obj => {
                    innerFunction(obj);
                    obj[key] = new BlankNode(obj[key]);
                };

            case('UriEncode'):
                return obj => {
                    innerFunction(obj);

                    obj[key] = encodeURI(obj[key]).replace(',', '%2C').replace('(', '%28').replace(')', '%29'); // Encode URI, Maybe manually in the future to match RML mapper.
                };

            case('Reference'):
                return (obj => {
                    obj[key] = obj[mapping.value];
                });

            case('Constant'):
                return (obj => {
                    obj[key] = mapping.value;
                });

            case('TemplateString'):
                const regex = /\{([^}]+)}/g; // Match text between curly brackets.
                const template_string = mapping.value.replace(regex, (match, content) => `{{[${content}]}}`); // Double brackets for HandleBars.
                const template = Handlebars.compile(template_string);
                return (obj => {
                    obj[key] = template(obj);
                });

            default:
                throw Error(`Type (${mapping.type}) found in extend operator not supported!`);
        }
    }


    constructor(id, config) {
        super(id, config);
        this.extensions = [];
        for (let key in config) {
            this.extensions.push(this.generateMapping(key, config[key]));
        }
    }

    next(v) {
        this.extensions.forEach(extend => {
            extend(v);
        });
        this.push(v);
    }

}
