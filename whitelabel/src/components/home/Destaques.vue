<template>
    <section class="product-one">
        <div class="container-carousel">
            <h3 class="product-one__title ">Destaques</h3>
            <div id="productCarousel" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                    <div class="carousel-item" :class="{ active: index === 0 }" v-for="(productChunk, index) in chunkedProducts" :key="index">
                        <div class="row justify-content-center">
                            <div class="row justify-content-center flex-row-wrap">
                                <div class="product__item" v-for="item in productChunk" :key="item.id">
                                    <div class="product__item__img">
                                        <img :src="item.imagens[0].url" :alt="item.nome" class="img-fluid" />
                                    </div>
                                    <div class="product__item__content">
                                        <h4 class="product__item__title">
                                            <router-link :to="{ name: 'produto', params: { slug: item.slug } }">
                                                {{ item.nome }}
                                            </router-link>
                                        </h4>
                                        <div class="product__item__code">COD: {{ item.codigo }}</div>
                                        <div class="product__item__price">${{ item.valor_venda }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button class="carousel-control-prev custom-carousel-control" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next custom-carousel-control" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    </section>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, onBeforeUnmount } from 'vue';

export default {
    name: 'ProductSection',
    setup() {
        const products = ref([]);
        const chunkedProducts = ref([]);
        const itemsPerPage = ref(5); 

        const chunkArray = (array, chunkSize) => {
            const result = [];
            for (let i = 0; i < array.length; i += chunkSize) {
                result.push(array.slice(i, i + chunkSize));
            }
            return result;
        };

        const fetchProducts = async () => {
            try {
                const response = await axios.get('https://api-wl.agcodecraft.com/api/public/products');
                products.value = response.data.data;
                chunkedProducts.value = chunkArray(products.value, itemsPerPage.value);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        const updateChunkedProducts = () => {
            const width = window.innerWidth;
            if (width < 576) {
                itemsPerPage.value = 1;
            } else if (width < 768) {
                itemsPerPage.value = 2;
            } else if (width < 992) {
                itemsPerPage.value = 3;
            } else if (width < 1200) {
                itemsPerPage.value = 4;
            } else {
                itemsPerPage.value = 5;
            }
            chunkedProducts.value = chunkArray(products.value, itemsPerPage.value);
        };

        onMounted(() => {
            fetchProducts();
            updateChunkedProducts();
            window.addEventListener('resize', updateChunkedProducts);
        });

        onBeforeUnmount(() => {
            window.removeEventListener('resize', updateChunkedProducts);
        });

        return { products, chunkedProducts };
    },
};
</script>

<style scoped>
body {
    font-family: 'Oswald', sans-serif;
}

.carousel-inner {
    max-width: 1200px;
    margin: 0 auto;
}

.title-red {
    color: #2ECC71; 
    text-align: left;
    margin-bottom: 20px; 
    font-size: 2.3rem;
}

.container-carousel {
    max-width: 1200px; 
    margin: 0 auto;
    position: relative; 
}

.carousel {
    max-width: 100%;
    margin: 0 auto;
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



.row.flex-row-wrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between; 
    gap: 20px; 
}

.product__item {
    width: calc(20% - 5px); 
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding-top: 20px;
}

@media (max-width: 1200px) {
    .product__item {
        width: calc(25% - 20px); 
    }

    .carousel-control-prev {
        left: 10px; /* Mais afastado da lateral esquerda */
    }

    .carousel-control-next {
        right: 10px; /* Mais afastado da lateral direita */
    }
}

@media (max-width: 992px) {
    .product__item {
        width: calc(33.33% - 20px);
    }
}

@media (max-width: 768px) {
    .product__item {
        width: calc(50% - 20px); 
    }

    .carousel-control-prev,
    .carousel-control-next {
        width: 30px; /* Tamanho menor em telas pequenas */
        height: 30px;
    }
    .carousel-control-prev {
        left: 15px; /* Mais afastado em telas menores */
    }

    .carousel-control-next {
        right: 15px;
    }
}

@media (max-width: 576px) {
    .product__item {
        width: calc(100% - 20px); 
    }

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
