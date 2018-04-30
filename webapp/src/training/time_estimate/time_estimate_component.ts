import Vue from 'vue';
import Component from 'vue-class-component';
import {Prop} from 'vue-property-decorator';
import TrainingElementComponent from '@training/training_element/training_element_component.vue';
import {IDropdownOptions} from 'foundation';
import {TrainingFieldComponent} from '@training/training_element/training_element_component';

const SELECTABLE_MINUTES = [0, 15, 30, 45];
const SELECTABLE_HOURS = Array.from(Array(6).keys());

@Component({
    components: {
        'training-element': TrainingElementComponent
    },
    data: () => {
        return {
            hours: "0",
            minutes: "0",
            selectableMinutes: SELECTABLE_MINUTES,
            selectableHours: SELECTABLE_HOURS
        };
    },
})
export class TimeEstimateComponent extends Vue implements TrainingFieldComponent {
    //the duration in minutes
    @Prop({type: Number})
    timeEstimate: number;
    dropdownConfig: IDropdownOptions = {
        alignment: 'center',
        position: 'right',
        allowOverlap: true,
        hOffset: 5
    };
    formstate = {};

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

    cancelCallback() {

    };
}

export default TimeEstimateComponent;
