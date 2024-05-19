import {Operator} from "./Operator.js";
import fs from "fs";
import * as readline from "readline";

export class SourceOp extends Operator {

    // because it's a source, you need to set the next and complete yourself
    async start() {
        super.start();
        switch (this.config.source_type) {
            case "File":
                this.read_file();
                break;
        }
    }

    read_file() {
        // Process file
        var path = this.config.path;
        const iterator = this.config.root_iterator
        switch (this.config.source_type){
            case "File":
                break;
            default:
                throw new Error("Iterator source type not supported.")
        }

        switch (iterator.reference_formulation) {
            case "CSVRows":
                try {
                    // CSV parser, on a async continuous stream for memory performance reasons.
                    const stream = fs.createReadStream(global.dot_directory + "/" + path, {flags: 'r', encoding: 'utf-8'});
                    const readLine = readline.createInterface({input:stream, crlfDelay: Infinity});
                    let csvFields = [];

                    let handleLine = (line) => {
                        csvFields = line.split(',') // Insert csv fields
                        // After the first line is processed, change the handler to process subsequent lines

                        handleLine = line => {
                            let fieldStart = 0;
                            let fieldIndex = 0;
                            let quoteLevel = 0
                            let v = {}
                            for(let i = 0; i < line.length; i++) {
                                if (line[i] === '"') {
                                    quoteLevel = quoteLevel + 1
                                }
                                if (line[i] === "," && quoteLevel % 2 === 0) { // field has ended
                                    if(quoteLevel === 0){
                                        v[csvFields[fieldIndex]] = line.substring(fieldStart + quoteLevel / 2, i - quoteLevel / 2)
                                        fieldIndex++;
                                        fieldStart = i + 1;
                                        quoteLevel = 0
                                    }
                                }
                            }
                            v[csvFields[fieldIndex]] = line.substring(fieldStart + quoteLevel / 2, line.length - quoteLevel / 2)
                            this.push(v)
                        }
                    };
                    readLine.on('line', line => {
                        handleLine(line)
                    });

                    let closed = false;
                    readLine.on('close', () => {
                        // All lines are read, file is closed now.
                        closed = true;
                        this.complete(); // Call the complete method here to signify the end of the file processing
                    });

                } catch (err) {
                    // Handle any errors that occur during file reading
                    // throw err
                    throw err
                }
                break;

            case "JSONPath":
                try{
                    // JSON parser, on an async continuous stream for memory performance reasons.
                    const stream = fs.createReadStream(global.dot_directory + "/" + path, {flags: 'r', encoding: 'utf-8'});
                    const reference = iterator.reference

                    let sub_fields = reference.split('.')

                    if(!(sub_fields[0] === '$' && sub_fields[sub_fields.length - 1].slice(-3) == "[*]")){
                         throw new Error("Error in parsing iterator reference.")
                    }
                    sub_fields = sub_fields.slice(1)
                    sub_fields.push(sub_fields.pop().slice(0,-3)) // remove trailing [*]
                    // parse reference
                    let remainder = ""

                    let extract_records = (chunk) =>{
                        chunk = " " + remainder + chunk // parse remainder of last chunk, add a space. Thus start can never be 0
                        let bracelet_level = 0
                        let ci = 0 // assume first char is a {}
                        let start = 0
                        while(ci < chunk.length){
                            if(chunk[ci] === "]" && start === 0){
                                // the list is finished (we reach a list end + there is no active object, this can only be the end of the iterator list)
                                this.complete()
                                return;
                            }
                            if(chunk[ci] === '{') {bracelet_level++; start = start === 0 ? ci : start;}
                            if(chunk[ci] === '}') bracelet_level--
                            if(bracelet_level === 0 && start !== 0){
                                // we have a finished object
                                const json_string = chunk.substring(start, ci + 1) // include the end
                                const json = JSON.parse(json_string)

                                let output = {}
                                iterator.fields.forEach(field => {
                                    output[field.alias] = json[field.reference]
                                    if(field.innerFields != []){
                                        //TODO parse inner fields
                                    }
                                })
                                start = 0
                                remainder = chunk.substring(ci)
                                this.push(output)
                            }
                            ci++
                        }
                    }


                    // First we have to navigate the root iterator reference
                    let curr_string = "" // outside of function so it can also act as a remainder
                    let curr_level = 1
                    let bracelet_count = 0
                    // n
                    let handleChunk =  (chunk) => {
                        // navigate through the file to find the list that should be iterated.
                        let open_string = false
                        for(let i = 0; i < chunk.length; i++ ){
                            if(chunk[i] === '{') bracelet_count++;
                            if(chunk[i] === '}') bracelet_count--;
                            if(bracelet_count === curr_level){
                                if((chunk[i] === "\"" || chunk[i] === "'")){
                                    if(open_string === false){
                                        open_string = true
                                    }else{
                                        if(curr_string === sub_fields[0]){
                                            // the data is in this object
                                            sub_fields = sub_fields.slice(1)
                                            if(sub_fields.length === 0){
                                                // we found the iterator object
                                                handleChunk = extract_records
                                                extract_records(chunk.substring(i))
                                            }
                                        }
                                        open_string = false
                                    }
                                }else{
                                    if(open_string === true){
                                        curr_string += chunk[i]
                                    }
                                }
                            }
                        }
                    }
                    stream.on('data', chunk => {
                            handleChunk(chunk)
                        }
                    )
                }catch(err){
                    throw err
                }
                break;
            default:
                throw new Error("Reference formulation not supported.")
        }
    }
}