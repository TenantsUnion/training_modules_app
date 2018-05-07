import Vue from 'vue';
import Component from 'vue-class-component';
import {mapState} from 'vuex';
import {RootGetters} from '@store/store_types';
import {CourseMode} from '@course/course_store';
import FoundationDropdownComponentVue from '@components/foundation/dropdown/foundation_dropdown_component.vue';
import FoundationDropdownComponent from '@components/foundation/dropdown/foundation_dropdown_component';
import EditIcon from '@components/icons/edit_icon_component.vue';
import CancelIcon from '@components/icons/cancel_icon_component.vue';
import PreviewIcon from '@components/icons/preview_icon_component.vue';
import {Prop} from 'vue-property-decorator';
import {IDropdownOptions} from 'foundation';
import {TrainingEntityDelta} from '@shared/training';
import {EDIT_TRAINING_MUTATIONS} from '@training/edit_training_store/edit_training_state';

let editDropdownCount = 0;
const editDropdownId = () => `edit-dropdown-${editDropdownCount++}`;

export interface TrainingFieldComponent {
    cancelCallback: () => any;
    hasEdits: boolean;
}

@Component({
    components: {
        'dropdown': FoundationDropdownComponentVue,
        'edit-icon': EditIcon,
        'cancel-icon': CancelIcon,
        'preview-icon': PreviewIcon
    },
    computed: mapState({
        isAdmin: (rootState, {currentCourseMode}: RootGetters) => currentCourseMode === CourseMode.ADMIN
    })
})
export class TrainingElementComponent extends Vue {
    @Prop({required: false})
    dropdownConfig!: IDropdownOptions;
    @Prop({required: true, type: String})
    fieldName!: string;
    @Prop({required: true, type: Function})
    cancelCallback!: () => any;
    @Prop({required: true, type: Boolean})
    hasEdits!: boolean;

    isAdmin!: boolean;
    editModeDropdownId: string = editDropdownId();
    viewModeDropdownId: string = editDropdownId();

    /**
     * Called when the training component DOM element is initially hovered over
     */
    onElement() {
        setTimeout(() => {
            this.open();
        }, 150);
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
        }, 350);
    }

    editMode() {
        (<FoundationDropdownComponent> this.$refs.viewModeDropdown).close(() => {
            this.editing = true;
            Vue.nextTick(() => {
                let focusElement = this.$(`[name="${this.fieldName}"]`);
                if (focusElement.length > 1) {
                    throw new Error(`Multiple elements selector for focus`);
                }
                focusElement.trigger('focus');
                (<FoundationDropdownComponent> this.$refs.editModeDropdown).open();
            });
        });
    }

    get editing(): boolean {
        return this.$getters.isEditingField(this.fieldName);
    }

    set editing(editing: boolean) {
        this.$store.commit(EDIT_TRAINING_MUTATIONS.SET_BASIC_FIELD_EDITING, {
            fieldName: this.fieldName,
            editMode: editing
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

