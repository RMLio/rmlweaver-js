/* Generates a function mapping an object to a string.
   Template fields must be split with a ' '. When you want to introduce a variable in the template place '?'.
   Example: "?name <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> ."

   generateTemplate(template)({name:"abc}) = "?abc <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> ."
*/
export class FileNotFoundError extends Error {
  constructor (filePath) {
    super(`File not found: ${filePath}`)
    this.name = 'FileNotFoundError'
    this.code = 'FileNotFound'
  }
}

export function enableDebugging(){
  debugLog = function (message) {
      console.log("Debug: ", message)
  }
}

export function debugLog(message){ // Only prints in debug mode.
  // Do nothing
}