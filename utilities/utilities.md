# MeamerJS Utilities
## Updating test cases
In the folder test_creation there is a script, this script will download, and translate all RML cases using the latest version of AlgeloomRS. \
Using the script:
- 1: Install cargo toolchain so Algemaploom-rs can be built. 
````curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh````
- 2: Then you can run the command `./generate_meamerjs_cases.sh <IDLab gitlab username> <IDLab gitlab auth_key>`. Gitlab keys are required since these are needed to clone the Algeloommap-rs

The translated cases will be in the folder `meamerjs_cases` along with the original mapping files. 
## Running KGCW challenge framework
- 1: Clone the KGCW test repo `https://github.com/kg-construct/challenge-tool` and make sure to switch to the challenge-2024 branch.
- 2: Download all the test cases, run: `
./exectool download-challenge-2023`
- 3: Add `meamerjs.py` to the `bench_executor` folder. 
- 4: Make sure to properly configure the meamerjs.py ALGEMAPLOOMRS_BINARY variable to the translator binary of Algemaploom-rs. 
- 4: Now we just need to translate all the cases and we can run the benchmark: copy the python file: `case_translator.py` to the download folder. Execute the file.
- 5: Run the following command to execute the cases: `./exectool --root=/challenge-tool/downloads/MeamerJSBenchmarks run`. Make sure to properly configure the root folder.

