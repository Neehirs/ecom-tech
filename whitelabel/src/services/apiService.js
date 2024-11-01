import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api-genove.agcodecraft.com/api/public',
});

// Função para buscar categorias
export const fetchCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    throw error;
  }
};

// Função para buscar marcas
export const fetchBrands = async () => {
  try {
    const response = await api.get('/brands');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar marcas:', error);
    throw error;
  }
};

// Função para buscar produtos com parâmetros dinâmicos (paginação, ordenação, etc.)
export const fetchProducts = async (params) => {
  try {
    const response = await api.get('/products', { params });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
};

// Função para buscar produtos de uma marca específica usando o brand_id
export const fetchProductsByBrandId = async (brandId, otherParams = {}) => {
  try {
    const response = await api.get('/products', { 
      params: { 
        brand_id: brandId, 
        ...otherParams // Permite passar outros parâmetros como página e ordenação
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar produtos da marca:', error);
    throw error;
  }
};
