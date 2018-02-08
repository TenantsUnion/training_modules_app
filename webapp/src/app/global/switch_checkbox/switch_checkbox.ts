import Vue from "vue";
import Component from "vue-class-component";

// generates unique id needed for foundation functionality
let switchCounter = 0;
const uniqueSwitchId = () => {
    return `checkbox-switch-${switchCounter++}`;
};

@Component({
    props: {
        checked: {
            type: Boolean,
            default: false
        },
        switchText: {
            type: String,
            required: true
        }
    }
})
export default class SwitchCheckboxComponent extends Vue {
    checked: boolean;
    vmChecked: boolean = this.checked;
    id: string = uniqueSwitchId();

    isChecked(): boolean {
        return this.vmChecked;
    }
}
