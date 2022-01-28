"use strict";
let state = {
    cancelAdjust: false,
    isAdjusting: false,
    setBodyOpacityTriedCount: 0,
    ADDJUESTED_CLASS: 'lx-adjuested',
};
function getViewPortWidth() {
    var _a, _b;
    let viewPortWidth = ((_a = document.documentElement) === null || _a === void 0 ? void 0 : _a.offsetWidth) || ((_b = document.body) === null || _b === void 0 ? void 0 : _b.offsetWidth);
    return viewPortWidth;
}
/**
 *
 * @param root
 * @returns
 */
function findWidthElArr(root, viewportWidth) {
    if (!root || !viewportWidth)
        return [];
    let result = [];
    function traverseEl(parent) {
        if (!getIsElementNode(parent)) {
            return;
        }
        let childNodes = parent.childNodes;
        childNodes.forEach(el => {
            try {
                if (!getIsElementNode(el)) {
                    return;
                }
                let display = getComputedStyle(el).display;
                if (display && display.toLowerCase() !== 'inline') {
                    let scrollWidth = el.scrollWidth;
                    if (scrollWidth > viewportWidth) {
                        result.push({ el: el });
                    }
                    else {
                        traverseEl(el);
                    }
                }
            }
            catch (ex) {
                console.error(ex);
            }
        });
    }
    traverseEl(root);
    return result;
}
/**
 *
 * @param cssSize
 * @returns
 */
function getUnitOfCSSSize(cssSize) {
    const defaultUnit = 'px';
    if (!cssSize)
        return defaultUnit;
    let reg = /^[\d\.]+([a-zA-Z]*)$/;
    let match = reg.exec(cssSize);
    if (!match)
        return defaultUnit;
    return match[1];
}
/**
 *
 * @param el
 * @returns
 */
function getIsElementNode(el) {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) {
        return false;
    }
    return true;
}
/**
 *
 * @param size
 * @param scale
 * @param unit
 * @returns
 */
function getNewScaleSize(size, scale, unit) {
    return Math.floor(Number.parseInt(size) / scale) + unit;
}
/**
 *
 * @param el
 * @param scale
 * @param isRoot
 * @returns
 */
function adjustElFontSize(el, scale, isRoot = false) {
    var _a;
    if (!el)
        return;
    const defaultFontSize = '16';
    const inlineFontSize = (_a = el.style) === null || _a === void 0 ? void 0 : _a.fontSize;
    if (inlineFontSize) {
        let unit = getUnitOfCSSSize(inlineFontSize);
        if (!isRoot && unit === 'em') {
            return;
        }
        let newFontSize = getNewScaleSize(inlineFontSize, scale, unit);
        el.style.fontSize = newFontSize;
    }
    else {
        if (isRoot) {
            el.style.fontSize = getNewScaleSize(defaultFontSize, scale, 'px');
        }
        else {
            el.style.fontSize = 'inherit';
        }
    }
}
/**
 *
 * @param el
 * @param scale
 * @returns
 */
function adujustLineHeight(el, scale) {
    var _a;
    const defaultLineheight = '1.6em';
    const inlineLineHeight = (_a = el.style) === null || _a === void 0 ? void 0 : _a.lineHeight;
    if (inlineLineHeight) {
        let unit = getUnitOfCSSSize(inlineLineHeight);
        if (unit === 'em' || unit === '') {
            return;
        }
        el.style.lineHeight = getNewScaleSize(inlineLineHeight, scale, unit);
    }
    else {
        el.style.lineHeight = defaultLineheight;
    }
}
/**
 *
 * @param el
 */
function adjustWhiteSpcaeAndWordBreak(el) {
    el.style.whiteSpace = 'normal';
    el.style.wordBreak = "break-all";
}
/**
 *
 * @param el
 */
function shouldIgnoreEl(el) {
    if (!getIsElementNode(el)) {
        return true;
    }
    if (el.tagName && ['col', 'colgroup'].indexOf(el.tagName.toLowerCase()) !== -1) {
        return true;
    }
}
/**
 *
 * @param el
 */
function specialAdjustEl(el, scale) {
    let tagName = el.tagName ? el.tagName.toLowerCase() : '';
    switch (tagName) {
        case 'table':
            el.style.tableLayout = 'fixed';
            break;
    }
}
/**
 *
 * @param htmlEl
 * @param scale
 */
function adjustElementContent(root, scale = 1) {
    if (!root || !scale || scale === 1)
        return;
    adjustElFontSize(root, scale, true);
    function traverseEl(parent) {
        if (shouldIgnoreEl(parent)) {
            return;
        }
        specialAdjustEl(root, scale);
        let childNodes = parent.childNodes || [];
        childNodes.forEach(el => {
            try {
                if (shouldIgnoreEl(el)) {
                    return;
                }
                adjustElFontSize(el, scale, false);
                adujustLineHeight(el, scale);
                adjustWhiteSpcaeAndWordBreak(el);
            }
            catch (ex) {
                console.error(ex);
            }
            traverseEl(el);
        });
    }
    traverseEl(root);
}
/**
 *
 * @param el
 * @param className
 * @returns
 */
function getAncestorByClass(el, className) {
    if (!el || !className)
        return;
    let parent = el;
    while (parent) {
        //@ts-ignore
        if (parent && parent.classList && parent.classList.contains(className)) {
            return parent;
        }
        parent = parent.parentNode;
    }
    return;
}
function adjustElement(el, viewportWidth, adjustContent = false) {
    if (!el || !viewportWidth)
        return;
    //避免重复处理
    if (getAncestorByClass(el, state.ADDJUESTED_CLASS)) {
        return;
    }
    el.classList.add(state.ADDJUESTED_CLASS);
    const currentElWidth = el.scrollWidth;
    if (currentElWidth > viewportWidth) {
        let scaleVal = (viewportWidth / currentElWidth) - 0.01;
        el.style.zoom = scaleVal;
        if (adjustContent) {
            el.style.width = '99.5%';
        }
        setTimeout(() => {
            if (adjustContent) {
                consoleTime(`adjustElementContent`);
                adjustElementContent(el, scaleVal);
                consoleTimeEnd(`adjustElementContent`);
            }
        }, 16);
    }
}
function adjustTables(viewportWidth) {
    let tables = document.querySelectorAll('table');
    if (tables && tables.length) {
        tables.forEach(tableEl => {
            adjustElement(tableEl, viewportWidth, true);
        });
    }
}
function consoleTime(tagName) {
    try {
        console.time(tagName);
    }
    catch (ex) {
        console.error && console.error(ex);
    }
}
function consoleTimeEnd(tagName) {
    try {
        console.timeEnd(tagName);
    }
    catch (ex) {
        console.error && console.error(ex);
    }
}
function consoleLog(...args) {
    try {
        console.log(...args);
    }
    catch (ex) {
        console.error && console.error(ex);
    }
}
/**
 *
 * 调整页面内容
 */
function adjustContent(el = document.body) {
    try {
        if (state.isAdjusting) {
            return;
        }
        state.isAdjusting = true;
        const viewportWidth = getViewPortWidth();
        // adjustTables(viewportWidth);
        consoleTime(`findWidthElArr`);
        let widthArr = findWidthElArr(document.body, viewportWidth);
        consoleLog(`widthArr`, widthArr);
        consoleTimeEnd(`findWidthElArr`);
        if (widthArr && widthArr.length) {
            widthArr.forEach(({ el }) => {
                // table已处理过
                if (el && el.tagName && el.tagName.toLowerCase() === 'table') {
                    adjustElement(el, viewportWidth, true);
                }
                else {
                    adjustElement(el, viewportWidth, true);
                }
            });
        }
        ;
    }
    catch (ex) {
        console.error(ex);
    }
    state.isAdjusting = false;
}
/**
 * 设置body的opacity
 * @param {*} val
 */
function setBodyOpacity(val) {
    let body = document.body;
    if (!body) {
        // 有可能在某些情况下死循环，需要判断下次数
        if (state.setBodyOpacityTriedCount > 2) {
            state.setBodyOpacityTriedCount = 0;
            return;
        }
        //如果body不存在
        setTimeout(() => {
            setBodyOpacity(val);
            state.setBodyOpacityTriedCount++;
        }, 0);
    }
    else {
        body.style.opacity = val.toString();
        state.setBodyOpacityTriedCount = 0;
    }
}
function addStyleEl(cssText) {
    try {
        if (!cssText)
            return;
        let styleEl = document.createElement('style');
        let cssTextEl = document.createTextNode(cssText);
        styleEl.appendChild(cssTextEl);
        document.head.appendChild(styleEl);
    }
    catch (ex) {
        console.error(ex);
    }
}
function main() {
    if (window.adjustContentParams && window.adjustContentParams.enable === false) {
        return;
    }
    addStyleEl(`.minfo-letter .bottom-btn a {text-align:center;}`);
    if (document.readyState === 'complete') {
        consoleLog(new Date(), 'complete event');
        adjustContent(document.body);
    }
    else {
        document.addEventListener('readystatechange', (ev) => {
            consoleLog(new Date(), document.readyState);
            if (document.readyState === 'complete') {
                setTimeout(() => {
                    adjustContent(document.body);
                }, 16);
            }
        });
    }
}
main();