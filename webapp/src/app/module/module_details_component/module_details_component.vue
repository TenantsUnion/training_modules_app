<template>
    <div class="main">
        <div v-if="loading" class="row">
            <loading></loading>
        </div>
        <template v-if="!loading">
            <div class="row">
                <div class="small-12 large-10 columns">
                    <div>
                        <h2>{{module.title}}</h2>
                        <h4>{{module.description}}</h4>
                        <time-estimate :time-estimate="module.timeEstimate"/>
                    </div>
                    <div v-for="section in module.sections">
                        <h3>{{section.title}}</h3>
                        <p>{{section.description}}</p>
                    </div>
                    <div class="row">
                        <div class="columns small-12 large-10">
                            <view-training-segments :content-questions="module.contentQuestions"
                                                    ref="trainingSegment"/>
                        </div>
                    </div>
                </div>
            </div>

        </template>
    </div>
</template>
<script lang="ts" src="./module_details_component.ts"></script>
