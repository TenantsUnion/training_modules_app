#!/usr/bin/env bash

find './server/src' -name "*.js" -exec rm -rf "{}" \; -o -name "*.js.map" -exec rm -rf "{}" \;
find './webapp/src' -name "*.js" -exec rm -rf "{}" \; -o -name "*.js.map" -exec rm -rf "{}" \;
find './webapp/karma_unit_test/src' -name "*.js" -exec rm -rf "{}" \; -o -name "*.js.map" -exec rm -rf "{}" \;
find './mocha_unit_test/src' -name "*.js" -exec rm -rf "{}" \; -o -name "*.js.map" -exec rm -rf "{}" \;
find './testcafe_e2e_test/src' -name "*.js" -exec rm -rf "{}" \; -o -name "*.js.map" -exec rm -rf "{}" \;
find './test_shared/src' -name "*.js" -exec rm -rf "{}" \; -o -name "*.js.map" -exec rm -rf "{}" \;
find './shared' -name "*.js" -exec rm -rf "{}" \; -o -name "*.js.map" -exec rm -rf "{}" \;
