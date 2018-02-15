import {t} from "testcafe";

export const checkCheckbox = async (checkbox: SelectorPromise) => {
       let isChecked = await checkbox.checked;
       if(!isChecked) {
           t.click(checkbox);
       }
};

export const uncheckCheckbox = async (checkbox: SelectorPromise) => {
    let isChecked = await checkbox.checked;
    if(isChecked) {
        t.click(checkbox);
    }
};

export const setChecked = async (checkbox: Selector, setChecked: boolean) => {
    let isChecked = await checkbox.checked;
    if(isChecked !== setChecked) {
        t.click(checkbox);
    }
};
