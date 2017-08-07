import {CreateUserContentCommand} from "content";
import {UpdateUserContentCommand} from './user_content_routes_controller';
import {quillRepository, QuillRepository} from "../../quill/quill_repository";
import {
    ContentEntity, contentRepository,
    ContentRepository
} from "../content_repository";
import {
    IUserRepository, userRepository,
    UserRepository
} from "../../user/users_repository";

export class UserContentHandler {
    constructor (private contentRepository: ContentRepository,
                 private quillRepository: QuillRepository,
                 private userRepository: UserRepository) {
    }

    async handleCreateUserContentCommand (createUserContentCommand: CreateUserContentCommand): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            (async () => {
                try {
                    let quillId = await this.quillRepository.getNextId();
                    await this.quillRepository.insertEditorJson(quillId, createUserContentCommand.quillContent);

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

    async handleUpdateUserContentCommand (updateUserContentCommand: ContentEntity): Promise<void> {
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

export const userContentHandler = new UserContentHandler(contentRepository, quillRepository, userRepository);