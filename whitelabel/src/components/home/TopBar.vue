<template>
  <section class="topbar-four">
    <div class="container">
      <div class="topbar-four__inner">
        <div class="topbar-four__logo">
          <a href="/">
            <img src="@/assets/images/logo.png" alt="Karoons HTML" width="300" />
          </a>
        </div>
        <div class="topbar-four__search">
          <form @submit.prevent="searchProducts" class="d-flex">
            <input v-model="searchText" @input="debouncedHandleInput" @focus="showSuggestions = true" @blur="handleBlur"
              type="search" class="search-input" placeholder="O que você está procurando hoje?" autocomplete="off" />
            <button type="submit" class="search-button">
              <i class="flaticon-search"></i>
            </button>
          </form>
          <div v-if="loading" class="loader"></div>
          <ul v-if="showSuggestions && filteredProducts.length" class="autocomplete-suggestions">
            <li v-for="(product, index) in limitedFilteredProducts" :key="product.id" @click="selectProduct(product)">
              <img :src="product.imagens[0]?.url || ProdutoSemImagem" alt="Product Image" />
              <span v-html="highlightMatch(product.nome)"></span>
            </li>
          </ul>
        </div>
        <ul class="list-unstyled topbar-four__info">
          <li class="topbar-four__info__item">
            <span v-if="currencies.length">
              R$ {{ currencies[0].tax }}
            </span>
            <span v-else>Carregando...</span>
          </li>
          <li class="topbar-four__info__item">
            <router-link :to="{ name: 'vendedores' }" class="sales-team-link">
              <i class="fab fa-whatsapp"></i>
              <strong>Equipe de vendas</strong>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import ProdutoSemImagem from '@/assets/images/produto-sem-imagem.png';


const searchText = ref('');
const filteredProducts = ref([]);
const showSuggestions = ref(false);
const loading = ref(false);
const currencies = ref([]);
const router = useRouter();

const limitedFilteredProducts = computed(() => filteredProducts.value.slice(0, 4));

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const searchProducts = async () => {
  if (searchText.value.trim()) {
    try {
      showSuggestions.value = false;
      await router.push({ name: 'produtos', query: { text: searchText.value } });
    } catch (err) {
      console.error('Erro ao navegar para produtos:', err);
    }
  } else {
    try {
      await router.push({ name: 'home' });
    } catch (err) {
      console.error('Erro ao navegar para home:', err);
    }
  }
};

const fetchProducts = async () => {
  const searchValue = searchText.value.trim();

  if (searchValue.length < 2) {
    return; // Não faz a requisição se o valor de busca for menor que 2 caracteres
  }

  let apiUrl = `https://api-genove.agcodecraft.com/api/public/products?text=${searchValue}&order_by=p_text&order=asc`;

  loading.value = true;
  try {
    const response = await axios.get(apiUrl);
    filteredProducts.value = response.data.data.filter(product => product.tem_estoque);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
  } finally {
    loading.value = false;
  }
};

const debouncedHandleInput = debounce(() => {
  if (searchText.value.trim()) {
    showSuggestions.value = true;
  }
  fetchProducts();
}, 300);

const highlightMatch = (text) => {
  const regex = new RegExp(`(${searchText.value})`, 'gi');
  return text.replace(regex, (match) => `<strong>${match}</strong>`);
};

const selectProduct = (product) => {
  searchText.value = product.nome;
  showSuggestions.value = false;

  try {
    router.push({
      name: 'produto',
      params: { slug: product.slug },
    });
  } catch (err) {
    console.error('Erro ao navegar para o detalhe do produto:', err);
  }
};

const handleBlur = () => {
  setTimeout(() => {
    if (!document.querySelector('.autocomplete-suggestions:hover')) {
      showSuggestions.value = false;
    }
  }, 200);
};

// Fetch exchange rates when the component mounts
const fetchExchangeRates = async () => {
  try {
    const response = await axios.get('https://api-genove.agcodecraft.com/api/public/exchange-rates');
    currencies.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar as cotações:', error);
  }
};

// Execute the function to fetch exchange rates
fetchExchangeRates();
</script>

<style>
.topbar-four {
  background-color: #f8f9fa;
  /* Cor de fundo clara */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  /* Sombra para dar profundidade */
  padding: 15px 0;
  /* Espaçamento vertical */
}

.topbar-four__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-input {
  border: 1px solid #ccc;
  border-radius: 25px;
  /* Bordas arredondadas */
  padding: 10px 20px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #007bff;
  /* Cor da borda ao focar */
  outline: none;
  /* Remove o contorno padrão */
}

.search-button {
  background-color: #007bff;
  /* Cor de fundo do botão */
  color: white;
  border: none;
  border-radius: 25px;
  /* Bordas arredondadas */
  padding: 10px 15px;
  margin-left: 10px;
  /* Espaço entre o campo de pesquisa e o botão */
  cursor: pointer;
  /* Cursor de ponteiro para indicar que é clicável */
  transition: background-color 0.3s;
}

.search-button:hover {
  background-color: #0056b3;
  /* Cor de fundo ao passar o mouse */
}

.topbar-four__info__item {
  font-size: 18px;
  margin-left: 20px;
  display: flex;
  align-items: center;
  /* Centraliza verticalmente */
}

.topbar-four__info__item strong {
  font-weight: bold;
}

.autocomplete-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  z-index: 10;
  max-height: 300px;
  overflow-y: auto;
  padding: 0;
  margin: 0;
  list-style: none;
}

.autocomplete-suggestions li {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #ddd;
}

.autocomplete-suggestions li img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 10px;
}

.autocomplete-suggestions li span {
  font-weight: bold;
  font-size: 18px;
}

.autocomplete-suggestions li span strong {
  color: #C99C5A;
}

.autocomplete-suggestions li:hover {
  background: #f4f4f4;
}

.loader {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #C99C5A 0%, rgba(201, 156, 90, 0) 50%, rgba(201, 156, 90, 0) 100%);
  background-size: 200% 100%;
  animation: loading 1s infinite;
}

@keyframes loading {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: 100% 0;
  }
}

@media (max-width: 768px) {
  .topbar-four__inner {
    flex-direction: column;
    /* Layout em coluna em telas pequenas */
    align-items: flex-start;
    /* Alinhamento à esquerda */
  }

  .topbar-four__info__item {
    margin-left: 0;
    /* Remove margem em telas pequenas */
    margin-top: 10px;
    /* Espaço entre os itens */
  }
}
</style>
