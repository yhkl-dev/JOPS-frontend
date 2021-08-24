import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

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
const Layout = () => import('@/views/layout/Layout')
const Login = () => import('@/views/login/Login')
const Page = () => import('@/views/404')

/* users */
const Dashboard = () => import('@/views/dashboard/index')
const UserList = () => import('@/views/users/UserList')
const GroupList = () => import('@/views/users/GroupList')
const GroupPermissionList = () => import('@/views/users/GroupPermissionList')

/* 资源管理 */
const Resources = () => import('@/views/resources/Resources')
const CloudResource = () => import('@/views/resources/cloud/Index')
const CloudServerInstance = () => import('@/views/resources/cloudServer/Index')
// const ProductList = () => import('@/views/resources/ProductList')
const Product = () => import('@/views/product/Index')
/* 项目管理*/
// const ProjectList = () => import('@/views/project/ProjectList')
const Project = () => import('@/views/project/Index')

/* 个人中心 */
const Profile = () => import('@/views/profile')

export const constantRouterMap = [
  {
    path: '/login',
    component: Login,
    hidden: true
  },
  {
    path: '/404',
    component: Page,
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    icon: 'dashboard',
    children: [{
      path: '',
      component: Dashboard,
      name: 'Dashboard',
      meta: { title: 'Dashboard', icon: 'dashboard', noCache: true }
    }]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: Profile,
        name: 'User Center',
        meta: { title: 'User Center', icon: 'user', noCache: true }
      }
    ]
  },
  {
    path: '/users',
    component: Layout,
    redirect: '/users/list',
    name: 'User Manage',
    meta: {
      title: 'User Management',
      icon: 'user'
    },
    children: [
      {
        path: 'list',
        component: UserList,
        name: 'User List',
        meta: { title: 'User List', icon: 'user' }
      },
      {
        path: 'group',
        component: GroupList,
        name: 'Role',
        meta: { title: 'Role', icon: 'solution' }
      },
      {
        path: 'group/groupPermission',
        component: GroupPermissionList,
        name: 'Permission',
        meta: { title: 'Permission List', icon: 'user' },
        hidden: true
      }
    ]
  },
  {
    path: '/project',
    component: Layout,
    name: 'project manage',
    redirect: '/project/index',
    hidden: true,
    meta: {
      title: 'PROJECT MANAGE',
      icon: 'project'
    },
    children: [
      {
        path: 'index',
        component: Project,
        name: 'PROJECT LIST',
        meta: { title: 'PROJECT LIST', icon: 'project' }
      }
    ]
  },
  {
    path: '/product',
    component: Layout,
    redirect: '/product/index',
    hidden: true,
    name: 'product manage',
    meta: {
      title: 'PRODUCT MANAGE',
      icon: 'user'
    },
    children: [
      {
        path: 'index',
        component: Product,
        name: 'product line',
        meta: { title: 'product line', icon: 'list', affix: true }
      }
    ]
  },
  {
    path: '/resources',
    component: Layout,
    name: 'resource manage',
    meta: {
      title: 'RESOURCE MANAGE',
      icon: 'user'
    },
    children: [
      {
        path: 'cloudResource',
        component: CloudResource,
        name: 'cloud resource list',
        meta: { title: 'CLOUD', icon: 'user' }
      },
      {
        path: 'serverResourceList',
        component: CloudServerInstance,
        name: 'SERVER LIST',
        meta: { title: 'SERVER LIST', icon: 'user' }
      },
      {
        path: 'databaseResourceList',
        component: Resources,
        name: 'database resource list',
        meta: { title: 'DATABASE LIST', icon: 'user' }
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

