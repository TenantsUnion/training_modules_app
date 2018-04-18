import Vue from 'vue';
import Component from 'vue-class-component';
import {mapState} from 'vuex';
import {RootGetters} from '@store/store_types';
import TrainingElement from '@training/training_element/training_element_component.vue';

@Component({
    components: {
        'training-element': TrainingElement
    },
    computed: mapState({
        training: (rootState, {currentTraining}: RootGetters) => currentTraining
    })
})
export class TrainingTitleComponent extends Vue {
    formstate = {};
    editTitle: string = '';
}

export default TrainingTitleComponent;