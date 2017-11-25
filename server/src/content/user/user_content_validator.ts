import {CreateUserContentCommand} from "content.ts";

export class UserContentValidator {
    async create (createUserContentCommand: CreateUserContentCommand): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (!createUserContentCommand.title) {
                return resolve(`Cannot create content without a title`);
            }

            if (!createUserContentCommand.quillContent) {
                return resolve(`Content cannot be empty`);
            }

            if (!createUserContentCommand.userId) {
                return resolve(`Cannot create user content without a user id`);
            }

            (async () => {
                // let user:IUserInfo = await userRepository.loadUser(createUserContentCommand.userId);
                // todo check that user doesn't have piece of content already called that
                resolve(null);
            })();
        });
    }
}

export const userContentValidator = new UserContentValidator();