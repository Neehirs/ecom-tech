<template>
    <!-- Carrossel de Produtos Relacionados -->
    <div class="carrossel-produtos-relacionados">
      <div class="row">
        <div class="col-lg-12">
          <div class="titulo-bloco">
            <h2 class="block-title">RELACIONADOS</h2>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12">
          <div class="product-list">
            <div class="product-grid">
              <div v-for="(produto, index) in produtosVisiveis" :key="index" class="product-item">
                <div class="conteudo-produto-unico conteudo-produto-relacionado">
                  <div class="product-content">
                    <div class="product-image-container">
                      <a :href="`/produto/${produto.slug}`">
                        <img :src="produto.imagens[0].url" class="img-fluid imagem-principal product-image" alt="" />
                      </a>
                    </div>
                    <div class="product-info">
                      <p class="product-name">{{ produto.nome }}</p>
                      <p class="product-price">{{ formatarPreco(produto.valor_venda) }}</p>
                      <p class="product-code">{{ produto.codigo }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="nav-buttons">
              <button
                class="btn btn-outline-primary btn-sm me-2"
                type="button"
                @click="anterior"
                :disabled="paginaAtual === 0"
                aria-label="Move to previous slide"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              <button
                class="btn btn-outline-primary btn-sm"
                type="button"
                @click="proximo"
                :disabled="paginaAtual >= maxPaginas - 1"
                aria-label="Move to next slide"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import axios from 'axios';
  
  const props = defineProps({
    marcaId: {
      type: Number,
      required: true
    }
  });
  
  const produtos = ref([]);
  const produtosVisiveis = ref([]);
  const paginaAtual = ref(0);
  const itensPorPagina = 1; 
  const maxPaginas = ref(0);
  
  const fetchRelatedProducts = async () => {
    try {
      if (props.marcaId) {
        const response = await axios.get(`https://api-wl.agcodecraft.com/api/public/products?marca_id=${props.marcaId}`);
        produtos.value = response.data.data;
        maxPaginas.value = Math.ceil(produtos.value.length / itensPorPagina);
        atualizarProdutosVisiveis();
      }
    } catch (error) {
      console.error('Erro ao buscar produtos relacionados:', error);
    }
  };
  
  const atualizarProdutosVisiveis = () => {
    const start = paginaAtual.value * itensPorPagina;
    const end = start + itensPorPagina;
    produtosVisiveis.value = produtos.value.slice(start, end);
  };
  
  const proximo = () => {
    if (paginaAtual.value < maxPaginas.value - 1) {
      paginaAtual.value++;
      atualizarProdutosVisiveis();
    }
  };
  
  const anterior = () => {
    if (paginaAtual.value > 0) {
      paginaAtual.value--;
      atualizarProdutosVisiveis();
    }
  };
  
  onMounted(() => {
    fetchRelatedProducts();
  });
  
  watch(() => props.marcaId, (newId) => {
    if (newId) {
      fetchRelatedProducts();
    }
  });
  
  const formatarPreco = (preco) => {
    const precoNumerico = parseFloat(preco);
    if (isNaN(precoNumerico)) return 'Preço inválido';
    
    return `U$ ${precoNumerico.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };
  
  </script>
  
  <style scoped>
  .btn-outline-primary {
    color: #777777;
    border-color: #777777;
    }

    .btn-outline-primary:hover {
    background-color: #C99C5A;
    color: white;
    border-color: #C99C5A;
    }
  .carrossel-produtos-relacionados {
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 10px;
    position: relative;
  }
  
  .titulo-bloco h2 {
    font-size: 1.5rem;
    margin-bottom: 20px;
    color: #333;
  }
  
  .product-list {
    position: relative;
  }
  .nav-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

  
  .nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 10px;
    cursor: pointer;
    font-size: 1.2rem;
    border-radius: 50%;
    z-index: 1;
  }
  
  .prev {
    left: 10px;
  }
  
  .next {
    right: 10px;
  }
  
  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }
  
  .product-item {
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
  }
  
  .product-item:hover {
    transform: scale(1.03);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
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
    width: 250px;
    height: 100%;
    object-fit: cover;
    padding-top: 15px;
  }
  
  .product-info {
    height: 40%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }
  
  .product-name {
    font-size: 18px; 
    font-family: 'Lato', sans-serif;
    color: rgb(43, 43, 43);
    margin-bottom: 10px; 
    font-weight: 500; 
    line-height: 1.5; 
  }
  
  .product-price {
    font-size: 28px; 
    font-family: 'Lato', sans-serif;
    color: #2ECC71; 
    margin: 5px 0; 
    font-weight: 700; 
  }
  
  .product-code {
    font-size: 16px;
    color: #757575;
    line-height: 1.667; 
    margin-top: auto;
    margin-bottom: 15px;
  }
  </style>
  