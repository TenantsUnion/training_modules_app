import {expect} from "chai";
import * as quillDelta from "quill-delta";
import {convertToDeltaObj, parameterErrorMsg} from "../../shared/modify/convert_delta";

// use @type/quilljs for standalone quill-delta library
let Delta: Quill.DeltaStatic = quillDelta;
describe('convertObjectValuesToDeltas function', function () {
    it('should throw an error if not passed an object', function () {
        [null, undefined, true, false, NaN, 'hi', -1, 3, [], [1, 2]].forEach(function (errorArg) {
            expect(convertToDeltaObj.bind(this, errorArg)).to.throw(`${parameterErrorMsg}${errorArg}`);
        });
    });

    it('should convert an object\'s properties to their Delta equivalents', function () {
        expect(convertToDeltaObj({
            a: 1,
            b: 'Some text',
            c: false
        })).to.deep.equal({
            a: new Delta().insert(1),
            b: new Delta().insert('Some text'),
            c: new Delta().insert(false)
        })
    });

    it('should convert a nested array object\'s properties to their Delta equivalents', function () {
        expect(convertToDeltaObj({
            a: [[1, 2, 'Some Stuff'], ['Some text']]
        })).to.deep.equal({
            a: new Delta().insert(1).insert(2).insert('Some Stuff').insert('Some text')
        })
    });

    it('should exclude properties from being being converted with a predicate', function () {
        expect(convertToDeltaObj({
            a: 1,
            b: 'Some text',
            c: false
        }, (key) => key !== 'b')).to.deep.equal({
            a: new Delta().insert(1),
            b: 'Some text',
            c: new Delta().insert(false)
        })
    });
});