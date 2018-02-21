import jQuery from 'jquery';
import Vue from 'vue';
import * as _ from "underscore";
import Quill from 'quill';
import axios, {AxiosRequestConfig} from "axios";
import LoadingComponent from './global/loading.vue';
import TimeEstimateComponent from './global/time_estimate/time_estimate_component.vue';
import QuillComponent from './global/quill/quill_component.vue';
import EditTrainingSegmentsComponent from './global/edit_training_segments/edit_training_segments_component.vue';
import ViewTrainingSegmentsComponent from './global/view_training_segments/view_training_segments_component.vue';
import QuestionComponent from "./global/edit_question/question_component.vue";
import SwitchCheckBoxComponent from './global/switch_checkbox/switch_checkbox.vue';
import AppHeader from './user/header/user_header_component.vue';
import VueRouter from 'vue-router';
import VueForm from 'vue-form';

//put jquery on global window for debugging,
//workaround for webpack doing this with module number prefixes
let unTypedWindow = <any> window;
if (process.env.NODE_ENV !== 'production') {
    unTypedWindow.jQuery = jQuery;
    unTypedWindow.$ = jQuery;
    unTypedWindow.Quill = Quill;
    unTypedWindow.axios = axios;
}

export const registerGlobalComponents = () => {
    Vue.component('loading', LoadingComponent);
    Vue.component('time-estimate', TimeEstimateComponent);
    Vue.component('quill-editor', QuillComponent);
    Vue.component('question', QuestionComponent);
    Vue.component('edit-training-segments', EditTrainingSegmentsComponent);
    Vue.component('view-training-segments', ViewTrainingSegmentsComponent);
    Vue.component('switch-checkbox', SwitchCheckBoxComponent);
    Vue.component('app-header', AppHeader);

    Vue.use(VueRouter);
    Vue.use(VueForm);
};


export const $ = jQuery;

// have properties that are empty strings be deleted from ajax requests
// empty model values of '' will be sent as invalid values otherwise unless checked for in each component
// and assigning null is saved as text
axios.interceptors.request.use((config: AxiosRequestConfig) => {
    return config.data ?
        _.extend({}, config, {
            data: _.reduce(Object.keys(config.data), (acc, key) => {
                if (!_.isString(config.data[key]) || config.data[key]) {
                    acc[key] = config.data[key];
                }
                return acc;
            }, {})
        }) :
        config;
});