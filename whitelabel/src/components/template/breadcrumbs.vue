<template>
  <nav v-if="!isHomePage" aria-label="breadcrumb">
    <ul class="breadcrumb">
      <li 
        v-for="(crumb, index) in breadcrumbs" 
        :key="index" 
        class="breadcrumb-item"
      >
        <router-link v-if="index !== breadcrumbs.length - 1" :to="crumb.to" class="breadcrumb-link">
          {{ crumb.breadcrumb }}
        </router-link>
        <span v-else class="breadcrumb-text">{{ crumb.breadcrumb }}</span>

        <span v-if="index < breadcrumbs.length - 1" class="breadcrumb-separator"> &gt; </span>
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
      // Log para depuração
      console.log('Current path:', route.path);
      
      isHomePage.value = route.path === '/';  // Verifica se é a página inicial

      const matchedBreadcrumbs = [];

      const categorySlug = route.params.categoriaSlug;
      const departmentSlug = route.params.departamentoSlug;

      if (!categories.value.length) return;  // Verifica se as categorias foram carregadas

      // Se houver um departamento, adicione "Página Inicial" e a categoria
      if (departmentSlug) {
        const category = categories.value.find(cat => cat.slug === categorySlug);
        if (category) {
          const department = category.departments.find(dep => dep.slug === departmentSlug);
          if (department) {
            matchedBreadcrumbs.push({
              breadcrumb: 'Página Inicial', 
              to: '/' // Link para a página inicial
            });
            matchedBreadcrumbs.push({
              breadcrumb: category.name, // Usando o nome da categoria
              to: `/produtos/${categorySlug}` // Link para a categoria
            });
            matchedBreadcrumbs.push({
              breadcrumb: department.name, 
              to: `/produtos/${categorySlug}/${departmentSlug}` // Link para o departamento
            });
          }
        }
      } else if (categorySlug) {
        const category = categories.value.find(cat => cat.slug === categorySlug);
        if (category) {
          matchedBreadcrumbs.push({
            breadcrumb: 'Página Inicial', 
            to: '/' // Link para a página inicial
          });
          matchedBreadcrumbs.push({
            breadcrumb: category.name, // Usando o nome da categoria
            to: `/produtos/${categorySlug}` // Link para a categoria
          });
        }
      }

      breadcrumbs.value = matchedBreadcrumbs; // Atualiza apenas se houver breadcrumbs válidos
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
  font-size: 14px;
  color: #555;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-link {
  color: #808080;
  text-decoration: none;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.breadcrumb-text {
  color: #555;
}

.breadcrumb-separator {
  margin: 0 8px; 
  color: #555; 
}
</style>
