<template>
    <div class="product-one">
        <div class="container">
            <h3 class="product-one__title ">BUSCAR PNEUS</h3>
            <section class="tire-search" :style="{ backgroundImage: `url(${backgroundImage})` }">
                <div class="container">
                    <div class="search-container">
                        <!-- Busca por Medida -->
                        <div class="search-by-size">
                            <h4 class="buscar">Busca por Medida</h4>
                            <form @submit.prevent="searchBySize" class="d-flex flex-wrap align-items-center">
                                <input type="number" placeholder="Largura (mm)" v-model="width"
                                    class="form-control rounded-input" required />
                                <input type="number" placeholder="Altura (%)" v-model="height"
                                    class="form-control rounded-input" required />
                                <input type="number" placeholder="Aro (inches)" v-model="rim"
                                    class="form-control rounded-input" required />
                                <button type="submit" class="btn btn-primary">Pesquisar</button>
                            </form>
                        </div>

                        <!-- Busca por Veículo -->
                        <div class="search-by-vehicle">
                            <h4 class="buscar">Busca por Veículo</h4>
                            <form @submit.prevent="searchByVehicle" class="d-flex flex-wrap align-items-center">
                                <select v-model="selectedBrand" @change="fetchModels"
                                    class="form-control rounded-input vibrant-select">
                                    <option value="" disabled selected>Selecionar Marca</option>
                                    <option v-for="brand in brands" :key="brand.Make_ID" :value="brand.Make_Name">
                                        {{ brand.Make_Name }}
                                    </option>
                                </select>
                                <select v-model="selectedModel" @change="fetchYears" class="form-control rounded-input"
                                    :class="{ 'active-select': selectedBrand }" :disabled="!selectedBrand">
                                    <option value="" disabled selected>Selecionar Modelo</option>
                                    <option v-for="model in models" :key="model.Model_ID" :value="model.Model_Name">
                                        {{ model.Model_Name }}
                                    </option>
                                </select>
                                <select v-model="selectedYear" class="form-control rounded-input"
                                    :disabled="!selectedModel">
                                    <option value="" disabled selected>Selecionar Ano</option>
                                    <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                                </select>
                                <button type="submit" class="btn btn-primary" v-if="selectedYear">Pesquisar</button>
                            </form>
                        </div>

                        <!-- Logo como marca d'água -->
                        <img src="@/assets/images/logo.png" alt="Logo" class="watermark" />
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';

export default {
    name: 'TireSearch',
    setup() {
        const width = ref('');
        const height = ref('');
        const rim = ref('');
        const selectedBrand = ref('');
        const selectedModel = ref('');
        const selectedYear = ref('');
        const brands = ref([]);
        const models = ref([]);
        const years = ref([]);

        // Fetch brands from the API
        const fetchBrands = async () => {
            const response = await axios.get('https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json');
            brands.value = response.data.Results;
        };

        // Fetch models based on selected brand
        const fetchModels = async () => {
            if (!selectedBrand.value) return;
            const response = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${encodeURIComponent(selectedBrand.value)}?format=json`);
            models.value = response.data.Results;
            selectedModel.value = ''; // Reset model
            years.value = []; // Clear years when brand changes
            selectedYear.value = ''; // Reset year
        };

        const fetchYears = async () => {
            if (!selectedBrand.value || !selectedModel.value) return;

            try {
                const response = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelyearsformakeandmodel/${encodeURIComponent(selectedBrand.value)}/${encodeURIComponent(selectedModel.value)}?format=json`);

                if (response.data && response.data.Results.length > 0) {
                    years.value = response.data.Results.map(year => year.Model_Year);
                } else {
                    console.error('Nenhum ano encontrado para a marca e modelo selecionados:', selectedBrand.value, selectedModel.value);
                    years.value = []; // Limpa anos se nenhum resultado for encontrado
                }
                selectedYear.value = ''; // Reseta o ano
            } catch (error) {
                console.error('Erro ao buscar anos:', error.response ? error.response.data : error.message);
            }
        };

        const searchBySize = () => {
            console.log(`Buscando pneus com medida: ${width.value}mm, ${height.value}%, aro ${rim.value} inches`);
        };

        const searchByVehicle = () => {
            console.log(`Buscando pneus para veículo: ${selectedBrand.value} ${selectedModel.value}, ano ${selectedYear.value}`);
        };

        fetchBrands(); // Fetch brands when the component mounts

        return {
            width,
            height,
            rim,
            selectedBrand,
            selectedModel,
            selectedYear,
            brands,
            models,
            years,
            searchBySize,
            searchByVehicle,
            fetchModels,
            fetchYears,
            backgroundImage: require('@/assets/images/backgroundBusca.png'),
        };
    },
};
</script>

<style scoped>
.product-one {
    margin: 0 auto;
    max-width: 1200px;
}

.buscar {
    font-size: 2rem;
    color: rgba(102, 102, 102);
    font-weight: 650;
    text-align: left;
    margin-right: 20px;
}

.tire-search {
    position: relative;
    padding: 50px 20px;
    border-radius: 15px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1), 0 0 0 0.5px #2ECC71;
    margin: 40px auto;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border: none;
}

.search-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.search-by-size,
.search-by-vehicle {
    display: flex;
    flex-direction: row;
    align-items: center;
}

form {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
}

.rounded-input {
    border: 2px solid #2ECC71;
    border-radius: 30px;
    padding: 12px 15px;
    width: 150px;
    transition: border-color 0.3s, box-shadow 0.3s;
    font-size: 1rem;
    box-shadow: 0 0 5px rgba(226, 59, 51, 0.5);
    opacity: 0.3;
}

.active-select {
    opacity: 1;
}

.vibrant-select {
    opacity: 1;
}

.rounded-input:focus {
    border-color: #FF9800;
    outline: none;
    box-shadow: 0 0 8px rgba(255, 152, 0, 0.5);
}

.btn {
    background-color: #2ECC71;
    color: white;
    border: none;
    border-radius: 30px;
    padding: 12px 20px;
    transition: background-color 0.3s, transform 0.2s, box-shadow 0.3s;
    box-shadow: 0 4px 10px rgba(226, 59, 51, 0.3);
    font-size: 1rem;
    width: 150px;
}

.btn:hover {
    background-color: #FF9800;
    transform: translateY(-4px);
    box-shadow: 0 6px 14px rgba(226, 59, 51, 0.5);
}

.watermark {
    position: absolute;
    bottom: 10px;
    right: 10px;
    opacity: 0.05;
    max-width: 80px;
}

.title-red {
    margin-top: 20px;
    color: #2ECC71;
    text-align: left;
    font-weight: bold;
}

@media (max-width: 768px) {

    .search-by-size,
    .search-by-vehicle {
        flex-direction: column;
        align-items: flex-start;
    }

    .buscar {
        margin-bottom: 10px;
    }

    .rounded-input,
    .btn {
        width: 100%;
    }

    .search-container {
        flex-direction: column;
        gap: 20px;
    }
}
</style>
