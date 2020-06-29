import Vue from 'vue'
import Router from 'vue-router'
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading
Vue.use(Router)
/* Layout */
import Layout from '../views/layout/Layout'
/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [{
  path: '/login',
  component: () => import('@/views/login/index'),
  hidden: true
}, {
  path: '/404',
  component: () => import('@/views/404'),
  hidden: true
}, {
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  name: 'Little Life',
  hidden: true,
  children: [{
    path: 'dashboard',
    component: () => import('@/views/dashboard/index')
  }]
}, {
  path: '/person',
  component: Layout,
  children: [{
    path: 'index',
    name: '个人资料',
    component: () => import('@/views/person/index'),
    meta: {
      title: '个人资料',
      icon: 'people'
    }
  }]
}, {
  path: '/anniversary',
  component: Layout,
  children: [{
    path: 'index',
    name: '重要日期',
    component: () => import('@/views/anniversary/index'),
    meta: {
      title: '重要日期',
      icon: 'star'
    }
  }]
}, {
  path: '/cashflow',
  component: Layout,
  children: [{
    path: 'index',
    name: '出入账',
    component: () => import('@/views/cashflow/index'),
    meta: {
      title: '出入账',
      icon: 'form'
    }
  }]
}, {
  path: '/timeline',
  component: Layout,
  children: [{
    path: 'index',
    name: '时间线',
    component: () => import('@/views/timeline/index'),
    meta: {
      title: '时间线',
      icon: 'list'
    }
  }]
}, {
  path: '/wage',
  component: Layout,
  children: [{
    path: 'index',
    name: '工资',
    component: () => import('@/views/wage/index'),
    meta: {
      title: '工资',
      icon: 'money'
    }
  }]
}, {
  path: '/note',
  component: Layout,
  children: [{
    path: 'index',
    name: '记事本',
    component: () => import('@/views/note/index'),
    meta: {
      title: '记事本',
      icon: 'edit'
    }
  }]
}, {
  path: '/password',
  component: Layout,
  children: [{
    path: 'index',
    name: '账号密码',
    component: () => import('@/views/password/index'),
    meta: {
      title: '账号密码',
      icon: 'password'
    }
  }]
}, {
  path: '/recode',
  component: Layout,
  children: [{
    path: 'index',
    name: '重要信息',
    component: () => import('@/views/recode/index'),
    meta: {
      title: '重要信息',
      icon: 'lock'
    }
  }]
}, {
  path: '*',
  redirect: '/404',
  hidden: true
}]
export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})
