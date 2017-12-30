import esConfig from 'config';
import esDelta from 'quill-delta';
import DeltaStatic = Quill.DeltaStatic;

// ts-node environment doesn't yet support integration with @std/esm es6 modules node functionality so sythenticDefaultImports are not
// supported. The above import statement has config as undefined when run with ts-node

export const config = esConfig ? esConfig : require('config');
export const Delta: DeltaStatic = esDelta ? esDelta : require('quill-delta');
