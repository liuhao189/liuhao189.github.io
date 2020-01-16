import Vue from 'vue';
import Loading from './loading.vue';
import { addClass, getStyle, removeClass } from './../../utils/dom';
import popUtils from './../../utils/popup';
import afterLeave from './../../utils/after-leave';

const Mask = Vue.extend(Loading);

const loadingDirective = {};

loadingDirective.install = (Vue) => {
  if (Vue.ptototype.$isServer) return;

  const toggleLoading = (el, binding) => {
    if (binding.value) {
      Vue.nextTick(_ => {
        if (binding.modifiers.fullscreen) {
          el.originalPosition = getStyle(document.body, 'position');
          el.originalOverflow = getStyle(document.body, 'overflow');
          el.maskStyle.zIndex = popUtils.nextZIndex();
          addClass(el.mask, 'is-fullscreen');
          insertDom(document.body, el, binding);
        } else {
          removeClass(el.mask, 'is-fullscreen');
          if (binding.modifiers.body) {
            el.originalPosition = getStyle(document.body, 'position');
            ['top', 'left'].forEach(prop => {
              const scroll = prop === 'top' ? 'scrollTop' : 'scrollLeft';
              el.maskStyle[prop] = el.getBoundingClientRect()[prop] + document.body[scroll] + document.documentElement[scroll] + parseInt(getStyle(document.body, `margin-${prop}`), 10) + 'px';
            });

            ['hight', 'width'].forEach(prop => {
              el.maskStyle[prop] = el.getBoundingClientRect()[prop] + 'px';
            })
            insertDom(document.body, el, binding);
          } else {
            el.originalPosition = getStyle(el, 'position');
            insertDom(el, el, binding);
          }
        }
      })
    } else {
      afterLeave(el.instance, () => {
        if (el.instance.hiding) return;
        el.domVisible = false;
        const target = binding.modifiers.fullscreen || binding.modifiers.body ? document.body : el;
        removeClass(target, 'el-loading-parent--relative');
        removeClass(target, 'el-loading-parent--hidden');
        el.instance.hiding = false;
      }, 300, true);
      el.instance.visible = false;
      el.instance.hiding = true;
    }
  }

  //insert dom
  const insertDom = (parent, el, binding) => {
    if (!el.domVisible && getStyle(el, 'display') !== 'none' && getStyle(el, 'visiblity') !== 'hidden') {
      Object.keys(el.maskStyle).forEach(prop => {
        el.mask.style[prop] = el.maskStyle[prop];
      });

      if (el.originalPosition !== 'absolute' && el.originalPosition !== 'fixed') {
        addClass(parent, 'el-loading-parent--relative');
      }
      if (binding.modifiers.fullscreen && binding.modifiers.lock) {
        addClass(parent, 'el-loading-parent--hidden');
      }
      el.domVisible = true;
      parent.appendChild(el.mask);
      Vue.nextTick(_ => {
        if (el.instance.hiding) {
          el.instance.$emit('after-leave')
        } else {
          el.instance.visible = true;
        }
      })
      el.domInserted = true;
    } else if (el.domVisible && el.instance.hiding === true) {
      el.instance.visible = true;
      el.instance.hiding = false;
    }
  }
  // 
  
  Vue.directive('loading', {
    bind: function (el, binding, vnode) {
      const txtExr = el.getAttribute('element-loading-text');
      const spinnerExr = el.getAttribute('element-loading-spinner');
      const backgroundExr = el.getAttribute('element-loading-background');
      const customClassExr = el.getAttribute('element-loading-custom-class');
      const vm = vnode.context;
      const mask = new Mask({
        el: document.createElement('div'),
        data: {
          text: vm && vm[txtExr] || txtExr,
          spinner: vm && vm[spinnerExr] || spinnerExr,
          background: vm && vm[backgroundExr] || backgroundExr,
          customClass: vm && vm[customClassExr] || customClassExr,
          fullscreen: !!binding.modifiers.fullscreen
        }
      });
      el.instance = mask;
      el.mask = mask.$el;
      el.maskStyle = {};
      binding.value && toggleLoading(el, binding);
    },
    update: function (el, binding) {
      el.instance.setText(el.getAttribute('element-loading-text'));
      if (binding.oldValue !== binding.value) {
        toggleLoading(el, binding);
      }
    },
    unbind: function (el, binding) {
      if (el.domInserted) {
        el.mask && el.mask.parentNode && el.mask.parentNode.removeChild(el.mask);
        toggleLoading(el, { value: false, modifiers: binding.modifiers });
      }
      el.instance && el.instance.$destroy();
    }
  })
}

export default loadingDirective;