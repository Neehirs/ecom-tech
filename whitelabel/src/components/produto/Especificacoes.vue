<template>
  <section class="pneu-specs">
    <div class="container">
      <div class="specs-header">
        <h2 class="specs-title">Especificações do Pneu</h2>
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
    const response = await axios.get(`https://api-wl.agcodecraft.com/api/public/products/${slug}/details`);
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
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.specs-header {
  text-align: center;
  margin-bottom: 30px;
}

.specs-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #333;
}

.specs-subtitle {
  font-size: 1rem;
  color: #666;
  margin-top: 8px;
}

.specs-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.spec-item {
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.spec-item:hover {
  transform: translateY(-5px);
}

.spec-name {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.spec-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #007bff;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}
</style>
