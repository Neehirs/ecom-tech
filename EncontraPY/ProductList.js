import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  StyleSheet, 
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  StatusBar,
  Dimensions,
  ScrollView,
  Animated,
  Platform,
  LogBox,
  Keyboard
} from 'react-native';

// Ignorar avisos específicos que podem estar causando problemas
LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
import { fetchGenoveProducts } from './genoveApiReal';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;

// Cores do tema - Paleta moderna (mantendo as cores padrões)
const COLORS = {
  primary: '#143447',  // Mantendo a cor primária original
  primaryLight: '#2563EB',
  accent: '#F43F5E',
  background: '#F9FAFB',
  card: '#FFFFFF',
  text: '#1F2937',
  textLight: '#6B7280',
  border: '#E5E7EB',
  success: '#10B981',
  error: '#EF4444',
  searchBg: '#F3F4F6',
  shadow: 'rgba(0,0,0,0.1)'
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [showSearch, setShowSearch] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Referência para o FlatList
  const flatListRef = useRef(null);
  
  // Valor de animação para o cabeçalho fixo
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = 60;
  
  // Estado para controlar a visibilidade do cabeçalho fixo
  // O cabeçalho fixo está sempre visível
  const [showFixedHeader] = useState(true);
  
  // Calcula a opacidade do cabeçalho fixo com base na posição de rolagem
  // Animação básica para o cabeçalho
  const headerOpacity = scrollY.interpolate({
    inputRange: [10, 80],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });
  
  useEffect(() => {
    loadProducts();
    
    // Limpar o timeout quando o componente for desmontado
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  // Efeito para rolar para o topo quando os produtos são atualizados
  useEffect(() => {
    if (filteredProducts.length > 0) {
      goToTop();
    }
  }, [filteredProducts]);

  const loadProducts = async (page = 1, query = searchQuery, sort = sortOption) => {
    try {
      setLoading(page === 1);
      if (page > 1) setLoadingMore(true);
      
      // Aqui adicionamos os parâmetros de busca e ordenação para a API
      const result = await fetchGenoveProducts(page, query, sort);
      
      // Sempre substituir os produtos ao mudar de página
      setProducts(result.products);
      setFilteredProducts(result.products);
      
      setPagination(result.pagination);
      setLoading(false);
      setLoadingMore(false);
      setIsSearching(false);
    } catch (err) {
      setError('Falha ao carregar produtos: ' + err.message);
      setLoading(false);
      setLoadingMore(false);
      setIsSearching(false);
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.lastPage && page !== pagination.currentPage) {
      loadProducts(page);
      // Rolar para o topo ao mudar de página
      goToTop();
    }
  };

  // Função para rolar para o topo quando a página for atualizada
  const goToTop = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  };

  // Referência para o timeout de debounce
  const searchTimeout = useRef(null);
  
  // Indicador visual de que a busca está em andamento
  const [isSearching, setIsSearching] = useState(false);
  
  // Função para lidar com a mudança no campo de busca
  const handleSearchChange = (text) => {
    setSearchQuery(text);
    
    // Limpar o timeout anterior se existir
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
      setIsSearching(false);
    }
    
    if (text.trim().length > 0) {
      setIsSearching(true);
    }
    
    // Configurar um novo timeout (1000ms de debounce)
    searchTimeout.current = setTimeout(() => {
      if (text.trim().length > 0) {
        loadProducts(1, text, sortOption);
      }
      setIsSearching(false);
    }, 1000);
  };
  
  // Função para lidar com a submissão da pesquisa (quando o usuário pressiona Enter)
  const handleSearchSubmit = () => {
    // Limpar qualquer timeout pendente
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    setIsSearching(false);
    
    // Executar a pesquisa imediatamente apenas se houver texto
    if (searchQuery.trim().length > 0) {
      console.log('Pesquisa submetida:', searchQuery);
      loadProducts(1, searchQuery, sortOption);
    }
    Keyboard.dismiss();
  };

  // Função para lidar com a mudança na ordenação
  const handleSortChange = (option) => {
    setSortOption(option);
    // Recarregar produtos com a nova ordenação
    loadProducts(1, searchQuery, option);
  };

  const renderItem = ({ item }) => {
    const isAvailable = item.availability !== 'fora de estoque';
    
    return (
      <TouchableOpacity 
        style={styles.productCard}
        activeOpacity={0.9}
        onPress={() => {
          // Feedback visual ao tocar no card
          console.log(`Produto selecionado: ${item.title}`);
        }}
      >
        <Image 
          source={item.image ? { uri: item.image } : require('./assets/placeholder.png')} 
          style={styles.productImage}
          resizeMode="cover"
          defaultSource={require('./assets/placeholder.png')}
        />
        <View style={styles.productInfo}>
          <View>
            <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.productBrand}>{item.brand}</Text>
          </View>
          <View>
            <Text style={styles.productPrice}>{item.price}</Text>
            <View style={styles.bottomRow}>
              <View style={[
                styles.productAvailability,
                isAvailable ? styles.available : styles.unavailable
              ]}>
                <Text style={styles.availabilityText}>
                  {isAvailable ? 'Disponível' : 'Fora de estoque'}
                </Text>
              </View>
              <Text style={styles.storeName}>{item.store}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    return (
      <View>
        {loadingMore && (
          <View style={styles.loadingMore}>
            <ActivityIndicator size="small" color={COLORS.accent} />
            <Text style={styles.loadingMoreText}>Carregando mais produtos...</Text>
          </View>
        )}
        
        <View style={styles.paginationContainer}>
          <TouchableOpacity 
            style={[styles.pageButton, !pagination.hasPrevPage && styles.pageButtonDisabled]}
            onPress={() => goToPage(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage}
            activeOpacity={pagination.hasPrevPage ? 0.7 : 1}
          >
            <Text style={[styles.pageButtonText, !pagination.hasPrevPage && styles.pageButtonTextDisabled]}>
              {'←'}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.paginationTextContainer}>
            <Text style={styles.paginationText}>
              Página {pagination.currentPage} de {pagination.lastPage}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.pageButton, !pagination.hasNextPage && styles.pageButtonDisabled]}
            onPress={() => goToPage(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
            activeOpacity={pagination.hasNextPage ? 0.7 : 1}
          >
            <Text style={[styles.pageButtonText, !pagination.hasNextPage && styles.pageButtonTextDisabled]}>
              {'→'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const ListHeaderComponent = () => (
    <View>
      {/* Espaço para o cabeçalho fixo */}
      <View style={{ height: 75 }} />
      
      {!loading && !error && (
        <View style={styles.resultsInfo}>
          <Text style={styles.resultsText}>
            <Text style={{fontWeight: 'bold', color: COLORS.primary}}>{pagination.total}</Text> produtos encontrados
          </Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.accent} />
          <Text style={styles.loadingText}>Carregando produtos...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => loadProducts()}
            activeOpacity={0.7}
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };
  
  const handleBack = () => {
    // Implementar navegação de volta
    console.log('Voltar');
  };
  
  const handleFilterPress = () => {
    // Mostrar modal de filtros
    console.log('Abrir filtros');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Cabeçalho fixo que sempre aparece */}
      <Animated.View 
        style={[
          styles.fixedHeader,
          { 
            opacity: 1, 
            position: 'sticky', 
            top: 0
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        
        <Image 
          source={require('./assets/logo.png')} 
          style={styles.smallLogo}
          resizeMode="contain"
        />
        
        <View style={styles.headerIcons}>
          <TouchableOpacity 
            style={styles.headerIcon} 
            onPress={handleFilterPress}
            activeOpacity={0.7}
          >
            <Text style={styles.iconText}>≡</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerIcon} 
            onPress={toggleSearch}
            activeOpacity={0.7}
          >
            <Text style={styles.iconText}>🔍</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      
      {/* Barra de pesquisa que aparece quando showSearch é true */}
      {showSearch && (
        <View 
          style={styles.searchOverlay}
        >
          <View style={styles.searchInputContainer}>
            {isSearching && (
              <ActivityIndicator 
                size="small" 
                color="#fff" 
                style={{marginRight: 8}} 
              />
            )}
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChangeText={handleSearchChange}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
              placeholderTextColor="rgba(255,255,255,0.7)"
              autoFocus
              selectionColor="rgba(255,255,255,0.5)"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery ? (
              <TouchableOpacity 
                style={styles.clearButton} 
                onPress={() => {
                  setSearchQuery('');
                  if (searchTimeout.current) {
                    clearTimeout(searchTimeout.current);
                  }
                  loadProducts(1, '', sortOption);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.searchButton} 
                onPress={handleSearchSubmit}
                activeOpacity={0.7}
              >
                <Text style={styles.searchButtonText}>🔍</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
      
      <FlatList
        ref={flatListRef}
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        ListHeaderComponent={ListHeaderComponent}
        stickyHeaderIndices={[0]}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>Nenhum produto encontrado</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => loadProducts(1, '', 'default')}
              activeOpacity={0.7}
            >
              <Text style={styles.retryButtonText}>Limpar filtros</Text>
            </TouchableOpacity>
          </View>
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 65,
    backgroundColor: '#143447',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 9999,
    elevation: 9999,
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    borderBottomWidth: 0,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
  smallLogo: {
    height: 38,
    width: 130,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  iconText: {
    fontSize: 18,
    color: '#fff',
  },
  searchOverlay: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: '#143447',
    padding: 12,
    zIndex: 10000,
    elevation: 10000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  searchContainer: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 54,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    paddingLeft: 15,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#fff',
    paddingHorizontal: 8,
  },
  clearButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  searchButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  sortContainer: {
    marginTop: 16,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  sortLabel: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  sortOptionsScroll: {
    width: '100%',
    height: 50,
  },
  sortOptionsContent: {
    paddingRight: 20,
    paddingBottom: 5,
  },
  sortOption: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: 'rgba(20,52,71,0.1)',
    marginRight: 12,
    minWidth: 110,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(20,52,71,0.1)',
  },
  sortOptionActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  sortOptionText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  sortOptionTextActive: {
    fontWeight: 'bold',
    color: '#fff',
  },
  resultsInfo: {
    padding: 16,
    backgroundColor: COLORS.background,
  },
  resultsText: {
    fontSize: 15,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  list: {
    padding: 16,
    paddingTop: 0,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 0,
    transform: [{ scale: 0.98 }],
  },
  productImage: {
    width: 140,
    height: 160,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  productInfo: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 24,
    letterSpacing: -0.3,
  },
  productBrand: {
    fontSize: 15,
    color: COLORS.textLight,
    marginBottom: 8,
    fontWeight: '500',
  },
  productPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  productAvailability: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  available: {
    backgroundColor: COLORS.success,
  },
  unavailable: {
    backgroundColor: COLORS.error,
  },
  availabilityText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  storeName: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 200,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  loadingMore: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingMoreText: {
    marginLeft: 12,
    fontSize: 15,
    color: COLORS.textLight,
  },
  errorContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: '85%',
    maxWidth: 350,
  },

  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
    marginTop: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  noResults: {
    padding: 40,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 17,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: 16,
  },
  pageButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
    transform: [{ scale: 0.95 }],
  },
  pageButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  pageButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pageButtonTextDisabled: {
    color: COLORS.textLight,
  },
  paginationTextContainer: {
    backgroundColor: 'rgba(0,0,0,0.04)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  paginationText: {
    fontSize: 16,
    color: COLORS.text,
    marginHorizontal: 12,
    fontWeight: '500',
  }
});

export default ProductList;