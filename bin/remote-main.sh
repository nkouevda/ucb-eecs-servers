#!/bin/bash

# Nikita Kouevda
# 2013/06/28

# Change directory to parent directory of location of script
cd "$(dirname "${BASH_SOURCE[0]}")/.."

# Load variables
. bin/config.sh

# The server list
servers_file="data/servers.txt"

# The online and offline files
online_file="data/online.txt"
offline_file="data/offline.txt"

# Clear the offline file and make the temporary directory
> "$offline_file"
mkdir -p tmp

# Iterate over servers, skipping comments and empty lines
for server in $(egrep -v '^[#$]' "$servers_file"); do
    # Background subshell for concurrent execution
    (
        # Retrieve and write output
        ssh "${ssh_opts[@]}" "$user@$server" \
            "~/$remote_dir/bin/remote.sh $server" > "tmp/$server" 2>/dev/null

        # Record the server as offline if ssh returned non-0
        [[ "$?" -ne 0 ]] && echo "$server" >> "$offline_file"
    ) &
done

# Wait for all background jobs to finish
wait

# Generate the new online file and remove the temporary directory
cat tmp/* > "$online_file"
rm -rf tmp
