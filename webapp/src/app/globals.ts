import jQuery from 'jquery';
import Quill from 'quill';
import Vue from 'vue';
import {LoadingComponent} from './global_components/loading';
import {TimeEstimateComponent} from './global_components/time_estimate/time_estimate_component';

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