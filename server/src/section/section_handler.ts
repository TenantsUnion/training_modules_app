import {SectionRepository} from './section_repository';
import {CreateSectionData, SaveSectionData, ViewSectionQuillData} from '../../../shared/sections';
import {QuillRepository} from '../quill/quill_repository';
import {LoggerInstance} from 'winston';
import {getLogger} from '../log';

export class SectionHandler {
    logger: LoggerInstance = getLogger('SectionHandler', 'info');

    constructor(private sectionRepo: SectionRepository,
                private quillRepo: QuillRepository) {
    }

    createSection(createSectionData: CreateSectionData): Promise<string> {
        return (async () => {
            let quillId = await this.quillRepo.getNextId();

            this.logger.info('Inserting quill data id: %s json: %s', quillId,
                JSON.stringify(createSectionData.quillData, null, '\t'));
            await this.quillRepo.insertEditorJson(quillId, createSectionData.quillData);
            this.logger.info('Creating section with quill id: %s', quillId);
            let sectionId = await this.sectionRepo.createSection(createSectionData, quillId);
            return sectionId;
        })();
    }

    saveSection(data: SaveSectionData): Promise<void> {
        return (async () => {
            await this.quillRepo.updateEditorJson(data.content[0].id, data.content[0].editorJson);
            await this.sectionRepo.updateSection(data);
        })();
    }
}