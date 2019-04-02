// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router/index";
import Vuex from "vuex";
import store from "./vuex/store";
import FastClick from "fastclick";
/****下拉刷新 */
import VueScroller from "vue-scroller";
Vue.config.productionTip = false;
//使用es6-promise来解析es6
require("es6-promise").polyfill();

//使用Vuex
Vue.use(Vuex, VueScroller);
FastClick.attach(document.body);
/******引入plugin 插件向vue中注册插件 */
// plugins
import {
    DatetimePlugin,
    LocalePlugin,
    DevicePlugin,
    ToastPlugin,
    AlertPlugin,
    ConfirmPlugin,
    LoadingPlugin,
    WechatPlugin,
    AjaxPlugin,
    AppPlugin
} from "vux";
// Vue.use(DevicePlugin)
Vue.use(ToastPlugin)
// Vue.use(AlertPlugin)
// Vue.use(ConfirmPlugin)
Vue.use(LoadingPlugin);
// Vue.use(WechatPlugin)
Vue.use(AjaxPlugin);
Vue.use(LocalePlugin)
Vue.use(DatetimePlugin);
/* eslint-disable no-new */
router.beforeEach((to, from, next) => {
    console.log(to);
    if (to.meta.requireAuth) {
        //判断该路由是否需要登录权限
        if (localStorage.getItem("loginStatus")) {
            //通过vuex state获取当前的token是否存在
            next();
        } else {
            console.log("参数" + to.fullPath);
            next({
                path: "user/login"
                // query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            });
        }
    } else {
        next();
    }
});

// 配置 axios
Vue.prototype.$http = Vue.prototype.$http.create({
    baseURL:'http://localhost:8080',
    // baseURL:'http://172.16.33.128:8090/project',
    // baseURL: "http://172.20.10.5:8080/project/second/app/timesheet",
    timeout: 5000,
    headers: {
        //'Content-Type': 'application/x-www-form-urlencoded',
        Accept: "application/x-www-form-urlencoded;charset=utf-8",
    },
    transformRequest: [
        function (data) {
            let ret = "";
            for (let it in data) {
                ret += encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
            }
            return ret;
        }
    ],
    // 跨域请求cookie
    withCredentials:true,
    //headers: {'D-REQUEST-FROM': 'wap'}
});

//常见请求实例配置项
Vue.prototype.$http.interceptors.response.use(
    function (response) {
        // 对响应数据做点什么
        return response;
    },
    function (error) {
        // 对响应错误做点什么
        return Promise.reject(error);
    }
);
//每个Vue.js应用的起步都是通过构造函数Vue创建一个Vue的根实例，这种开局方式完全把 App 当成一个组件使用
new Vue({
    el: "#app",
    router,
    store,
    template: "<App/>",
    components: { App }
});