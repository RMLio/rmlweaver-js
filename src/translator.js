export async function translateRmlString(input) {
    try {
        // Dynamically import the WASM module
        const module = await import("../libraries/meamerrs/pkg/meamer_rs.js");

        // Call the function from the module and return the result
        return module.translate_rml_str(input);
    } catch (e) {
        // Log any errors encountered during the import or function execution
        console.error('Error importing or executing the module:', e);
    }
}
