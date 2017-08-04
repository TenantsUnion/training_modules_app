import jQuery from 'jquery';
import Quill from 'quill';

//put jquery on global window for debugging,
//workaround for webpack doing this with module number prefixes
let unTypedWindow = <any> window;
unTypedWindow.jQuery = jQuery;
unTypedWindow.$ = jQuery;

unTypedWindow.Quill = Quill;

export const $ = jQuery;