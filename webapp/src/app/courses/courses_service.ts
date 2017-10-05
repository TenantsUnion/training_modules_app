import {CreateModuleData, ViewModuleQuillData} from "modules";
import {ViewCourseQuillData, SaveCourseData, ViewCourseTransferData} from 'courses';
import {appRouter} from "../router";
import {coursesRoutesService} from './courses_routes';
import {CreateSectionData, ViewSectionQuillData, ViewSectionTransferData} from 'sections';
import {quillService} from '../quill/quill_service';
import axios from "axios";
import VueRouter from "vue-router";
import * as _ from "underscore";
import * as moment from 'moment';
import {QuillEditorData} from '../../../../shared/quill';
import {tranformTransferViewService} from '../quill/transform_transfer_view_service';

type ObserveCourse = (courseData: ViewCourseQuillData) => any;
type ObserveModule = (moduleData: ViewModuleQuillData) => any;
type ObserverSection = (sectionData: ViewSectionQuillData) => any;


export class CoursesService {
    courseObservers: ObserveCourse[] = [];
    moduleObservers: ObserveModule[] = [];
    sectionObservers: ObserverSection[] = [];
    currentCourseTitle: string;
    currentCourse: Promise<ViewCourseQuillData>;
    currentModule: Promise<ViewModuleQuillData>;
    currentSection: Promise<ViewSectionQuillData>;
    router: VueRouter;

    constructor(router: VueRouter) {
        this.router = router;
    }

    loadAdminCourse(username: string, courseTitle: string): Promise<ViewCourseQuillData> {
        return axios.get(`user/${username}/courses/admin/${courseTitle}`)
            .then((response) => {
                this.notifyCourseUpdate(response.data);
                return <ViewCourseQuillData> response.data;
            }).catch((error) => {
                throw error;
            });
    }

    loadEnrolledCourse(username: string, courseTitle: string): Promise<ViewCourseQuillData> {
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
        this.getCurrentModule().then((course) => {
            moduleObs(course);
        });
        return () => {
            this.moduleObservers.splice(this.moduleObservers.indexOf(moduleObs), 1);
        };
    }

    public getCurrentCourse(): Promise<ViewCourseQuillData> {
        return (async () => {
            let username = coursesRoutesService.getCurrentUser();
            let routeCourseTitle = coursesRoutesService.getCurrentCourse();
            // use route to check if admin/ load appropriate course
            if (routeCourseTitle === this.currentCourseTitle) {
                return this.currentCourse;
            }

            this.currentCourseTitle = routeCourseTitle;
            if (!this.currentCourseTitle) {
                return Promise.resolve(null);
            }

            this.currentCourse = this.isCourseAdmin() ?
                this.loadAdminCourse(username, routeCourseTitle) :
                this.loadEnrolledCourse(username, routeCourseTitle);

            return this.currentCourse;
        })();
    }


    public async getCurrentModule(): Promise<ViewModuleQuillData> {
        return (async () => {
            let incomingModuleTitle = coursesRoutesService.getCurrentModuleTitle();

            let currentModule = await this.currentModule;
            if (currentModule && currentModule.title === incomingModuleTitle) {
                // stored current module is up to date
                return await currentModule;
            }

            if (!incomingModuleTitle) {
                this.currentModule = Promise.resolve(null);
                return null;
            }

            // recompute current module
            let currentCourse = await this.getCurrentCourse();
            let incomingCurrentModule = _.find(currentCourse.modules, (module) => {
                return module.title === incomingModuleTitle;
            });

            this.currentModule = tranformTransferViewService.transformTransferModuleView(incomingCurrentModule);
            return await this.currentModule;
        })();
    }

    notifyCourseUpdate(course: ViewCourseTransferData | ViewCourseQuillData): Promise<void> {
        return (async () => {
            function isViewCourseTransferData(course: ViewCourseTransferData | ViewCourseQuillData): course is ViewCourseTransferData {
                return !!course['content'];
            }

            this.currentCourse = isViewCourseTransferData(course) ?
                tranformTransferViewService.transformTransferCourseView(course) : Promise.resolve(course);

            let courseView = await this.currentCourse;
            this.courseObservers.forEach((obs: ObserveCourse) => {
                obs(courseView);
            });

            let module = await this.getCurrentModule();
            if (module) {
                this.notifyModuleUpdate(module);
            }

            let section = await this.getCurrentSection();
            if (section) {
                this.notifySectionUpdate(section);
            }
        })();
    }

    private notifyModuleUpdate(module: ViewModuleQuillData) {
        this.currentModule = Promise.resolve(module);
        this.moduleObservers.forEach((obs: ObserveModule) => {
            obs(module);
        });
    }

    private notifySectionUpdate(currentSection: ViewSectionQuillData) {
        this.sectionObservers.forEach((sectionObs) => {
            sectionObs(currentSection);
        });
    }

    isCourseAdmin(): boolean {
        return this.router.currentRoute.matched.some((matchedRoute) => {
            return matchedRoute.name === 'adminCourse';
        });
    }

    createModule(createModuleData: CreateModuleData): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            axios.post(`course/${createModuleData.courseId}/module/create`, createModuleData)
                .then((course) => {
                    this.notifyCourseUpdate(course.data);
                    resolve(course.data);
                })
                .catch((e) => {
                    throw e;
                });
        });
    }

    createSection(createSectionData: CreateSectionData): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            axios.post(`course/${createSectionData.courseId}/module/${createSectionData.moduleId}/section/create`,
                createSectionData)
                .then((response) => {
                    this.notifyCourseUpdate(response.data);
                    resolve(response.data);
                })
                .catch((e) => {
                    throw e;
                });
        });
    }

    public async getCurrentSection(): Promise<ViewSectionQuillData> {
        return (async () => {
            let incomingSectionTitle = coursesRoutesService.getCurrentSectionTitle();
            let incomingModuleTitle = coursesRoutesService.getCurrentModuleTitle();

            let currentSection = await this.currentSection;
            let currentModule = await this.currentModule;

            if (currentModule && currentModule.title === incomingModuleTitle &&
                currentSection && currentSection.title === incomingSectionTitle) {
                // stored current section is up to date
                return currentSection;
            }

            if (!incomingSectionTitle) {
                // current route state does not have a current section
                this.currentSection = Promise.resolve(null);
                return this.currentSection;
            }

            // current section has changed, recompute section view
            let incomingModule: ViewModuleQuillData = await this.getCurrentModule();

            let incomingCurrentSection: ViewSectionTransferData = _.find(incomingModule.sections, (section) => {
                return section.title === incomingSectionTitle;
            });

            this.currentSection = incomingCurrentSection ?
                tranformTransferViewService.transformTransferSectionView(incomingCurrentSection) : Promise.resolve(null);
            return await this.currentSection;
        })();
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


    saveCourse(course: SaveCourseData): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            axios.post(`course/save/${course.id}`, course)
                .then((response) => {
                    return this.notifyCourseUpdate(response.data);
                })
                .catch((e) => {
                    throw e;
                });
        });
    }

    refresh(): Promise<void> {
        return (async () => {
            let currentCourse = await this.getCurrentCourse();
            return currentCourse && await this.notifyCourseUpdate(currentCourse);
        })();
    }
}


export const coursesService = new CoursesService(appRouter);