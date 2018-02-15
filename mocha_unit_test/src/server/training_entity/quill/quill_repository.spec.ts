import {expect} from 'chai';
import {Delta} from '@shared/normalize_imports';
import {quillRepository} from "@server/config/repository_config";
import * as MockDate from 'mockdate';
import {clearData} from "../../../test_db_util";
import * as Moment from 'moment';
import {toDbTimestampFormat} from "@server/repository";
import {postgresDb} from "@server/datasource";

describe('Quill Repository', function () {
    let now = new Date();
    let nowTimestamp = toDbTimestampFormat(now);
    beforeEach(async function () {
        await clearData();
        MockDate.set(now);
    });

    it('should insert editor json', async function () {
        let quillId = 'QD1';
        let quillData = new Delta().insert('Some text or whatever');
        await quillRepository.insertEditorJson(quillId, quillData);
        expect(await quillRepository.loadQuillData(quillId)).to.deep.eq({
            id: quillId,
            version: 0,
            //use parse to remove functions attached to delta object which would fail comparison
            editorJson: JSON.parse(JSON.stringify(quillData)),
            lastModifiedAt: nowTimestamp,
            createdAt: nowTimestamp
        });
    });

    it('should load multiple quill data', async function () {
        let quillData: { id: string, editorJson: Quill.DeltaStatic }[] = [{
            id: 'QD1',
            editorJson: new Delta().insert('The text of the first')
        }, {
            id: 'QD2',
            editorJson: new Delta().insert('The text of the second')
        }, {
            id: 'QD3',
            editorJson: new Delta().insert('The text of the third')
        }];

        await Promise.all(quillData.map(({id, editorJson}) => quillRepository.insertEditorJson(id, editorJson)));
        expect(await quillRepository.loadMultipleQuillData([quillData[0].id, quillData[2].id])).to.have.deep.members([{
            id: quillData[0].id,
            version: 0,
            //use parse to remove functions attached to delta object which would fail comparison
            editorJson: JSON.parse(JSON.stringify(quillData[0].editorJson)),
            lastModifiedAt: nowTimestamp,
            createdAt: nowTimestamp
        }, {
            id: quillData[2].id,
            version: 0,
            //use parse to remove functions attached to delta object which would fail comparison
            editorJson: JSON.parse(JSON.stringify(quillData[2].editorJson)),
            lastModifiedAt: nowTimestamp,
            createdAt: nowTimestamp
        }]);
    });

    it('should update quill data', async function () {
        let quillId = 'QD1';
        let quillData = new Delta().insert('Some text or whatever');
        await quillRepository.insertEditorJson(quillId, quillData);

        let updated = Moment(now).add(1, 'hour').toDate();
        MockDate.set(updated);


        const updatedEditorJson = quillData.retain(4).delete(2).insert('other text');
        await quillRepository.updateEditorJson({
           id: quillId,
           version: 0,
           editorJson: updatedEditorJson
        });
        expect(await quillRepository.loadQuillData(quillId)).to.deep.eq({
            id: quillId,
            version: 0,
            //use parse to remove functions attached to delta object which would fail comparison
            editorJson: JSON.parse(JSON.stringify(updatedEditorJson)),
            lastModifiedAt: toDbTimestampFormat(updated),
            createdAt: nowTimestamp
        });
    });

    it('should add two quill data entries and remove the first', async function () {
        let quillId1 = 'QD1';
        let quillData1 = new Delta().insert('Some text or whatever');

        let quillId2 = 'QD2';
        let quillData2 = new Delta().insert('Some text or whatever');
        await quillRepository.insertEditorJson(quillId1, quillData1);
        await quillRepository.insertEditorJson(quillId2, quillData2);

        await quillRepository.remove(quillId1);
        let results = await postgresDb.query(`SELECT * from tu.quill_data`);
        expect(results.length).to.eq(1);
        expect(results[0].id).to.eq(quillId2);
    });
});
