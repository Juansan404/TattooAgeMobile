import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

interface CargaLayerProps {
  mensaje?: string;
}

/**
 * Capa de carga - Segunda capa que muestra un spinner mientras se cargan los datos
 */
const CargaLayer: React.FC<CargaLayerProps> = ({ mensaje = 'Cargando...' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#e74c3c" />
      <Text style={styles.mensaje}>{mensaje}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  mensaje: {
    marginTop: 15,
    fontSize: 16,
    color: '#95a5a6',
  },
});

export default CargaLayer;
