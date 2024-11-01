<template>
  <section class="pneu-specs">
    <div class="container">
      <div class="specs-header">
        <h2 class="specs-title">Especificações</h2>
        <p class="specs-subtitle">Confira os detalhes técnicos e garanta a melhor escolha!</p>
      </div>

      <div class="specs-content" v-if="!isLoading">
        <div v-for="(spec, index) in especificacoes" :key="index" class="spec-item">
          <div class="spec-name">{{ spec.nome }}</div>
          <div class="spec-value">{{ spec.valor || 'N/A' }}</div>
        </div>
      </div>

      <div v-else class="loading-container">
        <EspecificacoesSkeleton />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import EspecificacoesSkeleton from './EspecificacoesSkeleton.vue';

const route = useRoute();
const slug = route.params.slug;

const especificacoes = ref([]);
const isLoading = ref(true);

const fetchProductData = async () => {
  try {
    const response = await axios.get(`https://api-genove.agcodecraft.com/api/public/products/${slug}/details`);
    especificacoes.value = response.data.especificacoes || [];
  } catch (error) {
    console.error('Erro ao buscar os dados do produto:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchProductData();
});
</script>

<style scoped>
.pneu-specs {
  padding: 40px 20px;
  background-color: #f0f4f8; /* Cor de fundo mais clara */
  border-radius: 16px; /* Bordas mais suaves */
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1); /* Sombra mais sutil */
  margin-bottom: 20px;
}

.specs-header {
  text-align: center;
  margin-bottom: 30px;
}

.specs-title {
  font-size: 2rem; /* Tamanho maior para o título */
  font-weight: 700;
  color: #2c3e50; /* Cor mais escura para contraste */
}

.specs-subtitle {
  font-size: 1.1rem; /* Tamanho maior para o subtítulo */
  color: #7f8c8d; /* Cor mais suave */
  margin-top: 8px;
}

.specs-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); /* Aumenta a largura mínima */
  gap: 20px; /* Espaçamento maior entre os itens */
}

.spec-item {
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 12px; /* Bordas arredondadas */
  padding: 20px; /* Aumenta o padding */
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Sombra suave */
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Animação suave */
}

.spec-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2); /* Sombra mais pronunciada ao passar o mouse */
}

.spec-name {
  font-size: 1.1rem; /* Aumenta o tamanho da fonte */
  font-weight: 600;
  color: #34495e; /* Cor do texto mais escura */
  margin-bottom: 10px; /* Aumenta o espaço inferior */
}

.spec-value {
  font-size: 1.4rem; /* Aumenta o tamanho da fonte do valor */
  font-weight: 700;
  color: #2980b9; /* Cor do valor mais viva */
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}
</style>
