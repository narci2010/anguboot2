#!/bin/bash
set -e

echo 'Generating project with following configuration : $1'
mkdir $HOME/angutest
cd $HOME/angutest
cp $HOME/test/.yo-rc.$1.json $HOME/angutest/
yo anguboot2 -f