import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
    template: `<span><i class="fa fa-spinner fa-spin fa-fw margin-1"></i>
        <span class="sr-only">Loading...</span></span>
    `
})
export class LoadingComponent extends Vue {
}