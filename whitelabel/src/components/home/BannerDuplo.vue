<template>
  <section class="cta-five">
    <div class="container">
      <div class="row gutter-y-30">
        <div class="col-lg-4 fade-in" v-for="(item, index) in items" :key="index"
          :style="{ animationDelay: index * 100 + 'ms' }">
          <div class="cta-five__item" :class="item.className" :style="{ backgroundImage: `url(${item.image})` }">
            <div class="cta-five__overlay">
              <div class="cta-five__item__content">
                <h4 class="sub-title">{{ item.subTitle }}</h4>
                <h3 class="title">{{ item.title }}</h3>
                <p class="text">{{ item.text }}</p>
                <!-- <a :href="item.link" class="cta-five__item__button">Comprar</a> -->
              </div>
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
          subTitle: "Ofertas Imperdíveis",
          title: "iPhone 16 ",
          /*  text: "Desfrute da tecnologia avançada do novo iPhone 16 Pro Max com até 40% de desconto. Não perca!", */
          link: "products.html",
          image: require('@/assets/images/banners/banner01.jpg'),
          className: "cta-five__item--light",
        },
        {
          subTitle: "Tendências 2024",
          /* title: "PS5 Pro", */
          /* text: "Experimente jogos de última geração no PS5 Pro com até 40% de desconto. Aproveite esta oferta!", */
          link: "products.html",
          image: require('@/assets/images/banners/banner02.webp'),
          className: "cta-five__item--medium",
        },
        {
          subTitle: "Lançamentos Exclusivos",
          /* title: "Bicicleta de Carbono", */
          /* text: "Leve e resistente! A nova Bicicleta de Carbono está com até 50% de desconto. Ideal para quem busca desempenho.", */
          link: "products.html",
          image: require('@/assets/images/banners/banner03.jpg'),
          className: "cta-five__item--dark",
        },
      ],
    };
  },
};
</script>

<style scoped>
.cta-five {
  padding: 40px 0;
}

.cta-five__item {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  text-align: center;
  color: #fff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.cta-five__overlay {
  /* background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)); */
  border-radius: 12px;
  padding: 20px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.cta-five__item__content {
  z-index: 1;
  padding: 20px;
}

.cta-five__item:hover {
  transform: translateY(-5px);
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.15);
}

.sub-title {
  font-size: 14px;
  color: #f1f1f1;
  font-weight: 600;
}

.title {
  font-size: 30px;
  /* Aumenta o tamanho do título */
  margin: 10px 0;
  color: #fff;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.7);
  /* Sombra suave para destaque */
}

.text {
  font-size: 14px;
  margin-bottom: 12px;
}

.cta-five__item__button {
  display: inline-block;
  padding: 10px 24px;
  background-color: #2ECC71;
  color: #fff;
  border-radius: 5px;
  font-size: 14px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.cta-five__item__button:hover {
  background-color: #28a745;
}

.fade-in {
  opacity: 0;
  animation: fadeIn 1s forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
</style>
