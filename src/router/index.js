import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import AuditPage from "../views/AuditPage";
import LastPage from "../views/LastPage";
import Login from "../views/Login";
import SuperPage from "../views/SuperPage";
import SuperPageInput from "../views/SuperPageInput";
import RegisterPage from "../views/RegisterPage";
import CheckStatus from "../views/CheckStatus";
import CheckPage from "../views/CheckPage";

Vue.use(VueRouter)

const routes = [
    {
      path: '/checkPage',
      component: CheckPage
    },
    {
        path: '/checkStatus',
        component: CheckStatus
    },
    {
        path:'/register',
        component: RegisterPage
    },
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
        path: '/superpage',
        component: SuperPage
    },
    {
        path: '/superpageinput',
        component: SuperPageInput
    },
    // {
    //     path: '/about',
    //     name: 'About',
    //     // route level code-splitting
    //     // this generates a separate chunk (about.[hash].js) for this route
    //     // which is lazy-loaded when the route is visited.
    //     component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    // }
]

const router = new VueRouter({
    mode: 'history',
    base:'/audit/',
    // base: process.env.BASE_URL,
    routes
})

export default router
