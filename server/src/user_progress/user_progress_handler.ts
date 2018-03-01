import {CourseProgressId, TrainingProgressUpdate, TrainingProgressUpdateType} from "@shared/user_progress";
import {UserRepository} from "../user/users_repository";
import {CourseProgressRepository} from "./course_progress_repository";
import {ModuleProgressRepository} from "./module_progress_repository";
import {SectionProgressRepository} from "./section_progress_repository";
import {TrainingProgressRepository, TrainingProgressRowUpdate} from "./training_progress_repository";

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
            this.courseProgressRepository.createTrainingProgress({userId, id: courseId}),
            moduleIds.length ?
                this.moduleProgressRepository.bulkCreateTrainingProgress({userId, ids: moduleIds})
                : Promise.resolve(),
            sectionIds.length ?
                this.sectionProgressRepository.bulkCreateTrainingProgress({userId, ids: sectionIds})
                : Promise.resolve(),
            this.userRepository.addEnrolledCoursesId({userId, courseId})
        ]);
    }

    async recordTrainingProgress (trainingProgressUpdate: TrainingProgressUpdate) {
        let trainingRepo = this.trainingProgressRepo(trainingProgressUpdate.type);
        let rowUpdate: TrainingProgressRowUpdate = {
            id: trainingProgressUpdate.id,
            userId: trainingProgressUpdate.userId,
            viewedContentIds: trainingProgressUpdate.viewedContentIds,
            correctQuestionIds: trainingProgressUpdate.questionSubmissions
                .filter(({correct}) => correct).map(({questionId}) => questionId),
            submittedQuestionIds: trainingProgressUpdate.questionSubmissions.map(({questionId}) => questionId)
        };
        await trainingRepo.saveTrainingProgress(rowUpdate);
        await trainingRepo.markCompleted(rowUpdate);
    }

    private trainingProgressRepo (type: TrainingProgressUpdateType): TrainingProgressRepository {
        switch (type) {
            case TrainingProgressUpdateType.COURSE:
                return this.courseProgressRepository;
            case TrainingProgressUpdateType.MODULE:
                return this.moduleProgressRepository;
            case TrainingProgressUpdateType.SECTION:
                return this.sectionProgressRepository;
            default:
                throw new Error(`No repository to match TrainingProgressUpdateType: ${type}`);
        }

    }
}