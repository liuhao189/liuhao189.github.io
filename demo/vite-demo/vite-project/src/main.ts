import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')


import('./test').then(_ => {
  console.log(_);
}).catch(err => {
  console.error(err);
})

import imgUrl from './assets/min.jpeg';

console.log(imgUrl);