import {expect} from "chai";
import {courseSlug} from '../../../../../server/src/courses/courses_query_service';

describe('Course Slug', function () {
    let courseTitle = 'A Course Title';
    let courseId = '2';

    it('should return a slug from a unique course title with hyphens instead of spaces and lower case letters', function () {
        let expectedSlug = 'a-course-title';
        expect(courseSlug(courseTitle, true, courseId)).to.equal(expectedSlug);
    });

    it('should return a slug from a non unique course title that has the course id in it', function() {
       let expectedSlug = 'a-course-title__2';
        expect(courseSlug(courseTitle, false, courseId)).to.equal(expectedSlug);
    });
});

