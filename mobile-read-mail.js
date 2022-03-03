var state = {
    cancelAdjust: false,
    isAdjusting: false,
    setBodyOpacityTriedCount: 0,
    ADDJUESTED_CLASS: 'lx-adjuested'
};
var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
var isAndroid = /android/i.test(navigator.userAgent);
function getViewPortWidth() {
    var _a, _b;
    var viewPortWidth = ((_a = document.documentElement) === null || _a === void 0 ? void 0 : _a.offsetWidth) || ((_b = document.body) === null || _b === void 0 ? void 0 : _b.offsetWidth);
    if (isIOS) {
        return viewPortWidth - 28;
    }
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
    var result = [];
    function traverseEl(parent) {
        if (!getIsElementNode(parent)) {
            return;
        }
        var childNodes = parent.childNodes;
        childNodes.forEach(function (el) {
            try {
                if (!getIsElementNode(el)) {
                    return;
                }
                var display = getComputedStyle(el).display;
                if (display && display.toLowerCase() !== 'inline') {
                    var scrollWidth = el.scrollWidth;
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
    var defaultUnit = 'px';
    if (!cssSize)
        return defaultUnit;
    var reg = /^[\d\.]+([a-zA-Z]*)$/;
    var match = reg.exec(cssSize);
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
function adjustElFontSize(el, scale, isRoot) {
    var _a;
    if (isRoot === void 0) { isRoot = false; }
    if (!el)
        return;
    var defaultFontSize = '16';
    var inlineFontSize = (_a = el.style) === null || _a === void 0 ? void 0 : _a.fontSize;
    if (inlineFontSize) {
        var unit = getUnitOfCSSSize(inlineFontSize);
        if (!isRoot && unit === 'em') {
            return;
        }
        var newFontSize = getNewScaleSize(inlineFontSize, scale, unit);
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
    var defaultLineheight = '1.6em';
    var inlineLineHeight = (_a = el.style) === null || _a === void 0 ? void 0 : _a.lineHeight;
    if (inlineLineHeight) {
        var unit = getUnitOfCSSSize(inlineLineHeight);
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
    var tagName = el.tagName ? el.tagName.toLowerCase() : '';
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
function adjustElementContent(root, scale) {
    if (scale === void 0) { scale = 1; }
    if (!root || !scale || scale === 1)
        return;
    adjustElFontSize(root, scale, true);
    function traverseEl(parent) {
        if (shouldIgnoreEl(parent)) {
            return;
        }
        specialAdjustEl(root, scale);
        var childNodes = parent.childNodes || [];
        childNodes.forEach(function (el) {
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
    var parent = el;
    while (parent) {
        //@ts-ignore
        if (parent && parent.classList && parent.classList.contains(className)) {
            return parent;
        }
        parent = parent.parentNode;
    }
    return;
}
function adjustElement(el, viewportWidth, adjustContent) {
    if (adjustContent === void 0) { adjustContent = false; }
    if (!el || !viewportWidth)
        return;
    //避免重复处理
    if (getAncestorByClass(el, state.ADDJUESTED_CLASS)) {
        return;
    }
    el.classList.add(state.ADDJUESTED_CLASS);
    var currentElWidth = el.scrollWidth;
    if (currentElWidth > viewportWidth) {
        var scaleVal_1 = (viewportWidth / currentElWidth) - 0.01;
        el.style.zoom = scaleVal_1;
        if (adjustContent) {
            el.style.width = '99.5%';
        }
        setTimeout(function () {
            if (adjustContent) {
                consoleTime("adjustElementContent");
                adjustElementContent(el, scaleVal_1);
                consoleTimeEnd("adjustElementContent");
            }
        }, 16);
    }
}
function adjustTables(viewportWidth) {
    var tables = document.querySelectorAll('table');
    if (tables && tables.length) {
        tables.forEach(function (tableEl) {
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
function consoleLog() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    try {
        console.log.apply(console, args);
    }
    catch (ex) {
        console.error && console.error(ex);
    }
}
function resetViewPort() {
    var viewportMetaEl = document.querySelector('meta[name="viewport"]');
    if (viewportMetaEl) {
        var metaContent = viewportMetaEl.getAttribute('content');
        if (metaContent && metaContent.indexOf('initial-scale=0.') !== -1) {
            viewportMetaEl.content = 'width=device-width, initial-scale=1, maximum-scale=3.0';
        }
    }
}
/**
 *
 * 调整页面内容
 */
function adjustContent(el) {
    if (el === void 0) { el = document.body; }
    try {
        if (isIOS) {
            resetViewPort();
        }
        if (state.isAdjusting) {
            return;
        }
        state.isAdjusting = true;
        var viewportWidth_1 = getViewPortWidth();
        // adjustTables(viewportWidth);
        consoleTime("findWidthElArr");
        var widthArr = findWidthElArr(document.body, viewportWidth_1);
        consoleLog("widthArr", widthArr);
        consoleTimeEnd("findWidthElArr");
        if (widthArr && widthArr.length) {
            widthArr.forEach(function (_a) {
                var el = _a.el;
                // table已处理过
                if (el && el.tagName && el.tagName.toLowerCase() === 'table') {
                    adjustElement(el, viewportWidth_1, true);
                }
                else {
                    adjustElement(el, viewportWidth_1, true);
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
    var body = document.body;
    if (!body) {
        // 有可能在某些情况下死循环，需要判断下次数
        if (state.setBodyOpacityTriedCount > 2) {
            state.setBodyOpacityTriedCount = 0;
            return;
        }
        //如果body不存在
        setTimeout(function () {
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
        var styleEl = document.createElement('style');
        var cssTextEl = document.createTextNode(cssText);
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
    addStyleEl('.minfo-letter .bottom-btn a {text-align:center;}');
    if (document.readyState === 'complete') {
        consoleLog(new Date(), 'complete event');
        adjustContent(document.body);
    }
    else {
        document.addEventListener('readystatechange', function (ev) {
            consoleLog(new Date(), document.readyState);
            if (document.readyState === 'complete') {
                setTimeout(function () {
                    adjustContent(document.body);
                }, 16);
            }
        });
    }
}
main();