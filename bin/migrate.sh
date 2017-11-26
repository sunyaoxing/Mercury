#!/bin/bash

pushd $PWD
cd $PWD/../src
../node_modules/.bin/sequelize db:migrate
popd