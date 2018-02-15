import {t, Selector} from 'testcafe'
import {TimeEstimateComponentDriver} from "../components/time_estimate_component_driver";
import {setChecked} from "../../checkbox_driver";

export class CreateCoursePageDriver {
    private titleInput = Selector('#course-title');
    private activeCheckbox = Selector('#course-active');
    private descriptionInput = Selector('#course-description');
    private createAndEditBtn = Selector('button').withText('Create and Edit');

    setTitle (title: string): TestControllerPromise {
        return t.typeText(this.titleInput, title);
    }

    setDescription(description: string): TestControllerPromise {
        return t.typeText(this.descriptionInput, description);
    }

    setTime (hours: number, minutes: number): TestControllerPromise {
        return <TestControllerPromise> new TimeEstimateComponentDriver().enterTime(hours, minutes);
    }

    async setActive(active: boolean) {
        return setChecked(this.activeCheckbox, active);
    }

    createAndEdit(): TestControllerPromise {
        return t.click(this.createAndEditBtn);
    }
}