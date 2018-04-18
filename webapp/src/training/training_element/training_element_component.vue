<template>
    <div @mouseover="onElement" @mouseleave="offElement">
        <div v-show="!editing" :data-open="viewModeDropdownId">
            <slot name="display"></slot>
        </div>
        <div v-show="editing" :data-open="editModeDropdownId">
            <slot name="edit"></slot>
        </div>
        <dropdown :dropdown-id="viewModeDropdownId" ref="viewModeDropdown" :config="dropdownConfig">
            <button type="button" class="button" @click="editMode">Edit</button>
        </dropdown>
        <dropdown :dropdown-id="editModeDropdownId" ref="editModeDropdown" :config="dropdownConfig">
            <button type="button" class="button" @click="viewMode">Cancel</button>
        </dropdown>
    </div>
</template>
<script lang="ts" src="./training_element_component.ts"></script>