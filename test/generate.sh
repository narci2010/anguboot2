#!/bin/bash
set -e

echo '>> Generating project with following configuration : $1'
mkdir $ANGUTEST2
cd $ANGUTEST2
cp $TRAVIS_BUILD_DIR/test/.yo-rc.$1.json .yo-rc.json
yo anguboot2 -f
echo '>> Generation done !'
