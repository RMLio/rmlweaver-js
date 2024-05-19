import {Operator} from "./Operator.js";
import Handlebars from 'handlebars';
import {BlankNode, Iri, Literal} from "../types.js";
export class RenameOp extends Operator {
    constructor(id, config) {
        super(id, config);
        this.aliases = []
        for(let i =0; i < config.aliases; i++){
            const alias = config.aliases[i]
            if(alias[0] !== alias[1]){
                this.aliases.append(alias)
            }
        }
    }

    next(v) {
        for(let [_, alias] of this.aliases){
            v[alias[0]] = v[alias[1]]
            delete v[alias[1]]
        }
        this.push(v);
    }
}
