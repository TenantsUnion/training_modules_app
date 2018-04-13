import Component, {mixins} from 'vue-class-component';
import {IOffCanvasOptions, OffCanvas} from 'foundation';
import {FoundationMixin} from '@components/foundation/foundation_vue_mixin';
import {Prop} from 'vue-property-decorator';

@Component
export class FoundationOffCanvasMixin extends mixins(FoundationMixin) {
    @Prop({default: () => null})
    onOpen: () => {};
    @Prop({default: () => null})
    onClose: () => {};
    private hidden: boolean = true;
    protected offCanvas: OffCanvas;

    mounted() {
        this.offCanvas = new this.Foundation.OffCanvas(this.$(this.$el), this.offCanvasConfig);
    }

    close() {
        this.hide = true;
    }

    open() {
        this.hide = false;
    }

    set hide(hide: boolean) {
        if (hide && !this.hidden) {
            this.offCanvas.close();
            this.onClose();
        } else if (!hide && this.hidden) {
            this.offCanvas.open();
            this.onOpen();
        }
        this.hidden = hide;
    }

    get hide(): boolean {
        return this.hidden;
    }

    get offCanvasConfig(): IOffCanvasOptions {
        return {
            contentOverlay: false,
            transition: 'push'
        };
    }
}
