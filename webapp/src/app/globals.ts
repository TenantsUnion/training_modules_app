import jQuery from 'jquery';
import Vue from 'vue';
import * as _ from "underscore";
import Quill from 'quill';
import axios, {AxiosRequestConfig} from "axios";
import {LoadingComponent} from './global/loading';
import {TimeEstimateComponent} from './global/time_estimate/time_estimate_component';
import {QuillComponent} from './global/quill/quill_component';
import {AddContentComponent} from './global/content/add_content_componet';
import {SegmentViewerComponent} from './global/segment_viewer/segment_viewer_component';

//put jquery on global window for debugging,
//workaround for webpack doing this with module number prefixes
let unTypedWindow = <any> window;
unTypedWindow.jQuery = jQuery;
unTypedWindow.$ = jQuery;

unTypedWindow.Quill = Quill;

//load global components
Vue.component('loading', LoadingComponent);
Vue.component('time-estimate', TimeEstimateComponent);
Vue.component('quill-editor', QuillComponent);
Vue.component('add-content-component', AddContentComponent);
Vue.component('segment-viewer', SegmentViewerComponent);


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