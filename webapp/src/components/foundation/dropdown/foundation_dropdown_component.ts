import Component, {mixins} from 'vue-class-component';
import {FoundationMixin} from '@components/foundation/foundation_vue_mixin';
import {Dropdown, IDropdownOptions} from 'foundation';
import {Prop} from 'vue-property-decorator';

export const DEFAULT_DROPDOWN_OPTIONS: IDropdownOptions = {
    alignment: 'top',
    position: 'right',
    allowOverlap: true,
    hOffset: 5
};

@Component
export class FoundationDropdownComponent extends mixins(FoundationMixin) implements Dropdown {
    @Prop({type: Object, default: () => DEFAULT_DROPDOWN_OPTIONS})
    config!: IDropdownOptions;
    @Prop({type: String, required: true})
    dropdownId!: string;

    dropdown!: Dropdown;

    mounted() {
        this.dropdown = new this.Foundation.Dropdown(this.$(this.$el), {
            ...DEFAULT_DROPDOWN_OPTIONS,
            ...this.config,
        });
    }

    open() {
        this.dropdown.open();
    }

    close(cb?: () => any) {
        this.$(this.$el).one('hide.zf.dropdown', function () {
            cb && cb();
        });
        this.dropdown.close();
    }

    toggle() {
        this.dropdown.toggle();
    }

    destroy() {
        this.dropdown.destroy();
    }

    getPositionClass(): string {
        return this.dropdown.getPositionClass();
    }
}

export default FoundationDropdownComponent;