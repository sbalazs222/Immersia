#!/bin/sh
set -e

mkdir -p /data/incoming /data/sounds /data/thumb /data/thumb
chown -R 1000:1000 /data

apk add su-exec

exec su-exec 1000:1000 npm run start
