import {CreateModuleData, ModuleData, ModuleDetails} from "modules";
import axios from "axios";
import {CourseData} from 'courses';
import VueRouter from "vue-router";
import {appRouter} from "../router";
import {coursesRoutesService} from './courses_routes';
import {CreateSectionData, SectionData} from '../../../../shared/sections';
import * as _ from "underscore";
import {userCoursesHttpService} from '../user/courses/course_http_service';

type ObserveCourse = (courseData: CourseData) => any;
type ObserveModule = (moduleData: ModuleData) => any;
type ObserverSection = (sectionData: SectionData) => any;


export class CoursesService {
    courseObservers: ObserveCourse[] = [];
    moduleObservers: ObserveModule[] = [];
    sectionObservers: ObserverSection[] = [];
    currentCourseTitle: string;
    currentCourse: Promise<CourseData>;
    currentModuleTitle: string;
    currentModule: Promise<ModuleData>;
    router: VueRouter;

    constructor(router: VueRouter) {
        this.router = router;
    }

    loadAdminCourse(username: string, courseTitle: string): Promise<CourseData> {
        return axios.get(`user/${username}/courses/admin/${courseTitle}`)
            .then((response) => {
                this.notifyCourseUpdate(response.data);
                return <CourseData> response.data;
            }).catch((error) => {
                throw error;
            });
    }

    loadEnrolledCourse(username: string, courseTitle: string): Promise<CourseData> {
        return null;
    }

    subscribeCurrentCourse(courseObs: ObserveCourse) {
        let unsubcribeIndex = this.courseObservers.length;
        this.courseObservers.push(courseObs);
        this.getCurrentCourse().then((course) => {
            courseObs(course);
        });
        return () => {
            this.courseObservers = this.courseObservers.splice(unsubcribeIndex, 1);
        };
    }

    subscribeCurrentModule(moduleObs: ObserveModule) {
        this.moduleObservers.push(moduleObs);
        this.getCurrentModule().then((course) => {
            moduleObs(course);
        });
        return () => {
            this.moduleObservers = this.moduleObservers.splice(this.moduleObservers.indexOf(moduleObs), 1);
        };
    }

    public getCurrentCourse(): Promise<CourseData> {
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


    public getCurrentModule(): Promise<ModuleData> {
        let moduleTitle = coursesRoutesService.getCurrentModule();

        if (!moduleTitle) {
            return Promise.resolve(null);
        }

        this.currentModule = this.getCurrentCourse()
            .then((course) => {
                return _.find(course && course.modules, (module) => {
                    return module.title === moduleTitle;
                });
            });

        return this.currentModule;
    }

    notifyCourseUpdate(course: CourseData) {
        this.currentCourse = Promise.resolve(course);
        this.courseObservers.forEach((obs: ObserveCourse) => {
            obs(course);
        });
        let currentModuleTitle = coursesRoutesService.getCurrentModule();
        let currentModule = _.find(course && course.modules, (module) => module.title === currentModuleTitle);
        this.notifyModuleUpdate(currentModule);
    }

    private notifyModuleUpdate(module: ModuleData) {
        this.currentModule = Promise.resolve(module);
        this.moduleObservers.forEach((obs: ObserveModule) => {
            obs(module);
        });

        let currentSectionTitle = coursesRoutesService.getCurrentSection();
        let currentSection = _.find(module && module.sections, section => currentSectionTitle === section.title);
        this.notifySectionUpdate(currentSection);
    }

    private notifySectionUpdate(currentSection: SectionData) {
        this.sectionObservers.forEach((sectionObs)=>{
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

    public getCurrentSection(): Promise<SectionData> {
        let sectionTitle = coursesRoutesService.getCurrentSection();

        if (!sectionTitle) {
            return Promise.resolve(null);
        }

        return this.getCurrentModule()
            .then((module) => {
                    return _.find(module && module.sections, (section) => {
                        return  section.title === sectionTitle;
                    });
            });
    }

    refresh(): Promise<any> {
        return (async () => {
            let course = await this.getCurrentCourse();
            this.notifyCourseUpdate(course);
        })();
    }

    subscribeCurrentSection(obsSection: (section) => any) {
        this.sectionObservers.push(obsSection);
        this.getCurrentSection().then((section)=>{
            obsSection(section);
        });

        return () => {
            this.sectionObservers = this.sectionObservers.splice(this.sectionObservers.indexOf(obsSection), 1);
        };
    }


    saveCourse(course: CourseData): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            axios.post(`course/${course.id}`, course)
                .then(() => {
                    this.notifyCourseUpdate(course);
                    resolve();
                })
                .catch((e) => {
                    throw e;
                });
        });
    }
}

export const coursesService = new CoursesService(appRouter);