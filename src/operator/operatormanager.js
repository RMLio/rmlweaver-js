import {SourceOp} from "./sourceOperator.js";
import {ProjectOp} from "./projectOperator.js";
import {ExtendOp} from "./extendOperator.js";
import {SerializerOp} from "./serializerOperator.js";
import {TargetOp} from "./targetOperator.js";
import {FragmentOp} from "./fragmentOperator.js";
import {JoinOperator} from "./joinOperator.js";


export class OpManager {
    ops = {};
    opList = [];

    addOp(id, type, config) {
        this.ops[id] = parseOperator(id, type, config);
        this.opList.push(id);
    }

    getOperators() {
        return this.opList.map(id => this.ops[id]);
    }

    getOperatorByIndex(idx) {
        return this.ops[this.opList[idx]]
    }
}

export function parseOperator(id, type, config){
    let operator;
    switch (type) {
        case 'SourceOp':
            operator = new SourceOp(id, config);
            break;
        case 'ProjectOp':
            operator = new ProjectOp(id, config);
            break;
        case 'ExtendOp':
            operator = new ExtendOp(id, config);
            break;
        case 'SerializerOp':
            operator = new SerializerOp(id, config);
            break;
        case 'TargetOp':
            operator = new TargetOp(id, config);
            break;
        case 'FragmentOp':
            operator = new FragmentOp(id, config);
            break;
        case 'JoinOp':
            operator = new JoinOperator(id, config);
            break;
        default:
            throw new Error(`Operator type ${type} is not supported`);
    }
    return operator
}