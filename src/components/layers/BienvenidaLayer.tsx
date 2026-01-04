import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BienvenidaLayerProps {
  titulo: string;
  mensaje?: string;
}

/**
 * Capa de bienvenida - Primera capa que se muestra al usuario
 */
const BienvenidaLayer: React.FC<BienvenidaLayerProps> = ({ titulo, mensaje }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{titulo}</Text>
      {mensaje && <Text style={styles.mensaje}>{mensaje}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
    textAlign: 'center',
  },
  mensaje: {
    fontSize: 16,
    color: '#95a5a6',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default BienvenidaLayer;
