import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Cita } from '../../types/Cita';
import { obtenerCitasArtista, confirmarCita } from '../../services/citasService';
import CitaAgendaItem from '../../components/artista/CitaAgendaItem';

type ArtistaStackParamList = {
  SeleccionArtista: undefined;
  MiPortfolio: { artistaId: number; artistaNombre: string };
  DetalleTrabajo: undefined;
  MiAgenda: { artistaId: number; artistaNombre: string };
};

type MiAgendaScreenProps = NativeStackScreenProps<
  ArtistaStackParamList,
  'MiAgenda'
>;

/**
 * Pantalla de agenda del artista para ver sus citas
 */
const MiAgendaScreen: React.FC<MiAgendaScreenProps> = ({ route }) => {
  const { artistaId } = route.params;
  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      cargarCitas();
    }, [])
  );

  const cargarCitas = async () => {
    try {
      setCargando(true);
      const listaCitas = await obtenerCitasArtista(artistaId);
      setCitas(listaCitas);
    } catch (error) {
      console.error('Error al cargar citas:', error);
      Alert.alert('Error', 'No se pudieron cargar las citas');
    } finally {
      setCargando(false);
    }
  };

  const handleConfirmarCita = async (citaId: number) => {
    try {
      await confirmarCita(citaId);
      Alert.alert('Éxito', 'Cita confirmada correctamente');
      cargarCitas();
    } catch (error) {
      Alert.alert('Error', 'No se pudo confirmar la cita');
    }
  };

  if (cargando) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centrado}>
          <ActivityIndicator size="large" color="#e74c3c" />
          <Text style={styles.textoCargando}>Cargando tu agenda...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (citas.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centrado}>
          <Text style={styles.textoVacio}>No tienes citas agendadas</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={citas}
        renderItem={({ item }) => (
          <CitaAgendaItem
            cita={item}
            onConfirmar={() => handleConfirmarCita(item.id)}
          />
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

export default MiAgendaScreen;
