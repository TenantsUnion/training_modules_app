import Vue from 'vue';
import Component from 'vue-class-component';
import {mapState} from 'vuex';
import {RootGetters} from '@store/store_types';
import {CourseMode} from '@course/course_store';
import FoundationDropdownComponentVue from '@components/foundation/dropdown/foundation_dropdown_component.vue';
import FoundationDropdownComponent from '@components/foundation/dropdown/foundation_dropdown_component';
import {Prop} from 'vue-property-decorator';
import {IDropdownOptions} from 'foundation';

let editDropdownCount = 0;
const editDropdownId = () => `edit-dropdown-${editDropdownCount++}`;

@Component({
    components: {
        'dropdown': FoundationDropdownComponentVue
    },
    computed: mapState({
        isAdmin: (rootState, {currentCourseMode}: RootGetters) => currentCourseMode === CourseMode.ADMIN,
    })
})
export class TrainingElementComponent extends Vue {
    @Prop({required: false})
    dropdownConfig!: IDropdownOptions;
    @Prop({required: true, type: String})
    focusField!: string;

    editing: boolean = false;
    isAdmin!: boolean;
    editModeDropdownId: string = editDropdownId();
    viewModeDropdownId: string = editDropdownId();

    onElement() {
        setTimeout(() => {
            console.log('onElement');
            this.open();
        }, 250);
    }

    offElement() {
        var self = this;
        setTimeout(() => {
            if (self.$(self.$el).is(':hover')
                || self.$((<Vue> self.$refs.editModeDropdown).$el).is(':hover')
                || self.$((<Vue> self.$refs.viewModeDropdown).$el).is(':hover')
            ) {
                setTimeout(() => self.offElement(), 0);
            } else {
                this.close();
            }
        }, 250);
    }

    editMode() {
        (<FoundationDropdownComponent> this.$refs.viewModeDropdown).close(() => {
            this.editing = true;
            let focusElement = this.$(`[name="${this.focusField}"]`);
            if (focusElement.length > 1) {
                console.error(focusElement);
                throw new Error(`Multiple elements selector for focus`);
            }
            Vue.nextTick(() => focusElement.trigger('focus'));
            // (<FoundationDropdownComponent> this.$refs.editModeDropdown).open();
        });
    }

    viewMode() {
        (<FoundationDropdownComponent> this.$refs.editModeDropdown).close(() => {
            this.editing = false;
            (<FoundationDropdownComponent> this.$refs.viewModeDropdown).open();
        });
    }

    open() {
        this.editing ? (<FoundationDropdownComponent> this.$refs.editModeDropdown).open() :
            (<FoundationDropdownComponent> this.$refs.viewModeDropdown).open()
    }

    close() {
        (<FoundationDropdownComponent> this.$refs.editModeDropdown).close();
        (<FoundationDropdownComponent> this.$refs.viewModeDropdown).close();
    }
}

export default TrainingElementComponent;

