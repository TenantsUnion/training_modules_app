import {ModuleList} from './modules_list_component/module_list_component';
import {RouteConfig} from 'vue-router';
import {ModuleDetails} from './module_details_component/module_details_component';
import {ModuleSkeleton} from './module_skeleton_component/module_skeleton_component';

let routes: RouteConfig[] = [
    {
        path: `/admin/:username`,
        name: 'admin',
        props: true,
        children: [
            {
                path: 'modules',
                name: 'admin.modules',
                component: ModuleSkeleton
            }
        ],
        component: {
            components: {
                'module-list': ModuleList,
                'module-details': ModuleDetails
            },
            //language=HTML
            template: `
                <div>
                    <module-list></module-list>
                    <module-details>
                        <router-view></router-view>
                    </module-details>
                </div>
            `
        }
    }
];


// export const moduleRoutes = routes;
