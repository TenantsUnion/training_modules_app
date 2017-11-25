import {CreateUserContentCommand} from "content.ts";
import {QuillRepository} from "../../quill/quill_repository";
import {ContentEntity, ContentRepository} from "../content_repository";
import {UserRepository} from "../../user/users_repository";
import {getLogger} from "../../log";

export class UserContentHandler {
    private logger;

    constructor(private contentRepository: ContentRepository,
                private quillRepository: QuillRepository,
                private userRepository: UserRepository) {
        this.logger = getLogger('UserContentHandler', 'info');
    }

    async handleCreateUserContentCommand(createUserContentCommand: CreateUserContentCommand): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            (async () => {
                try {
                    let quillId = await this.quillRepository.getNextId();
                    await this.quillRepository.insertEditorJson(quillId, createUserContentCommand.quillContent);
                    this.logger.info('Inserted quill data with id %s', quillId);

                    let contentId = await this.contentRepository.getNextId();
                    await this.contentRepository.createContent({
                        id: contentId,
                        quillDataId: quillId,
                        title: createUserContentCommand.title,
                    });

                    await this.userRepository.addContentId(createUserContentCommand.userId,
                        contentId);
                    resolve();
                } catch (e) {
                    reject(e);
                }
            })();
        });
    }

    async handleUpdateUserContentCommand(updateUserContentCommand: ContentEntity): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            (async () => {
                try {
                    await this.contentRepository.saveContent(updateUserContentCommand);
                    await this.quillRepository.updateEditorJson(updateUserContentCommand.quillDataId,
                        updateUserContentCommand.quillData);
                    resolve();
                } catch (e) {
                    reject(e);
                }
            })();
        });
        //update quill data in quill table
    }
}

