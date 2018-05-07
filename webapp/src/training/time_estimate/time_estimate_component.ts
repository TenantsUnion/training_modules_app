import Component, {mixins} from 'vue-class-component';
import {IDropdownOptions} from 'foundation';
import {TrainingFieldComponent} from '@training/training_element/training_element_component';
import {TrainingElementMixin} from '@training/training_element_mixin';

const SELECTABLE_MINUTES = [0, 15, 30, 45];
const SELECTABLE_HOURS = Array.from(Array(6).keys());

@Component({
    data: () => {
        return {
            selectableMinutes: SELECTABLE_MINUTES,
            selectableHours: SELECTABLE_HOURS
        };
    },
})
export class TimeEstimateComponent extends mixins(TrainingElementMixin) implements TrainingFieldComponent {
    fieldName: 'timeEstimate' = 'timeEstimate';
    //the duration in minutes
    dropdownConfig: IDropdownOptions = {
        alignment: 'center',
        position: 'right',
        allowOverlap: true,
        hOffset: 5
    };

    get timeEstimateDescription() {
        return this.timeEstimate ? `${this.hours} hours ${this.minutes} minutes` : 'No time estimate';
    }

    get hours() {
        return Math.floor(this.timeEstimate / 60);
    }

    get minutes() {
        return this.timeEstimate % 60;
    }

    set hours(hours) {
        this.setFieldEdit(this.fieldName, (+hours * 60) + this.minutes);
    }

    set minutes(minutes) {
        this.setFieldEdit(this.fieldName, (this.hours * 60) + +minutes);
    }

    get timeEstimate(): number {
        return +this.getCurrentFieldValue(this.fieldName) || 0;
    }

    get hasEdits(): boolean {
        return this.$getters.fieldHasEdits(this.fieldName);
    }

    cancelCallback() {
        this.cancelEdit(this.fieldName);
    };
}

export default TimeEstimateComponent;
