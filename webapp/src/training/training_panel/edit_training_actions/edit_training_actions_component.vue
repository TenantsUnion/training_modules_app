<template>
    <div class="edit-actions">
        <div class="grid-x">
            <div class="cell small-12">
                <button v-show="hasEdits" @click="save" class="button" type="button" title="Save All">
                    <save-icon/>
                    Save All</button>
            </div>
            <div class="cell small-12" title="Reset All">
                <button v-show="hasEdits" @click="resetAll" class="button alert" type="button">
                    <cancel-icon/>
                    Reset All
                </button>
            </div>
        </div>
        <div class="grid-x">
            <div class="cell small-12">
                <button class="button" type="button"><i class="fa fa-plus-square"/>Section</button>
            </div>
            <div class="cell small-12">
                <button class="button" type="button"><i class="fa fa-plus-square"/>Module</button>
            </div>
        </div>
        <div class="grid-x">
            <div class="cell small-12">
                <button class="button" type="button">
                    <i class="fa fa-plus-square"/><span>Content</span>
                </button>
            </div>
            <div class="cell small-12">
                <button class="button" type="button"><i class="fa fa-plus-square"/>Question</button>
            </div>
        </div>
    </div>
</template>
<script lang="ts" src="./edit_training_actions_component.ts"></script>
<style lang="scss" scoped>
    .edit-actions {
        button {
            width: 90%;
            padding-right: .7em;
            padding-left: .7em;
        }
    }
</style>
