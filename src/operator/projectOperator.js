import {Operator} from "./Operator.js";

export class ProjectOp extends Operator {
    constructor(id, config) {
        super(id, config);
    }

    next(v) {
        if(global.skipProjection === true){
            this.push(v)
        }else{
            Object.keys(v).forEach(k => {
                if (this.config.projection_attributes.indexOf(k) === -1) {
                    delete v[k];
                }
            })
            this.push(v);
        }
    }
}
