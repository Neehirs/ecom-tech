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
        subTitle: 'trends products',
        title: 'Get 50% discount on all car accessories',
        listItems: ['shell power', 'premium quality'],
        buttonText: 'Shop Now',
        buttonLink: 'products.html',
      };
    },
  };
  </script>

<style scoped>
.cta-sevens {
    margin-bottom: 30px;
    margin: 0 auto;
    max-width: 1200px;
}
</style>