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
                  <div class="brand-title">{{ brand.nome }}</div> <!-- Título da marca -->
                </div>
              </router-link>
            </div>
          </div>
        </div>

        <div class="carousel-controls">
          <button class="carousel-control-prev custom-carousel-control" type="button" data-bs-target="#brandCarousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next custom-carousel-control" type="button" data-bs-target="#brandCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
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
        const response = await axios.get('https://api-wl.agcodecraft.com/api/public/brands');
        brands.value = response.data;
        chunkedBrands.value = chunkArray(brands.value, itemsPerPage.value);
      } catch (error) {
        console.error('Erro ao buscar marcas:', error);
      }
    };

    const updateChunkedBrands = () => {
      const width = window.innerWidth;
      if (width < 768) {
        itemsPerPage.value = 1;
      } else if (width < 1000) {
        itemsPerPage.value = 2;
      } else if (width < 1200) {
        itemsPerPage.value = 3;
      } else {
        itemsPerPage.value = 5;
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
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 50px 0;
  margin: 0 auto;
  max-width: 1200px;
}

.title-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  border-radius: 10px;
}

.brands-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  max-width: 100%;
}

.product__item {
  text-align: center;
  border-radius: 10px;
  background-color: #F7F7F7;
  padding: 10px; /* Padding para espaçamento */
  height: 300px; /* Altura fixa para garantir uniformidade */
  display: flex;
  flex-direction: column; 
  justify-content: center; /* Centraliza o conteúdo */
}

.brand-title {
  margin-top: 10px; /* Espaçamento acima do título */
  font-weight: bold;
  font-size: 1rem; /* Tamanho do texto */
  color: #333; /* Cor do texto */
}

.brands-wrapper {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.brand-item {
  flex: 0 0 auto;
  min-width: 200px;
  margin: 0 10px; 
  text-align: center;
  border-radius: 10px;
  border-color: #2ECC71;
  overflow: hidden;
  height: 300px; /* Altura fixa para garantir uniformidade */
}

.product-arrow {
  color: #2ECC71;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  position: absolute;
  bottom: 15px;
  right: 15px;
  cursor: pointer;
  background-color: white;
}

.title-red {
  color: #2ECC71;
  text-align: left;
  margin-bottom: 0px;
  font-size: 2.3rem;
}

.custom-carousel-control {
  background-color: #2ECC71;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s ease, transform 0.2s ease;
  border: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.custom-carousel-control:hover {
  background-color: #C12E29; 
  transform: scale(1.1);
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  width: 12px;
  height: 12px;
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

.carousel-control-prev {
  left: 0; 
}

.carousel-control-next {
  right: 0; 
}

@media (max-width: 1200px) {
  .carousel-controls {
    width: 100%;
    left: 0;
  }

  .carousel-control-prev {
    left: 10px; 
  }

  .carousel-control-next {
    right: 10px; 
  }
}

@media (max-width: 768px) {
  .carousel-control-prev,
  .carousel-control-next {
    width: 30px; 
    height: 30px;
  }
  .carousel-control-prev {
    left: 15px; 
  }

  .carousel-control-next {
    right: 15px;
  }
}

@media (max-width: 576px) {
  .carousel-control-prev,
  .carousel-control-next {
    width: 25px; 
    height: 25px;
  }
  .carousel-control-prev {
    left: 20px; 
  }

  .carousel-control-next {
    right: 20px;
  }
}
</style>
