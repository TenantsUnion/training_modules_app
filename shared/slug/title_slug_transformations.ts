/**
 * Marks the end of the title segment of the slug and the optional additional id segment that may be needed to uniquely
 * identify the corresponding entity that corresponds to the slug and user (duplicate titles for entities)
 */
// todo validate against having __ in title by user
export const COMPOUND_SLUG_MARKER = '__';
/**
 * Character marking the beginning of an escaped sequence of characters
 */
// todo validate against having [ in the title
export const BEGIN_ESCAPED = '(';
/**
 * Character marking the ending of an escaped sequence of characters
 */
// todo validate against having ] in the title
export const END_ESCAPED = ')';

// The characters ";", "/", "?", ":", "@", "=" and "&"
export const charToEscapedMap = {
    ' ': 'sp',
    ';': 'sc',
    '/': 'fs',
    '?': 'qm',
    '@': 'at',
    '&': 'as',
    '#': 'hs'
};

const escapedToCharMap = Object.keys(charToEscapedMap).reduce((map, charKey) => {
    map[charToEscapedMap[charKey]] = charKey; // invert key, val of charToEscapedMap
    return map;
}, {});


export const titleToSlug = (title: string, isDuplicate?: boolean, id?: string): string => {
    let slugTitle = title.split('').reduce((acc, char) => {
        let normalizedChar = char.toLowerCase();
        let sym = charToEscapedMap[char];
        if (sym) {
            acc.buffer.push(sym);
        } else if (acc.buffer.length) {
            // end of sequence that needs to be escaped
            acc.slug.push(BEGIN_ESCAPED, ...acc.buffer, END_ESCAPED, normalizedChar);
            acc.buffer = [];
        } else {
            acc.slug.push(normalizedChar);
        }
        return acc;
    }, {
        buffer: [],
        slug: []
    }).slug.join('');

    return !isDuplicate ? slugTitle : `${slugTitle + COMPOUND_SLUG_MARKER + id}`;
};

/**
 * Converts the slug (string intended for path url) into the course title it was derived from by converting spaces into '-' and stripping away the
 * number course id that is needed to uniquely identify course titles that are the same
 */
export const slugToTitle = (slug: string): string => {
    // if there are duplicate titles the part after the marker is the corresponding id and not part of the title
    let slugTitleSegment = slug.split(COMPOUND_SLUG_MARKER)[0].toLowerCase();
    let lowerCaseTitle = slugTitleSegment.split('').reduce((acc, char) => {
        if (char === BEGIN_ESCAPED) {
            acc.buffer.push(char);
        } else if (char === END_ESCAPED) {
            if(acc.buffer.length > 1) {
                throw new Error(`Invalid slug encoding ${slug}. Escape sequence ended with ${JSON.stringify(acc.buffer)} unmatched`);
            }
            acc.buffer = [];
        } else if (acc.buffer.length) {
            // in the middle of escape sequence
            acc.buffer.push(char);
            let encodedChar = escapedToCharMap[acc.buffer.slice(1).join('')];
            if(encodedChar) {
                acc.title.push(encodedChar);
                // reset buffer, don't need to support nested characters just consecutive
                acc.buffer = [BEGIN_ESCAPED];
            }
        } else {
            // do nothing to char
            acc.title.push(char);
        }
        return acc;
    }, {
        buffer: [],
        title: []
    });

    return lowerCaseTitle.title.join('');
};

/**
 * Returns the embedded id in the provided slug or null if there is no id
 * @param {string} slug
 * @returns {string | null} embedded id or null if not found
 */
export const slugToId = (slug: string): string | null => {
    let slugParts = slug.split(COMPOUND_SLUG_MARKER);
    return slugParts.length == 2 ? slugParts[1] : null;
};
