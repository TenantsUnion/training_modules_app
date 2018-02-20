import {CourseProgressRepository} from "@course/enrolled/course_progress_repository";
import {ModuleProgressRepository} from "@module/enrolled/module_progress_repository";
import {SectionProgressRepository} from "@section/enrolled/section_progress_repository";
import {CourseProgressId} from "@shared/user_progress";
import {UserRepository} from "../user/users_repository";

export class UserProgressHandler {
    constructor (private userRepository: UserRepository,
                 private courseProgressRepository: CourseProgressRepository,
                 private moduleProgressRepository: ModuleProgressRepository,
                 private sectionProgressRepository: SectionProgressRepository) {
    }

    async enrollUserInCourse ({userId, courseId}: CourseProgressId) {
        let courseStructure = await this.courseProgressRepository.courseStructure(courseId);
        let sectionIds = courseStructure.modules ? courseStructure.modules.reduce((acc, module) => {
            return acc.concat(module.orderedSectionIds ? module.orderedSectionIds : []);
        }, []) : [];
        await Promise.all([
            this.courseProgressRepository.createCourseProgress({userId, courseId}),
            this.moduleProgressRepository.createModuleProgress({userId, moduleIds: courseStructure.orderedModuleIds}),
            this.sectionProgressRepository.createSectionProgress({userId, sectionIds}),
            this.userRepository.addEnrolledCoursesId({userId, courseId})
        ]);
    }

}