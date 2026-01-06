import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Artista } from '../../types/Artista';
import { obtenerArtistas, crearArtista } from '../../services/artistasService';
import ArtistaCard from '../../components/shared/ArtistaCard';
import ModalArtista from '../../components/artista/ModalArtista';

type ArtistaStackParamList = {
  SeleccionArtista: undefined;
  MiPortfolio: { artistaId: number; artistaNombre: string };
  DetalleTrabajo: undefined;
  MiAgenda: { artistaId: number; artistaNombre: string };
};

type SeleccionArtistaScreenNavigationProp = NativeStackNavigationProp<
  ArtistaStackParamList,
  'SeleccionArtista'
>;

interface SeleccionArtistaScreenProps {
  navigation: SeleccionArtistaScreenNavigationProp;
}

/**
 * Pantalla de selección de artista (modo Artista)
 * Lista de artistas con botón para añadir nuevo
 */
const SeleccionArtistaScreen: React.FC<SeleccionArtistaScreenProps> = ({ navigation }) => {
  const [artistas, setArtistas] = useState<Artista[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      cargarArtistas();
    }, [])
  );

  const cargarArtistas = async () => {
    try {
      setCargando(true);
      const listaArtistas = await obtenerArtistas();
      setArtistas(listaArtistas);
    } catch (error) {
      console.error('Error al cargar artistas:', error);
      Alert.alert('Error', 'No se pudieron cargar los artistas');
    } finally {
      setCargando(false);
    }
  };

  const handleSeleccionarArtista = (artista: Artista) => {
    // Navegar al portfolio/agenda del artista seleccionado
    navigation.navigate('MiPortfolio', {
      artistaId: artista.id,
      artistaNombre: artista.nombre,
    });
  };

  const handleCrearArtista = async (datos: Omit<Artista, 'id' | 'fotoPerfil'>) => {
    try {
      const nuevoArtista = await crearArtista(datos);
      Alert.alert('Éxito', `Artista "${nuevoArtista.nombre}" creado correctamente`);
      cargarArtistas();
    } catch (error) {
      throw error;
    }
  };

  if (cargando) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centrado}>
          <ActivityIndicator size="large" color="#e74c3c" />
          <Text style={styles.textoCargando}>Cargando artistas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Selecciona tu Perfil</Text>
        <Text style={styles.subtitulo}>
          Elige el artista con el que quieres trabajar
        </Text>
      </View>

      {artistas.length === 0 ? (
        <View style={styles.centrado}>
          <Ionicons name="person-add" size={64} color="#95a5a6" style={{ marginBottom: 16 }} />
          <Text style={styles.textoVacio}>No hay artistas registrados</Text>
          <Text style={styles.textoVacioSecundario}>
            Pulsa el botón "+" para crear tu primer perfil de artista
          </Text>
        </View>
      ) : (
        <FlatList
          data={artistas}
          renderItem={({ item }) => (
            <ArtistaCard artista={item} onPress={() => handleSeleccionarArtista(item)} />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={styles.botonFlotante}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <ModalArtista
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onGuardar={handleCrearArtista}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 14,
    color: '#95a5a6',
  },
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  textoCargando: {
    marginTop: 12,
    fontSize: 16,
    color: '#95a5a6',
  },
  textoVacio: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  textoVacioSecundario: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
  },
  lista: {
    padding: 16,
  },
  botonFlotante: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#e74c3c',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});

export default SeleccionArtistaScreen;
