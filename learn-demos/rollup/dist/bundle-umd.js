(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.envLib = factory());
})(this, (function () { 'use strict';

    /**
     * 
     * @param {*} x 
     * @param {*} y 
     * @returns 
     */
    function add(x, y) {
        return x + y;
    }

    var main = { add };

    return main;

}));
