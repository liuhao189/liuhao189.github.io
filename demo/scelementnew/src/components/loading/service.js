import Vue from 'vue';
import LoadingVue from './loading.vue';
import popupUtils from '../../utils/popup';
import afterLeave from '../../utils/after-leave';
import { addClass, removeClass, getStyle } from '../../utils/dom';

const LoadingConstructor = Vue.extend(LoadingVue);

const defaults = {
  text: null,
  fullscreen: true,
  body: false,
  lock: false,
  customerClass: '',
};

let fullScreenLoading;

LoadingConstructor.prototype.originalPosition = '';
LoadingConstructor.prototype.originalOverflow = '';

LoadingConstructor.prototype.close = function () {
  if (this.fullscreen) {
    fullScreenLoading = undefined;
  }
  afterLeave(this, () => {
    const target = this.fullscreen || this.body ? document.body : this.target;
    removeClass(target, 'el-loading-parent--relative');
    removeClass(target, 'el-loading-parent--hidden');
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
    this.$destory();
  }, 300);
  this.visible = false;
};

const addStyle = (options, parent, instance) => {
  const maskStyle = {};
  if (options.fullscreen) {
    const parentEl = document.body;
    instance.originalPosition = getStyle(parentEl, 'position');
    instance.originalOverflo = getStyle(parentEl, 'overflow');
    maskStyle.zIndex = popupUtils.nextZIndex();
  } else if (options.body) {
    instance.originalPosition = getStyle(document.body, 'position');
    ['top', 'left'].forEach((prop) => {
      const scroll = prop === 'top' ? 'scrollTop' : 'scrollLeft';
      maskStyle[prop] = `${options.target.getBoundingClientRect()[prop] + document.body[scroll] + document.documentElement[scroll]}px`;
    });
    ['height', 'width'].forEach((prop) => {
      maskStyle[prop] = `${options.target.getBoundingClientRect()[prop]}px`;
    });
  } else {
    instance.originalPosition = getStyle(parent, 'position');
  }

  Object.keys(maskStyle).forEach((prop) => {
    instance.$el.style[prop] = maskStyle[prop];
  });
};

const Loading = (options = {}) => {
  if (Vue.prototype.$isServer) return;
  options = Object.assign({}, defaults, options);
  if (typeof options.target === 'string') {
    options.target = document.querySelector(options.target);
  }
  options.target = options.target || document.body;
  if (options.target !== document.body) {
    options.fullscreen = false;
  } else {
    options.body = true;
  }
  if (options.fullscreen && fullScreenLoading) {
    return fullScreenLoading;
  }
  const parent = options.body ? document.body : options.target;
  const instance = new LoadingConstructor({
    el: document.createElement('div'),
    data: options,
  });
  addStyle(options, parent, instance);
  if (instance.originalPosition !== 'absolute' && instance.originalPosition !== 'fixed') {
    addClass(parent, 'el-loading-parent--relative');
  }

  if (options.fullscreen && options.lock) {
    addClass(parent, 'el-loading-parent--hidden');
  }

  parent.appendChild(instance.$el);
  Vue.nextTick(() => {
    instance.visible = true;
  });

  if (options.fullscreen) {
    fullScreenLoading = instance;
  }

  return instance;
};

export default Loading;
