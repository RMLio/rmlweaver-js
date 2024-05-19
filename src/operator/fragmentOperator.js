import {Operator} from "./Operator.js";

export class FragmentOp extends Operator {
    constructor(id, config) {
        super(id, config);
    }

    next(v) {
        this.push(v);
    }
}
