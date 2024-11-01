<template>
  <div class="vendedores">
    <div class="block-title">
      <h1>Nossos Vendedores</h1>
      <p>Conheça nossa equipe dedicada, pronta para te ajudar!</p>
    </div>

    <div class="vendedor-list">
      <div v-for="vendedor in vendedores" :key="vendedor.id" class="vendedor">
        <div class="image-container">
          <img :src="vendedor.foto ? vendedor.foto : semFoto" :alt="vendedor.nome" />
        </div>
        <div class="vendedor-info">
          <h2>{{ vendedor.nome }}</h2>
          <p>{{ vendedor.funcao }}</p>
          <a :href="`https://wa.me/${vendedor.whatsapp}`" target="_blank" class="whatsapp-link">
            <i class="fab fa-whatsapp whats-icon"></i>
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import semFoto from '../assets/images/sem_foto.png';

const vendedores = ref([]);

onMounted(async () => {
  try {
    const response = await fetch('https://api-genove.agcodecraft.com/api/public/team');
    const data = await response.json();
    
    vendedores.value = data.sort((a, b) => b.nome.localeCompare(a.nome));
  } catch (error) {
    console.error('Erro ao buscar os vendedores:', error);
  }
});
</script>

<style scoped>
.vendedores {
  padding: 50px 20px;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 15px;
  background-color: #f2f2f2;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.block-title {
  margin-bottom: 30px;
}

.block-title h1 {
  font-size: 2.5em;
  color: #333;
  font-weight: bold;
}

.block-title p {
  font-size: 1.1em;
  color: #666;
  margin-top: 10px;
  line-height: 1.5;
}

.vendedor-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 30px;
}

.vendedor {
  background-color: #fff;
  border-radius: 15px;
  padding: 20px;
  width: 280px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
}

.vendedor:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2);
}

.image-container {
  width: 120px;
  height: 120px;
  overflow: hidden;
  border-radius: 20%;
  margin: 0 auto 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.image-container:hover img {
  transform: scale(1.1);
}

.vendedor-info {
  text-align: center;
}

.vendedor h2 {
  font-size: 1.4em;
  margin-bottom: 5px;
  color: #222;
  font-weight: 600;
}

.vendedor p {
  font-size: 1em;
  margin-bottom: 20px;
  color: #555;
}

.whatsapp-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  background-color: #25d366;
  border-radius: 30px;
  text-decoration: none;
  color: #fff;
  font-weight: 600;
  font-size: 1em;
  transition: background 0.3s, box-shadow 0.3s;
  border: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.whatsapp-link:hover {
  background-color: #1eb354;
  box-shadow: 0 6px 20px rgba(37, 211, 102, 0.5);
}

.whatsapp-link span {
  margin-left: 8px;
}

.whats-icon {
  font-size: 20px;
}

@media (max-width: 768px) {
  .vendedor-list {
    flex-direction: column;
    align-items: center;
  }

  .vendedor {
    width: 90%;
    max-width: 400px;
  }

  .block-title h1 {
    font-size: 2em;
  }
}
</style>
