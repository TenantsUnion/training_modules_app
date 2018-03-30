import Vue from "vue";
import Component from "vue-class-component";
import {Field, HttpOptions, VuetableConfig} from 'vuetable-2';
import {CourseStructureRouteGuardMixin} from "@course/course_route_guards";
import TableConfig from "@components/search_table/search_table_component.vue";

const fields: Field[] = [
    {
        name: 'username',
        sortField: 'username'
    }, {
        name: 'completed',
        sortField: 'completed'
    }, {
        name: 'lastViewed',
        sortField: 'lastViewed'
    }, {
        name: 'enrolled',
        sortField: 'enrolled',
        direction: 'desc'
    }
];

@Component({
    mixins: [CourseStructureRouteGuardMixin],
    data: () => {
        return {
            fields
        };
    },
    components: {
        'table-config': TableConfig
    }
})
export class CourseEnrolledTableComponent extends Vue {

    async fetch (apiUrl: string, httpOptions: HttpOptions): Promise<{ data: any[] }> {
        // set route parameters

        console.log(httpOptions);
        console.log('I\'m going to fetch data!');
        return {
            data: []
        };
    }

    transform (data: any[]): { data: any[] } {
        console.log('Transfoorrrrming');
        return {data: data};
    }

}

export default CourseEnrolledTableComponent;