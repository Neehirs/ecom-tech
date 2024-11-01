<template>
  <section class="faq-one faq-one--home-four">
    <div class="container">
      <h3 class="faq-one--home-four__sec-title">PERGUNTAS FREQUENTES</h3>
      <div class="row justify-content-center">
        <div class="col-lg-9">
          <div class="faq-one__accordion karoons-accordion" data-grp-name="karoons-accordion">
            <div
              v-for="(item, index) in faqs"
              :key="index"
              :class="['accrodion', { active: activeIndex === index }]"
            >
              <div class="accrodion-title" @click="toggleAccordion(index)">
                <h4>
                  {{ item.pergunta }}
                  <span class="accrodion-title__icon" :class="{ 'icon-open': activeIndex === index }"></span>
                </h4>
              </div>
              <transition name="accordion">
                <div v-show="activeIndex === index" class="accrodion-content">
                  <div class="inner">
                    <p>{{ item.resposta }}</p>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const activeIndex = ref(-1);
    const faqs = ref([]);

    const fetchFaqs = async () => {
      try {
        const response = await axios.get('https://api-genove.agcodecraft.com/api/public/faq');
        faqs.value = response.data.filter(item => item.ativo); // Filtra para incluir apenas os itens ativos
      } catch (error) {
        console.error("Erro ao buscar FAQs:", error);
      }
    };

    const toggleAccordion = (index) => {
      activeIndex.value = activeIndex.value === index ? -1 : index;
    };

    onMounted(fetchFaqs); // Chama a função ao montar o componente

    return { activeIndex, faqs, toggleAccordion };
  }
};
</script>

<style scoped>
.faq-one--home-four__sec-title {
  text-align: center;
  color: #2ECC71;
  font-size: 2.3rem;
  font-weight: 600;
  margin-bottom: 30px;
}

.accrodion {
  background: #fff;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  border-radius: 5px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.accrodion.active .accrodion-content {
  display: block;
}

.accrodion-title {
  cursor: pointer;
  padding: 15px;
  font-weight: 700;
  position: relative;
  background-color: #f9f9f9;
  transition: background-color 0.3s ease;
}

.accrodion-title:hover {
  background-color: #f1f1f1;
}

.accrodion-title h4 {
  margin: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.accrodion-title__icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.accrodion-title__icon.icon-open {
  transform: rotate(180deg);
}

.accrodion-content {
  padding: 15px;
  font-weight: 400;
}

.accordion-enter-active, .accordion-leave-active {
  transition: max-height 0.3s ease, opacity 0.3s ease;
}

.accordion-enter, .accordion-leave-to {
  max-height: 0;
  opacity: 0;
}

.accordion-leave-active {
  overflow: hidden;
}
</style>
