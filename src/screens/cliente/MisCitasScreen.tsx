import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Cita } from '../../types/Cita';
import { obtenerCitasCliente } from '../../services/citasService';
import BienvenidaLayer from '../../components/layers/BienvenidaLayer';
import CargaLayer from '../../components/layers/CargaLayer';
import ResultadosLayer from '../../components/layers/ResultadosLayer';
import CitaItem from '../../components/cliente/CitaItem';
import ModalCita from '../../components/cliente/ModalCita';

// ID de cliente hardcodeado (en producción vendría de autenticación)
const CLIENTE_ID = 1;
const CLIENTE_NOMBRE = 'Juan Pérez';

/**
 * Pantalla de citas del cliente (CON SISTEMA DE CAPAS)
 * Capa 1: Bienvenida -> Capa 2: Carga -> Capa 3: Resultados
 */
const MisCitasScreen: React.FC = () => {
  const [capa, setCapa] = useState<1 | 2 | 3>(1);
  const [citas, setCitas] = useState<Cita[]>([]);
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
      cargarCitas();
    }, 1500);
  };

  const cargarCitas = async () => {
    try {
      const listaCitas = await obtenerCitasCliente(CLIENTE_ID);
      setCitas(listaCitas);

      // Mostrar capa de carga por 1 segundo antes de mostrar resultados
      setTimeout(() => {
        setCapa(3);
      }, 1000);
    } catch (error) {
      console.error('Error al cargar citas:', error);
      Alert.alert('Error', 'No se pudieron cargar las citas');
      setCapa(3);
    }
  };

  const handleCrearCita = () => {
    setModalVisible(true);
  };

  const handleCitaCreada = () => {
    setCapa(2);
    cargarCitas();
  };

  const renderCita = (cita: Cita) => <CitaItem cita={cita} />;

  return (
    <SafeAreaView style={styles.container}>
      {capa === 1 && (
        <BienvenidaLayer
          titulo="Mis Citas"
          mensaje="Gestiona tus citas con los mejores artistas"
        />
      )}

      {capa === 2 && <CargaLayer mensaje="Cargando tus citas..." />}

      {capa === 3 && (
        <View style={styles.resultadosContainer}>
          <ResultadosLayer
            datos={citas}
            renderItem={renderCita}
            keyExtractor={(item, index) => item.id.toString()}
            mensajeVacio="No tienes citas agendadas. ¡Crea tu primera cita!"
          />

          <TouchableOpacity
            style={styles.botonFlotante}
            onPress={handleCrearCita}
            activeOpacity={0.8}
          >
            <Text style={styles.botonFlotanteTexto}>+ Nueva Cita</Text>
          </TouchableOpacity>
        </View>
      )}

      <ModalCita
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCitaCreada={handleCitaCreada}
        clienteId={CLIENTE_ID}
        clienteNombre={CLIENTE_NOMBRE}
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

export default MisCitasScreen;
