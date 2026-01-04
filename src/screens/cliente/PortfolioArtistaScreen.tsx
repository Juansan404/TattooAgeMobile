import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TrabajoPortfolio } from '../../types/TrabajoPortfolio';
import { obtenerTrabajosArtista } from '../../services/portfolioService';

type ClienteStackParamList = {
  ListaArtistas: undefined;
  PortfolioArtista: { artista: { id: number; nombre: string; especialidad: string } };
  MisCitas: undefined;
};

type PortfolioArtistaScreenProps = NativeStackScreenProps<
  ClienteStackParamList,
  'PortfolioArtista'
>;

/**
 * Pantalla para ver el portfolio de un artista específico (Cliente)
 */
const PortfolioArtistaScreen: React.FC<PortfolioArtistaScreenProps> = ({ route }) => {
  const { artista } = route.params;
  const [trabajos, setTrabajos] = useState<TrabajoPortfolio[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarPortfolio();
  }, []);

  const cargarPortfolio = async () => {
    try {
      setCargando(true);
      const listaTrabajos = await obtenerTrabajosArtista(artista.id);
      setTrabajos(listaTrabajos);
    } catch (error) {
      console.error('Error al cargar portfolio:', error);
    } finally {
      setCargando(false);
    }
  };

  const renderTrabajo = ({ item }: { item: TrabajoPortfolio }) => {
    const formatearFecha = (fecha: string) => {
      const [year, month, day] = fecha.split('-');
      return `${day}/${month}/${year}`;
    };

    return (
      <View style={styles.card}>
        {item.fotoUrl ? (
          <Image source={{ uri: item.fotoUrl }} style={styles.imagen} resizeMode="cover" />
        ) : (
          <View style={styles.imagenPlaceholder}>
            <Text style={styles.placeholderText}>Sin imagen</Text>
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.titulo}>{item.titulo}</Text>
          <Text style={styles.descripcion}>{item.descripcion}</Text>

          <View style={styles.footer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.estiloTatuaje}</Text>
            </View>
            <Text style={styles.fecha}>{formatearFecha(item.fechaRealizado)}</Text>
          </View>
        </View>
      </View>
    );
  };

  if (cargando) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centrado}>
          <ActivityIndicator size="large" color="#e74c3c" />
          <Text style={styles.textoCargando}>Cargando portfolio...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.nombreArtista}>{artista.nombre}</Text>
        <Text style={styles.especialidad}>{artista.especialidad}</Text>
      </View>

      {trabajos.length === 0 ? (
        <View style={styles.centrado}>
          <Text style={styles.textoVacio}>
            Este artista aún no tiene trabajos en su portfolio
          </Text>
        </View>
      ) : (
        <FlatList
          data={trabajos}
          renderItem={renderTrabajo}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  nombreArtista: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  especialidad: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: '600',
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
    fontSize: 16,
    color: '#95a5a6',
    textAlign: 'center',
  },
  lista: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imagen: {
    width: '100%',
    height: 200,
    backgroundColor: '#ecf0f1',
  },
  imagenPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#95a5a6',
  },
  info: {
    padding: 16,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  descripcion: {
    fontSize: 14,
    color: '#95a5a6',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  fecha: {
    fontSize: 12,
    color: '#95a5a6',
  },
});

export default PortfolioArtistaScreen;
