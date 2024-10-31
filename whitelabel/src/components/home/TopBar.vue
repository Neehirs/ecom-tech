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
            <input
              v-model="searchText"
              @input="debouncedHandleInput"
              @focus="showSuggestions = true"
              @blur="handleBlur"
              type="search"
              class="search-input"
              placeholder="O que você está procurando hoje?"
              autocomplete="off"
            />
            <button type="submit" class="search-button">
              <i class="flaticon-search"></i>
            </button>
          </form>
        </div>
        <ul class="list-unstyled topbar-four__info">
          <li class="topbar-four__info__item">
            <span v-if="currencies.length">
              R$ {{ currencies[0].tax }}  
            </span>
            <span v-else>Carregando...</span>
          </li>
          <li class="topbar-four__info__item">
            testeteste <strong>testeteste</strong> 
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

const searchText = ref('');
const currencies = ref([]);
const selectedLanguage = ref('Português');
const router = useRouter();

const searchProducts = async () => {
  // Adicione a lógica de pesquisa aqui
};

const fetchExchangeRates = async () => {
  try {
    const response = await axios.get('https://api-wl.agcodecraft.com/api/public/exchange-rates');
    currencies.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar as cotações:', error);
  }
};

fetchExchangeRates();
</script>

<style>
.topbar-four {
  background-color: #f8f9fa; /* Cor de fundo clara */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Sombra para dar profundidade */
  padding: 15px 0; /* Espaçamento vertical */
}

.topbar-four__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-input {
  border: 1px solid #ccc;
  border-radius: 25px; /* Bordas arredondadas */
  padding: 10px 20px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #007bff; /* Cor da borda ao focar */
  outline: none; /* Remove o contorno padrão */
}

.search-button {
  background-color: #007bff; /* Cor de fundo do botão */
  color: white;
  border: none;
  border-radius: 25px; /* Bordas arredondadas */
  padding: 10px 15px;
  margin-left: 10px; /* Espaço entre o campo de pesquisa e o botão */
  cursor: pointer; /* Cursor de ponteiro para indicar que é clicável */
  transition: background-color 0.3s;
}

.search-button:hover {
  background-color: #0056b3; /* Cor de fundo ao passar o mouse */
}

.topbar-four__info__item {
  font-size: 18px;
  margin-left: 20px;
  display: flex;
  align-items: center; /* Centraliza verticalmente */
}

.topbar-four__info__item strong {
  font-weight: bold;
}

@media (max-width: 768px) {
  .topbar-four__inner {
    flex-direction: column; /* Layout em coluna em telas pequenas */
    align-items: flex-start; /* Alinhamento à esquerda */
  }
  
  .topbar-four__info__item {
    margin-left: 0; /* Remove margem em telas pequenas */
    margin-top: 10px; /* Espaço entre os itens */
  }
}
</style>
