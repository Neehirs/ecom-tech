<template>
  <section class="product-two">
    <div class="container-carousel">
      <div class="product-two__top">
        <div class="container">
          <h3 class="product-one__title">MARCAS</h3>
          <div class="underline"></div>
        </div>
      </div>

      <div id="brandCarousel" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
          <div
            class="carousel-item"
            :class="{ active: index === 0 }"
            v-for="(brandChunk, index) in chunkedBrands"
            :key="index"
          >
            <div class="brands-wrapper">
              <router-link
                v-for="(brand, idx) in brandChunk"
                :key="brand.id"
                :to="{ name: 'marca', params: { brandSlug: brand.slug } }"
                class="brand-item"
              >
                <div class="product__item">
                  <div class="product__item__img">
                    <img :src="brand.logo" :alt="brand.nome" />
                  </div>
                  <div class="product__item__name">{{ brand.nome }}</div>
                </div>
              </router-link>
            </div>
          </div>
        </div>

        <div class="carousel-controls">
          <button class="carousel-control-prev custom-carousel-control" type="button" data-bs-target="#brandCarousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Anterior</span>
          </button>
          <button class="carousel-control-next custom-carousel-control" type="button" data-bs-target="#brandCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Próximo</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, onBeforeUnmount } from 'vue';

export default {
  name: 'BrandSection',
  setup() {
    const brands = ref([]);
    const chunkedBrands = ref([]);
    const itemsPerPage = ref(5);

    const chunkArray = (array, chunkSize) => {
      const result = [];
      for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
      }
      return result;
    };

    const fetchBrands = async () => {
      try {
        const response = await axios.get('https://api-genove.agcodecraft.com/api/public/brands');
        brands.value = response.data.filter(brand => brand.logo);
        chunkedBrands.value = chunkArray(brands.value, itemsPerPage.value);
      } catch (error) {
        console.error('Erro ao buscar marcas:', error);
      }
    };

    const updateChunkedBrands = () => {
      const width = window.innerWidth;
      
      if (width < 768) {
        itemsPerPage.value = 2;
      } else if (width < 1000) {
        itemsPerPage.value = 3;
      } else if (width < 1200) {
        itemsPerPage.value = 5;
      } else {
        itemsPerPage.value = 6;
      }
      chunkedBrands.value = chunkArray(brands.value, itemsPerPage.value);
    };

    onMounted(() => {
      fetchBrands();
      updateChunkedBrands();
      window.addEventListener('resize', updateChunkedBrands);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', updateChunkedBrands);
    });

    return { brands, chunkedBrands };
  },
};
</script>

<style scoped>
.product-two {
  padding: 50px 0;
  max-width: 1200px;
  margin: 0 auto;
}

.title-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
}

.brands-wrapper {
  display: flex; /* Mantém os itens em linha */
  justify-content: center;
  flex-wrap: nowrap; /* Não permite que os itens quebrem para uma nova linha */
}

.product__item {
  text-align: center;
  border-radius: 10px;
  background-color: #fff; /* Cor de fundo para cada item */
  padding: 20px;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Sombra suave */
  width: 100%; /* Permite que o item ocupe a largura do contêiner */
  max-width: 150px; /* Define um limite de largura para os itens */
  height: 180px; /* Aumenta a altura do item para acomodar o texto */
  display: flex;
  flex-direction: column; /* Alinha o conteúdo em coluna */
  justify-content: space-between; /* Espaça o conteúdo verticalmente */
}

.product__item:hover {
  transform: translateY(-5px); /* Efeito de elevação ao passar o mouse */
}

.product__item__img {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  max-height: 100px; /* Limita a altura da imagem */
}

.product__item__name {
  font-size: 1rem; /* Tamanho da fonte para o nome da marca */
  font-weight: 600;
  color: #333;
  margin-top: 10px; /* Espaço acima do nome */
  margin-bottom: 0; /* Remove margem inferior para evitar corte */
}

.brand-item {
  flex: 0 0 auto;
  margin: 10px; /* Espaçamento entre itens */
  transition: transform 0.3s;
}

.custom-carousel-control {
  background-color: #2ECC71;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s, transform 0.2s;
  border: none;
}

.custom-carousel-control:hover {
  background-color: #14bb7b;
  transform: scale(1.1);
}

.carousel-controls {
  position: absolute;
  top: 50%;
  width: calc(100% + 80px);
  left: -40px;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
  z-index: 10;
}

@media (max-width: 1200px) {
  .carousel-controls {
    width: 100%;
    left: 0;
  }
}
</style>
