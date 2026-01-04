import React from 'react';
import { View, FlatList, Text, StyleSheet, ViewStyle } from 'react-native';

interface ResultadosLayerProps<T> {
  datos: T[];
  renderItem: (item: T) => React.ReactElement;
  keyExtractor: (item: T, index: number) => string;
  mensajeVacio?: string;
  estiloContenedor?: ViewStyle;
}

/**
 * Capa de resultados - Tercera capa que muestra los datos en un FlatList
 * Componente genérico reutilizable para mostrar listas
 */
function ResultadosLayer<T>({
  datos,
  renderItem,
  keyExtractor,
  mensajeVacio = 'No hay elementos para mostrar',
  estiloContenedor,
}: ResultadosLayerProps<T>) {
  if (datos.length === 0) {
    return (
      <View style={styles.contenedorVacio}>
        <Text style={styles.textoVacio}>{mensajeVacio}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, estiloContenedor]}>
      <FlatList
        data={datos}
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  lista: {
    padding: 16,
  },
  contenedorVacio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  textoVacio: {
    fontSize: 16,
    color: '#95a5a6',
    textAlign: 'center',
  },
});

export default ResultadosLayer;
