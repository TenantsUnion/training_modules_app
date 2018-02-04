<template>
    <div v-show="displayQuillEditor" class="scrolling-container">
        <div v-if="!readOnly" ref="toolbar">
            <div class="row relative">
                <div class="quill-toolbar-buttons columns small-11">
                        <span v-for="formatGrp in toolbarConfig" class="ql-formats">
                            <span v-for="qlFormat in formatGrp">
                                <button v-if="isBtnObj(qlFormat)"
                                        :class="['ql-' + formatObjProp(qlFormat)]"
                                        :value="formatObjVal(qlFormat)"></button>
                                <select v-else-if="isDropdownObj(qlFormat)" :class="['ql-' + formatObjProp(qlFormat)]">
                                    <option v-for="val in formatObjVal(qlFormat)" :value="val"></option>
                                </select>
                                <button v-else :class="['ql-' + qlFormat]"></button>
                            </span>
                        </span>
                </div>
                <div v-if="onRemove && !readOnly" class="columns small-1">
                    <button type="button" class="close-button" title="Remove Content"
                            aria-label="Remove Content" v-on:click="onRemove">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            </div>
        </div>
        <div ref="editor" class="editor-container"></div>
    </div>
</template>

<script lang="ts" src="./quill_component.ts"></script>

<style lang="scss">
    //default quill theme
    @import '~quill/dist/quill.core.css';
    @import '~quill/dist/quill.snow.css';
</style>
