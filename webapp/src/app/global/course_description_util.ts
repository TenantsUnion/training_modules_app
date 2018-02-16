import * as _ from "underscore";
import {CourseDescription} from "@shared/courses";
import {titleToSlug} from "@shared/slug/title_slug_transformations";

export const courseSlugToIdMap = (courseDescriptions: CourseDescription[]) => {
    let uniqueTitle = courseDescriptions.reduce((acc, {title}: CourseDescription) => {
        acc[title] = _.isUndefined(acc[title]);
        return acc;
    }, {});
    let courseSlugToMap = courseDescriptions.reduce((acc, {id, title}) => {
        acc[titleToSlug(title, !uniqueTitle[title], id)] = id;
        return acc;
    }, {});
    return courseSlugToMap;
};

export const determineSlugs = (courseDescriptions: CourseDescription[]): CourseDescription[] => {
    let uniqueTitle = courseDescriptions.reduce((acc, {title}: CourseDescription) => {
        acc[title] = _.isUndefined(acc[title]);
        return acc;
    }, {});
    return courseDescriptions.map(c => {
        return {...c, slug: titleToSlug(c.title, !uniqueTitle[c.title], c.id)};
    });
};
