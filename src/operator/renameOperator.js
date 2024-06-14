import {Operator} from "./Operator.js";
import Handlebars from 'handlebars';
import {BlankNode, Iri, Literal} from "../types.js";
export class RenameOp extends Operator {
    constructor(id, config) {
        super(id, config);
        this.aliases = {}
        for (const from in config) {
            this.aliases[from] = config[from]
        }
    }

    next(v) {
        for(let from in this.aliases){
            let to = this.aliases[from]
            v[to] = v[from]
            delete v[from]
        }
        this.push(v);
    }
}
