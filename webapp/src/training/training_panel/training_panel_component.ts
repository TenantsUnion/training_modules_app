import Component, {mixins} from 'vue-class-component';
import {FoundationOffCanvasMixin} from '@components/foundation/foundation_off_canvas_mixin';
import {IOffCanvasOptions} from 'foundation';
import EditTrainingActionsComponent
    from './edit_training_actions/edit_training_actions_component.vue';
import {IconComponentMixin} from '@components/icons/icon_component_mixin';
import {mapState} from 'vuex';
import {RootGetters} from '@store/store_types';

@Component({
    components: {
        'edit-actions': EditTrainingActionsComponent
    },
    computed: mapState({
        hasEdits: (state, {hasEdits}: RootGetters) => hasEdits
    })
})
export class TrainingPanelComponent extends mixins(FoundationOffCanvasMixin, IconComponentMixin) {

    mounted(){
        new this.Foundation.Accordion(this.$(this.$el).children('.accordion'), {
            allowAllClosed: true,
            multiExpand: true
        });
    }

    get offCanvasConfig(): IOffCanvasOptions {
        return {
            contentOverlay: false,
            transition: 'detached',
            autoFocus: true,
            closeOnClick: false
        };
    }
}

export default TrainingPanelComponent;