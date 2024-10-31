<template>
    <header class="main-header main-header--four sticky-header sticky-header--normal">
        <div class="container">
            <div class="main-header__inner">
                <nav class="main-header__nav main-menu">
                    <ul class="main-menu__list">
                        <li class="dropdown">
                            <a href="#">
                                Categorias 
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
                                </svg>
                            </a>
                            <ul>
                                <li v-for="category in categories" :key="category.id" @click.prevent="selectCategory(category)">
                                    <a href="#">{{ category.name }}</a>
                                    <ul v-if="selectedCategory && selectedCategory.id === category.id">
                                        <li v-for="department in category.departments" :key="department.id">
                                            <a @click.prevent="navigateToDepartment(department.slug)">
                                                {{ department.name }}
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li><a href="about.html">Marca especial</a></li>
                        <li><a href="about.html">Categoria importante</a></li>
                        <li><a href="about.html">Contatos</a></li>
                        <li><a href="about.html">Localização</a></li>
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
            <div v-if="isMobileMenuOpen" class="mobile-menu" ref="mobileMenu">
                <nav class="mobile-menu__nav">
                    <ul class="mobile-menu__list">
                        <li class="dropdown">
                            <a href="#" @click.prevent="toggleMobileDepartments">
                                Categorias 
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
                                </svg>
                            </a>
                            <ul v-if="isDepartmentsOpen">
                                <li v-for="category in categories" :key="category.id" @click.prevent="selectCategory(category)">
                                    <a href="#">{{ category.name }}</a>
                                    <ul v-if="selectedCategory && selectedCategory.id === category.id">
                                        <li v-for="department in category.departments" :key="department.id">
                                            <a @click.prevent="navigateToDepartment(department.slug)">
                                                {{ department.name }}
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li><a href="about.html">Nacionais</a></li>
                        <li><a href="about.html">Importados</a></li>
                        <li><a href="about.html">Para Motos</a></li>
                        <li><a href="about.html">Localização</a></li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
    name: 'HeaderView',
    data() {
        return {
            categories: [], // Array para armazenar todas as categorias
            selectedCategory: null, // Categoria selecionada
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
                this.categories = response.data; // Armazena todas as categorias
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        },
        selectCategory(category) {
            this.selectedCategory = this.selectedCategory && this.selectedCategory.id === category.id ? null : category;
        },
        toggleMobileMenu() {
            this.isMobileMenuOpen = !this.isMobileMenuOpen;
        },
        toggleMobileDepartments() {
            this.isDepartmentsOpen = !this.isDepartmentsOpen;
        },
        navigateToDepartment(departmentSlug) {
            this.isMobileMenuOpen = false;
            this.$router.push({ name: 'produtos', params: { categoriaSlug: this.categorySlug, departamentoSlug: departmentSlug } });
        },
        handleClickOutside(event) {
            const menu = this.$refs.mobileMenu;
            if (this.isMobileMenuOpen && menu && !menu.contains(event.target)) {
                this.isMobileMenuOpen = false;
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
    height: 60px;
}

.main-menu {
    display: flex;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
}

.main-menu__list {
    display: flex;
    flex-grow: 1;
    justify-content: center;
    position: relative;
}

.main-menu__list li {
    list-style: none;
    margin: 0 15px; 
}

.main-menu__list li:first-child {
    margin-right: 90px; 
}

.main-menu__list li:last-child {
    margin-left: auto;
}

.main-header__right {
    display: flex;
    align-items: center;
}

.mobile-nav__btn {
    margin-left: 20px;
}

.mobile-menu {
    display: block;
    background-color: white; 
    position: absolute;
    top: 60px; 
    left: 0;
    right: 0;
    z-index: 1000; 
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
    display: flex;
    align-items: center;
    padding: 10px; 
    border-radius: 5px; 
    color: #333; 
    text-decoration: none; 
    transition: background-color 0.3s, transform 0.3s; 
}

.mobile-menu__list a:hover {
    background-color: #f0f0f0; 
    transform: scale(1.02); 
}

.size-6 {
    width: 16px; 
    height: 16px;
    color: currentColor; 
    margin-left: 5px; 
}
</style>
