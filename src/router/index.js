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
import CheckSelectPage from "../views/CheckSelectPage";
import PasswordPage from "../views/PasswordPage";
import ValidatePassword from "../views/ValidatePassword";
import InspectPage from "../views/InspectPage";
import JxLogin from "../views/JxLogin";
import JxRegisterPage from "../views/JxRegisterPage";
import InspectHome from "../views/InspectHome";
import SuperLogin from "../views/SuperLogin";
import RegisterInfo from "../views/RegisterInfo";
import ChangeRegisterInfo from "../views/ChangeRegisterInfo";
import Test from "../views/Test";

Vue.use(VueRouter)

const routes = [
    {
        path: '/test',
        component: Test
    },
    {
        path: '/changeRegisterInfo',
        component: ChangeRegisterInfo
    },
    {
        path: '/registerInfo',
        component: RegisterInfo
    },
    {
        path: '/superLogin',
        component: SuperLogin
    },
    {
        path: '/inspectHome',
        component: InspectHome
    },
    {
        path: '/jxRegister',
        component: JxRegisterPage
    },
    {
        path: '/jxLogin',
        component: JxLogin
    },
    {
        path: '/inspectPage',
        component: InspectPage
    },
    {
        path: '/validate/:id/',
        component: ValidatePassword
    },
    {
        path: '/passwordPage',
        component: PasswordPage
    },
    {
        path: '/checkSelectPage',
        component: CheckSelectPage
    },
    {
        path: '/checkPage',
        component: CheckPage
    },
    {
        path: '/checkStatus',
        component: CheckStatus
    },
    {
        path: '/register',
        component: RegisterPage
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/lastpage',
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
    base: '/audit/',
    // base: process.env.BASE_URL,
    routes
    // routes: [
    //     { path: '*',
    //         component: (resolve) => require(['@/page/error/404'], resolve)}
    // ]
})

export default router
