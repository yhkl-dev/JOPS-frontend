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

/* 监控管理 */
const Zabbix = () => import('@/views/monitor/zabbix')

/* 资源管理 */
const Resources = () => import('@/views/resources/Resources')
const WebShellAdmin = () => import('@/views/resources/WebShellAdmin')
const ProductList = () => import('@/views/resources/ProductList')

/* 配置中心 */
const Task = () => import('@/views/task/Task')
const Playbook = () => import('@/views/task/Playbook')

/* 巡检报告 */
const ServerReport = () => import('@/views/report/ServerReport')

/* 工单系统*/
const WorkOrderTask = () => import('@/views/workorder/workOrderTask')
const WorkOrderModelManagement = () => import('@/views/workorder/WorkOrderModelManagement')
const workOrderHistory = () => import('@/views/workorder/workOrderHistory')
const workOrderChart = () => import('@/views/workorder/workOrderChart')

/* 项目管理*/
const ProjectList = () => import('@/views/project/ProjectList')

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
      name: '首页',
      meta: { title: '首页', icon: 'dashboard', noCache: true }
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
        name: '个人中心',
        meta: { title: '个人中心', icon: 'user', noCache: true }
      }
    ]
  },
  {
    path: '/users',
    component: Layout,
    redirect: '/users/list',
    name: '用户管理',
    meta: {
      title: '用户管理',
      icon: 'user'
    },
    children: [
      {
        path: 'list',
        component: UserList,
        name: '用户列表',
        meta: { title: '用户列表', icon: 'user' }
      },
      {
        path: 'group',
        component: GroupList,
        name: '角色',
        meta: { title: '角色', icon: 'solution' }
      },
      {
        path: 'group/groupPermission',
        component: GroupPermissionList,
        name: '权限列表',
        meta: { title: '权限列表', icon: 'user' },
        hidden: true
      }
    ]
  },
  {
    path: '/monitor',
    component: Layout,
    name: '监控管理',
    meta: {
      title: '监控管理',
      icon: 'user'
    },
    children: [
      {
        path: 'zabbix',
        component: Zabbix,
        name: 'zabbix',
        meta: { title: 'zabbix', icon: 'user' }
      }
    ]
  },
  {
    path: '/project_management',
    component: Layout,
    name: '项目管理',
    meta: {
      title: '项目管理',
      icon: 'project'
    },
    children: [
      {
        path: 'project_list',
        component: ProjectList,
        name: '项目列表',
        meta: { title: '项目列表', icon: 'project' }
      }
    ]
  },
  {
    path: '/workorder',
    component: Layout,
    name: '工单',
    meta: {
      title: '工单',
      icon: 'order'
    },
    children: [
      {
        path: 'my_workorder',
        component: WorkOrderTask,
        name: '工单列表',
        meta: { title: '工单列表', icon: 'order' }
      },
      {
        path: 'work_order_model_manage',
        component: WorkOrderModelManagement,
        name: '模板管理',
        meta: { title: '模板管理', icon: 'order' }
      },
      {
        path: 'work_order_history',
        component: workOrderHistory,
        name: '工单历史',
        meta: { title: '工单历史', icon: 'order' }
      },
      {
        path: 'work_order_chart',
        component: workOrderChart,
        name: '工单历史趋势',
        meta: { title: '工单历史趋势', icon: 'order' }
      }
    ]
  },
  {
    path: '/resources',
    component: Layout,
    name: '资源管理',
    meta: {
      title: '资源管理',
      icon: 'user'
    },
    children: [
      {
        path: 'resourceList',
        component: Resources,
        name: '资源列表',
        meta: { title: '资源列表', icon: 'user' }
      },
      {
        path: 'product',
        component: ProductList,
        name: '业务线',
        meta: { title: '业务线', icon: 'list', affix: true }
      },
      {
        path: 'webssh',
        component: WebShellAdmin,
        name: 'webssh',
        meta: { title: 'Webssh', icon: 'Webssh', affix: true }
      }
    ]
  },
  {
    path: '/report',
    component: Layout,
    name: '智能运维',
    meta: {
      title: '智能运维',
      icon: 'documentation'
    },
    children: [
      {
        path: 'server_report',
        component: ServerReport,
        name: 'serverreport',
        meta: { title: '运维报告', icon: 'documentation' }
      }
    ]
  },
  {
    path: '/task',
    component: Layout,
    redirect: '/task/task_list',
    name: '配置中心',
    meta: {
      title: '配置中心',
      icon: 'task'
    },
    children: [
      {
        path: 'task_list',
        component: Task,
        name: 'task_list',
        meta: { title: '任务列表', icon: 'task' }
      },
      {
        path: 'playbook',
        component: Playbook,
        name: 'playbook',
        meta: { title: 'Playbook', icon: 'task', affix: true }
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

