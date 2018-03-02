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
        MockDate.set(now);
    });

    it('should insert editor json', async function () {
        let quillData = new Delta().insert('Some textAnswer or whatever');
        let quillId = await quillRepository.insertEditorJson(quillData);
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
        let quillData: Quill.DeltaStatic[] = [
            new Delta().insert('The textAnswer of the first'),
            new Delta().insert('The textAnswer of the second'),
            new Delta().insert('The textAnswer of the third')
        ];

        let quillIds = await Promise.all(quillData.map((editorJson) => quillRepository.insertEditorJson(editorJson)));
        expect(await quillRepository.loadMultipleQuillData([quillIds[0], quillIds[2]])).to.have.deep.members([{
            id: quillIds[0],
            version: 0,
            //use parse to remove functions attached to delta object which would fail comparison
            editorJson: JSON.parse(JSON.stringify(quillData[0])),
            lastModifiedAt: nowTimestamp,
            createdAt: nowTimestamp
        }, {
            id: quillIds[2],
            version: 0,
            //use parse to remove functions attached to delta object which would fail comparison
            editorJson: JSON.parse(JSON.stringify(quillData[2])),
            lastModifiedAt: nowTimestamp,
            createdAt: nowTimestamp
        }]);
    });

    it('should update quill data', async function () {
        let quillData = new Delta().insert('Some textAnswer or whatever');
        let quillId = await quillRepository.insertEditorJson(quillData);

        let updated = Moment(now).add(1, 'hour').toDate();
        MockDate.set(updated);


        const updatedEditorJson = quillData.retain(4).delete(2).insert('other textAnswer');
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
        let quillData1 = new Delta().insert('Some textAnswer or whatever');
        let quillId1 = await quillRepository.insertEditorJson(quillData1);

        let quillData2 = new Delta().insert('Some textAnswer or whatever');
        let quillId2 = await quillRepository.insertEditorJson(quillData2);

        await quillRepository.remove(quillId1);
        let results = await postgresDb.query({
            text: `SELECT * from tu.quill_data qd where qd.id = ANY($1)`,
            values: [[quillId1, quillId2]]
        });
        expect(results.length).to.eq(1);
        expect(results[0].id).to.eq(quillId2);
    });
});
