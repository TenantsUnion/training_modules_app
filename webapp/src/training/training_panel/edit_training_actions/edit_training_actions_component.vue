<template>
    <div class="edit-actions">
        <div class="grid-x">
            <div class="cell large-6 small-12">
                <button @click="save" class="button" type="button">Save</button>
            </div>
            <div class="cell large-6 small-12">
                <button @click="cancelButton" class="button secondary" type="button">Cancel</button>
            </div>
        </div>
        <div class="grid-x">
            <div class="cell large-6 small-12">
                <button class="button" type="button"><i class="fa fa-plus-square"/>Section</button>
            </div>
            <div class="cell large-6 small-12">
                <button class="button" type="button"><i class="fa fa-plus-square"/>Module</button>
            </div>
        </div>
        <div class="grid-x">
            <div class="cell large-6 small-12">
                <button class="button" type="button">
                    <i class="fa fa-plus-square"/><span>Content</span>
                </button>
            </div>
            <div class="cell large-6 small-12">
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
