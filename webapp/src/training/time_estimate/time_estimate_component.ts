import Vue from 'vue';
import Component from 'vue-class-component';
import {Prop, Watch} from 'vue-property-decorator';

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
})
export class TimeEstimateComponent extends Vue {
    @Prop({default: false})
    editing: boolean = false;
    //the duration in minutes
    @Prop({type: Number})
    timeEstimate: number;

    timeEstimateDescription() {
        return this.timeEstimate ? `
        ${(Math.floor(this.timeEstimate / 60))} hours
        ${this.timeEstimate % 60} minutes`
            : 'No time estimate';
    }

    timeChanged() {
        // // parse time
        // this.updated((parseInt(this.hours) * 60 + parseInt(this.minutes)));
    }
}

export default TimeEstimateComponent;
