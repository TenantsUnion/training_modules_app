import {expect} from 'chai';
import {convertToDeltaObj} from '../../shared/delta/convert_delta';
import {deltaArrayDiff, diffDeltaObj} from '../../shared/delta/diff_delta';
import * as Delta from 'quill-delta';
import {DeltaArrDiff, DeltaObjDiff} from '../../shared/delta/delta';

describe('diff delta spec', function () {
    it('should return an empty object when there are no differences', function () {
        let delta = convertToDeltaObj({
            a: 1,
            b: 'Some text',
            c: false
        });
        expect(diffDeltaObj(delta, delta)).to.deep.equal({});
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
            b: {
                key3: {
                    beforeIndex: 2,
                    change: 'DELETE'
                }
            }
        });
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
            b: <DeltaArrDiff>[
                {
                    val: 'key1',
                    index: 0,
                    op: 'DELETE'
                },
                {
                    val: 'key1',
                    index: 2,
                    op: 'ADD'
                }
            ]
        };

        expect(diffDeltaObj(delta1, delta2)).to.deep.equal(expected);
    });

    describe('delta array diff', function () {
        it('should return a delta array indicating that the first and third element have been deleted', function () {

            expect(deltaArrayDiff([1, 2, 3, 4], [2, 4])).to.deep.equal(<DeltaArrDiff> [
                {
                    val: 1,
                    index: 0,
                    op: 'DELETE'
                },
                {
                    val: 3,
                    index: 2,
                    op: 'DELETE'
                }
            ])
        });

        it('should return a delta array indicating that the first element has been deleted and the value of the first element has been inserted as the third element', function () {
            expect(deltaArrayDiff([1, 2, 3, 4], [2, 3, 1, 4])).to.deep.equal(<DeltaArrDiff> [
                {
                    val: 1,
                    index: 0,
                    op: 'DELETE'
                },
                {
                    val: 1,
                    index: 2,
                    op: 'ADD'
                }
            ]);
        });
    });
    // it('should return a delta object indicating adding elements to an array of keys', function () {
    //     let delta1 = {
    //         a: new Delta().insert(1),
    //         b: ['key1', 'key3']
    //     };
    //
    //     let delta2 = {
    //         a: new Delta().insert(1),
    //         b: ['key1', 'key2', 'key3']
    //     };
    //
    //     let expected = {
    //         b: {
    //             key3: {
    //                 beforeIndex: 1,
    //                 change: "MOVED",
    //                 index: 2
    //             },
    //             key2: {
    //                 index: 1,
    //                 change: "ADD"
    //             }
    //         }
    //     };
    //
    //     expect(diffDeltaObj(delta1, delta2)).to.deep.equal(expected);
    // });
});