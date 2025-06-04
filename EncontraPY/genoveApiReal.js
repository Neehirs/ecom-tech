import axios from 'axios';

const API_URI = 'https://api-genove.agcodecraft.com';

const api = axios.create({
  baseURL: API_URI,
});

// Moeda padrão (dólar)
const DEFAULT_MOEDA_ID = 2;

const getCurrencySymbol = (moedaId) => {
  switch (moedaId) {
    case 3:
      return 'G$';
    case 2:
      return 'U$';
    default:
      return '';
  }
};

export const formatPrice = (price, moedaId = DEFAULT_MOEDA_ID) => {
  const symbol = getCurrencySymbol(moedaId);

  if (moedaId === 3) {
    return `${symbol} ${price.toLocaleString('es-PY', {
      useGrouping: true,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;
  }

  return `${symbol} ${price.toLocaleString('pt-BR', {
    useGrouping: true,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

export const fetchGenoveProducts = async (page = 1, params = {}) => {
  try {
    const moedaId = params.moeda_id || DEFAULT_MOEDA_ID;
    
    const response = await api.get('api/public/products', { 
      params: { ...params, moeda_id: moedaId, page } 
    });
    
    const productData = response.data;
    
    // Formatar preços e mapear para o formato esperado pelo app
    if (productData.data && Array.isArray(productData.data)) {
      const products = productData.data.map(product => {
        const price = product.valor_venda || 0;
        const formattedPrice = formatPrice(parseFloat(price), moedaId);
        
        return {
          id: product.id.toString(),
          title: product.nome || '',
          price: formattedPrice,
          image: product.imagens && product.imagens.length > 0 ? product.imagens[0].url : 'https://via.placeholder.com/150',
          availability: product.tem_estoque ? 'disponível' : 'fora de estoque',
          brand: product.marca || '',
          link: product.slug ? `https://www.genove.com.py/produto/${product.slug}` : '#',
          store: 'Genove'
        };
      });
      
      return {
        products,
        pagination: {
          currentPage: productData.current_page,
          lastPage: productData.last_page,
          total: productData.total,
          hasNextPage: productData.current_page < productData.last_page,
          hasPrevPage: productData.current_page > 1
        }
      };
    }
    
    return { products: [], pagination: { currentPage: 1, lastPage: 1, total: 0, hasNextPage: false, hasPrevPage: false } };
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    // Em caso de erro, retorna um objeto vazio
    return { products: [], pagination: { currentPage: 1, lastPage: 1, total: 0, hasNextPage: false, hasPrevPage: false } };
  }
};