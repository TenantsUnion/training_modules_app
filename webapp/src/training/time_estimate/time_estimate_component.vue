<template>
    <training-element :dropdown-config="dropdownConfig" field-name="hours" :cancel-callback="cancelCallback" :has-edits="hasEdits">
        <div slot="edit">
            <vue-form :state="formstate" @submit.prevent class="input-group">
                <label for="hours-input" class="input-group-label">Hours</label>
                <select id="hours-input" class="input-group-field" name="hours"
                        v-model="hours">
                    <option v-for="hour in selectableHours">{{hour}}</option>
                </select>
                <label for="minutes-input" class="input-group-label">Minutes</label>
                <select id="minutes-input" class="input-group-field" name="minutes"
                        v-model="minutes">
                    <option v-for="minute in selectableMinutes">{{minute}}</option>
                </select>
            </vue-form>
        </div>
        <div slot="display">
            <p class="subheader">{{timeEstimateDescription}}</p>
        </div>
    </training-element>
</template>
<script lang="ts" src="./time_estimate_component.ts"></script>
