import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
const MyFile = resolve => require(['@/components/myFile/index'], resolve);
const VvCircle = resolve => require(['@/components/vvCircle/index'], resolve);
const More = resolve => require(['@/components/vvCircle/more'], resolve);
const MyTeam = resolve => require(['@/components/myTeam/index'], resolve);
const Edit = resolve => require(['@/components/edit/index'], resolve);
const Classif = resolve => require(['@/components/classif/index'], resolve);
const Diary = resolve => require(['@/components/setting/diary'], resolve);
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      redirect:'/myfile',
      children:[
      	{
      	  path: '/myfile',
          name: 'MyFile',
          component: MyFile,
      	},
      	{
      	  path: '/vvcircle',
          name: 'VvCircle',
          component: VvCircle,
      	},
      	{
      	  path: '/myteam',
          name: 'MyTeam',
          component: MyTeam,
      	},
        {
          path: '/edit',
          name: 'Edit',
          component: Edit,
        },
        {
          path: '/more',
          name: 'More',
          component: More,
        },
        {
          path: '/classif',
          name: 'Classif',
          component: Classif,
        },
        {
          path: '/diary',
          name: 'Diary',
          component: Diary,
        },
      ]
    }
  ]
})
