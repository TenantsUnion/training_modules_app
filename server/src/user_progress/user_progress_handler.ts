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
        let {modules, orderedModuleIds: moduleIds} = await this.courseProgressRepository.courseStructure(courseId);
        let sectionIds = modules ? modules.filter(module => module).reduce((acc, module) => {
            return acc.concat(module.orderedSectionIds ? module.orderedSectionIds : []);
        }, []) : [];
        await Promise.all([
            this.courseProgressRepository.createCourseProgress({userId, courseId}),
            moduleIds.length ? this.moduleProgressRepository.createModuleProgress({
                userId,
                moduleIds
            }) : Promise.resolve(),
            sectionIds.length ? this.sectionProgressRepository.createSectionProgress({
                userId,
                sectionIds
            }) : Promise.resolve(),
            this.userRepository.addEnrolledCoursesId({userId, courseId})
        ]);
    }

    async recordCourseTrainingProgress ({userId, courseId}: CourseProgressId) {

    }
}