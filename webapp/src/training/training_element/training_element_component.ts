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

export interface TrainingFieldComponent {
    cancelCallback: () => any;
}

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
    @Prop({required: true, type: Function})
    cancelCallback!: () => any;

    editing: boolean = false;
    isAdmin!: boolean;
    editModeDropdownId: string = editDropdownId();
    viewModeDropdownId: string = editDropdownId();

    /**
     * Called when the training component DOM element is initially hovered over
     */
    onElement() {
        setTimeout(() => {
            this.open();
        }, 200);
    }

    /**
     * Called when the training component DOM element is no longer hovered over
     */
    offElement() {
        setTimeout(() => {
            const keepOpen = this.editing || this.hoveredOver();
            if (keepOpen) {
                Vue.nextTick(() => this.offElement());
            } else {
                this.close();
            }
        }, 250);
    }

    editMode() {
        (<FoundationDropdownComponent> this.$refs.viewModeDropdown).close(() => {
            this.editing = true;
            Vue.nextTick(() => {
                let focusElement = this.$(`[name="${this.focusField}"]`);
                if (focusElement.length > 1) {
                    throw new Error(`Multiple elements selector for focus`);
                }
                focusElement.trigger('focus');
                (<FoundationDropdownComponent> this.$refs.editModeDropdown).open();
            });
        });
    }

    cancelEdits() {
        this.viewMode();
        this.cancelCallback();
    }

    viewMode() {
        (<FoundationDropdownComponent> this.$refs.editModeDropdown).close(() => {
            this.editing = false;
        });
    }

    open() {
        if (this.hoveredOver()) {
            this.editing ? (<FoundationDropdownComponent> this.$refs.editModeDropdown).open() :
                (<FoundationDropdownComponent> this.$refs.viewModeDropdown).open()
        }
    }

    close() {
        (<FoundationDropdownComponent> this.$refs.editModeDropdown).close();
        (<FoundationDropdownComponent> this.$refs.viewModeDropdown).close();
    }

    hoveredOver(): boolean {
        return this.$(this.$el).is(':hover')
            || this.$((<Vue> this.$refs.editModeDropdown).$el).is(':hover')
            || this.$((<Vue> this.$refs.viewModeDropdown).$el).is(':hover');
    }
}

export default TrainingElementComponent;

