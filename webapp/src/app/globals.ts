import jQuery from 'jquery';

//put jquery on global window for debugging,
//workaround for webpack doing this with module number prefixes
let unTypedWindow = <any> window;
unTypedWindow.jQuery = jQuery;
unTypedWindow.$ = jQuery;

export const $ = jQuery;