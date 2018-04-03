import {traverseActionOnProperties} from './property_traversal_util';

export const camelToSnakeCase = (item) => {
    return typeof item === 'string' ? item.replace(/([A-Z])/g, (match, capture) => {
        return '_' + capture.toLowerCase();
    }) : item;
};

export const traverseCamelToSnakeCase  = traverseActionOnProperties(camelToSnakeCase);
