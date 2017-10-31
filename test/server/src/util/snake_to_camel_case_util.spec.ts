import {expect} from "chai";
import {snakeToCamelCase, traverseSnakeToCamelCase} from '../../../../server/src/util/snake_to_camel_case_util';

describe('Utility that converts snake case to camel case', function () {
    it('should convert time_estimate to timeEstimate', function () {
        expect(snakeToCamelCase('time_estimate')).to.equal('timeEstimate');
    });

    it('should return \'id\' as itself', function () {
        expect(snakeToCamelCase('id')).to.equal('id');
    });

    it('should return properties in snake case', function () {
        let camelCaseObj = {
            id: '2',
            time_estimate: '1 hour'
        };
        expect(traverseSnakeToCamelCase(camelCaseObj)).to.be.deep.equal({
            id: '2',
            timeEstimate: '1 hour'
        });
    });

    it('should return properties in snake case with arrays', function () {
        let camelCaseObj = {
            id: '2',
            time_estimate: '1 hour',
            modules: [{
                id: '1',
                time_estimate: '30 minutes'
            }, {
                id: '2',
                time_estimate: '45 minutes'
            }]
        };
        expect(traverseSnakeToCamelCase(camelCaseObj)).to.be.deep.equal({
            id: '2',
            timeEstimate: '1 hour',
            modules: [{
                id: '1',
                timeEstimate: '30 minutes'
            }, {
                id: '2',
                timeEstimate: '45 minutes'
            }]
        });
    });
});