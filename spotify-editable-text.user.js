// ==UserScript==
// @name         Spotify Editable Text
// @namespace    https://spotify.com/
// @version      0.1
// @description  Makes certain text on Spotify's website editable.
// @author       Vanilla Black <vanilla@f66.dev>
// @match        https://open.spotify.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spotify.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    (new MutationObserver(check)).observe(document, { childList: true, subtree: true });

    function check(changes, observer) {
        if(document.querySelector('[data-testid="entityTitle"] h1')) {
            observer.disconnect();
            let entity = document.querySelector('[data-testid="entityTitle"] h1');
            entity.contentEditable = true;
        }
    }
})();
