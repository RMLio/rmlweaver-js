import {Operator} from "./Operator.js";
import Handlebars from 'handlebars';
import {BlankNode, Iri, Literal} from "../types.js";
import {BinaryOperator} from "./binaryOperator.js";
export class UnionOperator extends BinaryOperator {

    constructor(id, config) {
        super(id, config);
    }

    nextLeft(v) {
        this.push(v)
    }

    nextRight(v){
        this.push(v)
    }
}