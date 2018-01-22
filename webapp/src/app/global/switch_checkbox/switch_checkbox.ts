import Vue from "vue";
import Component from "vue-class-component";

// generates unique id needed for foundation functionality
let switchCounter = 0;
const uniqueSwitchId = () => {
    return `checkbox-switch-${switchCounter++}`;
};

@Component({
    props: {
        initChecked: {
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
    initChecked: boolean;
    checked: boolean = this.initChecked;
    id: string = uniqueSwitchId();

    isChecked(): boolean {
        return this.checked;
    }
}
