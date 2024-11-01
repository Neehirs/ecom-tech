<template>
    <footer class="main-footer-four background-gray">
        <div class="main-footer-four__bg" style="background-color: black;"></div>
        <div class="main-footer-four__top">
            <div class="container">
                <div class="row">
                    <div class="col-md-12 col-lg-4">
                        <div class="footer-widget footer-widget--about">
                            <a href="index.html" class="footer-widget__logo">
                                <img src="@/assets/images/logowhite.png" width="131" alt="Karoons HTML Template">
                            </a>
                            <p class="footer-description">
                                Descubra a melhor experiência de compras online com uma seleção incrível de produtos.
                            </p>
                        </div><!-- /.footer-widget -->
                    </div><!-- /.col-md-6 -->
                    
                    <div class="col-md-4 col-lg-2">
                        <h4 class="footer-heading">Links Rápidos</h4>
                        <ul class="footer-links">
                            <li><a href="#sobre" aria-label="Sobre nós">Sobre</a></li>
                            <li><a href="#contato" aria-label="Contato">Contato</a></li>
                            <li><a href="#privacidade" aria-label="Política de Privacidade">Privacidade</a></li>
                            <li><a href="#termos" aria-label="Termos de Serviço">Termos</a></li>
                        </ul>
                    </div><!-- /.col-md-6 -->

                    <div class="col-md-4 col-lg-2">
                        <h4 class="footer-heading">Siga-nos</h4>
                        <div class="social-icons">
                            <a href="#" aria-label="Facebook" class="social-icon"><i class="fab fa-facebook-f"></i></a>
                            <a href="#" aria-label="Instagram" class="social-icon"><i class="fab fa-instagram"></i></a>
                            <a href="#" aria-label="Twitter" class="social-icon"><i class="fab fa-twitter"></i></a>
                        </div>
                    </div><!-- /.col-md-6 -->
                </div><!-- /.row -->
            </div><!-- /.container -->
        </div><!-- /.main-footer-four__top -->
        <div class="main-footer-four__bottom">
            <div class="container">
                <div class="main-footer-four__bottom__inner">
                    <p class="main-footer-four__copyright">
                        &copy; Copyright <span class="dynamic-year"></span> White Label. Todos os direitos reservados.
                    </p>
                </div><!-- /.main-footer-four__inner -->
            </div><!-- /.container -->
        </div><!-- /.main-footer-four__bottom -->
    </footer><!-- /.main-footer-four -->
</template>
  
<script>
export default {
    name: 'FooterView',
}
</script>

<style scoped>
.main-footer-four {
    padding: 20px 0;
    color: rgb(0, 0, 0);
}

.footer-widget__logo img {
    max-width: 100%;
    height: auto;
}

.footer-description {
    margin-top: 10px;
    font-size: 0.9rem;
    opacity: 0.8;
}

.footer-heading {
    font-size: 1.2rem;
    margin-bottom: 10px;
}

.footer-links {
    list-style: none;
    padding: 0;
}

.footer-links li {
    margin: 5px 0;
}

.footer-links a {
    color: rgb(0, 0, 0);
    text-decoration: none;
    transition: color 0.3s;
}

.footer-links a:hover {
    color: #2ECC71; /* Cor de destaque */
}

.social-icons {
    display: flex;
    gap: 15px; /* Espaçamento entre os ícones */
}

.social-icon {
    color: rgb(0, 0, 0);
    font-size: 1.5rem;
    transition: color 0.3s;
}

.social-icon:hover {
    color: #2ECC71; /* Cor de destaque */
}
</style>
