import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TrabajoPortfolio } from '../../types/TrabajoPortfolio';
import {
  actualizarTrabajo,
  eliminarTrabajo,
} from '../../services/portfolioService';
import ModalTrabajo from '../../components/artista/ModalTrabajo';

type ArtistaStackParamList = {
  SeleccionArtista: undefined;
  MiPortfolio: { artistaId: number; artistaNombre: string };
  DetalleTrabajo: { trabajo: TrabajoPortfolio; artistaId: number };
  MiAgenda: { artistaId: number; artistaNombre: string };
};

type DetalleTrabajoScreenProps = NativeStackScreenProps<
  ArtistaStackParamList,
  'DetalleTrabajo'
>;

/**
 * Pantalla de detalle de un trabajo con opciones de editar/eliminar
 */
const DetalleTrabajoScreen: React.FC<DetalleTrabajoScreenProps> = ({
  route,
  navigation,
}) => {
  const { trabajo, artistaId } = route.params;
  const [modalVisible, setModalVisible] = useState(false);

  const formatearFecha = (fecha: string) => {
    const [year, month, day] = fecha.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleEditar = () => {
    setModalVisible(true);
  };

  const handleGuardarEdicion = async (datos: any, fotoUri: string | null) => {
    try {
      await actualizarTrabajo(trabajo.id, datos, fotoUri);
      Alert.alert('Éxito', 'Trabajo actualizado correctamente');
      navigation.goBack();
    } catch (error) {
      throw error;
    }
  };

  const handleEliminar = () => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de eliminar este trabajo? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: confirmarEliminacion,
        },
      ]
    );
  };

  const confirmarEliminacion = async () => {
    try {
      await eliminarTrabajo(trabajo.id);
      Alert.alert('Éxito', 'Trabajo eliminado correctamente');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el trabajo');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {trabajo.fotoUrl ? (
          <Image source={{ uri: trabajo.fotoUrl }} style={styles.imagen} resizeMode="cover" />
        ) : (
          <View style={styles.imagenPlaceholder}>
            <Text style={styles.placeholderText}>Sin imagen</Text>
          </View>
        )}

        <View style={styles.contenido}>
          <Text style={styles.titulo}>{trabajo.titulo}</Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>{trabajo.estiloTatuaje}</Text>
          </View>

          <View style={styles.seccion}>
            <Text style={styles.label}>Descripción</Text>
            <Text style={styles.descripcion}>{trabajo.descripcion}</Text>
          </View>

          <View style={styles.seccion}>
            <Text style={styles.label}>Fecha de realización</Text>
            <Text style={styles.valor}>{formatearFecha(trabajo.fechaRealizado)}</Text>
          </View>

          <View style={styles.botonesContainer}>
            <TouchableOpacity
              style={[styles.boton, styles.botonEditar]}
              onPress={handleEditar}
              activeOpacity={0.8}
            >
              <Ionicons name="pencil" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.botonEditarTexto}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.boton, styles.botonEliminar]}
              onPress={handleEliminar}
              activeOpacity={0.8}
            >
              <Ionicons name="trash" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.botonEliminarTexto}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <ModalTrabajo
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onGuardar={handleGuardarEdicion}
        trabajoEditar={trabajo}
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
  imagen: {
    width: '100%',
    height: 300,
    backgroundColor: '#ecf0f1',
  },
  imagenPlaceholder: {
    width: '100%',
    height: 300,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    color: '#95a5a6',
  },
  contenido: {
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  seccion: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#95a5a6',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  descripcion: {
    fontSize: 16,
    color: '#1a1a1a',
    lineHeight: 24,
  },
  valor: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  botonesContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  boton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonEditar: {
    backgroundColor: '#3498db',
  },
  botonEditarTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  botonEliminar: {
    backgroundColor: '#95a5a6',
  },
  botonEliminarTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DetalleTrabajoScreen;
