#!/bin/bash


# Step 1: Clone RML test cases repository
rm -rf rml-test-cases
git clone https://github.com/kg-construct/rml-test-cases
echo "RML test cases repository cloned."

# Step 2: Copy specific directories to a new location
rm -r meamer-js-cases
mkdir meamer-js-cases
find "rml-test-cases/test-cases/" -type d -name "*CSV*" -exec cp -r {} "meamerjs_cases/" \;
echo "CSV test cases copied to meamerjs_cases."

# Step 3: Update and build algeloom
if [ -d "algemaploom-rs" ]; then
	cd algemaploom-rs || exit
	git pull
else
	git clone https://github.com/s-minoo/algemaploom-rs.git
	cd algemaploom-rs || exit
fi
git checkout main

echo "Algemaploom-rs updated"
cargo build --release

# Step 4: Run translation
./target/release/translator folder ../meamerjs-cases
echo "Translation completed."

# Return to the original directory
cd ..

echo "Finished"
