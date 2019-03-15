"use strict";
import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

import vuxlogin from '../page/vux/login';
import homepage from '../page/application/homepage.vue';
import workItem from '../page/application/worker.vue';
import projectList from '../page/application/projectList.vue';
import approval from '../page/application/approval.vue';
import processes from '../page/application/processes.vue';
import information from '../page/application/information.vue';
import username from '../page/application/username.vue'
//异步加载组件
// const date = r => require.ensure([], () => r(require('../page/demo/date.vue')), 'chunkname1')
// const vuxlogin = r => require.ensure([], () => r(require('../page/vux/login')), 'chunkname1')


//用ui组件
export default new Router({
  // mode:"history",
  //路由配置
  routes: [
    /***测试首页 */
    {
      path: '/vuxlogin',
      name: 'vuxlogin',
      component: vuxlogin
    },
    {
      path: '/',
      component: homepage
    },
    {
      path: '/workItem',
      component: workItem,
      name: 'workItem'
    },
    {
      path: '/projectList',
      component: projectList,
      name: 'projectList'
    }, 
    {
      path: '/approval',
      component: approval,
      name: 'approval'
    },
    {
        path: '/processes',
        name: 'processes',
        component:processes
    },
    {
      path: '/information',
      name:'information',
      component: information
    },
    {
      path: '/username',
      name: 'username',
      component: username
    }
  ]
})
