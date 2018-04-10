import Vue from "vue";
import Component from "vue-class-component";

@Component({
    data: function() {
        return {};
    },
    props: {}
})
export class EditActionsButtonsComponent extends Vue {

    save () {
        console.log('saved!');
    }

    cancelButton () {
        console.log('canceled!');
    }
}

export default EditActionsButtonsComponent;
