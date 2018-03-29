import Vue from "vue";
import Component from "vue-class-component";
import Vuetable2, {Field} from 'vuetable-2';
import {CourseStructureRouteGuardMixin} from "@course/course_route_guards";

const fields: Field[] = [
    {
        name: 'username'
    }, {
        name: 'completed'
    }, {
        name: 'lastViewed'
    }, {
        name: 'enrolled'
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
        vuetable: Vuetable2
    }
})
export class CourseEnrolledTableComponent extends Vue {

    async httpFetch (): Promise<{ data: any[] }> {
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