#!/bin/bash -e

# build it
npm run build

# sync it online
rsync -rv _site/ admin@18.184.231.194:/home/caddyweb/dchere/static --delete
