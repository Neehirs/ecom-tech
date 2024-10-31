<template>
  <div class="product-page">
    <LoadingSpinner :isLoading="isLoading" />

    <!-- Lista de Produtos -->

    <div class="product-list-section">
      <!-- Lista de Categorias -->
     <!--  <div class="categories-container" v-if="categories.length > 0">
        <ul class="category-list">
          <li v-for="category in categories" :key="category.id" class="category-item">
            <a @click.prevent="selectCategory(category)" class="category-link"
              :class="{ active: selectedCategory && selectedCategory.id === category.id }">
              {{ category.name }}
            </a>
          </li>
        </ul>
      </div> -->

      <div class="header">
        <h2 class="brand-title">{{ selectedTitle }}</h2>
        <div class="sort-options">
          <div class="custom-select-wrapper">
            <select id="sort" v-model="sortOption">
              <option value="">Filtrar</option>
              <option value="valor_venda:asc">Preço Menor</option>
              <option value="valor_venda:desc">Preço Maior</option>
              <option value="nome:asc">Nome: A-Z</option>
              <option value="nome:desc">Nome: Z-A</option>
            </select>
          </div>
        </div>
      </div>
      <div v-if="filteredProducts.length === 0">
        <p>Nenhum produto disponível para esta marca.</p>
      </div>
      <div v-else class="product-list">
        <router-link v-for="(product, index) in filteredProducts" :key="index" :to="`/produto/${product.slug}?page=${currentPage.value}`"
        class="product__item"
        style="max-width: 250px;">

         <div class="product__item__img">
            <img 
              :src="product.imagens[0]?.url || defaultImage" 
              :alt="`Imagem do produto ${product.nome}`" 
              class="img-fluid" 
            />
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
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LoadingSpinner from '@/components/template/loading-spinner.vue';
import { fetchBrands, fetchProductsByBrandId, fetchCategoriesByBrandId } from '@/services/apiService';

const filteredProducts = ref([]);
const categories = ref([]);
const selectedTitle = ref('Produtos');
const sortOption = ref('');
const defaultImage = require('../assets/images/produto-sem-imagem.png');
const isLoading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const totalProducts = ref(0);
const route = useRoute();
const router = useRouter();
const brandId = ref(null);
const selectedCategory = ref(null);


const fetchCategories = async () => {
  try {
    if (!brandId.value) return;

    const response = await fetch(`https://api-wl.agcodecraft.com/api/public/categories?brand_id=${brandId.value}`);
    const data = await response.json();

    categories.value = data;
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
  }
};


const fetchBrandBySlug = async (brandSlug) => {
  try {
    const brands = await fetchBrands();
    const brand = brands.find(b => b.slug === brandSlug);
    return brand ? { id: brand.id, name: brand.nome } : { id: null, name: '' };
  } catch (error) {
    console.error('Erro ao buscar marcas:', error);
    return { id: null, name: '' };
  }
};

const formatarPreco = (preco) => {
  const precoNumerico = parseFloat(preco);
  return isNaN(precoNumerico) ? 'Preço inválido' : `US$ ${precoNumerico.toFixed(2).replace('.', ',')}`;
};

const fetchProducts = async (page = 1) => {
  currentPage.value = page;
  isLoading.value = true;
  window.scrollTo(0, 0);

  if (!brandId.value) {
    isLoading.value = false;
    return;
  }

  try {
    const params = {
      page: currentPage.value,
      order_by: sortOption.value.split(':')[0] || 'tem_estoque,id',
      order: sortOption.value.split(':')[1] || 'desc,desc',
      category_id: selectedCategory.value ? selectedCategory.value.id : '',
    };

    const response = await fetchProductsByBrandId(brandId.value, params);

    filteredProducts.value = response.data || [];
    totalProducts.value = response.total;
    totalPages.value = Math.ceil(totalProducts.value / 20);
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
  } finally {
    isLoading.value = false;
  }
};



const selectCategory = async (category) => {
  selectedCategory.value = category;

  await router.push({
    name: 'marca',
    params: {
      brandSlug: route.params.brandSlug,
      categoriaSlug: category.slug
    }
  });

  await fetchProducts();
};

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

const goToPage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
    sessionStorage.setItem('currentPage', page);  // Armazena a página atual
    router.push({
      name: 'marca',
      params: {
        brandSlug: route.params.brandSlug,
        categoriaSlug: selectedCategory.value ? selectedCategory.value.slug : null
      },
      query: {
        ...route.query,
        page: page
      }
    });
    fetchProducts(page);
  }
};



const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1);
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1);
  }
};

watch([() => route.params.brandSlug, () => route.params.categoriaSlug, () => route.query.page], 
  async ([brandSlug, categoriaSlug, page], [oldBrandSlug, oldCategoriaSlug, oldPage]) => {
    if (brandSlug !== oldBrandSlug) {
      const brand = await fetchBrandBySlug(brandSlug);
      brandId.value = brand.id;
      selectedTitle.value = brand.name || 'Produtos';
      await fetchCategories();
    }

    if (categoriaSlug) {
      const category = categories.value.find(c => c.slug === categoriaSlug);
      selectedCategory.value = category || null;
    } else {
      selectedCategory.value = null;
    }

    currentPage.value = parseInt(page) || 1;
    await fetchProducts(currentPage.value);
});



watch(sortOption, () => {
  fetchProducts();
});

onMounted(async () => {
  const brand = await fetchBrandBySlug(route.params.brandSlug);
  brandId.value = brand.id;
  selectedTitle.value = brand.name || 'Produtos';

  await fetchCategories();

  if (route.params.categoriaSlug) {
    const category = categories.value.find(c => c.slug === route.params.categoriaSlug);
    if (category) {
      selectedCategory.value = category;
    }
  }

  currentPage.value = parseInt(sessionStorage.getItem('currentPage')) || 1; 
  await fetchProducts(currentPage.value);
});

</script>


<style scoped>
html,
body {
  overflow-x: hidden;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;

}

.categories-container {
  margin-bottom: 20px;
}
.brand-title {
  font-family: 'Oswald', sans-serif;
}
.category-list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  padding: 0;
}

.category-item {
  margin-right: 15px;
  
}

.category-link {
  padding: 10px 15px;
  background-color: #f0f0f0;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  transition: background-color 0.3s ease;
  font-family: 'Oswald', sans-serif;
}

.category-link:hover {
  background-color: gray;
  color: white;
}

.container {
  max-width: 1500px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.product-page {
  display: flex;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
  max-width: 1500px;
  margin: 0 auto;
  font-family: 'Oswald', sans-serif;
}

.category-sidebar {
  width: 280px;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  position: relative;
}

.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
}

.category-item {
  position: relative;
}

.category-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  color: #333;
  text-decoration: none;
  border-radius: 8px;
  margin-bottom: 12px;
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

.category-link i {
  transition: transform 0.3s ease;
}

.department-list {
  list-style: none;
  padding: 0;
  margin: 0;
  position: absolute;
  left: 100%;
  top: 0;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  width: 200px;
  display: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.category-item:hover .department-list {
  display: block;
  opacity: 1;
}

.department-link {
  display: block;
  padding: 10px 16px;
  color: #333;
  text-decoration: none;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.3s ease;
}

.department-link:hover {
  background: #f5f5f5;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
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


.product-item {
  border: 2px solid #e0ccad;
  border-radius: 12px;
  width: 100%;
  max-width: 260px;
  min-width: 260px;
  flex: 1;
  height: auto;
  aspect-ratio: 4 / 7;
  overflow: hidden;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: white;
}

.product-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.product-image-container {
  width: 100%;
  height: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-image {
  width: auto;
  height: 100%;
  object-fit: cover;
  padding-top: 15px;
  max-width: 100%;
  box-sizing: border-box;
}

.product-info {
  height: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.product-name {
  font-size: 18px;
  font-family: 'Lato', sans-serif;
  color: rgb(43, 43, 43);
  margin-bottom: 10px;
  font-weight: 500;
  line-height: 1.5;
  margin-top: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}


.product-price {
  font-size: 28px;
  font-family: 'Lato', sans-serif;
  color: gray;
  margin: 5px 0;
  font-weight: 700;
  margin-top: 10px;
}

.product-code {
  font-size: 16px;
  color: #757575;
  line-height: 1.667;
  margin-top: auto;
  margin-bottom: 15px;
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

.linha-abaixo-titulo {
  height: 4px;
  background-color: #e0e0e0;
  border-radius: 2px;
  width: 100%;
  margin-bottom: 20px;
}

h2 {
  font-size: 2rem;
  color: gray;
  font-weight: bold;
  font-family: 'Lato', sans-serif;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  width: 100%;
  padding: 10px;
  position: relative;
}

.pagination-button {
  padding: 10px 20px;
  margin: 0 5px;
  border: none;
  border-radius: 50px;
  background: linear-gradient(145deg, gray, #C4A77D);
  color: white;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background 0.3s, transform 0.2s;
}

.pagination-button:hover {
  background: linear-gradient(145deg, #C4A77D, gray);
  transform: scale(1.05);
}

.pagination-button:disabled {
  background: #E0D8C1;
  cursor: not-allowed;
  box-shadow: none;
}

.pagination-numbers {
  display: flex;
  align-items: center;
  margin: 0 10px;
}

.pagination-numbers button {
  padding: 10px 15px;
  margin: 0 5px;
  border: 1px solid transparent;
  border-radius: 50px;
  background: #fff;
  color: gray;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background 0.3s, color 0.3s;
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
.pagination-numbers button.active {
  background: gray;
  color: #fff;
}

.pagination-numbers button:hover {
  background: gray;
  color: #fff;
}

@media (max-width: 768px) {
  .category-sidebar {
    display: none;
  }

  .product-page {
    padding: 1rem;
  }

  .pagination-controls {
    flex-direction: column;
  }

  .pagination-controls button {
    min-width: auto;

  }

  .pagination-numbers {
    display: none;
  }

  .pagination-button {
    font-size: 14px;
    padding: 8px 16px;
  }
}


.sort-options select {
  padding: 4px 10px;
  font-size: 16px;
  border-radius: 10px;
  border: 1px solid red;
  background-color: #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  appearance: none;
  cursor: pointer;
  transition: border-color 0.3s, box-shadow 0.3s;
  color: #827F7F
}

.sort-options select:hover,
.sort-options select:focus {
  border-color: #5f5f5f;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  padding: 0 10px;
}

.pagination-controls button {
  padding: 10px 20px;
  margin: 0 8px;
  border: none;
  border-radius: 50px;
  background: linear-gradient(145deg, gray, #C4A77D);
  color: white;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: background 0.3s, transform 0.2s;
  min-width: 100px;
  text-align: center;
}

.pagination-controls button:hover {
  background: linear-gradient(145deg, #C4A77D, gray);
  transform: scale(1.05);
}

.pagination-controls button:disabled {
  background: #E0D8C1;
  cursor: not-allowed;
  box-shadow: none;
}

.pagination-controls span {
  font-size: 16px;
  margin: 0 10px;
  color: #333;
  font-weight: 600;
}


@media (max-width: 768px) {
  .category-sidebar {
    display: none;
  }

  .product-page {
    padding: 1rem;
  }

  .pagination-controls {
    flex-direction: column;
  }

  .pagination-controls button {
    min-width: auto;

  }
}


.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-left-color: gray;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
