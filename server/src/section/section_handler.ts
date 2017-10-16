import * as _ from "underscore";
import {SectionRepository} from './section_repository';
import {
    CreateSectionData, SaveSectionData, ViewSectionTransferData
} from 'sections';
import {QuillRepository} from '../quill/quill_repository';
import {LoggerInstance} from 'winston';
import {getLogger} from '../log';

export class SectionHandler {
    logger: LoggerInstance = getLogger('SectionHandler', 'info');

    constructor(private sectionRepo: SectionRepository,
                private quillRepo: QuillRepository) {
    }

    async createSection(createSectionData: CreateSectionData): Promise<string> {
        let quillId = await this.quillRepo.getNextId();

        this.logger.info('Inserting quill data id: %s json: %s', quillId,
            JSON.stringify(createSectionData.content, null, '\t'));
        await this.quillRepo.insertEditorJson(quillId, createSectionData.content);
        this.logger.info('Creating section with quill id: %s', quillId);
        let sectionId = await this.sectionRepo.createSection(createSectionData, quillId);
        return sectionId;
    }

    async saveSection(data: SaveSectionData): Promise<void> {
        await this.quillRepo.updateEditorJson(data.content[0].id, data.content[0].editorJson);
        await this.sectionRepo.updateSection(data);
    }

    async removeSection(section: ViewSectionTransferData): Promise<void> {
        let removeQuillContent = _.map(section.orderedContentIds, (quillId) => {
            return this.quillRepo.remove(quillId);
        });

        await Promise.all(removeQuillContent);
        await this.sectionRepo.remove(section.id);
    }
}