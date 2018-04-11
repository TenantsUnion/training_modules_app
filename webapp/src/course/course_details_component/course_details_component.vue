<template>
    <div class="main">
        <div v-if="loading" class="grid-x">
            <loading></loading>
        </div>
        <!--<div v-if="currentCourse" class="grid-x">-->
            <!--<div class="small-12 large-10 cell">-->
                <!--<div>-->
                    <!--<h2>{{currentCourse.title}}</h2>-->
                    <!--<p>{{currentCourse.description}}</p>-->
                    <!--<time-estimate v-if="currentCourse.timeEstimate !== 0" :time-estimate="currentCourse.timeEstimate"/>-->
                <!--</div>-->
                <!--<div class="grid-x">-->
                    <!--<div class="cell small-12 large-10">-->
                        <!--<view-training-segments :content-questions="currentCourse.contentQuestions"-->
                                                <!--:individual-submit="currentCourse.submitIndividually"-->
                                                <!--:submit-cb="submitCb"-->
                                                <!--:individual-submit-cb="individualSubmitCb"/>-->
                    <!--</div>-->
                <!--</div>-->
            <!--</div>-->
        <!--</div>-->
        <div v-if="course" class="grid-x">
            <div class="small-12 large-12 cell">
                <training :callbacksConfig="trainingCallbacksConfig" ref="training"></training>
            </div>
        </div>
    </div>
</template>
<script lang="ts" src="./course_details_component.ts"></script>
