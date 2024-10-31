<template>
  <div id="app">
    <div class="layout">
      <div class="custom-cursor__cursor"></div>
      <div class="custom-cursor__cursor-two"></div>

      <div class="preloader">
        <div class="preloader__image" style="background-image: url(@/assets/images/loader.png);"></div>
      </div>
      <TopBar />
      <HeaderView />
      <Breadcrumbs />
      <router-view />
      <MobileArea />
    </div>
    <FooterView />
  </div>
</template>


<MobileArea/>

<script>
import HeaderView from '@/components/home/HeaderView.vue';
import TopBar from './components/home/TopBar.vue';
import MobileArea from './components/home/MobileArea.vue';
import FooterView from './components/home/FooterView.vue';
import Breadcrumbs from './components/template/breadcrumbs.vue';

export default {
  components: {
    HeaderView,
    TopBar,
    MobileArea,
    FooterView,
    Breadcrumbs
  },
  name: 'App',
}
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh; 
}

.layout {
  flex: 1; 
}

.footer {
  background-color: #f8f8f8; 
  padding: 20px; 
  text-align: center; 
}


.my-component {
  font-family: 'Oswald', sans-serif;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
