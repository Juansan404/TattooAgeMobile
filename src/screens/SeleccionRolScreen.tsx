import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  SeleccionRol: undefined;
  Cliente: undefined;
  Artista: undefined;
};

type SeleccionRolScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SeleccionRol'
>;

interface SeleccionRolScreenProps {
  navigation: SeleccionRolScreenNavigationProp;
}

/**
 * Pantalla inicial para seleccionar el rol (Cliente o Artista)
 */
const SeleccionRolScreen: React.FC<SeleccionRolScreenProps> = ({ navigation }) => {
  const handleSeleccionarCliente = () => {
    navigation.navigate('Cliente');
  };

  const handleSeleccionarArtista = () => {
    navigation.navigate('Artista');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>TattooAge</Text>
        <Text style={styles.subtitulo}>Gestión de estudios de tatuajes</Text>

        <View style={styles.botonesContainer}>
          <TouchableOpacity
            style={[styles.boton, styles.botonCliente]}
            onPress={handleSeleccionarCliente}
            activeOpacity={0.8}
          >
            <Ionicons name="person" size={48} color="#3498db" style={{ marginBottom: 12 }} />
            <Text style={styles.botonTexto}>Soy Cliente</Text>
            <Text style={styles.botonDescripcion}>
              Buscar artistas y agendar citas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.boton, styles.botonArtista]}
            onPress={handleSeleccionarArtista}
            activeOpacity={0.8}
          >
            <Ionicons name="color-palette" size={48} color="#e74c3c" style={{ marginBottom: 12 }} />
            <Text style={styles.botonTexto}>Soy Artista</Text>
            <Text style={styles.botonDescripcion}>
              Gestionar portfolio y agenda
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>v1.0.0 - 2026</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    color: '#95a5a6',
    marginBottom: 60,
  },
  botonesContainer: {
    width: '100%',
    gap: 20,
  },
  boton: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  botonCliente: {
    borderWidth: 2,
    borderColor: '#3498db',
  },
  botonArtista: {
    borderWidth: 2,
    borderColor: '#e74c3c',
  },
  botonTexto: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  botonDescripcion: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    fontSize: 12,
    color: '#95a5a6',
  },
});

export default SeleccionRolScreen;
