<template>
  <section class="product-two">
    <div class="container-carousel">
      <div class="product-two__top">
        <div class="container">
          <h3 class="product-one__title title-red">MARCAS</h3>
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
      } 
      else if (width < 1200) {
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
  background-size: cover;
  background-position: center;
  height: 100%; 
  display: flex;
  flex-direction: column; 
  justify-content: flex-start; 
  padding: 0; 
  background-color: #F7F7F7;
  padding-top: 10px;
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
  width: calc(20% - 20px);
  overflow: hidden;
  height: 270px; 
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
  background-color:white;
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
  width: 50px; /* Aumentado para facilitar o clique */
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s ease, transform 0.2s ease; /* Adicionado efeito de transformação */
  border: none; /* Removendo borda padrão */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Sombra para profundidade */
}

.custom-carousel-control:hover {
  background-color: #C12E29; /* Cor de fundo ao passar o mouse */
  transform: scale(1.1); /* Aumenta levemente o botão ao passar o mouse */
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
 
  width: 12px;
  height: 12px;
}

.carousel-controls {
  position: absolute;
  top: 50%;
  width: calc(100% + 80px); /* Aumente a largura para que os botões estejam fora do contêiner */
  left: -40px; /* Mova os botões para a esquerda para fora do contêiner */
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
  z-index: 10; /* Para garantir que fiquem acima de outros elementos */
}

.carousel-control-prev {
  left: 0; /* Deixe na posição 0 dentro do controle expandido */
}

.carousel-control-next {
  right: 0; /* Deixe na posição 0 dentro do controle expandido */
}

@media (max-width: 1200px) {
  .carousel-controls {
    width: 100%;
    left: 0;
  }

  .carousel-control-prev {
    left: 10px; /* Ajuste a posição para 10px de distância da lateral esquerda */
  }

  .carousel-control-next {
    right: 10px; /* Ajuste a posição para 10px de distância da lateral direita */
  }
}

@media (max-width: 768px) {
  .carousel-control-prev,
  .carousel-control-next {
    width: 30px; /* Tamanho menor em telas pequenas */
    height: 30px;
  }
  .carousel-control-prev {
    left: 15px; /* Mais afastado nas telas menores */
  }

  .carousel-control-next {
    right: 15px;
  }
}

@media (max-width: 576px) {
  .carousel-control-prev,
  .carousel-control-next {
    width: 25px; /* Tamanho ainda menor para telas muito pequenas */
    height: 25px;
  }
  .carousel-control-prev {
    left: 20px; /* Ainda mais afastado em telas muito pequenas */
  }

  .carousel-control-next {
    right: 20px;
  }
}


</style>
