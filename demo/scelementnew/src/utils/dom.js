/* eslint-disable */
import Vue from 'vue';

const isServer = Vue.prototype.$isServer;

export const hasClassList = (function () {
  const bodyEl = document.body;
  return !!bodyEl.classList;
}());

export function addClass(el, cls) {
  if (!el) return;
  let curClass = el.className;
  const classes = (cls || '').split(' ');
  for (let i = 0, j = classes.length; i < j; ++i) {
    const clsName = classes[i];
    if (!clsName) continue;
    if (el.classList) {
      el.classList.add(clsName);
    } else if (!hasClass(el, clsName)) {
      curClass += ` ${clsName}`;
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
}

export function hasClass(el, cls) {
  if (!el || !cls) return false;
  if (cls.indexOf(' ') !== -1) {
    throw new Error('className should not contain space!');
  }
  if (el.classList) {
    return el.classList.contains(cls);
  }
  return (` ${el.className} `).indexOf(` ${cls} `) > -1;
}

export function removeClass(el, cls) {
  if (!el || !cls) return;
  const classes = cls.split(' ');
  let curClass = ` ${el.className} `;
  for (let i = 0, j = classes.length; i < j; ++i) {
    const curClassName = classes[i];
    if (el.classList) {
      el.classList.remove(curClassName);
    } else if (hasClass(el, curClassName)) {
      curClass = curClass.replace(new RegExp(curClassName, 'g'), '');
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
}

export function getStyle(element, styleName) {
  if (isServer) return;
  if (!element || !styleName) return null;
  try {
    const computed = document.defaultView.getComputedStyle(element, '');
    return element.style[styleName] || computed ? computed[styleName] : null;
  } catch (e) {
    return element.style[styleName];
  }
}
