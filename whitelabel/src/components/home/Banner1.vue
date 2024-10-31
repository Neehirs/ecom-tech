<template>
    <section class="main-slider-four">
      <div class="main-slider-four__carousel karoons-owl__carousel owl-carousel" ref="carousel" :data-owl-options="owlOptions">
        <div v-for="(item, index) in slides" :key="index" class="item">
          <div class="main-slider-four__item">
            <div class="main-slider-four__bg" :style="{ backgroundImage: `url(${item.background})` }"></div>
            <div class="main-slider-four__content">
              <div class="main-slider-four__top">
                <h3 class="main-slider-four__top__title">{{ item.topTitle }}</h3>
                <h5 class="main-slider-four__top__sub-title">{{ item.subTitle }}</h5>
              </div>
              <h2 class="main-slider-four__title">Compre<span>Agora</span></h2>
              <p class="main-slider-four__text">{{ item.text }}</p>
              <div class="main-slider-four__price">{{ item.price }}<span>$</span></div>
            </div>
            <div class="main-slider-four__image">
              <img :src="item.image" alt="White Label">
            </div>
          </div>
        </div>
      </div>
      <div class="main-slider-four__social">
        <a href="https://facebook.com">
          <i class="fab fa-facebook-f" aria-hidden="true"></i>
          <span class="sr-only">Facebook</span>
        </a>
        <a href="https://twitter.com">
          <i class="fab fa-twitter" aria-hidden="true"></i>
          <span class="sr-only">Twitter</span>
        </a>
        <a href="https://instagram.com">
          <i class="fab fa-instagram" aria-hidden="true"></i>
          <span class="sr-only">Instagram</span>
        </a>
        <a href="https://www.youtube.com/">
          <i class="fab fa-youtube" aria-hidden="true"></i>
          <span class="sr-only">Youtube</span>
        </a>
      </div>
    </section>
  </template>
  
  <script>
  import { onMounted, ref } from 'vue';
  
  export default {
    name: 'MainSliderFour',
    setup() {
      const carousel = ref(null);
      const slides = [
        {
          background: require('@/assets/images/shapes/slider-4-1.png'),
          topTitle: 'Desperte o potencial da sua marca!',
          subTitle: 'Crie uma experiência de compra única para seus clientes',
          text: 'Conecte-se de forma significativa e personalizada.',
          price: 290,
          image: require('@/assets/images/ecommerce.webp')
        },
        {
          background: require('@/assets/images/shapes/slider-4-1.png'),
          topTitle: 'Transforme sua visão em realidade!',
          subTitle: 'Aproveite as oportunidades do mundo digital.',
          text: 'Lance seu e-commerce com facilidade e estilo.',
          price: 290,
          image: require('@/assets/images/ecommerce.avif')
        },
        {
          background: require('@/assets/images/shapes/slider-4-1.png'),
          topTitle: 'Sua marca, seu sucesso!',
          subTitle: 'Inicie sua jornada e conquiste o mercado online!',
          text: 'Construa um e-commerce sob medida para você.',
          price: 290,
          image: require('@/assets/images/ecommerce.jpg')
        }
      ];
  
      const owlOptions = {
        loop: true,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        items: 1,
        autoplay: true,
        autoplayTimeout: 7000,
        smartSpeed: 1000,
        nav: false,
        dots: true,
        margin: 0
      };
  
      onMounted(() => {
        // Initialize the owl carousel
        if (carousel.value) {
          $(carousel.value).owlCarousel(owlOptions);
        }
      });
  
      return {
        carousel,
        slides,
        owlOptions
      };
    }
  };
  </script>
  
