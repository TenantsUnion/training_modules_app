import {expect} from 'chai';
import {hasChanges} from '@shared/training';
import {EMPTY_CHANGES_OBJ} from '@mocha-root/test_util/test_course_util';
import {addDeltaArrOp} from '@shared/delta/diff_key_array';
import Delta from 'quill-delta';

describe('training', function () {
    describe('hasChanges', function () {
        it('should indicate an empty training delta', function () {
            expect(hasChanges(EMPTY_CHANGES_OBJ)).to.be.false;
        });

        it('should indicate a change when there is key corresponding to a primitive value', function () {
            expect(hasChanges({
                ...EMPTY_CHANGES_OBJ,
                active: true
            })).to.be.true;
        });

        it('should indicate a change when there is a key corresponding to an array with 1 or more elements', function () {
            expect(hasChanges({
                ...EMPTY_CHANGES_OBJ,
                orderedContentQuestionIds: [addDeltaArrOp('id1', 0)]
            })).to.be.true;
        });

        it('should indicate a change where there is a key corresponding to an object with 1 or more keys', function () {
            expect(hasChanges({
                ...EMPTY_CHANGES_OBJ,
                quillChanges: {
                   quillId: new Delta()
                }
            })).to.be.true;
        });
    });
});