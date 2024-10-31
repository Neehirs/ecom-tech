import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ProdutoView from '@/views/ProdutoView.vue'
import ProdutosView from '@/views/ProdutosView.vue'
import MarcaProdutosView from '@/views/MarcaProdutosView.vue'
import VendedoresView from '@/views/VendedoresView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { breadcrumb: 'Home' }
  },
  {
    path: '/produto/:slug?',
    name: 'produto',
    component: ProdutoView,
    meta: { breadcrumb: 'Produto' },
    props: route => ({
      slug: route.params.slug
    })
  },
  {
    path: '/produtos/:categoriaSlug?/:departamentoSlug?',
    name: 'produtos',
    component: ProdutosView,
    meta: { breadcrumb: 'Produtos' },
    props: route => ({
      departamentoSlug: route.params.departamentoSlug,
      categoriaSlug: route.params.categoriaSlug,
      text: route.query.text, 
      brandSlug: route.query.brandSlug  
    }),
  },
  {
    path: '/vendedores',
    name: 'vendedores',
    component: VendedoresView,
    meta: { breadcrumb: 'Vendedores' },
    props: true
  },
  {
    path: '/marca/:brandSlug?/:categoriaSlug?',
    name: 'marca',
    component: MarcaProdutosView,
    meta: { breadcrumb: 'Marca' },
    props: route => ({
      brandSlug: route.params.brandSlug,
      categoriaSlug: route.params.categoriaSlug,
    }),
  },
]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router




/* import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ProdutoView from '../views/ProdutoView.vue';
import ProdutosView from '../views/ProdutosView.vue';
import VendedoresView from '../views/VendedoresView.vue';
import MarcaProdutosView from '../views/MarcaProdutosView.vue';
import store from '@/store';
import EspecialView from '@/views/EspecialView.vue';

const routes = [

  
  {
    path: '/vendedores',
    name: 'vendedores',
    component: VendedoresView,
    props: true
  },
  {
    path: '/marca/:brandSlug?/:categoriaSlug?',
    name: 'marca',
    component: MarcaProdutosView,
    props: route => ({
      brandSlug: route.params.brandSlug,
      categoriaSlug: route.params.categoriaSlug,
    }),
  },
  {
    path: '/especial/:brandSlug?/:categoriaSlug?/:departamentoSlug?',
    name: 'especial',
    component: EspecialView,
    props: route => ({
      brandSlug: route.params.brandSlug,
      categoriaSlug: route.params.categoriaSlug,
      departamentoSlug: route.params.departamentoSlug,
    }),
  },
  
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const app = router.app;

  if (app && app.findNameById) {
    if (to.params.categoriaSlug && !isNaN(to.params.categoriaSlug)) {
      to.params.categoriaSlug = app.findNameById(to.params.categoriaSlug, app.categories);
    }

    if (to.params.departamentoSlug && !isNaN(to.params.departamentoSlug)) {
      to.params.departamentoSlug = app.findNameById(to.params.departamentoSlug, app.departments);
    }

    if (to.params.brandSlug && !isNaN(to.params.brandSlug)) {
      to.params.brandSlug = app.findNameById(to.params.brandSlug, app.brands);
    }
  }

  if (from.name) {
    store.dispatch('addRoute', from.fullPath);
  }

  next();
});

export default router;
 */