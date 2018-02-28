<template>
    <div class="main">
        <div v-if="loading" class="grid-x">
            <loading></loading>
        </div>
        <template v-if="!loading">
            <div class="grid-x">
                <div class="small-12 large-10 cell">
                    <div>
                        <h2>{{module.title}}</h2>
                        <h4>{{module.description}}</h4>
                        <time-estimate :time-estimate="module.timeEstimate"/>
                    </div>
                    <div v-for="section in module.sections">
                        <h3>{{section.title}}</h3>
                        <p>{{section.description}}</p>
                    </div>
                    <div class="grid-x">
                        <div class="cell small-12 large-10">
                            <view-training-segments :content-questions="module.contentQuestions"
                                                    :individual-submit="module.submitIndividually"
                                                    ref="trainingSegment"/>
                        </div>
                    </div>
                </div>
            </div>

        </template>
    </div>
</template>
<script lang="ts" src="./module_details_component.ts"></script>
