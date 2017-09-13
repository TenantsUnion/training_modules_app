import {accountRepository} from "./repository.config";
import {AccountRequestValidator} from "../account/account_request_validation_service";

export const accountRequestValidator = new AccountRequestValidator(accountRepository);
