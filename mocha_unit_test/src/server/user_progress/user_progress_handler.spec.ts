import {clearData} from "../../test_db_util";
import {addModule, addSection, createCourse, createUser, sectionEntity} from "../util/test_course_util";

describe('User progress handler', function () {
    before(async function(){
        await clearData();
        await createUser();
        await createCourse();
        let moduleId1 = await addModule();
        let sectionId = await addSection(sectionEntity({moduleId: moduleId1}));
        let moduleId2 = await addModule();
    });
    it('should create course, module, section progress entries for enrolling in course', function () {
        //create user

        // create course
        // add 2 modules to course
        // add 1 section to second module
    });
});