#!/bin/bash

# Nikita Kouevda
# 2013/06/30

# Change directory to parent directory of location of script
cd "$(dirname "${BASH_SOURCE[0]}")/.."

# Load configuration
. "bin/config.sh"
tmp_dir="tmp.$$"

# Clear the offline servers file and make the temporary directory
> "$offline_servers"
mkdir -p "$tmp_dir"

# Query each server in a background subshell for concurrent execution
for server in $(cat "$server_list" | grep -v '^[#$]'); do
    (
        # Retrieve and write output
        ssh "${ssh_config[@]}" "$username@$server" \
            "$remote_dir/$remote_script $server" > "$tmp_dir/$server" \
            2>/dev/null

        # Record the server as offline if ssh returned non-0
        [[ "$?" -ne 0 ]] && echo "$server" >> "$offline_servers"
    ) &
done

# Wait for all background jobs to finish
wait

# Generate the new online servers file and remove the temporary directory
cat "$tmp_dir"/* > "$online_servers"
rm -rf "$tmp_dir"
