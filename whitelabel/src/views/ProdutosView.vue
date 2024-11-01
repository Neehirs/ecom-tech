<template>
  <div class="product-page">
    <LoadingSpinner :isLoading="isLoading" />
    <div v-if="currentCategory && currentCategory.departments.length" class="category-sidebar">
      <div>
        <h3 class="category-name">Categorias</h3>
        <ul class="department-list">
          <li v-for="(department, deptIndex) in currentCategory.departments" :key="deptIndex">
            <a href="#" class="department-link" @click.prevent="selectDepartment(department, currentCategory)"
              :class="{ 'selected-department': selectedDepartmentId === department.id }">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="#ffffff"
                style="width: 16px; height: 16px; margin-left: 5px;">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M5.25 4.5l7.5 7.5-7.5 7.5m6-15l7.5 7.5-7.5 7.5" />
              </svg> {{ department.name }}
            </a>
          </li>
        </ul>
      </div>


      <div class="brand-filter">
        <h4 class="marcas-name">Marcas</h4>
        <ul class="brand-list">
          <li v-for="(brand, brandIndex) in brands" :key="brandIndex" class="marca">
            <label>
              <input type="checkbox" :value="brand.id" :checked="selectedBrandIds.includes(brand.id)"
                @change="filterByBrand(brand.id)">
              <span class="check"></span>
              {{ brand.name }}
            </label>
          </li>
        </ul>
      </div>

    </div>
    <div class="product-list-section">
      <div class="header">
        <h2>{{ selectedTitle }}</h2>
        <div class="sort-options">
          <div class="custom-select-wrapper">
            <div class="custom-select">
              <select id="sort" v-model="sortOption">
                <option value="">Classificar</option>
                <option value="valor_venda:asc">Preço Menor</option>
                <option value="valor_venda:desc">Preço Maior</option>
                <option value="nome:asc">Nome: A-Z</option>
                <option value="nome:desc">Nome: Z-A</option>
              </select>
              <svg v-if="!sortOption" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke-width="1.5" stroke="currentColor" class="icon">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M4.5 5.25l7.5 7.5 7.5-7.5m-15 6l7.5 7.5 7.5-7.5" />
              </svg>
            </div>
          </div>
        </div>



      </div>

      <div v-if="isLoading">
        <ProdutosSkeleton :isLoading="isLoading" />
      </div>
      <div v-else-if="productsLoaded && filteredProducts.length === 0">
        <p>Nenhum produto disponível para esta pesquisa.</p>
      </div>

      <div class="product-list">
        <router-link v-for="(product, index) in sortedProducts" :key="index"
          :to="`/produto/${product.slug}?page=${currentPage.value}`" class="product__item" style="max-width: 250px;">
          <div class="product__item__img">
            <img :src="product.imagens[0]?.url || defaultImage" :alt="`Imagem do produto ${product.nome}`"
              class="img-fluid" />
          </div>
          <div class="product__item__content">
            <h4 class="product__item__title">
              <a :href="`/produto/${product.slug}?page=${currentPage.value}`">{{ product.nome }}</a>
            </h4>
            <div class="product__item__code">COD: {{ product.codigo }}</div>
            <div class="product__item__price" v-if="product.tem_estoque">{{ formatarPreco(product.valor_venda) }}</div>
            <small v-if="!product.tem_estoque" class="out-of-stock-tag">INDISPONÍVEL</small>
          </div>
        </router-link>
      </div>


      <div class="pagination-container" v-if="totalPages > 1">
        <button @click="prevPage" :disabled="currentPage === 1" class="pagination-button">
          Anterior
        </button>
        <div class="pagination-numbers">
          <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
            :class="{ active: page === currentPage }">
            {{ page }}
          </button>
          <span v-if="totalPages > visiblePages[visiblePages.length - 1]">...</span>
          <button v-if="currentPage < totalPages - 4" @click="goToPage(totalPages)">{{ totalPages }}</button>
        </div>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-button">
          Próxima
        </button>
      </div>


    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchCategories, fetchBrands, fetchProducts } from '@/services/apiService';

const categories = ref([]);
const filteredProducts = ref([]);
const selectedTitle = ref('Produtos');
const sortOption = ref('');
const defaultImage = require('../assets/images/produto-sem-imagem.png');
const error = ref(null);
const selectedCategoryId = ref(null);
const selectedBrand = ref(null);
const selectedDepartmentId = ref(null);
const searchText = ref('');
const currentPage = ref(1);
const totalPages = ref(1);
const totalProducts = ref(0);
const isLoading = ref(false);
const productsLoaded = ref(false);
const brands = ref([]);
const selectedBrandIds = ref([]);


const route = useRoute();
const router = useRouter();

const currentCategory = computed(() => {
  return categories.value.find(c => c.slug === route.params.categoriaSlug) || null;
});

const goToPage = (page) => {
  router.push({
    name: 'produtos',
    params: {
      categoriaSlug: route.params.categoriaSlug,
      departamentoSlug: route.params.departamentoSlug
    },
    query: {
      ...route.query,
      page: page
    }
  });

  fetchProductsList(page);
};


const nextPage = () => {
  if (currentPage.value < totalPages.value && filteredProducts.value.length > 0) {
    goToPage(currentPage.value + 1);
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1);
  }
};

const formatarPreco = (preco) => {
  const precoNumerico = parseFloat(preco);
  if (isNaN(precoNumerico)) return 'Preço inválido';
  return `U$ ${precoNumerico.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

const selectDepartment = async (department, category) => {
  selectedDepartmentId.value = department.id;
  selectedTitle.value = department.name;
  selectedBrandIds.value = [];

  // Atualiza a URL e o breadcrumb
  await router.push({
    name: 'produtos',
    params: {
      departamentoSlug: department.slug,
      categoriaSlug: category.slug,
    }
  });

  // Recarrega a página e os produtos
  await fetchProductsList(1);
  await fetchBrandsByDepartment(department.slug);
};


const fetchBrandsByDepartment = async (departmentSlug) => {
  try {
    isLoading.value = true;
    const response = await fetch(`https://api-genove.agcodecraft.com/api/public/departments/${departmentSlug}`);
    const data = await response.json();

    if (data.brands && data.brands.length) {
      brands.value = data.brands.map(brand => ({
        id: brand.id,
        name: brand.nome,
        slug: brand.slug
      })).sort((a, b) => a.name.localeCompare(b.name));
    } else {
      console.error("Nenhuma marca encontrada para o departamento");
    }
  } catch (error) {
    console.error("Erro ao buscar marcas", error);
  } finally {
    isLoading.value = false;
  }
};


const selectBrand = async (brand) => {
  if (selectedBrandIds.value.length === brands.value.length) {
    selectedBrandIds.value = [brand.id];
  } else {
    const index = selectedBrandIds.value.indexOf(brand.id);
    if (index > -1) {
      selectedBrandIds.value.splice(index, 1);
    } else {
      selectedBrandIds.value.push(brand.id);
    }
  }


  router.push({
    name: 'produtos',
    params: {
      categoriaSlug: route.params.categoriaSlug,
      departamentoSlug: route.params.departamentoSlug
    },
    query: {
      ...route.query,
      brandSlug: selectedBrandIds.value.join(',')
    }
  });

  goToPage(1);

  fetchProductsList(currentPage.value);
};


const sortedProducts = computed(() => filteredProducts.value);

const fetchCategoriesList = async () => {
  isLoading.value = true;
  try {
    const data = await fetchCategories();
    const sortedCategories = data.sort((a, b) => a.name.localeCompare(b.name));

    sortedCategories.forEach(category => {
      if (category.departments) {
        category.departments.sort((a, b) => a.name.localeCompare(b.name));
      }
    });

    categories.value = sortedCategories;
  } catch (err) {
    error.value = 'Erro ao buscar categorias e departamentos.';
    console.error(error.value, err);
  } finally {
    isLoading.value = false;
  }
};

const fetchBrandsList = async () => {
  isLoading.value = true;
  try {
    const data = await fetchBrands();
    brands.value = data.sort((a, b) => a.name.localeCompare(b.name));

    selectedBrandIds.value = brands.value.map(brand => brand.id);
  } catch (err) {
    error.value = 'Erro ao buscar marcas.';
    console.error(error.value, err);
  } finally {
    isLoading.value = false;
  }
};


const filterByBrand = (brandId) => {
  const index = selectedBrandIds.value.indexOf(brandId);
  if (index > -1) {
    selectedBrandIds.value.splice(index, 1);
  } else {
    selectedBrandIds.value.push(brandId);
  }

  router.push({
    name: 'produtos',
    params: {
      categoriaSlug: route.params.categoriaSlug,
      departamentoSlug: route.params.departamentoSlug
    },
    query: {
      ...route.query,
      brandSlug: selectedBrandIds.value.join(',')
    }
  });

  fetchProductsList(currentPage.value);
};



const fetchProductsList = async (page = 1) => {
  currentPage.value = page;
  isLoading.value = true;
  productsLoaded.value = false;
  window.scrollTo(0, 0);

  try {
    filteredProducts.value = [];

    let orderBy = 'id';
    let order = 'desc';

    if (sortOption.value && sortOption.value.includes(':')) {
      const [sortField, sortOrder] = sortOption.value.split(':');
      orderBy = sortField;
      order = sortOrder;
    }

    const params = {
      text: route.query.text || searchText.value,
      category_id: selectedCategoryId.value,
      department_id: selectedDepartmentId.value,
      brands_ids: selectedBrandIds.value.length ? selectedBrandIds.value.join(',') : null,
      page: currentPage.value,
      order_by: `tem_estoque,${orderBy}`,
      order: `desc,${order}`
    };

    const data = await fetchProducts(params);

    filteredProducts.value = data.data || [];
    totalProducts.value = data.total;
    totalPages.value = Math.ceil(totalProducts.value / 20);
  } catch (err) {
    error.value = 'Erro ao buscar produtos.';
    console.error(error.value, err);
  } finally {
    isLoading.value = false;
    productsLoaded.value = true;
  }
};

const fetchBrandsByCategory = async (categorySlug) => {
  try {
    isLoading.value = true;
    const response = await fetch(`https://api-genove.agcodecraft.com/api/public/categories/${categorySlug}`);
    const data = await response.json();


    if (data.brands && data.brands.length) {
      brands.value = data.brands.map(brand => ({
        id: brand.id,
        name: brand.nome,
        slug: brand.slug
      })).sort((a, b) => a.name.localeCompare(b.name));
    } else {
      console.error("Nenhuma marca encontrada para a categoria");
    }
  } catch (error) {
    console.error("Erro ao buscar marcas", error);
  } finally {
    isLoading.value = false;
  }
};
watch(currentCategory, async (newCategory) => {
  if (newCategory) {
    await fetchBrandsByCategory(newCategory.slug);
  }
});


watch([() => route.params.departamentoSlug, () => route.params.categoriaSlug, () => route.query.page, () => route.query.text],
  async ([departamentoSlug, categoriaSlug, page, text], [oldDepartamentoSlug, oldCategoriaSlug, oldPage, oldText]) => {
    if (categoriaSlug !== oldCategoriaSlug) {
      const categoryItem = categories.value.find(c => c.slug === categoriaSlug);
      selectedCategoryId.value = categoryItem ? categoryItem.id : null;
      selectedTitle.value = categoryItem ? categoryItem.name : 'Produtos';
    }

    if (departamentoSlug !== oldDepartamentoSlug) {
      const departmentItem = currentCategory.value?.departments.find(d => d.slug === departamentoSlug);
      selectedDepartmentId.value = departmentItem ? departmentItem.id : null;
      selectedTitle.value = departmentItem ? departmentItem.name : selectedTitle.value;
    }

    currentPage.value = parseInt(page) || 1;
    searchText.value = text || '';
    await fetchProductsList(currentPage.value);
  });

watch(sortOption, () => {
  fetchProductsList(currentPage.value);
});

onMounted(async () => {
  currentPage.value = parseInt(sessionStorage.getItem('currentPage')) || 1;

  await fetchCategoriesList();
  await fetchBrandsList();

  if (route.params.categoriaSlug) {
    const categoryItem = categories.value.find(c => c.slug === route.params.categoriaSlug);
    selectedCategoryId.value = categoryItem ? categoryItem.id : null;
    selectedTitle.value = categoryItem ? categoryItem.name : 'Produtos';
  }

  if (route.params.departamentoSlug && currentCategory.value) {
    const departmentItem = currentCategory.value.departments.find(d => d.slug === route.params.departamentoSlug);
    selectedDepartmentId.value = departmentItem ? departmentItem.id : null;
    selectedTitle.value = departmentItem ? departmentItem.name : selectedTitle.value;
  }
  if (route.query.brandSlug) {
    selectedBrandIds.value = route.query.brandSlug.split(',').map(slug => parseInt(slug));
  }
  await fetchProductsList(currentPage.value);
});


watch(currentPage, (newPage) => {
  sessionStorage.setItem('currentPage', newPage);
});

const visiblePages = computed(() => {
  let pages = [];
  if (totalPages.value <= 5) {
    pages = Array.from({ length: totalPages.value }, (_, i) => i + 1);
  } else {
    const start = Math.max(1, currentPage.value - 2);
    const end = Math.min(totalPages.value, start + 4);

    pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
  return pages;
});
</script>



<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400&display=swap');

html,
body {
  overflow-x: hidden;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

.brand-filter {
  margin: 20px 0;
}

.size-6 {
  width: 16px;
  height: 16px;
  color: currentColor;
  margin-left: 5px;
}

.custom-select-wrapper {
  position: relative;
}

.custom-select {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.custom-select select {
  appearance: none;
  padding-right: 25px;
  /* Espaço para o ícone */

}

.custom-select .icon {
  position: absolute;
  right: 5px;
 
  pointer-events: none;
  width: 16px;
 
  height: 16px;
}


.brand-list {
  list-style: none;
  padding: 0;
  margin-left: 20px;
}

.marca {
  margin-bottom: 10px;
  position: relative;
  color: #7D7A7A;
  font-weight: 600;
  font-size: large;
  letter-spacing: 1px;
  
}


label {
  cursor: pointer;
  display: flex;
  align-items: center;
}

input[type="checkbox"] {
  display: none;
}

.product__item {
  padding: 20px;
}

.product__item__img {
  padding-left: 20px;
  padding-right: 20px;
}

.check {
  width: 15px;
  height: 15px;
  border-radius: 4px;
  margin-right: 4px;
  position: relative;
  background-color: #FFFFFF;
  box-shadow: 0 0 0 0.5px rgb(32, 211, 112);
  /* Simula a borda mais fina */
  border: none;
  /* Remove a borda original */
}


.check:after {
  content: '';
  position: absolute;
  top: 1px;
  left: 4px;
  width: 4px;
  height: 8px;
  border: solid black;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  display: none;
}

input[type="checkbox"]:checked+.check:after {
  display: block;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}



.product-page {
  display: flex;
  padding: 20px;
  max-width: 1500px;
  margin: 0 auto;
}

.category-name,
.marcas-name {
  text-align: left;
  margin-left: 10px;
  font-weight: 600;
}

.category-sidebar {
  width: 280px;
  padding-top: 20px;
  background: #e6e6e6; /* Cor de identidade */
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  position: relative;
}


.department-list {
  list-style: none;
  padding: 0;
  margin: 0;
}


.category-item {
  position: relative;
  margin-bottom: 12px;
}

.category-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  color: #333;
  text-decoration: none;
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid transparent;
  transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  font-weight: 600;
}

.category-link:hover,
.category-link.active {
  background-color: gray;
  color: #ffffff;
  border-color: gray;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.department-list {
  list-style: none;
  padding: 0;
  margin: 0;
  border-radius: 8px;
  width: 100%;
  margin-top: 8px;
  text-align: left;
}

.department-link {
  display: block;
  padding: 12px 16px;
  color: #2b4430;
  text-decoration: none;
  transition: background 0.3s ease;
}


.department-link:hover {
  background: rgba(204, 204, 204, 0.6); 
}

.selected-department {
  font-weight: bold;
  background-color: rgba(204, 204, 204, 0.8);
  border-radius: 4px;
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.sort-options select {
  padding: 4px 10px;
  font-size: 16px;
  border-radius: 10px;
  background-color: #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 0 0 0.5px rgb(32, 211, 112);
  appearance: none;
  cursor: pointer;
  transition: border-color 0.3s, box-shadow 0.3s;
  color: #827F7F;
  border: none;
}

.sort-options select:hover,
.sort-options select:focus {
  border-color: #5f5f5f;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.category-link i {
  transition: transform 0.3s ease;
}

.product-list-section {
  flex: 1;
  padding: 20px;
  max-width: 100vw;
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
}

.out-of-stock-tag {
  color: #2ECC71;
  font-weight: bold;
  background-color: #f8d7da;
  padding: 3px 6px;
  border-radius: 3px;
  display: inline-block;
  margin-top: 5px;
}

@media (max-width: 768px) {
  .product-list {
    flex-direction: column;
    align-items: center;
  }

  .product-item {
    width: 100%;
    max-width: 300px;
    margin-bottom: 20px;

  }

  .category-sidebar {
    display: none;
  }
}

@media (min-width: 769px) and (max-width: 1200px) {
  .product-item {
    width: 45%;
    max-width: 260px;

  }


}

@media (min-width: 1201px) {
  .product-item {
    width: 22%;
    max-width: 260px;
  }
}
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}

.pagination-button {
  background-color: #2ECC71;
  color: #fff;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.pagination-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination-numbers {
  display: flex;
  align-items: center;
  margin: 0 10px;
}

.pagination-numbers button {
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  padding: 8px;
  margin: 0 5px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.pagination-numbers button:hover {
  background-color: #e0e0e0;
}
.active {
  background-color: #2ECC71; 
  color: #2ECC71;
}
</style>
