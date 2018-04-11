import Vue from "vue";
import Component from 'vue-class-component';
import {FoundationMixin} from '@webapp/mixins/foundation_vue_mixin';
import {Prop} from 'vue-property-decorator';
import {OffCanvas} from 'foundation';

@Component({
    mixins: [FoundationMixin]
})
export class TrainingPanelComponent extends Vue {
    @Prop({required: true})
    contentId: string;
    offCanvas: OffCanvas;
    hidden: boolean = true;

    mounted() {
        this.offCanvas = new this.Foundation.OffCanvas(this.$(this.$el).children('.training-panel'), {
            contentId: this.contentId,
            nested: true,
            contentOverlay: false,
            position: 'right',

        });

        // (<any>this.$(this.$el)).foundation();
        // (<any>this.$(this.$el)).foundation('open');
        // this.offCanvas.open();

        console.log(this.offCanvas);
    }

    close() {
        console.log('closing');
        this.offCanvas.close(() => {
            console.log('close callback');
            this.hidden = true;
        });
    }


    open() {

        console.log('opening');
        this.offCanvas.open();
    }

    destroyed() {
        // (<any>this.$(this.offCanvas)).foundation('destroy');
        // this.offCanvas.destroy();
    }

}

export default TrainingPanelComponent;