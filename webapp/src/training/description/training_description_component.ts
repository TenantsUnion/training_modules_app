import Component, {mixins} from 'vue-class-component';
import {TrainingFieldComponent} from '@training/training_element/training_element_component';
import {TrainingElementMixin} from '@training/training_element_mixin';

@Component
export class TrainingDescriptionComponent extends mixins(TrainingElementMixin) implements TrainingFieldComponent {
    fieldName: 'description' = 'description';

    set description(description: string) {
        this.setFieldEdit(this.fieldName, description);
    }

    get description() {
        return this.getCurrentFieldValue(this.fieldName);
    }

    get hasEdits() {
        return this.$getters.fieldHasEdits(this.fieldName);
    }

    cancelCallback() {
        this.cancelEdit(this.fieldName)
    }
}

export default TrainingDescriptionComponent;
