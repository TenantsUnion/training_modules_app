import {CourseProgressId, TrainingProgressUpdate, TrainingProgressUpdateType} from "@shared/user_progress";
import {UserRepository} from "../user/users_repository";
import {CourseProgressRepository} from "./course_progress_repository";
import {ModuleProgressRepository} from "./module_progress_repository";
import {SectionProgressRepository} from "./section_progress_repository";
import {TrainingProgressRepository, TrainingProgressRowUpdate} from "./training_progress_repository";
import {QuestionSubmissionRepository} from "../training_entity/question/question_submission_repository";
import {questionSubmissionRepository} from "../config/repository_config";

export class UserProgressHandler {
    constructor (private userRepository: UserRepository,
                 private questionSubmissionRepository: QuestionSubmissionRepository,
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

    async saveTrainingProgress (trainingProgressUpdate: TrainingProgressUpdate) {
        let {id, userId, viewedContentIds, questionSubmissions} = trainingProgressUpdate;
        let rowUpdate: TrainingProgressRowUpdate = {
            id, userId, viewedContentIds,
            correctQuestionIds: questionSubmissions
                .filter(({correct}) => correct).map(({questionId}) => questionId),
            submittedQuestionIds: questionSubmissions.map(({questionId}) => questionId)
        };

        let trainingRepo = this.trainingProgressRepo(trainingProgressUpdate.type);

        let insertQuestionAsync = questionSubmissionRepository.insertQuestionSubmissions(userId, questionSubmissions);
        await trainingRepo.saveTrainingProgress(rowUpdate);
        await Promise.all([ // markCompleted has to happen after save training to use update to date progress data
            trainingRepo.markCompleted(rowUpdate),
            insertQuestionAsync
        ]);
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