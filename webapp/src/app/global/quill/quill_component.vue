<template>
    <div v-show="displayQuillEditor" class="scrolling-container">
        <div v-if="!readOnly" v-bind:class="toolbarSelector">
            <div class="row">
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
                        <span type="button" class="button alert small" title="Remove Content" v-on:click="onRemove">
                            <i class="fa fa-times fa-fw" aria-hidden="true"></i>
                            <span class="sr-only">Remove Content</span>
                        </span>
                </div>
            </div>
        </div>
        <div v-bind:class="editorSelector" class="editor-container"></div>
    </div>
</template>

<script lang="ts">
    import {QuillComponent} from './quill_component';
    export default QuillComponent;
</script>
