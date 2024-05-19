import { Executor } from './executor.js'
import {translateRmlString} from "./translator.js";
import {dirname} from "path";
import fs from "fs";
import {debugLog, enableDebugging} from "./utils.js";

async function main () {
  const args = process.argv.slice(2)
  runMeamerJS(args)
}

// Main function for executing a dot or ttl translation file.
export async function runMeamerJS (args){
  const filename = args[0]

  global.dot_directory = dirname(filename) // Directory relative to the file.

  // Enable debugging mode
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "-debug") {
      enableDebugging();
    }

    if (args[i] === "-skipProjection") {
      global.skipProjection = true;
    }
    if (args[i].startsWith("-forceFileOutput=")) {
      // Extract output file from the argument
      global.outputFile = args[i].substring(args[i].indexOf("=") + 1);
    }
    if (args[i].startsWith("-extend_dup_removal")) {
      // Extract output file from the argument
      global.extend_dup_removal = true;
    }
    if(args[i].startsWith("-dup_removal")){
      global.dup_removal = true;
    }
  }

  // Check if filename is a rml file.
  const extension = filename.split('.').pop()
  let fileContents = fs.readFileSync(filename, 'utf8');

  if(extension === "ttl"){
    // Translate rml file.
    fileContents = await translateRmlString(fileContents)
  }else if(extension !== "dot"){
    throw Error("Filetype not supported. Please use a dot or rml file.")

  }
  const executor = new Executor(fileContents)
  await executor.run()
  debugLog("Translation of file: " + filename + " executed successfully.");

}

main()


