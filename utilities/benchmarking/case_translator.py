import os
import json
import shutil

def find_first_mapping_file(data, key='mapping_file'):
    if isinstance(data, dict):
        for k, v in data.items():
            if k == key:
                return v
            elif isinstance(v, (dict, list)):
                found = find_first_mapping_file(v, key)
                if found is not None:
                    return found
    elif isinstance(data, list):
        for item in data:
            if isinstance(item, (dict, list)):
                found = find_first_mapping_file(item, key)
                if found is not None:
                    return found
    return None

def convert_json_file(json_object):
    name = json_object["name"] + " Converted to MeamerJS"
    description = json_object["description"] + " Using the MeamerJS engine."
    mapping_file = find_first_mapping_file(json_object["steps"])
    
    converted_json = {
        "@id": json_object["@id"],
        "name": name,
        "description": description,
        "steps": [{
            "@id": json_object["@id"],
            "name": "MeamerJS execution",
            "command": "execute_mapping",
            "resource": "MeamerJS",
            "parameters": {"mapping_file": mapping_file}
        }]
    }
    return converted_json

def extract_json(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)

def save_json(file_path, data):
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)

OUTPUT_DIR = "./MeamerJSBenchmarks/"
os.makedirs(OUTPUT_DIR, exist_ok=True)

initial_folders = ["./eswc-kgc-challenge-2023"]
folders_to_parse = [(folder, OUTPUT_DIR + folder.strip("./")) for folder in initial_folders]

while folders_to_parse:
    current_dir, output_dir = folders_to_parse.pop(0)
    print(f"Exploring: {current_dir} -> Output: {output_dir}")

    try:
        dir_contents = os.listdir(current_dir)
    except NotADirectoryError:
        print(f"{current_dir} is not a directory.")
        continue

    if "metadata.json" in dir_contents:
        metadata_path = os.path.join(current_dir, "metadata.json")
        important_info = extract_json(metadata_path)
        new_json = convert_json_file(important_info)
        
        shutil.copytree(current_dir, output_dir, dirs_exist_ok=True)
        new_metadata_path = os.path.join(output_dir, "metadata.json")
        shutil.copyfile(new_metadata_path, os.path.join(output_dir, "original_metadata.json"))
        save_json(new_metadata_path, new_json)
        
    for item in dir_contents:
        item_path = os.path.join(current_dir, item)
        if os.path.isdir(item_path):
            new_output_dir = os.path.join(output_dir, item)
            folders_to_parse.append((item_path, new_output_dir))

