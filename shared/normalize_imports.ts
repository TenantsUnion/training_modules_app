import esConfig from 'config';
import esDelta from 'quill-delta';
import DeltaStatic = Quill.DeltaStatic;

// ts-node environment doesn't yet support integration with @std/esm es6 modules node functionality so sythenticDefaultImports are not
// supported. The above import statement has config as undefined when run with ts-node

export const config = esConfig ? esConfig : require('config');
export const Delta: DeltaStatic = esDelta ? esDelta : require('quill-delta');

/**
 * Import moment with node's require instead of es6 import syntax since the top level default export is a callable
 * function. From the typescript docs
 * {@link https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-function-d-ts.html}
 *
 *~ Note that ES6 modules cannot directly export callable functions.
 *~ This file should be imported using the CommonJS-style:
 *~   import x = require('someLibrary');
 *~
 *~ Refer to the documentation to understand common
 *~ workarounds for this limitation of ES6 modules.
 */
export const moment = require('moment');
