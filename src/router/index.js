import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import ss from "../views/ss"
import AuditPage from "../views/AuditPage";
import LastPage from "../views/LastPage";
import Login from "../views/Login";

Vue.use(VueRouter)

const routes = [
    {
        path:'/login',
        component: Login
    },
    {
        path:'/lastpage',
        component: LastPage
    },
    {
        path: '/auditpage',
        component: AuditPage
    },
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/ss',
        component: ss
    },
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
