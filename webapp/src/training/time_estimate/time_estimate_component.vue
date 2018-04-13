<template>
    <div>
        <div v-if="editing">
            <label>Time Estimate
                <div class="input-group">
                    <label for="hours-input" class="input-group-label">Hours</label>
                    <select id="hours-input" class="input-group-field"
                            v-model="hours" v-on:change="timeChanged">
                        <option v-for="hour in selectableHours">{{hour}}</option>
                    </select>
                    <label for="minutes-input" class="input-group-label">Minutes</label>
                    <select id="minutes-input" class="input-group-field"
                            v-model="minutes" v-on:change="timeChanged">
                        <option v-for="minute in selectableMinutes">{{minute}}</option>
                    </select>
                </div>
            </label>
        </div>
        <div v-if="!editing">
            <p class="subheader">{{timeEstimateDescription()}}</p>
        </div>
    </div>
</template>
<script lang="ts" src="./time_estimate_component.ts"></script>
