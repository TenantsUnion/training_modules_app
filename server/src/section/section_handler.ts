import {SectionRepository} from './section_repository';
import {CreateSectionData, SaveSectionData, SectionData} from '../../../shared/sections';
import {userContentHandler} from '../config/handler.config';
import {QuillRepository} from '../quill/quill_repository';
import {quillRepository, sectionRepository} from '../config/repository.config';

export class SectionHandler {
    constructor(private sectionRepo: SectionRepository,
                private quillRepo: QuillRepository) {
    }

    createSection(createSectionData: CreateSectionData): Promise<string> {
        return (async () => {
            let quillId = await this.quillRepo.getNextId();
            await this.quillRepo.insertEditorJson(quillId, null);
            let sectionId = await this.sectionRepo.createSection(createSectionData);
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