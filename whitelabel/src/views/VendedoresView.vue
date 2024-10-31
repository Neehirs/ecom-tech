<template>
  <div class="vendedores">
    <div class="block-title">
      <h1>Nossos Vendedores</h1>
    </div>

    <div class="vendedor-list">
      <div v-for="vendedor in vendedores" :key="vendedor.id" class="vendedor">
        <img :src="vendedor.foto ? vendedor.foto : semFoto" :alt="vendedor.nome" />
        <h2>{{ vendedor.nome }}</h2>
        <p>{{ vendedor.funcao }}</p>
        <a :href="`https://wa.me/${vendedor.whatsapp}`" target="_blank" class="whatsapp-link">
          <i class="fab fa-whatsapp whats-icon"></i>
          <span>Fale no WhatsApp</span>
        </a>
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
    const response = await fetch('https://api-wl.agcodecraft.com/api/public/team');
    const data = await response.json();
    
    vendedores.value = data.sort((a, b) => b.nome.localeCompare(a.nome));
  } catch (error) {
    console.error('Erro ao buscar os vendedores:', error);
  }
});
</script>


<style scoped>
.vendedores {
  padding: 40px 20px;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  border-radius: 20px;
  background-color: #f9f9f9;
}

.block-title h1 {
  font-size: 3em;
  margin-bottom: 30px;
  color: #333;
  font-weight: 700;
  letter-spacing: -0.8px;
}

.vendedor-list {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 40px;
}

.vendedor {
  background-color: #fff;
  border-radius: 20px;
  padding: 25px;
  width: 300px;
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.1);
  
  text-align: center;
  transition: transform 0.4s, box-shadow 0.4s;
}

.vendedor:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.vendedor img {
  border-radius: 50%;
  width: 140px;
  height: 140px;
  object-fit: cover;
  margin: 0 auto 20px;
  border: 4px solid #e0e0e0;
  transition: transform 0.3s;
}

.vendedor:hover img {
  transform: scale(1.05);
}

.vendedor h2 {
  font-size: 1.5em;
  margin-bottom: 8px;
  color: #222;
  font-weight: 700;
}

.vendedor p {
  font-size: 1.1em;
  margin-bottom: 25px;
  color: #555;
}

.whatsapp-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  background: linear-gradient(135deg, #25d366, #1eb354);
  border-radius: 50px;
  text-decoration: none;
  color: #fff;
  font-weight: bold;
  font-size: 1.1em;
  transition: background 0.3s, box-shadow 0.3s;
}

.whatsapp-link:hover {
  background: linear-gradient(135deg, #1eb354, #25d366);
  box-shadow: 0 8px 20px rgba(37, 211, 102, 0.5);
}

.whatsapp-link span {
  margin-left: 10px;
}

.whats-icon {
  font-size: 30px;
}

@media (max-width: 768px) {
  .vendedor-list {
    flex-direction: column;
    align-items: center;
  }

  .vendedor {
    width: 100%;
    max-width: 400px;
  }
}
</style>
