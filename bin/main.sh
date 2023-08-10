#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

source "bin/settings.sh"

# shellcheck disable=SC2188
>"$offline_servers"

tmp_dir="$(mktemp -d)"

# Query each server in background for concurrent execution
sed -n '/^[^#]/p' "$server_list" | while read -r server; do
  # Retrieve and write output; record server as offline if ssh returns nonzero
  ssh "${ssh_config[@]}" "$username@$server" \
      "$remote_dir/$info_script $server" >"$tmp_dir/$server" 2>/dev/null \
      || echo "$server" >>"$offline_servers" &
done

# Wait for all background jobs to finish
wait

# Generate the new online servers file
cat "$tmp_dir"/* >"$online_servers"

rm -r "$tmp_dir"
