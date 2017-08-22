import {RouteConfig} from "vue-router";
import {ModuleSkeleton} from "./modules/module_skeleton_component/module_skeleton_component";

export const coursesRoutes: RouteConfig[] = [
    {
        path: '/course/:title',
        name: 'course',
        props: true,
        children: [{
            path: 'module/:title',
            name: 'courses',
            props: true,
            component: ModuleSkeleton,
        }]
    }
];
