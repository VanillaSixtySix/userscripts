// ==UserScript==
// @name         Pxls Random Color Picker
// @namespace    https://pxls.space
// @version      1.1.0
// @description  Randomly picks a new palette color after placing a pixel.
// @author       Vanilla Black <vanilla@f66.dev>
// @match        https://pxls.space/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pxls.space
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        const palette = [...document.getElementById('palette').children].slice(2);
        let lastColorId = [...document.getElementById('palette').children].slice(2).find(e => e.className.includes('active')).getAttribute('data-idx');

        $(window).on('pxls:ack:place', (event, x, y) => {
            palette[Math.floor(Math.random() * palette.length)].click();
            lastColorId = palette.find(e => e.className.includes('active')).getAttribute('data-idx');
        });
    }, false);
})();
