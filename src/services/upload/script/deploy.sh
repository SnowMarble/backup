#!/bin/sh

rm -rf dist
tsc -p .

cp -r prisma dist
cp package.json dist

cf push
