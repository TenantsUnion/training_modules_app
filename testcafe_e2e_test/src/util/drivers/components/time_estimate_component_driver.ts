import {t, Selector} from "testcafe";

export class TimeEstimateComponentDriver {
    private hoursInput = Selector('#hours-input');
    private minutesInput = Selector('#minutes-input');

    async enterHours (hours: number) {
        if (hours < 0 || hours > 5) {
            throw new Error("hours not within range");
        }

        return t.click(this.hoursInput)
            .pressKey(downStrokes(hours));
    }

    async enterMinutes (minutes: number) {
        if (minutes % 15 !== 0 && minutes < 60 && minutes >= 0) {
            throw new Error('minutes must be 0, 15, 30, or 45');
        }

        return t.click(this.minutesInput)
            .pressKey(downStrokes(minutes / 15));
    }

    async enterTime (hours: number, minutes: number) {
        await this.enterHours(hours);
        return this.enterMinutes(minutes);
    }
}

const downStrokes = (downStrokes: number): string => {
    return 'down '.repeat(downStrokes).trim();
};