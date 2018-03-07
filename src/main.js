/**
 * Created by Jimmy on 2017/5/22.
 */
import Vue from 'vue';
import Router from 'vue-router';
import MuseUI from 'muse-ui';
import App from './app.vue';
import routes from './configs/routes.config';
import 'muse-ui/dist/muse-ui.css';
import 'muse-ui/dist/theme-light.css';
import 'material-design-icons/iconfont/material-icons.css';

Vue.use(MuseUI);
Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: routes
});
router.beforeEach((to,form,next)=>{
    console.log('Before');
    next();
});
router.afterEach((to, from, next) => {
    console.log('After');
});
new Vue({
    el:'#app',
    router,
    render: h => h(App)
});