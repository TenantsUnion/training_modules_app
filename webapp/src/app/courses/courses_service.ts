import {CreateModuleData, ModuleData, ModuleDetails} from "modules";
import axios from "axios";
import {CourseData} from 'courses';
import VueRouter from "vue-router";
import {appRouter} from "../router";
import {coursesRoutesService} from './courses_routes';
import {CreateSectionData} from '../../../../shared/sections';

type ObserveCourse = (courseData: CourseData) => any;
type ObserveModule = (moduleData: ModuleData) => any;

let findModuleFromCourse = (course:CourseData, moduleTitle:string) => {
    return course.modules.reduce((acc, module) => {
        acc[module.title] = module;
        return acc;
    }, {})[moduleTitle];
};

export class CoursesService {
    courseObservers: ObserveCourse[] = [];
    moduleObservers: ObserveModule[] = [];
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
            }).catch((response) => {
                throw response.data.data;
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
        let unsubcribeIndex = this.moduleObservers.length;
        this.moduleObservers.push(moduleObs);
        this.getCurrentModule().then((course) => {
            moduleObs(course);
        });
        return () => {
            this.moduleObservers = this.moduleObservers.splice(unsubcribeIndex, 1);
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
            if(!this.currentCourseTitle) {
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

        let module = this.getCurrentCourse()
            .then((course) => {
                let currentModule = findModuleFromCourse(course, moduleTitle);
                this.notifyModuleUpdate(currentModule);
                return currentModule;
            });

        return module;
    }

    notifyCourseUpdate(course: CourseData) {
        this.currentCourse = Promise.resolve(course);
        this.courseObservers.forEach((obs: ObserveCourse) => {
            obs(course);
        });
        this.notifyModuleUpdate(findModuleFromCourse(course, coursesRoutesService.getCurrentModule()));
    }

    private notifyModuleUpdate(module: ModuleData) {
        this.currentModule = Promise.resolve(module);
        this.moduleObservers.forEach((obs: ObserveModule) => {
            obs(module);
        });
    }

    isCourseAdmin(): boolean {
        return this.router.currentRoute.matched.some((matchedRoute) => {
            return matchedRoute.name === 'adminCourse';
        });
    }

    createModule(createModuleData: CreateModuleData): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            axios.post(`courses/${createModuleData.courseId}/module/create`, createModuleData)
                .then((course) => {
                    this.notifyCourseUpdate(course.data);
                    resolve(course.data);
                })
                .catch((e) => {
                    throw e.data.data;
                });
        });
    }

    createSection(createSectionData: CreateSectionData): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            axios.post(`courses/${createSectionData.courseId}/module/${createSectionData.moduleId}/section/create}`,
                createSectionData)
                .then((response) => {
                    this.notifyCourseUpdate(response.data);
                    resolve(response.data);
                })
                .catch((e) => {
                    throw e.data.data;
                });
        });
    }

    refresh(): Promise<any> {
        return Promise.all([this.getCurrentCourse(), this.getCurrentModule()]);
    }
}

export const coursesService = new CoursesService(appRouter);