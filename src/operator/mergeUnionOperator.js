import {Operator} from "./Operator.js";
import Handlebars from 'handlebars';
import {BlankNode, Iri, Literal} from "../types.js";
import {BinaryOperator} from "./binaryOperator.js";
export class MergeUnionOperator extends BinaryOperator {
    // Keeps all previously unique sent solution mappings so every possible (merged) combination of left and right can exist.
    constructor(id, config) {
        super(id, config);
        this.sentLeft = new Set()
        this.sentRight = new Set()

        // assume all combinations are made already

    }


    nextLeft(v) {
        const notInSet = !this.sentLeft.has(v)
        if(notInSet){
            this.sentLeft.add(v)
            this.sentRight.forEach(item => {
                this.push(mergeObjects(v, item))
            })
        }
    }

    nextRight(v){
        const notInSet = !this.sentRight.has(v)
        if(notInSet){
            this.sentRight.add(v)
            this.sentLeft.forEach(item => {
                this.push(mergeObjects(v, item))
            })
        }
    }
}

function mergeObjects(object1, object2){
    return {...object1, ...object2}
}