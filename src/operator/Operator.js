import {debugLog} from "../utils.js";

export class Operator {
    id = 0;
    config = {};
    push = () => {
        throw new Error(`Define push for: ${this.id}`);
    };
    complete = () => {
        throw new Error(`Define complete for: ${this.id}`);
    }
    constructor(id, config) {
        this.id = id;
        this.config = config;
    }
    getId(){
        return this.id
    }
    setPush(f) {
        this.push = f;
    }

    next(v) {
        this.push(v);
    }

    async start() {
    }

    setComplete(f) {
        this.complete = f;
    }
}
