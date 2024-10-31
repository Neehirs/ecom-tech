<template>
    <section class="cta-five">
      <div class="container">
        <div class="row gutter-y-30">
          <div
            class="col-lg-6 wow fadeInUp"
            v-for="(item, index) in items"
            :key="index"
            :data-wow-delay="index * 100 + 'ms'"
          >
            <div class="cta-five__item" :class="item.className">
              
              
              <div class="cta-five__item__image">
                
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
            subTitle: "new collections",
            title: "BMW Accessories",
            text: "Up to 40% off Accessories",
            link: "products.html",
            image: require('@/assets/images/resources/cta-5-1.png'),
            className: "",
          },
          {
            subTitle: "new collections",
            title: "Sports Car Accessories",
            text: "Up to 40% off Accessories",
            link: "products.html",
            image: require('@/assets/images/resources/cta-5-2.png'),
            className: "cta-five__item--two",
          },
        ],
      };
    },
  };
  </script>
  
  <style scoped>
  /* Adicione aqui estilos personalizados, se necessário */
  </style>
  