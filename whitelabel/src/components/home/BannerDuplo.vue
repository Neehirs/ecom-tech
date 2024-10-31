<template>
  <section class="cta-five">
    <div class="container">
      <div class="row gutter-y-30">
        <div
          class="col-lg-4 wow fadeInUp"
          v-for="(item, index) in items"
          :key="index"
          :data-wow-delay="index * 100 + 'ms'"
        >
          <div class="cta-five__item" :class="item.className">
            <div class="cta-five__item__image">
              <img :src="item.image" alt="Image" />
            </div>
            <div class="cta-five__item__content">
              <h4 class="sub-title">{{ item.subTitle }}</h4>
              <h3 class="title">{{ item.title }}</h3>
              <p class="text">{{ item.text }}</p>
              <a :href="item.link" class="cta-five__item__button">Comprar</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "CtaFive",
  data() {
    return {
      items: [
        {
         /*  subTitle: "Novas Coleções",
          title: "Acessórios BMW",
          text: "Até 40% de desconto em acessórios",
          link: "products.html", */
          image: require('@/assets/images/resources/cta-5-1.png'),
          className: "cta-five__item--one",
        },
        {
         /*  subTitle: "Novas Coleções",
          title: "Acessórios para Carros Esportivos",
          text: "Até 40% de desconto em acessórios",
          link: "products.html", */
          image: require('@/assets/images/resources/cta-5-2.png'),
          className: "cta-five__item--two",
        },
        {
          /* subTitle: "Novas Coleções",
          title: "Acessórios de Luxo",
          text: "Até 50% de desconto em acessórios",
          link: "products.html", */
          image: require('@/assets/images/resources/cta-5-2.png'), // Mantendo a mesma imagem
          className: "cta-five__item--three",
        },
      ],
    };
  },
};
</script>

<style scoped>
.cta-five__item {
  border: 1px solid #e1e1e1; /* Borda sutil */
  border-radius: 8px; /* Bordas arredondadas */
  overflow: hidden; /* Para manter a imagem dentro do contêiner */
  transition: transform 0.3s; /* Transição suave */
  text-align: center; /* Centralizar o texto */
}

.cta-five__item:hover {
  transform: scale(1.05); /* Efeito de zoom ao passar o mouse */
}

.cta-five__item__image img {
  width: 100%; /* A imagem ocupa todo o contêiner */
  height: auto; /* Mantém a proporção da imagem */
}

.sub-title {
  font-size: 16px; /* Tamanho do subtítulo */
  color: #888; /* Cor do subtítulo */
}

.title {
  font-size: 24px; /* Tamanho do título */
  margin: 10px 0; /* Margem em cima e embaixo do título */
}

.text {
  font-size: 14px; /* Tamanho do texto */
  color: #555; /* Cor do texto */
}

.cta-five__item__button {
  display: inline-block; /* Torna o botão em bloco */
  padding: 10px 20px; /* Padding do botão */
  background-color: #007bff; /* Cor de fundo do botão */
  color: #fff; /* Cor do texto do botão */
  border-radius: 5px; /* Bordas arredondadas do botão */
  text-decoration: none; /* Remove sublinhado */
  transition: background-color 0.3s; /* Transição suave */
}

.cta-five__item__button:hover {
  background-color: #0056b3; /* Cor de fundo ao passar o mouse */
}

/* Estilos para diferentes tons de cinza */
.cta-five__item--one {
  background-color: #f0f0f0; /* Tom claro */
}

.cta-five__item--two {
  background-color: #d9d9d9; /* Tom médio */
}

.cta-five__item--three {
  background-color: #bfbfbf; /* Tom escuro */
}
</style>
