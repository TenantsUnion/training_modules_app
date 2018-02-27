<template>
    <div class="main">
        <div class="grid-x" v-if="loading">
            <div class="cell small-12 large-10">
                <loading></loading>
            </div>
        </div>
        <template v-if="!loading">
            <div class="grid-x">
                <div class="cell small-12 large-10">
                    <h2>{{section.title}}</h2>
                    <time-estimate :time-estimate="section.timeEstimate"/>
                </div>
            </div>
            <div class="grid-x">
                <div class="cell small-12 large-10">
                    <div class="small-12 cell">
                        <view-training-segments :content-questions="section.contentQuestions"
                            :submit-individual-questions="true"/>
                    </div>
                </div>
            </div>
            <div class="grid-x">
                <div class="cell small-12 large-10">
                    <button v-if="previousSectionId" @click="back" type="button"
                            class="button secondary" :disabled="loading">
                        Back
                    </button>
                    <button v-if="nextSectionId" @click="next" class="button primary" :disabled="loading">Next</button>
                </div>
            </div>
        </template>
    </div>
</template>
<script src="./view_section_component.ts" lang="ts"></script>
