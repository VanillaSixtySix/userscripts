// ==UserScript==
// @name         CDawg Canvas Stack Multiple of 2 Flasher
// @namespace    https://canvas.cdawgva.com
// @version      1
// @description  Flashes the entire page red if the palette reaches a multiple of 2.
// @author       VanillaSixtySix
// @match        https://canvas.cdawgva.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cdawgva.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    (new MutationObserver(check)).observe(document, { childList: true, subtree: true, characterData: true });

    let lastStackCount = 0;

    function check(upperMutationList, upperObserver) {
        const stackTextElem = [...document.querySelectorAll('small span')].filter(e => e.innerText.includes('of 6') || e.innerText.includes('seconds'))[0];
        if (!stackTextElem) return;
        stackTextElem.id = 'stack-text';
        const stackMatch = /(\d)+ of (\d)+/;
        const matches = stackTextElem.innerText.match(stackMatch);
        if (!matches) {
            // Possibly on cooldown, ignore
            return;
        }
        const stack = parseInt(matches[1]);
        const maxStack = parseInt(matches[2]);

        if (lastStackCount === stack) return;
        if (lastStackCount == null) {
            lastStackCount = stack;
            return;
        }
        if (lastStackCount > stack) {
            // Placing pixels, do not flash
            lastStackCount = stack;
            return;
        }
        lastStackCount = stack;

        if (stack % 2 === 0) {
            console.log('MULTIPLE of 2!');
            flashRedOverlay(2);
        }

        console.log('Current stack count: ' + stack);
        console.log('Palette max: ' + maxStack);
    }

    function flashRedOverlay(times) {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'red';
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '999999';
        overlay.style.transition = 'opacity 0.2s ease';
        document.body.appendChild(overlay);

        let count = 0;
        function doFlash() {
            overlay.style.opacity = '0.7';
            setTimeout(() => {
                overlay.style.opacity = '0';
                count++;
                if (count < times) {
                    setTimeout(doFlash, 200);
                } else {
                    setTimeout(() => overlay.remove(), 300);
                }
            }, 200);
        }
        doFlash();
    }
})();
