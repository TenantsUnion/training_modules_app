import {traverseActionOnProperties} from './property_traversal_util';

export const snakeToCamelCase = (item) => {
    return typeof item === 'string' ? item.replace(/_(\w)/g, (match, capture) => {
        return capture.toUpperCase();
    }) : item;
};

export const traverseSnakeToCamelCase  = traverseActionOnProperties(snakeToCamelCase);