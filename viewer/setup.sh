#!/bin/sh
# set -x

cd `dirname $0`
# npm install
rm -r public/build/*
if [ "$1" = "prod" ]; then
echo "prod"
npm run build:prod
else
echo "dev"
npm run build
fi

