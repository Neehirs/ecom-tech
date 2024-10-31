<template>
  <div class="carrossel-produtos-relacionados" ref="carrosselContainer">
    <div class="row">
      <div class="col-lg-12">
        <div class="titulo-bloco">
          <h2 class="block-title">Sugestões para Você</h2>
        </div>
      </div>
    </div>

    <div class="row position-relative">
      <div class="col-lg-12">
        <button
          class="btn btn-outline-primary btn-sm navigation-arrow left-arrow"
          type="button"
          @click="changePage(currentPage - 1)"
          :disabled="loading || currentPage <= 1"
          aria-label="Move to previous slide"
        >
          <i class="fas fa-chevron-left"></i>
        </button>

        <div class="product-list" :class="{ 'fade-in': isFadingIn, 'fade-out': isFadingOut }">
          <router-link 
            v-for="(product, index) in paginatedProdutos" 
            :key="index"
            :to="`/produto/${product.slug}?page=${currentPage}`"
            class="product__item"
            style="max-width: 250px;"
          >
            <div class="product__item__img">
              <img 
                :src="product.imagens[0]?.url || defaultImage" 
                :alt="`Imagem do produto ${product.nome}`" 
                class="img-fluid" 
              />
            </div>
            <div class="product__item__content">
              <h4 class="product__item__title">
                <a :href="`/produto/${product.slug}?page=${currentPage}`">{{ product.nome }}</a>
              </h4>
              <div class="product__item__code">COD: {{ product.codigo }}</div>
              <div class="product__item__price" v-if="product.tem_estoque">{{ formatarPreco(product.valor_venda) }}</div>
              <small v-if="!product.tem_estoque" class="out-of-stock-tag">INDISPONÍVEL</small>
            </div>
          </router-link>
        </div>

        <button
          class="btn btn-outline-primary btn-sm navigation-arrow right-arrow"
          type="button"
          @click="changePage(currentPage + 1)"
          :disabled="loading || currentPage >= totalPages"
          aria-label="Move to next slide"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import axios from 'axios';
import SemImagem from '../../assets/images/produto-sem-imagem.png'

const props = defineProps({
  marcaId: {
    type: Number,
    required: true
  }
});

const produtos = ref([]);
const produtosDuplicados = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(5);
const loading = ref(true);

const carrosselContainer = ref(null);

const updateItemsPerPage = () => {
  if (carrosselContainer.value) {
    const width = carrosselContainer.value.clientWidth;
    if (width >= 1200) {
      itemsPerPage.value = 5;
    } else if (width >= 992) {
      itemsPerPage.value = 4;
    } else if (width >= 768) {
      itemsPerPage.value = 3;
    } else {
      itemsPerPage.value = 2;
    }
  }
};

const fetchRelatedProducts = async () => {
  try {
    loading.value = true;
    if (props.marcaId) {
      const response = await axios.get(`https://api-wl.agcodecraft.com/api/public/products?brand_id=${props.marcaId}`);
      produtos.value = response.data.data;
      produtosDuplicados.value = [...produtos.value, ...produtos.value];
    }
  } catch (error) {
    console.error('Erro ao buscar produtos relacionados:', error);
  } finally {
    loading.value = false;
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
const paginatedProdutos = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return produtosDuplicados.value.slice(startIndex, endIndex);
});

const totalPages = computed(() => Math.ceil(produtosDuplicados.value.length / itemsPerPage.value));

const isFadingIn = ref(false);
const isFadingOut = ref(false);

const changePage = (pageNumber) => {
  if (!loading.value) {
    if (pageNumber < 1) {
      pageNumber = 1;
    } else if (pageNumber > totalPages.value) {
      pageNumber = totalPages.value;
    }

    if (pageNumber > currentPage.value) {
      isFadingIn.value = false;
      isFadingOut.value = true;
    } else if (pageNumber < currentPage.value) {
      isFadingIn.value = true;
      isFadingOut.value = false;
    }

    setTimeout(() => {
      currentPage.value = pageNumber;
      isFadingIn.value = false;
      isFadingOut.value = false;
    }, 300); // Tempo da animação de fade
  }
};


onMounted(() => {
  fetchRelatedProducts();
  updateItemsPerPage();

  // Observe changes in the size of the carrossel container
  const resizeObserver = new ResizeObserver(() => {
    updateItemsPerPage();
  });

  if (carrosselContainer.value) {
    resizeObserver.observe(carrosselContainer.value);
  }

  onUnmounted(() => {
    resizeObserver.disconnect();
  });
});

watch(() => props.marcaId, (newId) => {
  if (newId) {
    fetchRelatedProducts();
  }
});
</script>

<style scoped>
.carrossel-produtos-relacionados {
  position: relative;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
}

.navigation-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  background-color: #ff0000; /* Cor de fundo vermelho */
  color: white; /* Cor do ícone */
  border: none; /* Remover borda padrão */
  border-radius: 50%; /* Deixar o fundo arredondado */
  width: 40px; /* Largura do botão */
  height: 40px; /* Altura do botão */
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Adicionar sombra */
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s ease; /* Transição suave */
}

.navigation-arrow:hover {
  background-color: #cc0000; /* Mudar a cor ao passar o mouse */
}

.left-arrow {
  left: 10px;
}

.right-arrow {
  right: 10px;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
  background-color: #d6d6d6; /* Cor de fundo desabilitado */
  color: #777777; /* Cor do ícone desabilitado */
}


.product-list {
  display: flex;
  overflow: hidden;
  padding: 10px 0;
  justify-content: center;
  position: relative;
  transition: transform 0.5s ease-in-out;
}

.product__item {
  margin: 10px;
  text-align: center;
}

.btn-outline-primary {
  color: #777777;
  border-color: #777777;
}

.btn-outline-primary:hover {
  background-color: #a81515;
  color: white;
  border-color: #a81515;
}


.fade-in {
  animation: fadeIn 0.5s ease-in-out forwards;
}

.fade-out {
  animation: fadeOut 0.5s ease-in-out forwards;
}
.animated-slide {
  transition: transform 0.3s ease;
}

.carrossel-produtos-relacionados {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
}

.titulo-bloco h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
  justify-content: end;
}


.slide-left {
  transform: translateX(-100%);
}
.product__item {
  margin: 10px; 
  text-align: center;
  padding-top: 20px;
}

.product__item__img img {
  width: 100%;
  height: auto;
}

.product__item__title {
  font-size: 16px;
  margin: 10px 0;
}

.product__item__code, .product__item__price {
  margin-bottom: 5px;
}

.out-of-stock-tag {
  color: #2ECC71;
  font-weight: bold;
}
.slide-right {
  transform: translateX(100%);
}

.animated-slide {
  transition: transform 0.5s ease;
}


.product-item:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.imagem-produto {
  position: relative;
  overflow: hidden;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.imagem-produto img {
  width: 100%;
  height: auto;
  transition: opacity 0.3s;
}

.imagem-hover {
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
}

.imagem-produto:hover .imagem-hover {
  opacity: 1;
}

.nome-produto {
  padding: 15px;
  font-size: 1.2rem;
}

.nome-produto a {
  color: #333;
  text-decoration: none;
  transition: color 0.3s;
}

.nome-produto a:hover {
  color: #007bff;
}

.caixa-preco {
  padding: 0 15px 15px;
}

.caixa-preco h4 {
  font-size: 1.1rem;
  color: #333;
}

.product-item {
  border: 2px solid #e0ccad;
  border-radius: 12px;
  width: 100%;
  max-width: 260px;
  min-width: 220px;
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
}

.product-price {
  font-size: 28px; 
  font-family: 'Lato', sans-serif;
  color: #c99c5a; 
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

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}

.pagination-controls button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin: 0 10px;
}

.pagination-controls button:disabled {
  background-color: #d6d6d6;
  cursor: not-allowed;
}

.pagination-controls span {
  font-size: 16px;
  color: #333;
}
.btn-outline-primary {
  color: #777777;
  border-color: #777777;
}

.btn-outline-primary:hover {
  background-color: #af2929;
  color: white;
  border-color: #af2929;
}
.btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.skeleton-item {
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 10px;
}

.skeleton {
  background-color: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 10px;
}

.skeleton-image {
  width: 100%;
  height: 150px;
}

.skeleton-text {
  height: 20px;
}

.skeleton-name {
  width: 70%;
}

.skeleton-price {
  width: 50%;
}

.skeleton-code {
  width: 40%;
}
@media (max-width: 1200px) {
  .product-item {
    width: 200px;
  }
}

@media (max-width: 992px) {
  .product-item {
    width: 180px;
  }
}

@media (max-width: 768px) {
  .product-item {
    width: 150px;
  }
}

@media (max-width: 576px) {
  .product-item {
    width: 120px;
  }
}
</style>
