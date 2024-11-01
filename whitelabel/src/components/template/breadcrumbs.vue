<template>
  <nav v-if="!isHomePage" aria-label="breadcrumb">
    <ul class="breadcrumb">
      <li 
        v-for="(crumb, index) in breadcrumbs" 
        :key="index" 
        class="breadcrumb-item"
      >
        <router-link 
          v-if="index !== breadcrumbs.length - 1" 
          :to="crumb.to" 
          class="breadcrumb-link"
        >
          {{ crumb.breadcrumb }}
        </router-link>
        <span v-else class="breadcrumb-text">{{ crumb.breadcrumb }}</span>
      </li>
    </ul>
  </nav>
</template>

<script>
import { useRoute } from 'vue-router';
import { ref, watchEffect, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'Breadcrumbs',
  setup() {
    const route = useRoute();
    const breadcrumbs = ref([]);
    const categories = ref([]);
    const isHomePage = ref(false); 

    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://api-genove.agcodecraft.com/api/public/categories');
        categories.value = response.data;
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };

    watchEffect(() => {
      console.log('Current path:', route.path);
      isHomePage.value = route.path === '/';  

      const matchedBreadcrumbs = [];
      const categorySlug = route.params.categoriaSlug;
      const departmentSlug = route.params.departamentoSlug;

      if (!categories.value.length) return;  

      if (departmentSlug) {
        const category = categories.value.find(cat => cat.slug === categorySlug);
        if (category) {
          const department = category.departments.find(dep => dep.slug === departmentSlug);
          if (department) {
            matchedBreadcrumbs.push({
              breadcrumb: 'Página Inicial', 
              to: '/'
            });
            matchedBreadcrumbs.push({
              breadcrumb: category.name,
              to: `/produtos/${categorySlug}`
            });
            matchedBreadcrumbs.push({
              breadcrumb: department.name, 
              to: `/produtos/${categorySlug}/${departmentSlug}`
            });
          }
        }
      } else if (categorySlug) {
        const category = categories.value.find(cat => cat.slug === categorySlug);
        if (category) {
          matchedBreadcrumbs.push({
            breadcrumb: 'Página Inicial', 
            to: '/'
          });
          matchedBreadcrumbs.push({
            breadcrumb: category.name,
            to: `/produtos/${categorySlug}`
          });
        }
      }

      breadcrumbs.value = matchedBreadcrumbs; 
    });

    onMounted(fetchCategories);

    return { breadcrumbs, isHomePage };
  }
};
</script>

<style scoped>
.breadcrumb {
  list-style: none;
  display: flex;
  align-items: center;
  padding: 0;
  font-size: 12px; /* Diminuir o tamanho da fonte */
  color: #aaa; /* Cor de texto mais clara */
  max-width: 1400px; /* Largura máxima de 1500px */
  margin: 0 auto; /* Centraliza o contêiner, mantendo-o à esquerda */
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-link {
  color: #aaa; /* Cor mais suave */
  text-decoration: none;
  transition: color 0.3s; /* Transição suave na cor */
}

.breadcrumb-link:hover {
  color: #555; /* Cor mais escura ao passar o mouse */
  text-decoration: underline; /* Mantenha o sublinhado ao passar o mouse */
}

.breadcrumb-text {
  color: #aaa; /* Manter a mesma cor do link */
}
</style>
