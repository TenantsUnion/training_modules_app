import {expect} from 'chai'
import {moment} from '@shared/normalize_imports';
import {postgresDb} from '../../../server/src/datasource';
import {TIMESTAMP_FORMAT} from '../../../server/src/repository';

describe('Datasource', function () {

    before(async function () {
        await postgresDb.query(`DROP TABLE IF EXISTS tu.test_data;`);
        await postgresDb.query(`
        CREATE TABLE tu.test_data (
          id   INT PRIMARY KEY,
          some_text TEXT,
          some_var_char VARCHAR(20),
          test TIMESTAMPTZ NOT NULL,
          test2 TIMESTAMPTZ NOT NULL
        );
    `);
    });

    beforeEach(async function () {
        await postgresDb.query(`TRUNCATE TABLE tu.test_data`);
    });

    after(async function () {
        await postgresDb.query(`DROP TABLE tu.test_data;`);
    });

    let date = '2018-01-31T12:30:01.100'; // result should still have .100 and not .1
    let notDate = '20 February';
    let notDate2 = '2016 March 5';
    it('should format timestamptz fields as \'YYYY-MM-DDTHH:mm:ss.SSSZ\' and not truncate fractional second trailing 0s', async function () {
        let date2 = new Date();
        await postgresDb.query({
            text: 'INSERT INTO tu.test_data (id, some_text, some_var_char, test, test2) VALUES (1, $1, $2, $3, $4)',
            values: [notDate, notDate2, date, date2]
        });

        let results = await postgresDb.query(`select * from tu.test_data`);
        expect(results[0]).to.deep.eq({
            id: 1,
            someText: notDate,
            someVarChar: notDate2,
            test: "2018-01-31T12:30:01.100-08:00",
            test2: moment(date2).format(TIMESTAMP_FORMAT)
        });
    });

    it('should format nested json timestamptz fields as \'YYYY-MM-DDTHH:mm:ss.SSSZ\' and not truncate fractional second trailing 0s', async function () {
        let date2 = new Date();
        await postgresDb.query({
            text: 'INSERT INTO tu.test_data (id, some_text, some_var_char, test, test2) VALUES (1, $1, $2, $3, $4)',
            values: [notDate, notDate2, date, date2]
        });

        let results = await postgresDb.query(`select json_agg(td.*) as nested from tu.test_data td`);
        expect(results[0]).to.deep.eq({
            nested: [{
                id: 1,
                someText: notDate,
                someVarChar: notDate2,
                test: "2018-01-31T12:30:01.100-08:00",
                test2: moment(date2).format(TIMESTAMP_FORMAT)
            }]
        });
    });
});