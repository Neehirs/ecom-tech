<template>
    <div class="page-wrapper">
      <Banner1 />
      <Marcas />
      <Banner2 />
      
      <Destaques />
      <BannerDuplo />
      
    </div>
  </template>
  
  <script>
  import Banner1 from '@/components/home/Banner1.vue';
  import Marcas from '@/components/home/Marcas.vue';
  import Banner2 from '@/components/home/Banner2.vue';
  import Destaques from '@/components/home/Destaques.vue';
  import BannerDuplo from '@/components/home/BannerDuplo.vue';
 
  
  export default {
    components: {
      Banner1,
      Marcas,
      Banner2,
      Destaques,
      BannerDuplo,
     
    },
    name: 'Home',
  }
  </script>
  
  <style scoped>
  .page-wrapper {
    padding: 20px;
  }
  </style>
  