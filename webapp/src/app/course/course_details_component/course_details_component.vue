<template>
    <div class="main">
        <div v-if="currentCourseLoading" class="grid-x">
            <loading></loading>
        </div>
        <div v-if="currentCourse" class="grid-x">
            <div class="small-12 large-10 cell">
                <div>
                    <h2>{{currentCourse.title}}</h2>
                    <p>{{currentCourse.description}}</p>
                    <time-estimate v-if="currentCourse.timeEstimate !== 0" :time-estimate="currentCourse.timeEstimate"/>
                </div>
                <div class="grid-x">
                    <div class="cell small-12 large-10">
                        <view-training-segments :content-questions="currentCourse.contentQuestions"
                                                :individual-submit="currentCourse.submitIndividually"
                                                :submit-cb="submitCb"
                                                :individual-submit-cb="individualSubmitCb"/>
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
<script lang="ts" src="./course_details_component.ts"></script>
