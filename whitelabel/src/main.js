import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import '@/assets/images/favicons/apple-touch-icon.png'
import '@/assets/images/favicons/favicon-32x32.png'
import '@/assets/images/favicons/favicon-16x16.png'
//import '@/assets/images/favicons/site.webmanifest'

import '@/assets/vendors/bootstrap/css/bootstrap.min.css'
import '@/assets/vendors/bootstrap-select/bootstrap-select.min.css'
import '@/assets/vendors/animate/animate.min.css'
import '@/assets/vendors/fontawesome/css/all.min.css'
import '@/assets/vendors/jquery-ui/jquery-ui.css'
import '@/assets/vendors/date-time-picker/jquery.datetimepicker.min.css'
import '@/assets/vendors/jarallax/jarallax.css'
import '@/assets/vendors/jquery-magnific-popup/jquery.magnific-popup.css'
import '@/assets/vendors/nouislider/nouislider.min.css'
import '@/assets/vendors/nouislider/nouislider.pips.css'
import '@/assets/vendors/tiny-slider/tiny-slider.css'
import '@/assets/vendors/karoons-icons/style.css'
import '@/assets/vendors/slick/slick.css'
import '@/assets/vendors/owl-carousel/css/owl.carousel.min.css'
import '@/assets/vendors/owl-carousel/css/owl.theme.default.min.css'


import '@/assets/css/karoons.css'
import jQuery from 'jquery';
import bootstrap from 'bootstrap'
window.$ = window.jQuery = jQuery;
window.bootstrap = bootstrap;

// pacotes instalados via NPM
// require("@/assets/vendors/jquery/jquery-3.7.0.min.js")
// import jQuery from "@/assets/vendors/jquery/jquery-3.7.0.min.js";
// window.$ = window.jQuery = jQuery;
 //require("@/assets/vendors/jquery-magnific-popup/jquery.magnific-popup.min.js")


 require("@/assets/vendors/bootstrap/js/bootstrap.bundle.min.js")
//  require("@/assets/vendors/bootstrap-select/bootstrap-select.min.js")
 require("@/assets/vendors/jarallax/jarallax.min.js")
 require("@/assets/vendors/jquery-ui/jquery-ui.js")
 //require("@/assets/vendors/date-time-picker/jquery.datetimepicker.min.js")
 require("@/assets/vendors/jquery-ajaxchimp/jquery.ajaxchimp.min.js")
 require("@/assets/vendors/jquery-appear/jquery.appear.min.js")
 require("@/assets/vendors/jquery-circle-progress/jquery.circle-progress.min.js")
 require("@/assets/vendors/jquery-validate/jquery.validate.min.js")
 require("@/assets/vendors/nouislider/nouislider.min.js")
 require("@/assets/vendors/tiny-slider/tiny-slider.js")
 require("@/assets/vendors/wnumb/wNumb.min.js")
 require("@/assets/vendors/owl-carousel/js/owl.carousel.min.js")
 require("@/assets/vendors/wow/wow.js")
 require("@/assets/vendors/imagesloaded/imagesloaded.min.js")
 require("@/assets/vendors/isotope/isotope.js")
 require("@/assets/vendors/slick/slick.min.js")
 require("@/assets/vendors/countdown/countdown.min.js")
 require("@/assets/vendors/jquery-circleType/jquery.circleType.js")
 require("@/assets/vendors/jquery-lettering/jquery.lettering.min.js")
//  // <!-- gsap js -->
 require("@/assets/vendors/gsap/gsap.js")
 require("@/assets/vendors/gsap/scrolltrigger.min.js")
 require("@/assets/vendors/gsap/splittext.min.js")
 require("@/assets/vendors/gsap/karoons-split.js")
//  // <!-- template js -->
 require("@/assets/js/karoons.js")

createApp(App).use(store).use(router).mount('#app')
