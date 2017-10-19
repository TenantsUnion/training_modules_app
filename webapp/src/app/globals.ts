import jQuery from 'jquery';
import Quill from 'quill';
import Vue from 'vue';
import {LoadingComponent} from './global_components/loading';
import {TimeEstimateComponent} from './global_components/time_estimate/time_estimate_component';
import * as _ from "underscore";
import axios, {AxiosRequestConfig} from "axios";

//put jquery on global window for debugging,
//workaround for webpack doing this with module number prefixes
let unTypedWindow = <any> window;
unTypedWindow.jQuery = jQuery;
unTypedWindow.$ = jQuery;

unTypedWindow.Quill = Quill;

//load global components
Vue.component('loading', LoadingComponent);
Vue.component('time-estimate', TimeEstimateComponent);


export const $ = jQuery;

// have properties that are empty strings be deleted from ajax requests
// empty model values of '' will be used as invalid values otherwise and default behavior
// of setting value to null is interpreted as string
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