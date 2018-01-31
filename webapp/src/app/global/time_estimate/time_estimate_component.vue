<template>
    <div>
        <div v-if="isInput">
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
        <div v-if="!isInput">
            <p>Time Estimate: {{hours}} hours {{minutes}} minutes</p>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import {Watch} from 'vue-property-decorator';

    const SELECTABLE_MINUTES = [0, 15, 30, 45];
    const SELECTABLE_HOURS = Array.from(Array(6).keys());

    @Component({
        data: () => {
            return {
                hours: "0",
                minutes: "0",
                selectableMinutes: SELECTABLE_MINUTES,
                selectableHours: SELECTABLE_HOURS
            };
        },
        props: {
            //the duration in minutes
            timeEstimate: Number,
            isInput: {
                type: Boolean,
                default: false
            },
            updated: {
                type: Function,
                default: () => {
                }
            }
        },
    })
    export default class TimeEstimateComponent extends Vue {
        hours: string;
        minutes: string;
        timeEstimate: string;
        updated: (time: string) => void;

        @Watch('timeEstimate', {immediate: true})
        updateTimeEstimate(timeEstimate, oldTimeEstimate) {
            if (timeEstimate) {
                this.hours = (Math.floor(parseInt(timeEstimate) / 60)) + '';
                this.minutes = parseInt(timeEstimate) % 60 + '';
            } else {
                this.hours = '0';
                this.minutes = '0';
            }
            this.timeChanged();
        }

        timeChanged() {
            // parse time
            this.updated((parseInt(this.hours) * 60 + parseInt(this.minutes)) + '');
        }
    }
</script>
