import Vue from 'vue';
import VueRouter from 'vue-router';
import CurrencyConverter from '@/components/CurrencyConverter.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'converter',
    component: CurrencyConverter,
  },
  {
    path: '/portfolio',
    name: 'portfolio',
    component: () => import('@/components/CurrencyPortfolio.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
