<template>
        <div class="mobile-nav__wrapper">
        <div class="mobile-nav__overlay mobile-nav__toggler"></div>
        <!-- /.mobile-nav__overlay -->
        <div class="mobile-nav__content">
            <span class="mobile-nav__close mobile-nav__toggler"><i class="fa fa-times"></i></span>

            <div class="logo-box">
                <a href="index.html" aria-label="logo image"><img src="@/assets/images/logo-light.png" width="155" alt="" /></a>
            </div>
            <!-- /.logo-box -->
            <div class="mobile-nav__container"></div>
            <!-- /.mobile-nav__container -->

            <ul class="mobile-nav__contact list-unstyled">
                <li>
                    <i class="fa fa-envelope"></i>
                    <a href="mailto:needhelp@karoons.com">needhelp@karoons.com</a>
                </li>
                <li>
                    <i class="fa fa-phone-alt"></i>
                    <a href="tel:666-888-0000">666 888 0000</a>
                </li>
            </ul><!-- /.mobile-nav__contact -->
            <div class="mobile-nav__social">
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
            </div><!-- /.mobile-nav__social -->
        </div>
        <!-- /.mobile-nav__content -->
    </div>
    <!-- /.mobile-nav__wrapper -->
    <div class="search-popup">
        <div class="search-popup__overlay search-toggler"></div>
        <!-- /.search-popup__overlay -->
        <div class="search-popup__content">
            <form role="search" method="get" class="search-popup__form" action="#">
                <input type="text" id="search" placeholder="Search Here..." />
                <button type="submit" aria-label="search submit" class="karoons-btn">
                    <span><i class="flaticon-search"></i></span>
                </button>
            </form>
        </div>
        <!-- /.search-popup__content -->
    </div>
    <!-- /.search-popup -->
    <!-- Sidebar One Start -->
    <aside class="sidebar-one">
        <div class="sidebar-one__overlay"></div><!-- /.siderbar-ovarlay -->
        <div class="sidebar-one__content">
            <div class="sidebar-one__close"><i class="flaticon-close"></i></div><!-- /.siderbar-close -->
            <div class="sidebar-one__logo">
                <a href="index.html" aria-label="logo image"><img src="@/assets/images/logo-2-light.png" alt="karoons" width="147"></a>
            </div><!-- /.sidebar-one__logo-box -->
            <p class="sidebar-one__text">
                Mauris ut enim sit amet lacus ornare ullamcor. Praesent placerat nequ
                puru rhoncu tincidunt odio ultrices. Sed feugiat feugiat felis.
            </p>
            <h4 class="sidebar-one__title">Contact Info:</h4>
            <ul class="sidebar-one__info">
                <li>
                    <span class="fas fa-map-marker-alt"></span>
                    85 Ketch Harbour RoadBensalem, PA 19020
                </li>
                <li>
                    <span class="fas fa-envelope"></span>
                    <a href="mailto:needhelp@company.com">needhelp@company.com</a>
                </li>
                <li>
                    <span class="fas fa-phone-alt"></span>
                    <a href="tel:09969569535">099 695 695 35</a>
                </li>
            </ul>
            <div class="sidebar-one__social">
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
            </div><!-- /sidebar-one__socila -->
            <h4 class="sidebar-one__title">Newsletter:</h4>
            <form action="#" data-url="MAILCHIMP_FORM_URL" class="sidebar-one__newsletter mc-form">
                <input type="text" name="EMAIL" placeholder="Email address">
                <button type="submit" class="fas fa-paper-plane">
                    <span class="sr-only">submit</span><!-- /.sr-only -->
                </button>
            </form><!-- /.footer-widget__newsletter mc-form -->
        </div><!-- /.sidebar__content -->
    </aside>
</template>
  
  <script>
  // @ is an alias to /src
  
  export default {
    name: 'MobileArea',
  
  }
  </script>
  