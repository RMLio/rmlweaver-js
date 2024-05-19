import {Operator} from "./Operator.js";

export class BinaryOperator extends Operator{
    constructor(id, config) {
        super(id, config);
        this.completedOps = 0;
        this.duplicates = 0
    }
    nextLeft(v) {

    }

    nextRight(v) {

    }

    completeLeft() {
        this.completedOps++;
        if (this.completedOps === 2) {
            this.complete();
        }
    }

    completeRight() {
        this.completedOps++;
        if (this.completedOps === 2) {
            this.complete();
        }
    }
}
