import {expect} from 'chai';
import {isEmptyQuestionChanges} from '../../../shared/questions';
import {addDeltaArrOp} from '../../../shared/delta/diff_key_array';

describe('question utilities', function () {
    describe('isEmptyQuestionChanges', function () {
        it('should return true when optionIds, correctOptionIds, optionChanges are empty objects and arrays', function () {
            expect(isEmptyQuestionChanges({
                optionChangesObject: {},
                optionIds: [],
                correctOptionIds: []
            })).to.be.true;
        });

        it('should return false if any primitive property is set', function () {
            let primitiveProperties = ["questionQuillId", "questionType", "answerType", "randomizeOptionOrder",
                "answerInOrder", "canPickMultiple"];

            expect(isEmptyQuestionChanges({
                optionChangesObject: {},
                optionIds: [],
                correctOptionIds: [],
                // randomly choose primitive property to set a value for -- doesn't matter what the value is
                [primitiveProperties[Math.floor(Math.random() * primitiveProperties.length)]]: true
            })).to.be.false;


        });

        it('should return false if optionIds contains an operation', function () {
            expect(isEmptyQuestionChanges({
                optionChangesObject: {},
                optionIds: [addDeltaArrOp('QO1', 0)],
                correctOptionIds: []
            }))
        });

    });
});