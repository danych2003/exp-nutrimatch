import { createRouter, createWebHistory } from 'vue-router';
import Products from '@/Products.vue';

const routes = [
    { path: '/', redirect: '/products' },
    { path: '/products', component: Products },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
