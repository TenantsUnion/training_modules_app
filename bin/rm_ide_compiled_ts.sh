#!/usr/bin/env bash

find './server/src' -name "*.js" -exec rm -rf "{}" \; -o -name "*.js.map" -exec rm -rf "{}" \;
find './webapp/src' -name "*.js" -exec rm -rf "{}" \; -o -name "*.js.map" -exec rm -rf "{}" \;
find './test/src' -name "*.js" -exec rm -rf "{}" \; -o -name "*.js.map" -exec rm -rf "{}" \;
find './shared' -name "*.js" -exec rm -rf "{}" \; -o -name "*.js.map" -exec rm -rf "{}" \;
