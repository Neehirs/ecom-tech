<template>
  <section class="cta-sevens">
    <div class="container">
      <div class="cta-seven__inner">
        <div class="cta-seven__inner__bg" :style="{ backgroundImage: `url(${backgroundImage})` }"></div>
        <div class="row d-flex align-items-center">
          <div class="col-lg-8 wow fadeInLeft" data-wow-delay="100ms">
            <h5 class="cta-seven__sub-title">{{ subTitle }}</h5>
            <h3 class="cta-seven__title">{{ title }}</h3>
            <ul class="cta-seven__list">
              <li v-for="(item, index) in listItems" :key="index">
                <i class="flaticon-check"></i> {{ item }}
              </li>
            </ul>
          </div>
          <div class="col-lg-4">
            <div class="cta-seven__btn wow fadeInUp" data-wow-delay="200ms">
              <a :href="buttonLink" class="karoons-btn">
                <span><i class="flaticon-paper-plan"></i> {{ buttonText }}</span>
              </a>
            </div>
          </div>
        </div>
      </div><!-- /.cta-seven__content -->
    </div><!-- /.container -->
  </section><!-- /.cta-seven -->
</template>

<script>
export default {
  name: 'CtaSeven',
  data() {
    return {
      backgroundImage: require('@/assets/images/resources/cta-7-bg.jpg'), 
      subTitle: 'Produtos em alta',
      title: 'Aproveite 50% de desconto em todos os acessórios automotivos',
      listItems: ['Qualidade premium', 'Entrega rápida e segura', 'Suporte ao cliente 24/7'],
      buttonText: 'Compre Agora',
      buttonLink: 'produtos.html',
    };
  },
};
</script>

<style scoped>
.cta-sevens {
    margin-bottom: 30px;
    margin: 0 auto;
    max-width: 1200px;
    padding: 30px; /* Adicionando padding para um layout mais arejado */
    border-radius: 8px; /* Arredondando os cantos do banner */
}
.cta-seven__title {
    color: #ffffff; /* Mudando a cor do título para um tom mais escuro */
    font-weight: bold; /* Aumentando a espessura do texto */
}
.cta-seven__btn .karoons-btn {
    background-color: #007bff; /* Mudando a cor do botão para um azul vibrante */
    color: #fff; /* Cor do texto do botão */
    border-radius: 4px; /* Arredondando os cantos do botão */
    padding: 10px 20px; /* Adicionando padding ao botão */
}
.cta-seven__btn .karoons-btn:hover {
    background-color: #0056b3; /* Efeito hover para escurecer o botão */
}
</style>
