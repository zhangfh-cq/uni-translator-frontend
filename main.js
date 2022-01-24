import Vue from 'vue';
import App from './App';
import CONFIG from '@/config/config.js';
import utils from '@/utils/utils.js';

CONFIG.UNI = uni;
Vue.prototype.CONFIG = CONFIG;
Vue.prototype.utils = utils;

App.mpType = 'app';

const app = new Vue({
	...App
});
app.$mount();
