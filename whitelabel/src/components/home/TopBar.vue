<template>
  <section class="topbar-four">
    <div class="container">
      <div class="topbar-four__inner">
        <div class="topbar-four__logo">
          <a href="/">
            <img src="@/assets/images/logo.png" alt="Karoons HTML" width="300" />
          </a>
        </div>
        <!-- /.main-header__logo -->
        <div class="topbar-four__search">
          <form @submit.prevent="searchProducts" class="d-flex">
            <input v-model="searchText" @input="debouncedHandleInput" @focus="showSuggestions = true" @blur="handleBlur"
              type="search" class="search-input"
              placeholder="DIGITE O QUE ESTÁ BUSCANDO..." autocomplete="off" />
            <button type="submit">
              <i class="flaticon-search"></i>
            </button>
          </form>
        </div>
        <ul class="list-unstyled topbar-four__info">
          <li>
            <div class="topbar-four__info__language">
              <a href="#"><i class="flaticon-language"></i>Idioma</a>
              <div class="topbar-four__info__language__dropdown">
                <a href="#">Português</a>
                <a href="#">Español</a>
              </div>
            </div>
          </li>
          <li>
            <div class="topbar-four__info__currency" @mouseenter="fetchExchangeRates">
              <a href="#"><i class="flaticon-dollar"></i>Cotação</a>
              <div class="topbar-four__info__currency__dropdown">
                <template v-if="currencies.length">
                  <a v-for="currency in currencies" :key="currency.target_currency.id">
                    <img v-if="currency.target_currency.symbol === 'BRL'" src="@/assets/images/bandeira-brasil.webp"
                      alt="Brasil" class="flag-icon" />
                    <img v-if="currency.target_currency.symbol === 'PYG'" src="@/assets/images/bandeira-paraguai.webp"
                      alt="Paraguai" class="flag-icon" />
                    {{ currency.source_currency.symbol }} -> {{ currency.target_currency.symbol }}:
                    {{ currency.tax }}
                  </a>
                </template>
                <template v-else>
                  <span>Loading...</span>
                </template>
              </div>

            </div>
          </li>
          <!-- Uncomment and modify for login/register if needed -->
          <!-- <li class="topbar-four__info__item">
              <i class="flaticon-user-two"></i>
              <a href="login.html">Entrar</a><span>/</span><a href="checkout.html">Registre-se</a>
          </li> -->
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
const currencies = ref([]); // inicializando currencies como um array
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
    return;
  }

  let apiUrl = `https://api-wl.agcodecraft.com/api/public/products?text=${searchValue}&order_by=p_text&order=asc`;

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

const fetchExchangeRates = async () => {
  if (currencies.value.length) return; // Avoid refetching if data is already loaded

  try {
    const response = await axios.get('https://api-wl.agcodecraft.com/api/public/exchange-rates');
    currencies.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar as cotações:', error);
  }
};
</script>

<style>
.search-input::placeholder {
  font-size: 16px;
  color: #888787;
}

.topbar-four__info__language,
.topbar-four__info__currency,
.topbar-four__info__item {
  border: 1px solid rgb(206, 54, 66);
  ;
  border-radius: 15px;
  padding: 0px 6px;
  margin: 0 5px;
  white-space: nowrap;
  display: inline-block;
}

.topbar-four__info__language a,
.topbar-four__info__currency a,
.topbar-four__info__item a {
  color: inherit;
  text-decoration: none;
}

.topbar-four__info__item span {
  margin: 0 3px;
}

.topbar-four__info__currency {
  position: relative;
}

.topbar-four__info__currency__dropdown {
  display: none;
  position: absolute;
  background: white;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  z-index: 10;
}

.topbar-four__info__currency:hover .topbar-four__info__currency__dropdown {
  display: block;
}

.topbar-four__info__language {
  visibility: hidden;
  /* Ocultar o botão de idioma */
}

.flag-icon {
  width: 20px;
  height: auto;
  margin-right: 5px;
  vertical-align: middle;
}
</style>