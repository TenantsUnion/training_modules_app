import {CreateModuleData, SaveModuleData, ViewModuleQuillData, ViewModuleTransferData} from "modules";
import {ViewCourseQuillData, SaveCourseData, ViewCourseTransferData} from 'courses';
import {appRouter} from "../router";
import {coursesRoutesService} from './courses_routes';
import {CreateSectionData, SaveSectionData, ViewSectionQuillData, ViewSectionTransferData} from 'sections';
import axios from "axios";
import VueRouter from "vue-router";
import * as _ from "underscore";
import {transformTransferViewService} from '../quill/transform_transfer_view_service';

type ObserveCourse = (courseData: ViewCourseQuillData) => any;
type ObserveModule = (moduleData: ViewModuleQuillData) => any;
type ObserverSection = (sectionData: ViewSectionQuillData) => any;


export class CoursesService {
    courseObservers: ObserveCourse[] = [];
    currentCourseTitle: string;
    currentCourse: Promise<ViewCourseQuillData>;
    currentCourseTransfer: Promise<ViewCourseTransferData>;

    moduleObservers: ObserveModule[] = [];
    currentModule: Promise<ViewModuleQuillData>;
    currentModuleTransfer: Promise<ViewModuleTransferData>;

    sectionObservers: ObserverSection[] = [];
    currentSection: Promise<ViewSectionQuillData>;
    currentSectionTransfer: Promise<ViewSectionTransferData>;
    router: VueRouter;

    constructor(router: VueRouter) {
        this.router = router;
    }

    loadAdminCourse(username: string, courseTitle: string): Promise<ViewCourseTransferData> {
        return axios.get(`user/${username}/courses/admin/${courseTitle}`)
            .then((response) => {
                return <ViewCourseTransferData> response.data;
            }).catch((error) => {
                throw error;
            });
    }

    loadEnrolledCourse(username: string, courseTitle: string): Promise<ViewCourseTransferData> {
        return null;
    }

    subscribeCurrentCourse(courseObs: ObserveCourse) {
        this.courseObservers.push(courseObs);
        this.getCurrentCourse().then((course) => {
            courseObs(course);
        });
        return () => {
            let unsubIndex = this.courseObservers.indexOf(courseObs);
            if (unsubIndex === -1) {
                throw 'Observer not found to unsubscribe';
            }
            this.courseObservers.splice(unsubIndex, 1);
        };
    }

    subscribeCurrentModule(moduleObs: ObserveModule) {
        this.moduleObservers.push(moduleObs);
        this.getCurrentModule().then((module) => {
            moduleObs(module);
        });
        return () => {
            this.moduleObservers.splice(this.moduleObservers.indexOf(moduleObs), 1);
        };
    }

    async getCurrentCourse(): Promise<ViewCourseQuillData> {
        let username = coursesRoutesService.getCurrentUser();
        let routeCourseTitle = coursesRoutesService.getCurrentCourse();

        if (!routeCourseTitle) {
            this.currentCourseTransfer = Promise.resolve(null);
            this.currentCourse = Promise.resolve(null);
        } else if (routeCourseTitle !== this.currentCourseTitle) {
            // use route to check if admin/ load appropriate course
            this.currentCourseTransfer = coursesRoutesService.isCourseAdmin() ?
                this.loadAdminCourse(username, routeCourseTitle) :
                this.loadEnrolledCourse(username, routeCourseTitle);
            this.currentCourse = transformTransferViewService.transformTransferCourseView(await this.currentCourseTransfer);
        } else {
            this.currentCourse = transformTransferViewService.transformTransferCourseView(await this.currentCourseTransfer);
        }

        this.currentCourseTitle = routeCourseTitle;
        return this.currentCourse;
    }


    async getCurrentModule(): Promise<ViewModuleQuillData> {
        let incomingModuleTitle = coursesRoutesService.getCurrentModuleTitle();

        if (!incomingModuleTitle) {
            this.currentModule = Promise.resolve(null);
            this.currentModuleTransfer = Promise.resolve(null);
        } else {
            // recompute current module
            this.currentModuleTransfer = this.getCurrentCourse().then((currentCourse) => {
                return _.find(currentCourse.modules, (module) => module.title === incomingModuleTitle);
            });
            this.currentModule =
                transformTransferViewService.transformTransferModuleView(await this.currentModuleTransfer);
        }
        return this.currentModule;
    }

    async notifyCourseUpdate(course: ViewCourseTransferData): Promise<void> {
        this.currentCourseTransfer = Promise.resolve(course);
        this.currentCourse = transformTransferViewService.transformTransferCourseView(course);

        // notifies subscribers even if null
        let courseView = await this.currentCourse;
        this.courseObservers.forEach((obs: ObserveCourse) => {
            obs(courseView);
        });

        let module = await this.getCurrentModule();
        if (module) {
            this.currentModule = Promise.resolve(module);
            this.moduleObservers.forEach((obs: ObserveModule) => {
                obs(module);
            });
        }

        let section = await this.getCurrentSection();
        if (section) {
            this.sectionObservers.forEach((sectionObs) => {
                sectionObs(section);
            });
        }
    }
    createModule(createModuleData: CreateModuleData): Promise<void> {
        return axios.post(`course/${createModuleData.courseId}/module/create`, createModuleData)
            .then((course) => {
                return this.notifyCourseUpdate(course.data);
            })
            .catch((e) => {
                throw e;
            });
    }

    createSection(createSectionData: CreateSectionData): Promise<void> {
        return axios.post(`course/${createSectionData.courseId}/module/${createSectionData.moduleId}/section/create`,
            createSectionData)
            .then((response) => {
                return this.notifyCourseUpdate(response.data);
            })
            .catch((e) => {
                throw e;
            });
    }

    public async getCurrentSection(): Promise<ViewSectionQuillData> {
        let incomingSectionTitle = coursesRoutesService.getCurrentSectionTitle();

        if (!incomingSectionTitle) {
            // current route state does not have a current section
            this.currentSection = Promise.resolve(null);
            this.currentSectionTransfer = Promise.resolve(null);
        } else {
            this.currentSectionTransfer = this.getCurrentModule().then((module) => {
                return _.find(module.sections, (section) => section.title === incomingSectionTitle);
            });
            this.currentSection = transformTransferViewService.transformTransferSectionView(await this.currentSectionTransfer);
        }
        return this.currentSection;
    }

    subscribeCurrentSection(obsSection: (section) => any) {
        this.sectionObservers.push(obsSection);
        this.getCurrentSection().then((section) => {
            obsSection(section);
        });

        return () => {
            this.sectionObservers.splice(this.sectionObservers.indexOf(obsSection), 1);
        };
    }


    async saveCourse(course: SaveCourseData): Promise<void> {
        let response = await axios.post(`course/save/${course.id}`, course);
        this.router.push({params: {courseTitle: course.title}});
        await this.notifyCourseUpdate(response.data);
    }

    async saveModule(module: SaveModuleData): Promise<void> {
        let response = await axios.post(`course/${module.courseId}/module/${module.id}/save`, module);
        // set module parameter to title of saved module in case it has changed
        this.router.push({params: {moduleTitle: module.title}});
        await this.notifyCourseUpdate(response.data);
    }

    async saveSection(section: SaveSectionData): Promise<void> {
        let response = await axios.post(`course/${section.courseId}/module/${section.moduleId}/section/${section.id}/save`, section);
        this.router.push({params: {sectionTitle: section.title}});
        await this.notifyCourseUpdate(response.data);
    }

    async refresh(): Promise<void> {
        await this.getCurrentCourse();
        await this.notifyCourseUpdate(await this.currentCourseTransfer);
    }
}


export const coursesService = new CoursesService(appRouter);