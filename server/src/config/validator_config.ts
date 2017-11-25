import {accountRepository} from "./repository_config";
import {AccountRequestValidator} from "../account/account_request_validation_service";

export const accountRequestValidator = new AccountRequestValidator(accountRepository);
