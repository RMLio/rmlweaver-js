import {dotFileTest, lineAmountTest, operatorTest, throwErrorTest} from "./test_functions.js";
import {FileNotFoundError} from "../src/utils.js";

const TC_CSV =  'test/rml-mapper-test-cases-csv' // Test cases directory (csv)
const TC_JSON = 'test/rml-mapper-test-cases-json' // Test cases directory (json)
const TC_KGCW = 'test/KGCW' // Test cases directory KGCW tool
const OTC =  'test/rml-operator-test-cases' // Operator test cases directory

/*
 All RML-Mapper csv test-cases (https://github.com/kg-construct/rml-test-cases)
 Then converted using meamer-rs (https://github.com/s-minoo/meamer-rs)
 Currently, a lot are failing due to non-implemented operators or functions.

 */

/*describe("RML Operator Tests" ,() => {
    it('Extend Test 1', operatorTest(`${OTC}/EXTEND_1.json`));
    it('Extend Test 2', operatorTest(`${OTC}/EXTEND_2.json`));
    it('Extend Test 3', operatorTest(`${OTC}/EXTEND_3.json`));
    it('Extend Test 4', operatorTest(`${OTC}/EXTEND_4.json`));
    it('Project Test 1', operatorTest(`${OTC}/PROJECT_1.json`));
    it('Project Test 2', operatorTest(`${OTC}/PROJECT_2.json`));
    it('Serializer Test 1', operatorTest(`${OTC}/SERIALIZER_1.json`));
}); TODO: Update these operator tests to the latest specifications */

describe("RML Mapper Tests CSV", () => {
    it('RMLTC0000-CSV', dotFileTest(`${TC_CSV}/RMLTC0000-CSV/mapping.dot`, `${TC_CSV}/RMLTC0000-CSV/output.nq`));
    it('RMLTC0001a-CSV', dotFileTest(`${TC_CSV}/RMLTC0001a-CSV/mapping.dot`, `${TC_CSV}/RMLTC0001a-CSV/output.nq`));
    it('RMLTC0001b-CSV', dotFileTest(`${TC_CSV}/RMLTC0001b-CSV/mapping.dot`, `${TC_CSV}/RMLTC0001b-CSV/output.nq`));
    it('RMLTC0002a-CSV', dotFileTest(`${TC_CSV}/RMLTC0002a-CSV/mapping.dot`, `${TC_CSV}/RMLTC0002a-CSV/output.nq`));
    it('RMLTC0002b-CSV', dotFileTest(`${TC_CSV}/RMLTC0002b-CSV/mapping.dot`, `${TC_CSV}/RMLTC0002b-CSV/output.nq`));
    //it('RMLTC0002c-CSV', dotFileTest(`${TC_CSV}/RMLTC0002c-CSV/mapping.dot`, `${TC_CSV}/RMLTC0002c-CSV/output.nq`));
    //it('RMLTC0002e-CSV', throwErrorTest(`${TC_CSV}/RMLTC0002e-CSV/mapping.dot`, "ENOENT"));
    it('RMLTC0003c-CSV', dotFileTest(`${TC_CSV}/RMLTC0003c-CSV/mapping.dot`, `${TC_CSV}/RMLTC0003c-CSV/output.nq`));
    it('RMLTC0004a-CSV', dotFileTest(`${TC_CSV}/RMLTC0004a-CSV/mapping.dot`, `${TC_CSV}/RMLTC0004a-CSV/output.nq`));
    //it('RMLTC0004b-CSV', dotFileTest(`${TC_CSV}/RMLTC0004b-CSV/mapping.dot`, `${TC_CSV}/RMLTC0004b-CSV/output.nq`));
    it('RMLTC0005a-CSV', dotFileTest(`${TC_CSV}/RMLTC0005a-CSV/mapping.dot`, `${TC_CSV}/RMLTC0005a-CSV/output.nq`));
    it('RMLTC0006a-CSV', dotFileTest(`${TC_CSV}/RMLTC0006a-CSV/mapping.dot`, `${TC_CSV}/RMLTC0006a-CSV/output.nq`));
    it('RMLTC0007a-CSV', dotFileTest(`${TC_CSV}/RMLTC0007a-CSV/mapping.dot`, `${TC_CSV}/RMLTC0007a-CSV/output.nq`));
    it('RMLTC0007b-CSV', dotFileTest(`${TC_CSV}/RMLTC0007b-CSV/mapping.dot`, `${TC_CSV}/RMLTC0007b-CSV/output.nq`));
    it('RMLTC0007c-CSV', dotFileTest(`${TC_CSV}/RMLTC0007c-CSV/mapping.dot`, `${TC_CSV}/RMLTC0007c-CSV/output.nq`));
    it('RMLTC0007d-CSV', dotFileTest(`${TC_CSV}/RMLTC0007d-CSV/mapping.dot`, `${TC_CSV}/RMLTC0007d-CSV/output.nq`));
    it('RMLTC0007e-CSV', dotFileTest(`${TC_CSV}/RMLTC0007e-CSV/mapping.dot`, `${TC_CSV}/RMLTC0007e-CSV/output.nq`));
    it('RMLTC0007f-CSV', dotFileTest(`${TC_CSV}/RMLTC0007f-CSV/mapping.dot`, `${TC_CSV}/RMLTC0007f-CSV/output.nq`));
    //it('RMLTC0007g-CSV', dotFileTest(`${TC_CSV}/RMLTC0007g-CSV/mapping.dot`, `${TC_CSV}/RMLTC0007g-CSV/output.nq`));
    //it('RMLTC0007h-CSV', dotFileTest(`${TC_CSV}/RMLTC0007h-CSV/mapping.dot`, `${TC_CSV}/RMLTC0007h-CSV/output.nq`));
    it('RMLTC0008a-CSV', dotFileTest(`${TC_CSV}/RMLTC0008a-CSV/mapping.dot`, `${TC_CSV}/RMLTC0008a-CSV/output.nq`));
    it('RMLTC0008b-CSV', dotFileTest(`${TC_CSV}/RMLTC0008b-CSV/mapping.dot`, `${TC_CSV}/RMLTC0008b-CSV/output.nq`));
    it('RMLTC0008c-CSV', dotFileTest(`${TC_CSV}/RMLTC0008c-CSV/mapping.dot`, `${TC_CSV}/RMLTC0008c-CSV/output.nq`));
    it('RMLTC0009a-CSV', dotFileTest(`${TC_CSV}/RMLTC0009a-CSV/mapping.dot`, `${TC_CSV}/RMLTC0009a-CSV/output.nq`));
    it('RMLTC0009b-CSV', dotFileTest(`${TC_CSV}/RMLTC0009b-CSV/mapping.dot`, `${TC_CSV}/RMLTC0009b-CSV/output.nq`));
    it('RMLTC0010a-CSV', dotFileTest(`${TC_CSV}/RMLTC0010a-CSV/mapping.dot`, `${TC_CSV}/RMLTC0010a-CSV/output.nq`));
    it('RMLTC0010b-CSV', dotFileTest(`${TC_CSV}/RMLTC0010b-CSV/mapping.dot`, `${TC_CSV}/RMLTC0010b-CSV/output.nq`));
    it('RMLTC0010c-CSV', dotFileTest(`${TC_CSV}/RMLTC0010c-CSV/mapping.dot`, `${TC_CSV}/RMLTC0010c-CSV/output.nq`));
    // it('RMLTC0011b-CSV', dotFileTest(`${TC_CSV}/RMLTC0011b-CSV/mapping.dot`, `${TC_CSV}/RMLTC0011b-CSV/output.nq`));
    it('RMLTC0012a-CSV', dotFileTest(`${TC_CSV}/RMLTC0012a-CSV/mapping.dot`, `${TC_CSV}/RMLTC0012a-CSV/output.nq`));
    it('RMLTC0012b-CSV', dotFileTest(`${TC_CSV}/RMLTC0012b-CSV/mapping.dot`, `${TC_CSV}/RMLTC0012b-CSV/output.nq`));
    it('RMLTC0012c-CSV', dotFileTest(`${TC_CSV}/RMLTC0012c-CSV/mapping.dot`, `${TC_CSV}/RMLTC0012c-CSV/output.nq`));
    it('RMLTC0012d-CSV', dotFileTest(`${TC_CSV}/RMLTC0012d-CSV/mapping.dot`, `${TC_CSV}/RMLTC0012d-CSV/output.nq`));
    it('RMLTC0015a-CSV', dotFileTest(`${TC_CSV}/RMLTC0015a-CSV/mapping.dot`, `${TC_CSV}/RMLTC0015a-CSV/output.nq`));
    // it('RMLTC0015b-CSV', dotFileTest(`${TC_CSV}/RMLTC0015b-CSV/mapping.dot`, `${TC_CSV}/RMLTC0015b-CSV/output.nq`));
    it('RMLTC0019a-CSV', dotFileTest(`${TC_CSV}/RMLTC0019a-CSV/mapping.dot`, `${TC_CSV}/RMLTC0019a-CSV/output.nq`));
    it('RMLTC0019b-CSV', dotFileTest(`${TC_CSV}/RMLTC0019b-CSV/mapping.dot`, `${TC_CSV}/RMLTC0019b-CSV/output.nq`));
    it('RMLTC0020a-CSV', dotFileTest(`${TC_CSV}/RMLTC0020a-CSV/mapping.dot`, `${TC_CSV}/RMLTC0020a-CSV/output.nq`));
    it('RMLTC0020b-CSV', dotFileTest(`${TC_CSV}/RMLTC0020b-CSV/mapping.dot`, `${TC_CSV}/RMLTC0020b-CSV/output.nq`));
    it('GTFS-case', dotFileTest(`${TC_CSV}/GTFS-case/mapping.dot`, `${TC_CSV}/GTFS-case/output.nq`));
});


describe("RML Mapper Tests JSON", () => {
    it('RMLTC0000-JSON', dotFileTest(`${TC_JSON}/RMLTC0000-JSON/mapping.dot`, `${TC_JSON}/RMLTC0000-JSON/output.nq`));
    it('RMLTC0001a-JSON', dotFileTest(`${TC_JSON}/RMLTC0001a-JSON/mapping.dot`, `${TC_JSON}/RMLTC0001a-JSON/output.nq`));
    it('RMLTC0001b-JSON', dotFileTest(`${TC_JSON}/RMLTC0001b-JSON/mapping.dot`, `${TC_JSON}/RMLTC0001b-JSON/output.nq`));
    it('RMLTC0002a-JSON', dotFileTest(`${TC_JSON}/RMLTC0002a-JSON/mapping.dot`, `${TC_JSON}/RMLTC0002a-JSON/output.nq`));
    it('RMLTC0002b-JSON', dotFileTest(`${TC_JSON}/RMLTC0002b-JSON/mapping.dot`, `${TC_JSON}/RMLTC0002b-JSON/output.nq`));
    it('RMLTC0002c-JSON', dotFileTest(`${TC_JSON}/RMLTC0002c-JSON/mapping.dot`, `${TC_JSON}/RMLTC0002c-JSON/output.nq`));
    it('RMLTC0002e-JSON', throwErrorTest(`${TC_JSON}/RMLTC0002e-JSON/mapping.dot`, FileNotFoundError));
    it('RMLTC0003c-JSON', dotFileTest(`${TC_JSON}/RMLTC0003c-JSON/mapping.dot`, `${TC_JSON}/RMLTC0003c-JSON/output.nq`));
    it('RMLTC0004a-JSON', dotFileTest(`${TC_JSON}/RMLTC0004a-JSON/mapping.dot`, `${TC_JSON}/RMLTC0004a-JSON/output.nq`));
    it('RMLTC0004b-JSON', dotFileTest(`${TC_JSON}/RMLTC0004b-JSON/mapping.dot`, `${TC_JSON}/RMLTC0004b-JSON/output.nq`));
    it('RMLTC0005a-JSON', dotFileTest(`${TC_JSON}/RMLTC0005a-JSON/mapping.dot`, `${TC_JSON}/RMLTC0005a-JSON/output.nq`));
    it('RMLTC0006a-JSON', dotFileTest(`${TC_JSON}/RMLTC0006a-JSON/mapping.dot`, `${TC_JSON}/RMLTC0006a-JSON/output.nq`));
    it('RMLTC0007a-JSON', dotFileTest(`${TC_JSON}/RMLTC0007a-JSON/mapping.dot`, `${TC_JSON}/RMLTC0007a-JSON/output.nq`));
    it('RMLTC0007b-JSON', dotFileTest(`${TC_JSON}/RMLTC0007b-JSON/mapping.dot`, `${TC_JSON}/RMLTC0007b-JSON/output.nq`));
    it('RMLTC0007c-JSON', dotFileTest(`${TC_JSON}/RMLTC0007c-JSON/mapping.dot`, `${TC_JSON}/RMLTC0007c-JSON/output.nq`));
    it('RMLTC0007d-JSON', dotFileTest(`${TC_JSON}/RMLTC0007d-JSON/mapping.dot`, `${TC_JSON}/RMLTC0007d-JSON/output.nq`));
    it('RMLTC0007e-JSON', dotFileTest(`${TC_JSON}/RMLTC0007e-JSON/mapping.dot`, `${TC_JSON}/RMLTC0007e-JSON/output.nq`));
    it('RMLTC0007f-JSON', dotFileTest(`${TC_JSON}/RMLTC0007f-JSON/mapping.dot`, `${TC_JSON}/RMLTC0007f-JSON/output.nq`));
    it('RMLTC0007g-JSON', dotFileTest(`${TC_JSON}/RMLTC0007g-JSON/mapping.dot`, `${TC_JSON}/RMLTC0007g-JSON/output.nq`));
    it('RMLTC0007h-JSON', dotFileTest(`${TC_JSON}/RMLTC0007h-JSON/mapping.dot`, `${TC_JSON}/RMLTC0007h-JSON/output.nq`));
    it('RMLTC0008a-JSON', dotFileTest(`${TC_JSON}/RMLTC0008a-JSON/mapping.dot`, `${TC_JSON}/RMLTC0008a-JSON/output.nq`));
    it('RMLTC0008b-JSON', dotFileTest(`${TC_JSON}/RMLTC0008b-JSON/mapping.dot`, `${TC_JSON}/RMLTC0008b-JSON/output.nq`));
    it('RMLTC0008c-JSON', dotFileTest(`${TC_JSON}/RMLTC0008c-JSON/mapping.dot`, `${TC_JSON}/RMLTC0008c-JSON/output.nq`));
    it('RMLTC0009a-JSON', dotFileTest(`${TC_JSON}/RMLTC0009a-JSON/mapping.dot`, `${TC_JSON}/RMLTC0009a-JSON/output.nq`));
    it('RMLTC0009b-JSON', dotFileTest(`${TC_JSON}/RMLTC0009b-JSON/mapping.dot`, `${TC_JSON}/RMLTC0009b-JSON/output.nq`));
    it('RMLTC0010a-JSON', dotFileTest(`${TC_JSON}/RMLTC0010a-JSON/mapping.dot`, `${TC_JSON}/RMLTC0010a-JSON/output.nq`));
    it('RMLTC0010b-JSON', dotFileTest(`${TC_JSON}/RMLTC0010b-JSON/mapping.dot`, `${TC_JSON}/RMLTC0010b-JSON/output.nq`));
    it('RMLTC0010c-JSON', dotFileTest(`${TC_JSON}/RMLTC0010c-JSON/mapping.dot`, `${TC_JSON}/RMLTC0010c-JSON/output.nq`));
    it('RMLTC0011b-JSON', dotFileTest(`${TC_JSON}/RMLTC0011b-JSON/mapping.dot`, `${TC_JSON}/RMLTC0011b-JSON/output.nq`));
    it('RMLTC0012a-JSON', dotFileTest(`${TC_JSON}/RMLTC0012a-JSON/mapping.dot`, `${TC_JSON}/RMLTC0012a-JSON/output.nq`));
    it('RMLTC0012b-JSON', dotFileTest(`${TC_JSON}/RMLTC0012b-JSON/mapping.dot`, `${TC_JSON}/RMLTC0012b-JSON/output.nq`));
    it('RMLTC0012c-JSON', dotFileTest(`${TC_JSON}/RMLTC0012c-JSON/mapping.dot`, `${TC_JSON}/RMLTC0012c-JSON/output.nq`));
    it('RMLTC0012d-JSON', dotFileTest(`${TC_JSON}/RMLTC0012d-JSON/mapping.dot`, `${TC_JSON}/RMLTC0012d-JSON/output.nq`));
    it('RMLTC0015a-JSON', dotFileTest(`${TC_JSON}/RMLTC0015a-JSON/mapping.dot`, `${TC_JSON}/RMLTC0015a-JSON/output.nq`));
    it('RMLTC0015b-JSON', dotFileTest(`${TC_JSON}/RMLTC0015b-JSON/mapping.dot`, `${TC_JSON}/RMLTC0015b-JSON/output.nq`));
    it('RMLTC0019a-JSON', dotFileTest(`${TC_JSON}/RMLTC0019a-JSON/mapping.dot`, `${TC_JSON}/RMLTC0019a-JSON/output.nq`));
    it('RMLTC0019b-JSON', dotFileTest(`${TC_JSON}/RMLTC0019b-JSON/mapping.dot`, `${TC_JSON}/RMLTC0019b-JSON/output.nq`));
    it('RMLTC0020a-JSON', dotFileTest(`${TC_JSON}/RMLTC0020a-JSON/mapping.dot`, `${TC_JSON}/RMLTC0020a-JSON/output.nq`));
    it('RMLTC0020b-JSON', dotFileTest(`${TC_JSON}/RMLTC0020b-JSON/mapping.dot`, `${TC_JSON}/RMLTC0020b-JSON/output.nq`));
});

describe("KGCTOOL Tests", function() {
    this.timeout(0);
    it('GTFS Scale1',
        lineAmountTest(`${TC_KGCW}/scale_1/data/mapping.dot`, 395953));
    it('GTFS Tabular',
        dotFileTest(`${TC_KGCW}/tabular/mapping.dot`, `${TC_JSON}/RMLTC0020a-JSON/output.nq`));
});