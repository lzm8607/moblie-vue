/**
 * Created by Jimmy on 2017/5/22.
 */
const Index = r => require.ensure([], () => r(require('../views/index.vue')), 'index');
const Home = r => require.ensure([], () => r(require('../views/home.vue')), 'home');
const DataList = r => require.ensure([], () => r(require('../views/home/datalist.vue')), 'home');
const PeopleList = r => require.ensure([], () => r(require('../views/home/personlist.vue')), 'home');
const CarList = r => require.ensure([], () => r(require('../views/home/carlist.vue')), 'home');
const routes = [
    {path: '/',redirect:{name:'index'}},
    {path: '/index', component: Index, name: 'index'},
    {path: '/home', component: Home, name: 'home',redirect:{name:'dlist'},children:[
        {path: '/home/dlist', component: DataList, name: 'dlist'},
        {path: '/home/plist', component: PeopleList, name: 'plist'},
        {path: '/home/clist', component: CarList, name: 'clist'},
    ]},
    // {path: '/index', component: Index, name: 'index',redirect: {name: 'home'},children:[
    //     {path: '/index/home', component: Home, name: 'home'},
    //     {
    //         path: '/index/user', component: User, name: 'user',
    //         children: [{path: '/index/user/add', component: UserAdd, name: 'add'}]
    //     },
    //     {path: 'index/other', component: UserAdd, name: 'other'},
    // ]},


];
export default routes;