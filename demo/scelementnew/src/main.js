import Vue from 'vue';
import './styles/components/loading.scss';
import LoadingService from './components/loading/service';

Vue.config.productionTip = false;

const instance = LoadingService({
  text: '加载中....',
  lock: true,
  customClass: 'my-loading',
  target: '#app'
});