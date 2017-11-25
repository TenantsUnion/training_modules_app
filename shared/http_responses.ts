import * as _ from "underscore";

export interface HttpResponse {
    status: number,
    message: string,
    data: {}
}

export interface ValidationErrorResponse extends HttpResponse {
    data: { errorMessages: { [index: string]: string } }
}

export const isValidationErrorResponse = (obj: any): obj is ValidationErrorResponse => {
    return obj && _.isObject(obj) && (obj.status + '' === '422') && _.isObject(obj.data) && _.isObject(obj.data.errorMessages);
};



