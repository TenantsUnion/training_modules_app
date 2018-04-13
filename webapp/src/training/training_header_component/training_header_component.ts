import Vue from 'vue';
import Component from 'vue-class-component';
import {mapState} from 'vuex';
import {RootGetters} from '@store/store_types';
import TimeEstimateComponent from '@webapp/training/time_estimate/time_estimate_component.vue';

@Component({
    components: {
      'time-estimate': TimeEstimateComponent
    },
    computed: {
        ...mapState({
            training: (rootState, {currentTraining}: RootGetters) => currentTraining || {}
        })
    }
})
export class TrainingHeaderComponent extends Vue {}

export default TrainingHeaderComponent;