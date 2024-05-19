import {Operator} from "./Operator.js";
import {BinaryOperator} from "./binaryOperator.js";

export class JoinOperator extends BinaryOperator {
    constructor(id, config) {
        super(id, config);
        const join_type = config.join_type;

        let leftMap = new Map();
        let rightMap = new Map();

        const joinPrefix = this.config.join_alias;
        let joinFieldsLeft = this.config.left_right_attr_pairs.map(v => v[0]); // first elements
        let joinFieldsRight = this.config.left_right_attr_pairs.map(v => v[1]); // second elements

        if (join_type === "NaturalJoin") {
            // We have to collect the first element in both streams, so we know on which fields to join.

            let first_left_object = undefined
            let first_right_object = undefined

            let storageLeft = []
            let storageRight = []

            this.nextLeft = function (v) {
                // First we must find out on what fields to join.
                storageLeft.push(v)
                first_left_object = v
                if(first_right_object === undefined){
                    return;
                }
                joinFieldsLeft = []
                Object.keys(v).forEach(key => {
                    if(first_right_object[key] !== undefined){
                        joinFieldsLeft.push(key)
                    }
                })
                joinFieldsRight = joinFieldsLeft

                this.nextLeft = standardJoinLeft(joinFieldsLeft, leftMap, rightMap, joinPrefix)
                this.nextRight = standardJoinRight(joinFieldsRight, leftMap, rightMap, joinPrefix)

                storageLeft.forEach(pastObject => {
                    this.nextLeft(pastObject)
                })
                storageRight.forEach(pastObject => {
                    this.nextRight(pastObject)
                })
            }

            this.nextRight = function (v) {
                // First we must find out on what fields to join.
                storageRight.push(v)
                first_right_object = v
                if(first_left_object === undefined){
                    return;
                }

                joinFieldsLeft = []
                Object.keys(v).forEach(key => {
                    if(first_left_object[key] !== undefined){
                        joinFieldsLeft.push(key)
                    }
                })
                joinFieldsRight = joinFieldsLeft
                this.nextLeft = standardJoinLeft(joinFieldsLeft, leftMap, rightMap, joinPrefix)
                this.nextRight = standardJoinRight(joinFieldsRight, leftMap, rightMap, joinPrefix)
                storageLeft.forEach(pastObject => {
                    this.nextLeft(pastObject)
                })
                storageRight.forEach(pastObject => {
                    this.nextRight(pastObject)
                })
            }

        } else if (join_type === "InnerJoin") {
            this.nextLeft = standardJoinLeft(joinFieldsLeft, leftMap, rightMap, joinPrefix)
            this.nextRight = standardJoinRight(joinFieldsRight, leftMap, rightMap, joinPrefix)

        } else if (join_type === "LeftJoin") {
            //TODO
        } else if (join_type === "RightJoin") {
            //TODO
        } else {
            throw Error(`Join type ${this.config.join_type} not supported yet.`);
        }
    }


    nextLeft(_) { // Stream element of left input operator.
        throw Error("Join method not implemented.")
    }

    nextRight(_) { // Stream element of right input operator.
        throw Error("Join method not implemented.")
    }


}

function mergeObjectsLeft(obj1, obj2, prefix) {
    const result = {};
    for (const key in obj2) {
        result[`${prefix}_${key}`] = obj2[key];
    }
    for (const key in obj1) {
        result[key] = obj1[key];
    }
    return result
}

function standardJoinLeft(joinFields_left, leftMap, rightMap, join_prefix){
    return function (v) {
        let key = ""
        for (const column of joinFields_left) {
            key += v[column];
        }
        const list = leftMap.get(key)
        if (list === undefined) {
            leftMap.set(key, new Set([v]))
        } else {
            leftMap.get(key).add(v)
        }
        let joinObjects = rightMap.get(key);
        if (joinObjects !== undefined) {
            for (const obj of joinObjects) {
                this.push(mergeObjectsLeft(v, obj, join_prefix));
            }
        }
    }
}

function standardJoinRight(joinFields_right, leftMap, rightMap, join_prefix){
    return function (v) {
        let key = ""
        for (const column of joinFields_right) {
            key += v[column];
        }
        const list = rightMap.get(key)
        if (list === undefined) {
            rightMap.set(key, new Set([v]))
        } else {
            rightMap.get(key).add(v)
        }
        let joinObjects = leftMap.get(key);
        if (joinObjects !== undefined) {
            for (const obj of joinObjects) {
                this.push(mergeObjectsLeft(obj, v, join_prefix));
            }
        }
    }
}
