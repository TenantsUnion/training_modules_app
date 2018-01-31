<template>
    <div id="wrapper" class="wrapper">
        <div id="sidebar-wrapper" class="sidebar-wrapper">
            <div class="menu-icon-container row align-right">
                <a class="menu-icon" id="menu-toggle"></a>
            </div>
            <loading v-if="currentCourseLoading"></loading>
            <course-navigation v-if="currentCourse"
                               :is-course-admin="isCourseAdmin"
                               :course="currentCourse">
            </course-navigation>
        </div>
        <div id="page-content-wrapper" class="page-content-wrapper">
            <router-view></router-view>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from "vue";
    import Component from "vue-class-component";
    import CourseNavigationComponent from '../course_navigation_component/course_navigation_component.vue';
    import {$} from '../../globals';
    import CourseDetailsComponent from "../course_details_component/course_details_component.vue";
    import {mapGetters, mapState} from 'vuex';
    import {COURSE_ACTIONS} from '../store/course/course_actions';
    import {NavigationGuard} from 'vue-router';
    import {store} from '../../state_store';

    const currentCourseRouteGuard: NavigationGuard = async (to: any, from: any, next) => {
        let slug = to.params.courseSlug;
        if (!slug || slug === 'undefined') {
            throw new Error('Invalid route. :courseSlug must be defined');
        }
        try {
            await store.dispatch(COURSE_ACTIONS.SET_CURRENT_COURSE_FROM_SLUG, {slug, isAdmin: true});
        } catch (e) {
            console.error(`Error setting current course. ${e}`);
        } finally {
            next();
        }

    };

    @Component({
        computed: {
            ...mapState({
                isCourseAdmin: ({course}) => course.isAdmin
            }),
            ...mapGetters(['currentCourse', 'currentCourseLoading'])
        },
        beforeRouteEnter: currentCourseRouteGuard,
        beforeRouteUpdate: currentCourseRouteGuard,
        components: {
            'course-navigation': CourseNavigationComponent,
            'course-details': CourseDetailsComponent
        }
    })
    export default class CourseComponent extends Vue {
        created () {
            $(this.$el).find('#menu-toggle').click(function (e) {
                e.preventDefault();
                $('#page-content-wrapper').toggleClass('toggled');
                $('#sidebar-wrapper').toggleClass('toggled');
                $('.sidebar-nav').toggleClass('toggled');
                $('#wrapper').toggleClass('toggled');
            });
        }
    }
</script>
