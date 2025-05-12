import { createRouter, createWebHistory } from 'vue-router';
import Products from '@/Products.vue';
import Profile from "@/Profile.vue";
import LoginPage from "@/LoginPage.vue";
import RegisterPage from "@/RegisterPage.vue";
import {isLoggedIn} from "@/utils/LoginHelper.ts";
import Recipes from "@/Recipes.vue";
import CreateRecipe from "@/CreateRecipe.vue";
import {defineAsyncComponent} from "vue";

const routes = [
    { path: '/', redirect: '/products' },
    { path: '/products', component: Products },
    {
        path: '/profile',
        component: () => import('../Profile.vue')
    },
    { path: '/login', component: LoginPage },
    { path: '/register', component: RegisterPage },
    { path: '/recipes', component: Recipes },
    { path: '/recipes/create', component: () => import('../CreateRecipe.vue')},
    { path: '/recipes/create/choose', component: () => import('../ChooseProducts.vue')}
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    if (!isLoggedIn() && to.path !== '/login' && to.path !== '/register') {
        next('/login');
    } else {
        next();
    }
});

export function changeAppScreenState(page: string) {
    router.push(`/${page}`);
}

export default router;
