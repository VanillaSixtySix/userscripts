// ==UserScript==
// @name         Pxls Random Color Picker
// @namespace    https://pxls.space
// @version      1.0.0
// @description  Randomly picks a new palette color after placing a pixel.
// @author       Vanilla Black <vanilla@f66.dev>
// @match        https://pxls.space/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pxls.space
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    $(window).on('pxls:ack:place', (event, x, y) => {
        [...document.getElementById('palette').children].slice(2)[Math.floor(Math.random() * [...document.getElementById('palette').children].slice(2).length)].click();
    });
})();

