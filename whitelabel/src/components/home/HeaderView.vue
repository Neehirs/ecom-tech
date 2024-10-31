<template>
    <header class="main-header main-header--four sticky-header sticky-header--normal">
        <div class="container">
            <div class="main-header__inner">
                <nav class="main-header__nav main-menu">
                    <ul class="main-menu__list">
                        <li class="dropdown">
                            <a href="#" class="menu-link" @click.prevent="toggleMobileDepartments">
                                Categorias 
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
                                </svg>
                            </a>
                            <ul v-if="isDepartmentsOpen">
                                <li v-for="category in categories" :key="category.id" @click.stop="selectCategory(category)">
                                    <a href="#" class="category-link">{{ category.name }}</a>
                                    <ul v-if="selectedCategory && selectedCategory.id === category.id">
                                        <li v-for="department in category.departments" :key="department.id">
                                            <a @click.stop.prevent="navigateToDepartment(department.slug)" class="department-link">
                                                {{ department.name }}
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li><a href="about.html" class="menu-link">Marca especial</a></li>
                        <li><a href="about.html" class="menu-link">Categoria importante</a></li>
                        <li><a href="about.html" class="menu-link">Contatos</a></li>
                        <li><a href="about.html" class="menu-link">Localização</a></li>
                    </ul>
                </nav>
                <div class="main-header__right">
                    <div class="mobile-nav__btn mobile-nav__toggler" @click="toggleMobileMenu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
            <transition name="fade">
                <div v-if="isMobileMenuOpen" class="mobile-menu" ref="mobileMenu">
                    <nav class="mobile-menu__nav">
                        <ul class="mobile-menu__list">
                            <li class="dropdown">
                                <a href="#" @click.prevent="toggleMobileDepartments" class="menu-link">
                                    Categorias 
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
                                    </svg>
                                </a>
                                <ul v-if="isDepartmentsOpen" class="mobile-department-list">
                                    <li v-for="category in categories" :key="category.id" @click.stop="selectCategory(category)">
                                        <a href="#" class="category-link">{{ category.name }}</a>
                                        <ul v-if="selectedCategory && selectedCategory.id === category.id">
                                            <li v-for="department in category.departments" :key="department.id">
                                                <a @click.stop.prevent="navigateToDepartment(department.slug)" class="department-link">
                                                    {{ department.name }}
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            <li><a href="about.html" class="menu-link">Nacionais</a></li>
                            <li><a href="about.html" class="menu-link">Importados</a></li>
                            <li><a href="about.html" class="menu-link">Para Motos</a></li>
                            <li><a href="about.html" class="menu-link">Localização</a></li>
                        </ul>
                    </nav>
                </div>
            </transition>
        </div>
    </header>
</template>

<script>
import axios from 'axios';

export default {
    name: 'HeaderView',
    data() {
        return {
            categories: [],
            selectedCategory: null,
            isMobileMenuOpen: false,
            isDepartmentsOpen: false,
            categorySlug: 'pneus',
        };
    },
    created() {
        this.fetchCategories();
        document.addEventListener('click', this.handleClickOutside);
    },
    beforeDestroy() {
        document.removeEventListener('click', this.handleClickOutside);
    },
    methods: {
        async fetchCategories() {
            try {
                const response = await axios.get('https://api-wl.agcodecraft.com/api/public/categories');
                this.categories = response.data;
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        },
        selectCategory(category) {
            this.selectedCategory = this.selectedCategory && this.selectedCategory.id === category.id ? null : category;
        },
        toggleMobileMenu() {
            // Alterna o estado do menu mobile
            this.isMobileMenuOpen = !this.isMobileMenuOpen;
            // Reseta o estado dos departamentos
            if (this.isMobileMenuOpen) {
                this.isDepartmentsOpen = false; // Fecha os departamentos ao abrir o menu
            }
        },
        toggleMobileDepartments() {
            this.isDepartmentsOpen = !this.isDepartmentsOpen; // Alterna o estado dos departamentos
        },
        navigateToDepartment(departmentSlug) {
            this.isMobileMenuOpen = false; // Fecha o menu mobile ao navegar
            this.$router.push({ name: 'produtos', params: { categoriaSlug: this.categorySlug, departamentoSlug: departmentSlug } });
        },
        handleClickOutside(event) {
            const menu = this.$refs.mobileMenu;
            if (this.isMobileMenuOpen && menu && !menu.contains(event.target)) {
                this.isMobileMenuOpen = false; // Fecha o menu ao clicar fora dele
            }
        }
    },
};
</script>

<style scoped>
.main-header__inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
    background-color: #fff; /* Cor de fundo */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Sombra leve */
}

.main-menu__list {
    display: flex;
    flex-grow: 1;
    justify-content: center;
}

.main-menu__list li {
    list-style: none;
    margin: 0 15px;
    position: relative;
}

.menu-link {
    padding: 10px 15px;
    font-weight: 600;
    color: #333;
    transition: color 0.3s, background-color 0.3s;
}

.menu-link:hover {
    color: #007bff;
    background-color: rgba(0, 123, 255, 0.1);
    border-radius: 5px;
}

.mobile-menu {
    display: block;
    background-color: #f8f9fa; /* Cor de fundo do menu */
    position: absolute;
    top: 70px; /* Ajuste para a altura do header */
    left: 0;
    right: 0;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: max-height 0.3s ease;
    padding: 15px; /* Adiciona espaçamento */
}

.mobile-menu__nav {
    padding: 10px;
}

.mobile-menu__list {
    list-style: none;
    padding: 0;
}

.mobile-menu__list li {
    margin: 10px 0;
}

.mobile-menu__list a {
    display: block;
    padding: 12px 15px; /* Aumenta a área clicável */
    border-radius: 5px;
    color: #333;
    text-decoration: none;
    transition: background-color 0.3s, transform 0.3s;
}

.mobile-menu__list a:hover {
    background-color: #e9ecef;
    transform: scale(1.02);
}

.department-list,
.mobile-department-list {
    padding-left: 15px; /* Adiciona espaçamento à lista de departamentos */
    display: none; /* Oculta inicialmente as subcategorias */
}

.department-list.active,
.mobile-department-list.active {
    display: block; /* Exibe quando ativo */
}

/* Animações */
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}
.size-6 {
    width: 16px;
    height: 16px;
    color: currentColor;
    margin-left: 5px;
}
</style>
