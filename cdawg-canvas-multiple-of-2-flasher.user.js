// ==UserScript==
// @name         CDawg Canvas Stack Multiple of 2 Flasher
// @namespace    https://canvas.cdawgva.com
// @version      2
// @description  Flashes the entire page red if the palette reaches a multiple of 2.
// @author       VanillaSixtySix
// @match        https://canvas.cdawgva.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cdawgva.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const observer = new MutationObserver(check);
    observer.observe(document, {
        childList: true,
        subtree: true,
        characterData: true,
    });

    let lastStackCount = null;
    let isFlashing = false;

    function check() {
        const stackInfo = getStackInfo();
        if (!stackInfo) return;

        const { stack, maxStack } = stackInfo;

        if (lastStackCount === stack) return;
        if (lastStackCount === null) {
            lastStackCount = stack;
            return;
        }
        if (lastStackCount > stack) {
            lastStackCount = stack;
            return;
        }
        lastStackCount = stack;

        if (stack % 2 === 0) {
            flashRedOverlay(2);
            if (console && console.debug) {
                console.debug(`[Canvas Flasher] Multiple of 2: ${stack}/${maxStack}`);
            }
        }
    }

    function getStackInfo() {
        const candidate = Array.from(document.querySelectorAll('small span'))
        .find((e) => /of\s*\d+/.test(e.innerText) || /seconds/i.test(e.innerText));
        if (!candidate) return null;
        if (/seconds/i.test(candidate.innerText)) return null;
        const m = candidate.innerText.match(/(\d+)\s*of\s*(\d+)/i);
        if (!m) return null;
        const stack = parseInt(m[1], 10);
        const maxStack = parseInt(m[2], 10);
        if (!Number.isFinite(stack) || !Number.isFinite(maxStack)) return null;
        candidate.id = 'stack-text';
        return { stack, maxStack };
    }

    function flashRedOverlay(times = 2) {
        if (isFlashing) return;
        isFlashing = true;
        const id = 'stack-flash-overlay';
        let overlay = document.getElementById(id);
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = id;
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'red';
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
            overlay.style.zIndex = '2147483647';
            overlay.style.transition = 'opacity 180ms ease';
            (document.body || document.documentElement).appendChild(overlay);
        }

        let count = 0;

        const doOneFlash = () =>
        new Promise((resolve) => {
            overlay.style.opacity = '0.75';
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(resolve, 200);
            }, 180);
        });

        (async () => {
            try {
                while (count < times) {
                    await doOneFlash();
                    count++;
                    if (count < times) await wait(120);
                }
            } finally {
                isFlashing = false;
            }
        })();
    }

    function wait(ms) {
        return new Promise((res) => setTimeout(res, ms));
    }
})();
