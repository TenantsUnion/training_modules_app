import Vue from 'vue';
import Component from 'vue-class-component';
import SaveIconComponent from '@components/icons/save_icon_component.vue';
import CancelIconComponent from '@components/icons/cancel_icon_component.vue';
import BarsIconComponent from '@components/icons/bars_icon_component.vue';

@Component({
    components: {
        'save-icon': SaveIconComponent,
        'cancel-icon': CancelIconComponent,
        'bars-icon': BarsIconComponent
    }
})
export class IconComponentMixin extends Vue {
}
