import {expect} from 'chai';
import {updateArrPlaceholderIds, updateObjPlaceholderIds} from '../../../../shared/delta/update_placeholder_ids';

describe('Update placeholder ids', function () {
    let placeholder1 = 'replace1';
    let placeholder2 = 'replace2';
    let placeholder3 = 'replace3';
    let placeholder4 = 'replace4';

    const actual1 = "actual1";
    const actual2 = "actual2";
    const actual3 = "actual3";
    const actual4 = "actual4";

    const PLACEHOLDER_ID_MAP = {
        [placeholder1]: actual1,
        [placeholder2]: actual2,
        [placeholder3]: actual3,
        [placeholder4]: actual4
    };

    it('should replace the values at nested levels that have a match in the placeholder id map', function () {
        const placeholder = {
            nested: {
                ph1: placeholder1,
                noReplace: 'don\'t change me',
                anotherObj: {
                    ph2: placeholder2,
                    ph3: placeholder3
                }
            },
            ph4: placeholder4
        };

        const expected = {
            nested: {
                ph1: actual1,
                noReplace: 'don\'t change me',
                anotherObj: {
                    ph2: actual2,
                    ph3: actual3
                }
            },
            ph4: actual4
        };

        expect(updateObjPlaceholderIds(placeholder, PLACEHOLDER_ID_MAP)).to.deep.eq(expected);
    });

    it('should replace the object keys at nested levels that have a match in the placeholder id map', function () {
        const placeholder = {
            nested: {
                [placeholder1]: 'something',
                noReplace: 'don\'t change me',
                anotherObj: {
                    [placeholder2]: 1111,
                    [placeholder3]: [1, 2, 3, 4]
                }
            },
            [placeholder4]: false
        };

        const expected = {
            nested: {
                [actual1]: 'something',
                noReplace: 'don\'t change me',
                anotherObj: {
                    [actual2]: 1111,
                    [actual3]: [1, 2, 3, 4]
                }
            },
            [actual4]: false
        };

        expect(updateObjPlaceholderIds(placeholder, PLACEHOLDER_ID_MAP)).to.deep.eq(expected);

    });

    it('should replace the properties and values at nested levels that have a match in the placeholder id map', function () {
        const placeholder = {
            nested: {
                [placeholder1]: 'something',
                noReplace: placeholder1,
                anotherObj: {
                    [placeholder2]: 1111,
                    [placeholder3]: [1, 2, 3, 4]
                }
            },
            [placeholder4]: placeholder4,
        };

        const expected = {
            nested: {
                [actual1]: 'something',
                noReplace: actual1,
                anotherObj: {
                    [actual2]: 1111,
                    [actual3]: [1, 2, 3, 4]
                }
            },
            [actual4]: actual4,
        };

        expect(updateObjPlaceholderIds(placeholder, PLACEHOLDER_ID_MAP)).to.deep.eq(expected);
    });

    it('should replace the values in arrays according to the placeholder id map', function () {
        const placeholder = [1, placeholder1, false];
        const expected = [1, actual1, false];

        expect(updateArrPlaceholderIds(placeholder, PLACEHOLDER_ID_MAP)).to.deep.eq(expected);
    });

    it('should replace values in nested arrays', function () {
        const placeholder = {
            nested: {
                [placeholder1]: 'something',
                noReplace: placeholder1,
                anotherObj: {
                    [placeholder2]: 1111,
                    [placeholder3]: [1, placeholder3, 3, 4,
                        {
                            nested: {
                                [placeholder1]: 'something',
                                noReplace: placeholder1,
                                anotherObj: {
                                    [placeholder2]: 1111,
                                    [placeholder3]: [1, 2, 3, 4]
                                }
                            },
                            [placeholder4]: placeholder4,
                        }
                    ]
                }
            },
            [placeholder4]: [placeholder4],
        };

        const expected = {
            nested: {
                [actual1]: 'something',
                noReplace: actual1,
                anotherObj: {
                    [actual2]: 1111,
                    [actual3]: [1, actual3, 3, 4,
                        {
                            nested: {
                                [actual1]: 'something',
                                noReplace: actual1,
                                anotherObj: {
                                    [actual2]: 1111,
                                    [actual3]: [1, 2, 3, 4]
                                }
                            },
                            [actual4]: actual4,
                        }
                    ]
                }
            },
            [actual4]: [actual4],
        };

        expect(updateObjPlaceholderIds(placeholder, PLACEHOLDER_ID_MAP)).to.deep.eq(expected);
    });
});