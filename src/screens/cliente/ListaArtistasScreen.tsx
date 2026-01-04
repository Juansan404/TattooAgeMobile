import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Artista } from '../../types/Artista';
import { obtenerArtistas } from '../../services/artistasService';
import ArtistaCard from '../../components/shared/ArtistaCard';

type ClienteStackParamList = {
  ListaArtistas: undefined;
  PortfolioArtista: { artista: Artista };
  MisCitas: undefined;
};

type ListaArtistasScreenNavigationProp = NativeStackNavigationProp<
  ClienteStackParamList,
  'ListaArtistas'
>;

interface ListaArtistasScreenProps {
  navigation: ListaArtistasScreenNavigationProp;
}

/**
 * Pantalla para ver lista de artistas disponibles (Cliente)
 */
const ListaArtistasScreen: React.FC<ListaArtistasScreenProps> = ({ navigation }) => {
  const [artistas, setArtistas] = useState<Artista[]>([]);
  const [cargando, setCargando] = useState(true);

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
    } finally {
      setCargando(false);
    }
  };

  const handleVerPortfolio = (artista: Artista) => {
    navigation.navigate('PortfolioArtista', { artista });
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

  if (artistas.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centrado}>
          <Text style={styles.textoVacio}>No hay artistas disponibles</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={artistas}
        renderItem={({ item }) => (
          <ArtistaCard artista={item} onPress={() => handleVerPortfolio(item)} />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoCargando: {
    marginTop: 12,
    fontSize: 16,
    color: '#95a5a6',
  },
  textoVacio: {
    fontSize: 16,
    color: '#95a5a6',
  },
  lista: {
    padding: 16,
  },
});

export default ListaArtistasScreen;
