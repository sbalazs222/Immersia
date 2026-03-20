#!/bin/sh
set -e

mkdir -p /immersia_data/incoming /immersia_data/sounds /immersia_data/thumb
chown -R 1000:1000 /immersia_data

apk add su-exec

exec su-exec 1000:1000 npm run start
