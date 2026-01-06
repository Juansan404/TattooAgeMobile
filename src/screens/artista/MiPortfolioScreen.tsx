import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TrabajoPortfolio } from '../../types/TrabajoPortfolio';
import {
  obtenerTrabajosArtista,
  crearTrabajo,
} from '../../services/portfolioService';
import BienvenidaLayer from '../../components/layers/BienvenidaLayer';
import CargaLayer from '../../components/layers/CargaLayer';
import ResultadosLayer from '../../components/layers/ResultadosLayer';
import PortfolioItem from '../../components/artista/PortfolioItem';
import ModalTrabajo from '../../components/artista/ModalTrabajo';

type ArtistaStackParamList = {
  SeleccionArtista: undefined;
  MiPortfolio: { artistaId: number; artistaNombre: string };
  DetalleTrabajo: { trabajo: TrabajoPortfolio };
  MiAgenda: { artistaId: number; artistaNombre: string };
};

type MiPortfolioScreenProps = NativeStackScreenProps<
  ArtistaStackParamList,
  'MiPortfolio'
>;

/**
 * Pantalla de portfolio del artista (CON SISTEMA DE CAPAS)
 * Capa 1: Bienvenida -> Capa 2: Carga -> Capa 3: Resultados
 */
const MiPortfolioScreen: React.FC<MiPortfolioScreenProps> = ({ route, navigation }) => {
  const { artistaId, artistaNombre } = route.params;
  const [capa, setCapa] = useState<1 | 2 | 3>(1);
  const [trabajos, setTrabajos] = useState<TrabajoPortfolio[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      iniciarCarga();
    }, [])
  );

  const iniciarCarga = () => {
    setCapa(1);

    // Mostrar capa de bienvenida por 1.5 segundos
    setTimeout(() => {
      setCapa(2);
      cargarTrabajos();
    }, 1500);
  };

  const cargarTrabajos = async () => {
    try {
      const listaTrabajos = await obtenerTrabajosArtista(artistaId);
      setTrabajos(listaTrabajos);

      // Mostrar capa de carga por 1 segundo antes de mostrar resultados
      setTimeout(() => {
        setCapa(3);
      }, 1000);
    } catch (error) {
      console.error('Error al cargar trabajos:', error);
      Alert.alert('Error', 'No se pudieron cargar los trabajos');
      setCapa(3);
    }
  };

  const handleCrearTrabajo = () => {
    setModalVisible(true);
  };

  const handleGuardarTrabajo = async (datos: any, fotoUri: string | null) => {
    try {
      await crearTrabajo(datos, fotoUri);
      Alert.alert('Éxito', 'Trabajo creado correctamente');
      setCapa(2);
      cargarTrabajos();
    } catch (error) {
      throw error;
    }
  };

  const handleVerDetalle = (trabajo: TrabajoPortfolio) => {
    navigation.navigate('DetalleTrabajo', { trabajo });
  };

  const renderTrabajo = (trabajo: TrabajoPortfolio) => (
    <PortfolioItem trabajo={trabajo} onPress={() => handleVerDetalle(trabajo)} />
  );

  return (
    <SafeAreaView style={styles.container}>
      {capa === 1 && (
        <BienvenidaLayer
          titulo="Mi Portfolio"
          mensaje="Muestra tu mejor trabajo a tus clientes"
        />
      )}

      {capa === 2 && <CargaLayer mensaje="Cargando tu portfolio..." />}

      {capa === 3 && (
        <View style={styles.resultadosContainer}>
          <ResultadosLayer
            datos={trabajos}
            renderItem={renderTrabajo}
            keyExtractor={(item, index) => item.id.toString()}
            mensajeVacio="No tienes trabajos en tu portfolio. ¡Añade tu primer trabajo!"
          />

          <TouchableOpacity
            style={styles.botonFlotante}
            onPress={handleCrearTrabajo}
            activeOpacity={0.8}
          >
            <Text style={styles.botonFlotanteTexto}>+ Nuevo Trabajo</Text>
          </TouchableOpacity>
        </View>
      )}

      <ModalTrabajo
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onGuardar={handleGuardarTrabajo}
        artistaId={artistaId}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  resultadosContainer: {
    flex: 1,
  },
  botonFlotante: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#e74c3c',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  botonFlotanteTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MiPortfolioScreen;
