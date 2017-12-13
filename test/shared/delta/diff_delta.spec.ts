import {expect} from 'chai';
import * as Delta from 'quill-delta';
import {convertToDeltaObj} from '../../../shared/delta/convert_delta';
import {diffDeltaObj} from '../../../shared/delta/diff_delta';
import {DeltaObjDiff} from '../../../shared/delta/delta';

describe('diff delta spec', function () {
    it('should return an empty object when there are no differences', function () {
        let delta = convertToDeltaObj({
            a: 1,
            b: 'Some text',
            c: false
        });
        expect(diffDeltaObj(delta, delta)).to.deep.equal({});
    });

    it('should return a delta object indicating elements have moved ', function () {
        let delta1 = {
            a: new Delta().insert(1),
            b: ['key1', 'key2', 'key3']
        };

        let delta2 = {
            a: new Delta().insert(1),
            b: ['key2', 'key3', 'key1']
        };

        let expected: DeltaObjDiff = {
            "b": [
                {
                    beforeIndex: 1,
                    index: 0,
                    op: "MOVE",
                },
                {
                    beforeIndex: 2,
                    index: 1,
                    op: "MOVE"
                }
            ]
        };

        expect(diffDeltaObj(delta1, delta2)).to.deep.equal(expected);
    });
    it('should return a deltaObject indicating the changed property', function () {
        let delta1 = convertToDeltaObj({
            a: 1,
            b: 'Some text',
            c: false
        });

        let delta2 = convertToDeltaObj({
            a: 2,
            b: 'Some text',
            c: false
        });

        expect(diffDeltaObj(delta1, delta2)).to.deep.equal({
            a: 2
        });
    });

    it('should return a delta object indicating deletions from an array of keys', function () {
        let delta1 = {
            a: new Delta().insert(1),
            b: ['key1', 'key2', 'key3']
        };

        let delta2 = {
            a: new Delta().insert(1),
            b: ['key1', 'key2']
        };

        expect(diffDeltaObj(delta1, delta2)).to.deep.equal({
            b: [
                {
                    index: 2,
                    op: "DELETE",
                    val: "key3"
                }
            ]
        });
    });
});