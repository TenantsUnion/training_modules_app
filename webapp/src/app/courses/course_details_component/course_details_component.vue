<template>
    <div class="main">
        <div v-if="currentCourseLoading" class="row">
            <loading></loading>
        </div>
        <div v-if="currentCourse" class="row">
            <div class="small-12 large-10 columns">
                <div>
                    <h2>{{currentCourse.title}}</h2>
                    <p>{{currentCourse.description}}</p>
                    <time-estimate :time-estimate="currentCourse.timeEstimate"/>
                </div>
                <div class="row">
                    <div class="columns small-12 large-10">
                        <training-segments :stored-segments="currentCourse.contentQuestions" ref="trainingSegment"/>
                    </div>
                </div>
                <div v-for="module in currentCourse.modules">
                    <h3>{{module.title}}</h3>
                    <p>{{module.description}}</p>
                    <ul class="content-list">
                        <li v-for="section in module.sections" class="content-item">
                            <h5>{{section.title}}</h5>
                            <p>{{section.description}}</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";
    import {mapGetters} from 'vuex';

    @Component({
        computed: {
            ...mapGetters(['currentCourse', 'currentCourseLoading'])
        }
    })
    export default class CourseDetailsComponent extends Vue {
    }
</script>
