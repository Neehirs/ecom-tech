<template>
  <div v-if="isLoading">
    <SkeletonLoader />
  </div>
  <div class="product-page" v-else>
    <div class="product-detail-container">
  <!-- Galeria de Imagens -->
  <div class="image-gallery">
    <div class="tab-content product-details-large">
      <!-- Verifique se há imagens, senão exiba a imagem padrão -->
      <div 
        v-if="images.length > 0" 
        v-for="(image, index) in images" 
        :key="index" 
        :class="['tab-pane fade', { 'show active': currentIndex === index }]" 
        :id="'single-slide-' + (index + 1)" 
        role="tabpanel" 
        :aria-labelledby="'single-slide-tab-' + (index + 1)">
        <div class="single-product-img">
          <button class="prev-button" @click="prevImage">
            <i class="fas fa-chevron-left"></i>
          </button>
          <img 
            :src="image.url" 
            :alt="'Image ' + (index + 1)" 
            class="img-fluid image-large" 
            @click="openModal(index)" 
          />
          <button class="next-button" @click="nextImage">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
      <div v-else class="tab-pane fade show active" id="no-image">
        <div class="single-product-img no-image-container">
          <img src="@/assets/images/produto-sem-imagem.png" alt="Imagem não disponível" class="img-fluid no-image" />
        </div>
      </div>
    </div>

    <!-- Miniaturas das Imagens -->
    <div class="single-product-menu">
      <div class="nav single-slide-menu" role="tablist">
        <div 
          v-for="(image, index) in images" 
          :key="index" 
          class="single-tab-menu">
          <a 
            data-bs-toggle="tab" 
            :id="'single-slide-tab-' + (index + 1)" 
            :href="'#single-slide-' + (index + 1)" 
            @click="setCurrentIndex(index)">
            <img 
              :src="image.url" 
              :alt="'Thumbnail ' + (index + 1)" 
              class="img-fluid thumbnail" 
            />
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- Informações do Produto -->
  <div class="product-info">
    <h2 class="product-title">{{ nome }}</h2>

    <div class="product-code-stock">
      <p class="product-code"><span>COD: </span>{{ codigo }}</p>
      <span v-if="temEstoque" class="badge stock-status in-stock">
          Disponível
      </span>
      <span v-else class="badge stock-status out-of-stock">
          Indisponível
      </span>
    </div>

    <!-- Exibir os preços apenas se estiver em estoque -->
    <div v-if="temEstoque" class="product-info-details">
      <div class="product-prices">
        <div class="price-container">
          <h2 class="product-price-item">{{ formattedPriceUSD }}</h2>
          <div class="additional-prices">
            <h2 class="product-price2">{{ formattedPriceBRL }}</h2>
            <h2 class="product-price2">{{ formattedPricePYG }}</h2>
          </div>
        </div>
        <p class="iva-notice">Valores não incluem I.V.A</p>
      </div>
    </div>

    <p class="caracteristicas">{{ caracteristica }}</p>
    <p class="product-description" v-html="detalhes"></p>
    <p class="stock-details"></p>
  </div>
</div>



    <!-- Ficha Técnica -->
    <div class="ficha-tecnica">
      <Especificacoes />
    </div>

    <!-- Produtos Relacionados (Somente para PCs) -->
    <section class="related-products-section">
      <Relacionados :marcaId="marcaId" />
    </section>

  

    <!-- Modal de Imagem -->
    <div v-if="showModal" class="image-modal" @click="closeModal">
      <button class="close-button" @click.stop="closeModal">&times;</button>
      <button class="prev-button-modal" @click.stop="prevImageModal">
        <i class="fas fa-chevron-left"></i>
      </button>
      <img :src="images[currentIndex]?.url || '@/assets/produto-sem-imagem.png'" class="modal-image" />
      <button class="next-button-modal" @click.stop="nextImageModal">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import Relacionados from '../components/produto/Relacionados.vue';
import RelacionadosMobile from '../components/produto/RelacionadosMobile.vue';
import Especificacoes from '../components/produto/Especificacoes.vue';
import SkeletonLoader from '@/components/produto/ProdutoSkeleton.vue';
import { formatCurrency } from '@/components/helpers/helper.js';

const marcaId = ref(null);
const isMobile = ref(false);
const route = useRoute();
const slug = route.params.slug;
const images = ref([]);
const currentIndex = ref(0);
const showModal = ref(false);
const nome = ref('');
const preco = ref(0);
const detalhes = ref('');
const caracteristica = ref('');
const codigo = ref('');
const temEstoque = ref(false);
const isLoading = ref(true); 

const fetchProductData = async (slug) => {
  try {
    const response = await axios.get(`https:/api-genove.agcodecraft.com/api/public/products/${slug}/details`);
    const data = response.data;

    nome.value = data.nome;
    preco.value = data.preco_atual.valor_venda;
    detalhes.value = data.detalhes;
    codigo.value = data.codigo;
    caracteristica.value = data.caracteristica;
    temEstoque.value = data.tem_estoque;
    images.value = data.imagens;
    marcaId.value = data.marca_id;
  } catch (error) {
    console.error('Erro ao buscar os dados do produto:', error);
  } finally {
    isLoading.value = false;
  }
};

const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  window.scrollTo(0, 0);
  fetchProductData(slug);
  updateIsMobile();
  window.addEventListener('resize', updateIsMobile);
});

onMounted(() => {
  window.scrollTo(0, 0);
  fetchProductData(slug);
  fetchExchangeRates(); // Chamada para obter as taxas de câmbio
  updateIsMobile();
  window.addEventListener('resize', updateIsMobile);
});


watch(() => route.params.slug, (newSlug) => {
  fetchProductData(newSlug);
}, { immediate: true });

const openModal = (index) => {
  currentIndex.value = index;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const setCurrentIndex = (index) => {
  currentIndex.value = index;
};

const prevImage = () => {
  currentIndex.value = (currentIndex.value - 1 + images.value.length) % images.value.length;
};

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % images.value.length;
};

const prevImageModal = () => {
  currentIndex.value = (currentIndex.value - 1 + images.value.length) % images.value.length;
};

const nextImageModal = () => {
  currentIndex.value = (currentIndex.value + 1) % images.value.length;
};



const exchangeRates = ref({});

const fetchExchangeRates = async () => {
  try {
    const response = await axios.get('https://api-genove.agcodecraft.com/api/public/exchange-rates');
    const rates = response.data;
    exchangeRates.value = {
      BRL: parseFloat(rates.find(rate => rate.target_currency.name === 'Real').tax),
      PYG: parseFloat(rates.find(rate => rate.target_currency.name === 'Guarani').tax),
    };
  } catch (error) {
    console.error('Erro ao buscar taxas de câmbio:', error);
  }
};
const formattedPriceUSD = computed(() => {
  // Formata o valor para o padrão dos EUA
  const formatted = preco.value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  // Substitui o ponto por uma vírgula
  return `U$ ${formatted.replace('.', ',')}`;
});


const formattedPriceBRL = computed(() => {
  return formatCurrency(preco.value * (exchangeRates.value.BRL || 1), 2, 'BRL');
});

const formattedPricePYG = computed(() => {
  return formatCurrency(preco.value * (exchangeRates.value.PYG || 1), 0, 'PYG');
});

</script>

<style scoped>
.product-page {
  max-width: 1500px;
  margin: 0 auto;
  box-sizing: border-box;
  margin-top: 20px;
  justify-content: center;
}


.tab-content {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.single-product-img {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.single-product-img img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 20px;
  cursor: pointer;
}

.prev-button,
.next-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: #646464;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 6px;
  z-index: 2;
  border-radius: 5px;
  transition: background 0.3s ease;
}

.prev-button:hover,
.next-button:hover {
  background: #a3a3a3;
}

.prev-button {
  left: 10px;
}

.next-button {
  right: 10px;
}

.prev-button-modal,
.next-button-modal {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: #a3a3a3;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 10px;
  z-index: 1000;
  border-radius: 20%;
  transition: background 0.3s ease;
}

.prev-button-modal:hover,
.next-button-modal:hover {
  background: #666666;
}

.prev-button-modal {
  left: 20px;
}

.next-button-modal {
  right: 20px;
}

.single-product-img img:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.single-product-menu {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.single-slide-menu {
  cursor: pointer;
}

.thumbnail {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  transition: transform 0.2s ease;
}

.thumbnail:hover {
  transform: scale(1.1);
}

.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-image {
  max-width: 90%;
  max-height: 80%;
  border-radius: 8px;
  position: relative;
}

.close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 10px;
  border-radius: 10px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}



.product-info-details {
  justify-content: space-between;
  align-items: center;
  margin-top: 50px;

}




.product-code {
  color: rgba(0, 0, 0, 0.6);
  font-size: 1rem;
  color: #777;
  flex: 1;
}



.product-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2ECC71;

}
.product-detail-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  padding: 2rem;
}

.image-gallery {
  flex: 1;
  max-width: 600px;
}

.product-info {
  flex: 1;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 10px;
  background-color: #fff;
}

.product-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.product-code-stock {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}


.product-prices {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.product-price-item {
  font-size: 2rem;
  color: #007bff;
}

.additional-prices {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.thumbnail {
  max-width: 80px;
  max-height: 80px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.thumbnail:hover {
  transform: scale(1.05);
}

.no-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

.no-image {
  max-width: 100%;
  object-fit: contain;
}


.product-description {
  font-size: 1rem;
  color: #555;
}

.caracteristicas {
  margin-top: 80px;
  font-size: 1rem;
}

.stock-details {
  font-size: 1rem;
  color: #333;
}

.stock-status {
    font-size: large;
    font-weight: 700;
    flex: 1;
    text-align: right;
}

.in-stock {
    color: #2ecc71; /* Verde */
}

.out-of-stock {
    color: #dc3545; /* Vermelho */
    background-color: #f8d7da; /* Fundo claro */
    padding: 0.5rem;
    border-radius: 5px;
}


.price-container {
  display: flex;
  gap: 5px;
  align-items: flex-end;
}


.flag2 {
  width: 20px;
  height: 12px;
  margin-right: 5px;
}

.product-prices {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-left {
  flex: 1;
}

.product-price-item {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2ECC71;
  white-space: nowrap;
}

.price-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
}

.additional-prices {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
  text-align: left;
  gap: 1px;
  align-items: flex-start;
}

.product-price2 {
  font-size: 0.7rem;
  margin: 0;
  white-space: nowrap;
  line-height: 0.01;
  margin-bottom: 12px;
  color: rgba(0, 0, 0, 0.5);
  text-align: left;
}

.iva {
  align-items: flex-end;
  justify-content: end;
}

.iva-notice {
  font-size: 0.7rem;
  color: #777;
  margin-left: 10px;
  margin-top: 5px;

}

h2.block-title2,
.block-title2 h2 {
  font-size: 2rem;
  font-weight: 700;
  position: relative;
  padding-bottom: 5px;
  margin-bottom: 15px;
  line-height: 1.2;
  font-family: 'Lato', sans-serif;
}

h2.block-title2:before,
.block-title2 h2:before {
  position: absolute;
  bottom: 110%;
  left: 0;
  width: 100px;
  height: 3px;
  background: red;
  content: "";
}

h2.block-title2:after,
.block-title2 h2:after {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: #f4f4f4;
  content: "";
}


@media (max-width: 768px) {
  .product-detail-container {
    flex-direction: column;
    gap: 1rem;
  }

  .skeleton-container {
    padding: 0 5px;
  }

  .image-gallery {
    max-width: 100%;
    width: 100%;
    margin: 0 auto;
  }

  .caracteristicas {
    margin-top: 40px;
    font-size: 1rem;
  }

  .image-gallery {
    height: 50vh;
    /* Ajuste para telas menores */
  }

  .single-product-img img {
    border-radius: 10px;
  }

  .product-title {
    font-size: 1.25rem;
  }

  .product-price {
    font-size: 1.5rem;
  }

  .single-product-menu {
    display: none;
  }

  .image-gallery .tab-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .prev-button,
  .next-button {
    font-size: 1rem;
    padding: 6px;
  }

  .product-prices {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .product-price-item {
    margin-right: 0;
  }

  .product-info-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

}

@media (max-width: 480px) {
  .product-title {
    font-size: 1rem;
  }

  .image-gallery {
    height: 40vh;
  }

  .caracteristicas {
    margin-top: 20px;
    font-size: 1rem;
  }

  .single-product-img img {
    border-radius: 5px;
  }

  .product-price {
    font-size: 1.5rem;
  }

  .thumbnail {
    width: 60px;
    height: 60px;
  }

  .product-price-item {
    margin-right: 10px;
  }

  .close-button {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }

  .product-prices {
    gap: 10px;
  }

  .product-info-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
    margin-top: 20px;
  }

  .product-page {
    max-width: 1500px;
    margin: 0 auto;
    box-sizing: border-box;
    margin-top: 5px
  }

}
</style>
