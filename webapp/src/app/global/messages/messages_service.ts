import Vue from "vue";
import Component from "vue-class-component";

@Component({
    data: () => {
        return {
            message: '',
            isSuccess: false,
            isWarning: false
        }
    },
    template: require('./messages_component.tpl.html')
})
export class MessagesComponent extends Vue {
    defaultTimeout: number = 4000;
    message: string;
    isSuccess: boolean;
    isWarning: boolean;

    setSuccessMessage (successMsg, timeout?: number) {
        this.message = successMsg;
        this.isSuccess = true;
        this.isWarning = false;
        setTimeout(() => {
            this.message = '';
            this.isSuccess = false;
            this.isWarning = false;
        }, timeout ? timeout : this.defaultTimeout);
    }
}

export class MessagesService {
    observers: ((successMsg:string, timeout?:number) => void)[];
    setSuccessMessage (successMsg: string, timeout?: number) {

    }

    subscribeToMessages (observer: (successMsg:string, timeout?:number) => () => void) {
        this.observers.push(observer);

        return



    }
}