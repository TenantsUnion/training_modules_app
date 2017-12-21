import axios from "axios";
import VueRouter from "vue-router";
import {CreateModuleEntityCommand, CreateModuleEntityPayload, CreateModuleResponse, SaveModuleData} from "modules.ts";
import {
    ViewCourseQuillData, SaveCourseEntityCommand, ViewCourseTransferData, CourseEntity,
    CreateCourseEntityCommand, CreateCourseResponse
} from 'courses';
import {
    ViewSectionQuillData, CreateSectionEntityPayload, CreateSectionResponse,
    SaveSectionEntityPayload, SaveSectionResponse
} from 'sections';
import {appRouter} from "../router";
import {userQueryService} from '../account/user_query_service';
import {transformTransferViewService} from '../global/quill/transform_transfer_view_service';

export class CoursesService {
    currentCourse: Promise<ViewCourseQuillData>;
    currentSection: Promise<ViewSectionQuillData>;
    router: VueRouter;

    constructor(router: VueRouter) {
        this.router = router;
    }

    async loadAdminCourse(courseId: string): Promise<CourseEntity> {
        try {
            let response = await axios.get(`view/course/admin/${courseId}`);
            let course = await transformTransferViewService.populateTrainingEntityQuillData(response.data);
            return <CourseEntity> course;
        } catch (e) {
            console.error(`Error creating course data ${e}`);
            throw e.data;
        }
    }

    loadEnrolledCourse(username: string, courseTitle: string): Promise<ViewCourseTransferData> {
        return null;
    }

    async getAdminCourseFromSlug(slug: string, userId: string): Promise<ViewCourseTransferData> {
        try {
            let response = await axios.get(`user/${userId}/admin/course/${slug}`);
            return response.data;
        } catch (e) {
            console.error(`Error loading course data. userId: ${userId}, slug: ${slug},\nError: ${e}`);
            throw e.data;
        }
    }

    // /**
    //  * The provided callback function is called as an observer of the current course whenever it updates
    //  * via a call to
    //  * @param {(courseData: courses.ViewCourseQuillData) => any} courseObs
    //  * @returns {() => any}
    //  */
    // subscribeCurrentCourse(courseObs: ObserveCourse) {
    //
    //     // don't differentiate between admin and enrolled courses subscribers for now
    //     this.courseObservers.push(courseObs);
    //     this.getCurrentCourse().then((course) => {
    //         courseObs(course);
    //     });
    //     return () => {
    //         let unsubIndex = this.courseObservers.indexOf(courseObs);
    //         if (unsubIndex === -1) {
    //             throw 'Observer not found to unsubscribe';
    //         }
    //         this.courseObservers.splice(unsubIndex, 1);
    //     };
    // }

    // subscribeCurrentModule(moduleObs: ObserveModule) {
    //     this.moduleObservers.push(moduleObs);
    //     // this.getCurrentModule().then((module) => {
    //     //     moduleObs(module);
    //     // });
    //     return () => {
    //         this.moduleObservers.splice(this.moduleObservers.indexOf(moduleObs), 1);
    //     };
    // }

    // async getCurrentCourse(): Promise<ViewCourseQuillData> {
    //     let username = coursesRoutesService.getCurrentUser();
    //     let routeCourseTitle = coursesRoutesService.getCurrentCourse();
    //
    //     if (!routeCourseTitle) {
    //         this.currentCourseTransfer = Promise.resolve(null);
    //         this.currentCourse = Promise.resolve(null);
    //     } else if (routeCourseTitle !== this.currentCourseTitle) {
    //         // use route to check if admin/ load appropriate course
    //         this.currentCourseTransfer = coursesRoutesService.isCourseAdmin() ?
    //             this.loadAdminCourse(username, routeCourseTitle) :
    //             this.loadEnrolledCourse(username, routeCourseTitle);
    //         this.currentCourse = transformTransferViewService.transformTransferCourseView(await this.currentCourseTransfer);
    //         setCourseSubscription((await this.currentCourseTransfer).id);
    //     } else {
    //         this.currentCourse = transformTransferViewService.transformTransferCourseView(await this.currentCourseTransfer);
    //     }
    //
    //     this.currentCourseTitle = routeCourseTitle;
    //     return this.currentCourse;
    // }


    // async getCurrentModule(): Promise<ViewModuleQuillData> {
    //     let incomingModuleTitle = coursesRoutesService.getCurrentModuleTitle();
    //
    //     if (!incomingModuleTitle) {
    //         this.currentModule = Promise.resolve(null);
    //         this.currentModuleTransfer = Promise.resolve(null);
    //     } else {
    //         // recompute current module
    //         this.currentModuleTransfer = this.getCurrentCourse().then((currentCourse) => {
    //             return _.find(currentCourse.modules, (module) => module.title === incomingModuleTitle);
    //         });
    //         this.currentModule =
    //             transformTransferViewService.transformTransferModuleView(await this.currentModuleTransfer);
    //     }
    //     return this.currentModule;
    // }

    // async notifyCourseUpdate(course: ViewCourseTransferData): Promise<void> {
    //     this.currentCourseTransfer = Promise.resolve(course);
    //     this.currentCourse = transformTransferViewService.transformTransferCourseView(course);
    //
    //     // notifies subscribers even if null
    //     let courseView = await this.currentCourse;
    //     this.courseObservers.forEach((obs: ObserveCourse) => {
    //         obs(courseView);
    //     });
    //
    //     let module = await this.getCurrentModule();
    //     if (module) {
    //         this.currentModule = Promise.resolve(module);
    //         this.moduleObservers.forEach((obs: ObserveModule) => {
    //             obs(module);
    //         });
    //     }
    //
    //     let section = await this.getCurrentSection();
    //     if (section) {
    //         this.sectionObservers.forEach((sectionObs) => {
    //             sectionObs(section);
    //         });
    //     }
    // }
    async createModule(createModule: CreateModuleEntityPayload): Promise<CreateModuleResponse> {
        let response = await axios.post(`course/${createModule.courseId}/module/create`, {
            payload: createModule
        });

        return response.data;
    }

    /**
     * Returns promise that resolves to the just created section id
     * @param {CreateSectionEntityPayload} createSectionData
     * @returns {Promise<string>}
     */
    async createSection(createSectionData: CreateSectionEntityPayload): Promise<CreateSectionResponse> {
        let {courseId, moduleId} = createSectionData;
        try {
            let response = await axios.post(`course/${courseId}/module/${moduleId}/section/create`,
                createSectionData);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    // async getCurrentSection(): Promise<ViewSectionQuillData> {
    //     let incomingSectionTitle = coursesRoutesService.getCurrentSectionTitle();
    //
    //     if (!incomingSectionTitle) {
    //         // current route state does not have a current section
    //         this.currentSection = Promise.resolve(null);
    //         this.currentSectionTransfer = Promise.resolve(null);
    //     } else {
    //         this.currentSectionTransfer = this.getCurrentModule().then((module) => {
    //             return _.find(module.sections, (section) => section.title === incomingSectionTitle);
    //         });
    //         this.currentSection = transformTransferViewService.transformTransferSectionView(await this.currentSectionTransfer);
    //     }
    //     return this.currentSection;
    // }

    // subscribeCurrentSection(obsSection: (section) => any) {
    //     this.sectionObservers.push(obsSection);
    //     this.getCurrentSection().then((section) => {
    //         obsSection(section);
    //     });
    //
    //     return () => {
    //         this.sectionObservers.splice(this.sectionObservers.indexOf(obsSection), 1);
    //     };
    // }


    async saveCourse(course: SaveCourseEntityCommand): Promise<void> {
        await axios.post(`command/course/save/${course.metadata.id}`, course);
    }

    async saveModule(module: SaveModuleData): Promise<void> {
        await axios.post(`course/${module.courseId}/module/${module.id}/save`, module);
        // todo move to state action
        // todo slug handling
        // this.router.push({params: {moduleTitle: module.title}});
    }

    async saveSection(section: SaveSectionEntityPayload): Promise<SaveSectionResponse> {
        let response = await axios.post(`course/${section.courseId}/module/${section.moduleId}/section/${section.id}/save`, {
            payload: section
        });
        return response.data;
    }

    // async refresh(): Promise<void> {
    //     await this.getCurrentCourse();
    //     await this.notifyCourseUpdate(await this.currentCourseTransfer);
    // }

    /**
     *
     * @param {CreateCourseEntityCommand} createCourseCommand
     * @returns {Promise<string>}
     */
    async createCourse(createCourseCommand: CreateCourseEntityCommand): Promise<CourseEntity> {
        let request = await axios.post('courses/create', createCourseCommand);
        let viewCourseQuillData = await transformTransferViewService.populateTrainingEntityQuillData(request.data);
        return <CourseEntity> viewCourseQuillData;
    }
}


export const coursesService = new CoursesService(appRouter);