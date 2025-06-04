import { parseString } from 'react-native-xml2js';
import { genoveXml } from './localData';

export const fetchGenoveProducts = async () => {
  try {
    return new Promise((resolve, reject) => {
      // Opções para ignorar tags vazias
      const options = {
        explicitArray: true,
        normalizeTags: false,
        emptyTag: null,  // Converte tags vazias para null
        ignoreAttrs: true // Ignora atributos XML
      };

      parseString(genoveXml, options, (err, result) => {
        if (err) {
          console.error('Erro ao converter XML:', err);
          reject(err);
          return;
        }
        
        try {
          if (!result || !result.rss || !result.rss.channel || !result.rss.channel[0]) {
            reject(new Error('Estrutura XML inválida'));
            return;
          }
          
          const items = result.rss.channel[0].item || [];
          const products = [];
          
          for (const item of items) {
            // Verifica se os campos obrigatórios existem
            if (item.title && item.codigo && item.preco && item.disponibilidade) {
              products.push({
                id: item.codigo[0],
                title: item.title[0],
                price: item.preco[0],
                image: item.link_imagem ? item.link_imagem[0] : 'https://via.placeholder.com/150',
                availability: item.disponibilidade[0],
                brand: item.marca ? item.marca[0] : 'Sem marca',
                link: item.link ? item.link[0] : '#',
                store: 'Genove'
              });
            }
          }
          
          resolve(products);
        } catch (processingError) {
          console.error('Erro ao processar dados XML:', processingError);
          reject(processingError);
        }
      });
    });
  } catch (error) {
    console.error('Erro geral:', error);
    throw error;
  }
};