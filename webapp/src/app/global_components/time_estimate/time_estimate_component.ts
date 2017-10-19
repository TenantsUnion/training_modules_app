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
    template: `
        <div class="row">
            <label>Time Estimate
                <div class="input-group">
                    <label for="hours-input" class="input-group-label">Hours</label>
                    <select id="hours-input" v-model="hours" class="input-group-field">
                        <option v-for="hour in selectableHours">{{hour}}</option>
                    </select>
                    <label for="minutes-input" class="input-group-label">Minutes</label>
                    <select id="minutes-input" class="input-group-field" type="number">
                        <option v-for="minute in selectableMinutes">{{minute}}</option>
                    </select>
                </div>
            </label>
        </div>
    `,
    props: {
        //the duration in minutes
        timeEstimate: String
    }
})
export class TimeEstimateComponent extends Vue {
    hours: string;
    minutes: string;
    timeEstimate: string;

    @Watch('timeEstimate')
    updateTimeEstimate(timeEstimate, oldTimeEstimate) {
        if (timeEstimate) {
            this.hours = (Math.floor(parseInt(timeEstimate) / 60)) + '';
            this.minutes = parseInt(timeEstimate) % 60 + '';
        } else {
            this.hours = '0';
            this.minutes = '0';
        }
    }
}