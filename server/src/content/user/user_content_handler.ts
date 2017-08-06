import {CreateUserContentCommand} from "content";
import {UpdateUserContentCommand} from './user_content_routes_controller';
import {quillRepository} from "../../quill/quill_repository";
import {contentRepository} from "../content_repository";
import {userRepository} from "../../user/users_repository";

export class UserContentHandler {
    constructor (private quillRepository) {
    }

    async handleCreateUserContentCommand (createUserContentCommand: CreateUserContentCommand): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            (async () => {
                try {
                    let quillId = await this.quillRepository.getNextId();
                    await quillRepository.insertEditorJson(quillId, createUserContentCommand.quillContent);

                    let contentId = await contentRepository.getNextId();
                    await contentRepository.createContent({
                        id: contentId,
                        quillDataId: quillId,
                        title: createUserContentCommand.title,
                    });

                    await userRepository.addContentId(createUserContentCommand.userId,
                        contentId);
                    resolve();
                } catch (e) {
                    reject(e);
                }
            })();
        });
    }

    handleUpdateUserContentCommand (updateUserContentCommand: UpdateUserContentCommand) {
        //update quill data in quill table
    }


}

export const userContentHandler = new UserContentHandler(quillRepository);