import {CreateUserContentCommand} from "content";
import {UpdateUserContentCommand} from './user_content_routes_controller';
import {quillRepository} from "../../quill/quill_repository";

export class UserContentHandler {
    constructor() {
    }

    handleCreateUserContentCommand(createUserContentCommand: CreateUserContentCommand) {

        quillRepository.insertEditorJson(createUserContentCommand.quillContent);
        //add quill data to quill table
        //add content data with quill id to content table
        //add content id to user table
    }

    handleUpdateUserContentCommand(updateUserContentCommand: UpdateUserContentCommand) {
        //update quill data in quill table
    }


}

export const userContentHandler = new UserContentHandler();