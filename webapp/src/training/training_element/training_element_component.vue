<template>
    <div @mouseover="onElement" @mouseleave="offElement">
        <div v-show="!editing" :data-open="viewModeDropdownId">
            <slot name="display"></slot>
        </div>
        <div v-show="editing" :data-open="editModeDropdownId">
            <slot name="edit"></slot>
        </div>
        <dropdown class="training-dropdown" :dropdown-id="viewModeDropdownId" ref="viewModeDropdown"
                  :config="dropdownConfig">
            <button type="button" class="button icon-button" @click="editMode">
                <edit-icon/>
            </button>
            <button type="button" class="button icon-button alert" @click="cancelEdits">
                <cancel-icon/>
            </button>
        </dropdown>
        <dropdown class="training-dropdown" :dropdown-id="editModeDropdownId" ref="editModeDropdown"
                  :config="dropdownConfig">
            <button type="button" class="button icon-button secondary icon-button" @click="viewMode">
                <preview-icon/>
            </button>
            <button type="button" class="button icon-button alert" @click="cancelEdits">
                <cancel-icon/>
            </button>
        </dropdown>
    </div>
</template>
<script lang="ts" src="./training_element_component.ts"></script>
<style lang="scss" scoped>
    button.icon-button {
        margin: 0 auto;
        padding: .5em;
        border-radius: 50%
    }

    .training-dropdown {
        border: none;
    }
</style>