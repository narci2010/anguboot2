#!/bin/bash
set -e

echo '>> Generating project with following configuration : $1'
mkdir $HOME/angutest
cd $HOME/angutest
cp $TRAVIS_BUILD_DIR/test/.yo-rc.$1.json $HOME/angutest/
yo anguboot2 -f
echo '>> Generation done !'
