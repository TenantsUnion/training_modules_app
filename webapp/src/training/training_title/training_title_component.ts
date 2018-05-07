import Component, {mixins} from 'vue-class-component';
import {TrainingFieldComponent} from '@training/training_element/training_element_component';
import {TrainingElementMixin} from '@training/training_element_mixin';

@Component
export class TrainingTitleComponent extends mixins(TrainingElementMixin) implements TrainingFieldComponent {
    fieldName: 'title' = 'title';

    get title() {
        return this.getCurrentFieldValue(this.fieldName);
    }

    set title(title: string) {
        this.setFieldEdit(this.fieldName, title);
    }

    get hasEdits() {
        return this.$getters.fieldHasEdits(this.fieldName);
    }

    cancelCallback() {
        this.cancelEdit(this.fieldName);
    }
}

export default TrainingTitleComponent;