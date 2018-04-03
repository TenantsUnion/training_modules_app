<template>
    <div>
        <div v-if="searchField.type === 'text'">
            <label>
                {{searchField.name}}
                <input type="text"
                       v-bind:placeholder="searchField.placeholderText"
                       v-model="filterInput"
                       v-on:input="triggerSearch"
                />
            </label>
        </div>
        <div v-else>
            <p>Search field type {{searchField.type}} is not recognized!!</p>
        </div>
    </div>
</template>
<script src="./search_field_component.ts" lang="ts"></script>