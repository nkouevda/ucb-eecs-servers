#!/bin/bash

# Nikita Kouevda
# 2013/06/30

# Change directory to parent directory of location of script
cd "$(dirname "${BASH_SOURCE[0]}")/.."

# Load configuration
. "bin/config.sh"

# Run the main remote script
ssh "${ssh_config[@]}" "$username@$server" "$remote_dir/$remote_main_script"

# Retrieve the online and offline files
scp "${ssh_config[@]}" \
    "$username@$server:$remote_dir/{$online_servers,$offline_servers}" data/

# Update the best hive server
sort -nrst ',' -k 2,2 "$online_servers" | sort -nrst ',' -k 3,3 | grep 'hive' \
    | tail -n 1 | cut -d ',' -f 1 > "$best_hive"
