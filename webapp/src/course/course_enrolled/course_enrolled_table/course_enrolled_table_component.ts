import Vue from "vue";
import Component from "vue-class-component";
import {Field, HttpOptions, SortOrderField} from 'vuetable-2';
import SearchTableVue from "@components/search_table/search_table_component.vue";
import {mapState} from 'vuex';
import {RootState} from '@store/store_types';
import {searchCourseEnrolled} from '@course/course_enrolled/course_enrolled_table/course_enrolled_requests';
import {CourseEnrolledView, EnrolledUserView} from '@shared/course_progress_summary';
import {FetchTableData, SearchField} from '@components/search_table/search_table_component';
import {SqlOp, ViewSearchResponse} from '@shared/views';
import moment from 'moment';


type CourseEnrolledUser = {
    id: string;
    username: string;
    createdAt: string,
    courseCompleted: string,
    lastViewedAt: string
}

const fields: Field[] = [
    {
        name: 'username',
        sortField: 'username'
    }, {
        name: 'courseCompleted',
        title: 'Completed',
        sortField: 'completed'
    }, {
        name: 'lastViewedAt',
        title: 'Last Viewed',
        sortField: 'lastViewedAt'
    }, {
        name: 'createdAt',
        title: 'Enrolled',
        sortField: 'createdAt',
    }
];

const sortOrder: SortOrderField[] = [
    {
        field: 'createdAt',
        sortField: 'createdAt',
        direction: 'desc'
    }
];

const searchFields: SearchField[] = [{
    columnNames: ['username'],
    op: SqlOp.LIKE,
    placeholderText: 'Filter based on username',
    type: 'text',
    name: 'Username: '
}];



@Component({
    data: () => {
        return {
            fields, searchFields, sortOrder
        };
    },
    computed: mapState({
        courseId: ({course: {currentCourseId}}: RootState) => currentCourseId
    }),
    components: {
        'search-table': SearchTableVue
    }
})
export class CourseEnrolledTableComponent extends Vue implements FetchTableData {
    courseId!: string;


    async fetchTableData(predicates, orderBy, pagination, httpOptions): Promise<{ data: ViewSearchResponse<CourseEnrolledView> }> {

        return {
            data: await searchCourseEnrolled({
                predicates, orderBy, id: this.courseId
            })
        };
    }

    transform(data: ViewSearchResponse<EnrolledUserView[]>): ViewSearchResponse<CourseEnrolledUser[]> {
        return {
            data: data.data.map((user) => {
                return {
                    id: user.id,
                    username: user.username,
                    createdAt: moment(user.createdAt).format('llll'),
                    courseCompleted: user.courseCompleted ? moment(user.courseCompleted).format('llll') : null,
                    lastViewedAt: user.lastViewedAt ? moment(user.lastViewedAt).format('llll') : null
                }
            }),
            links: data.links
        };
    }

}

export default CourseEnrolledTableComponent;