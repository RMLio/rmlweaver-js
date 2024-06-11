import {Operator} from "./Operator.js";
import fs from "fs";
import {debugLog} from "../utils.js";

export class TargetOp extends Operator {
    constructor(id, config) {
        super(id, config);
        // because it's a sink, you need to set the push and complete yourself
        let fileStream = undefined;
        if (global.outputFile) {
            try {
                fileStream = fs.createWriteStream(global.dot_directory + "/" + global.outputFile + "_" + id, 'utf-8');
                if (global.count_lines) {
                    // function for debugging purposes in large files.
                    global.lineAmount = 0;
                    this.setPush(v => {
                        global.lineAmount++;
                        if (global.lineAmount % 1000 === 0) {
                            // print amount of lines
                            console.log(global.lineAmount)
                        }
                        fileStream.write(v + " \n")
                    });
                } else {
                    this.setPush(v => fileStream.write(v + " \n"));
                }

            } catch (err) {
                // Handle any errors that occur during file reading
                throw Error('Error writing to file:' + err);
            }
        }else{
            switch (config.target_type) {
                case("StdOut"):
                    this.setPush(v => console.log(v))
                    break;
                case("File"):
                    try {
                        fileStream = fs.createWriteStream(global.dot_directory + "/" + config.path + "_" + id, 'utf-8');
                        this.setPush(v => fileStream.write(v + " \n"));
                    } catch (err) {
                        // Handle any errors that occur during file reading
                        throw Error('Error writing to file:' + err);
                    }
                    break;
                default:
                    throw Error(`Target type ${config.target_type} not supported.`);
            }
        }

        this.setComplete(() => {
            debugLog("TargetOp complete")
            if (fileStream !== undefined) {
                fileStream.end();
            }
        });

    }

    next(v) {
        this.push(v);
    }
}
