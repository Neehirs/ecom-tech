import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import ProductList from './ProductList';

// Cores do tema
const COLORS = {
  primary: '#143447',
  background: '#F8F9FA'
};

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ProductList />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

export default App;