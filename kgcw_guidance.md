# Utilising KGCW with MeamerJS

## Step one:
Make sure you are on the required version of MeamerJS. This settings can be changed in the file `meamer.json` in the root directory of your project. ~Benchmark/challenge-tool/bench_executor/meamerjs.py

## Step two:
Run the challenge tool using wanted commands. And wait for the output to come. For example:
```bash
/exectool run --runs=5 --verbose --root="/home/cloud/Benchmark/challenge-tool/downloads/eswc-kgc-challenge-2024-meamerjs/track2/"
```
## Step three: 
Generate the output, to only get the times and benchmark information, run the following command:
```bash
./exectool stats --root=downloads/eswc-kgc-challenge-2024-meamerjs/track2/
```
The output zip file will be in the root directory.
To also gather the sink output files, use the script in the root challenge-tool directory: This will first run the previous command to generate the csv files, and then it will copy the respective output to folders. Afterwards it will zip all the results
```bash
./gather-results.sh downloads/eswc-kgc-challenge-2024-meamerjs/track2/
```