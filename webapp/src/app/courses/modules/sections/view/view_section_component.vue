<template>
    <div class="main">
        <div class="row" v-if="loading">
            <div class="columns small-12 large-10">
                <loading></loading>
            </div>
        </div>
        <template v-if="!loading">
            <div class="row">
                <div class="columns small-12 large-10">
                    <h2>{{section.title}}</h2>
                    <time-estimate :time-estimate="section.timeEstimate"></time-estimate>
                </div>
            </div>
            <div class="row">
                <div class="columns small-12 large-10">
                    <div class="small-12 columns">
                        <div v-for="content in section.content">
                            <quill-editor :read-only="true" :editor-id="content.id"
                                          :editor-json="content.editorJson"></quill-editor>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="columns small-12 large-10">
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
