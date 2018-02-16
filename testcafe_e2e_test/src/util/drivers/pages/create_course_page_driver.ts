import {t, Selector} from 'testcafe'
import {TimeEstimateComponentDriver} from "../components/time_estimate_component_driver";
import {setChecked} from "../../checkbox_driver";

export class CreateCoursePageDriver {
    private titleInput = Selector('#course-title');
    private activeCheckbox = Selector('#course-active');
    private descriptionInput = Selector('#course-description');
    private createAndEditBtn = Selector('button').withText('Create and Edit');

    async createCourse (input: CreateCourseUserInput)  {
        let {title, description, active, minutes, hours} = input;
        await setChecked(this.activeCheckbox, active);
        return new TimeEstimateComponentDriver().enterTime(hours, minutes)
            .typeText(this.titleInput, title)
            .typeText(this.descriptionInput, description)
            .click(this.createAndEditBtn);
    }
}

export type CreateCourseUserInput = {
    title: string,
    description?: string;
    hours?: number;
    minutes?: number;
    active?: boolean;
}