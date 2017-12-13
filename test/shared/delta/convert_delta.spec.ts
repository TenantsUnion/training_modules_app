import {expect} from "chai";
import {convertToDeltaObj, parameterErrorMsg} from '../../../shared/delta/convert_delta';

// use @type/quilljs for standalone quill-delta library
describe('convertObjectValuesToDeltas function', function () {
    it('should throw an error if not passed an object', function () {
        [null, undefined, true, false, NaN, 'hi', -1, 3, [], [1, 2]].forEach(function (errorArg) {
            expect(convertToDeltaObj.bind(this, errorArg)).to.throw(`${parameterErrorMsg}${errorArg}`);
        });
    });

    it('should not affect properties that aren\'t deltas', function () {
        expect(convertToDeltaObj({
            a: 1,
            b: 'Some text',
            c: false
        })).to.deep.equal({
            a: 1,
            b: 'Some text',
            c: false
        })
    });

    it('should fully copy nested arrays to the delta object', function () {
        expect(convertToDeltaObj({
            a: [
                1,
                [
                    2,
                    'Some Stuff'
                ]
            ],
            b: 'top level text'
        })).to.deep.equal({
            a: [
                1,
                [
                    2,
                    'Some Stuff'
                ]
            ],
            b: 'top level text'
        });
    });

    it('should exclude properties from being being converted with a predicate', function () {
        expect(convertToDeltaObj({
            a: 1,
            b: 'Some text',
            c: false
        }, (key) => key !== 'b')).to.deep.equal({
            a: 1,
            c: false
        })
    });
});

describe('diffDeltaObj function', function () {

});