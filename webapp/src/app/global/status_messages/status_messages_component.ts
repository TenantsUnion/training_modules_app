import Vue from 'vue';
import Component from "vue-class-component";
import {mapState} from "vuex";
import {RootState} from "../../state_store";
import {STATUS_MESSAGES_MUTATIONS, StatusMessage} from "@global/status_messages/status_messages_store";

@Component({
    computed: mapState({
        messages: ({statusMessages}: RootState): StatusMessage[] => statusMessages.messages
    })
})
export class StatusMessageComponent extends Vue {
    dismissMessage(message: StatusMessage) {
        this.$store.commit(STATUS_MESSAGES_MUTATIONS.DISMISS_MESSAGE, message);
    }

    statusStyleClasses({status}: StatusMessage){
        return {
            alert: status === 'ALERT',
            warning: status === 'WARNING',
            success: status === 'SUCCESS'
        }
    }
}

export default StatusMessageComponent;