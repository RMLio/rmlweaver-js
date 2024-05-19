import {Executor} from "../src/executor.js";

async function benchmark_big_file () {
    const executor = new Executor("C:/Users/webin/Desktop/IDLAB/meamer-js/test/data/mapping.csv.dot")
    await executor.run()
}

benchmark_big_file()
