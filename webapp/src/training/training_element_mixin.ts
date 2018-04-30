import Vue from 'vue';
import Component from 'vue-class-component';
import TrainingElementComponent from '@training/training_element/training_element_component.vue';

@Component({
    components: {
        'training-element': TrainingElementComponent
    }
})
export class TrainingElementMixin extends Vue {}