import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Image,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { TrabajoPortfolio } from '../../types/TrabajoPortfolio';
import { tomarFoto, seleccionarFoto } from '../../services/portfolioService';

interface ModalTrabajoProps {
  visible: boolean;
  onClose: () => void;
  onGuardar: (datos: any, fotoUri: string | null) => Promise<void>;
  trabajoEditar?: TrabajoPortfolio | null;
  artistaId: number;
}

/**
 * Modal para crear/editar trabajos del portfolio (con cámara)
 */
const ModalTrabajo: React.FC<ModalTrabajoProps> = ({
  visible,
  onClose,
  onGuardar,
  trabajoEditar,
  artistaId,
}) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estiloTatuaje, setEstiloTatuaje] = useState('');
  const [fechaRealizado, setFechaRealizado] = useState(new Date());
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (trabajoEditar) {
      setTitulo(trabajoEditar.titulo);
      setDescripcion(trabajoEditar.descripcion);
      setEstiloTatuaje(trabajoEditar.estiloTatuaje);
      setFechaRealizado(new Date(trabajoEditar.fechaRealizado));
      setFotoUri(trabajoEditar.fotoUrl);
    } else {
      limpiarFormulario();
    }
  }, [trabajoEditar, visible]);

  const limpiarFormulario = () => {
    setTitulo('');
    setDescripcion('');
    setEstiloTatuaje('');
    setFechaRealizado(new Date());
    setFotoUri(null);
  };

  const handleTomarFoto = async () => {
    try {
      const uri = await tomarFoto();
      if (uri) {
        setFotoUri(uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const handleSeleccionarFoto = async () => {
    try {
      const uri = await seleccionarFoto();
      if (uri) {
        setFotoUri(uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la foto');
    }
  };

  const handleEliminarFoto = () => {
    Alert.alert('Eliminar foto', '¿Estás seguro de eliminar la foto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => setFotoUri(null),
      },
    ]);
  };

  const handleGuardar = async () => {
    if (!titulo.trim()) {
      Alert.alert('Error', 'El título es obligatorio');
      return;
    }

    if (!descripcion.trim()) {
      Alert.alert('Error', 'La descripción es obligatoria');
      return;
    }

    if (!estiloTatuaje.trim()) {
      Alert.alert('Error', 'El estilo de tatuaje es obligatorio');
      return;
    }

    setCargando(true);

    try {
      const fechaStr = fechaRealizado.toISOString().split('T')[0];

      const datos = {
        artistaId,
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        estiloTatuaje: estiloTatuaje.trim(),
        fechaRealizado: fechaStr,
      };

      await onGuardar(datos, fotoUri);
      limpiarFormulario();
      onClose();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el trabajo');
    } finally {
      setCargando(false);
    }
  };

  const handleCancelar = () => {
    limpiarFormulario();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.titulo}>
              {trabajoEditar ? 'Editar Trabajo' : 'Nuevo Trabajo'}
            </Text>
            <TouchableOpacity onPress={handleCancelar}>
              <Text style={styles.cerrarBoton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <View style={styles.campo}>
              <Text style={styles.label}>Foto del Tatuaje</Text>

              {fotoUri ? (
                <View style={styles.fotoContainer}>
                  <Image source={{ uri: fotoUri }} style={styles.foto} resizeMode="cover" />
                  <View style={styles.botonesImagen}>
                    <TouchableOpacity
                      style={styles.botonCambiarFoto}
                      onPress={handleSeleccionarFoto}
                    >
                      <Text style={styles.botonCambiarFotoTexto}>Cambiar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.botonEliminarFoto}
                      onPress={handleEliminarFoto}
                    >
                      <Text style={styles.botonEliminarFotoTexto}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.botonesImagen}>
                  <TouchableOpacity
                    style={styles.botonFoto}
                    onPress={handleTomarFoto}
                  >
                    <Ionicons name="camera" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.botonFotoTexto}>Tomar Foto</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.botonFoto}
                    onPress={handleSeleccionarFoto}
                  >
                    <Ionicons name="images" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.botonFotoTexto}>Galería</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.campo}>
              <Text style={styles.label}>Título</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Rosa realista en antebrazo"
                value={titulo}
                onChangeText={setTitulo}
              />
            </View>

            <View style={styles.campo}>
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe el trabajo realizado..."
                value={descripcion}
                onChangeText={setDescripcion}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.campo}>
              <Text style={styles.label}>Estilo de Tatuaje</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Realismo, Tradicional, Japonés..."
                value={estiloTatuaje}
                onChangeText={setEstiloTatuaje}
              />
            </View>

            <View style={styles.campo}>
              <Text style={styles.label}>Fecha Realizado</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setMostrarDatePicker(true)}
              >
                <Text style={styles.inputText}>
                  {fechaRealizado.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </Text>
              </TouchableOpacity>
              {mostrarDatePicker && (
                <DateTimePicker
                  value={fechaRealizado}
                  mode="date"
                  display="default"
                  maximumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    setMostrarDatePicker(Platform.OS === 'ios');
                    if (selectedDate) {
                      setFechaRealizado(selectedDate);
                    }
                  }}
                />
              )}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.boton, styles.botonCancelar]}
              onPress={handleCancelar}
            >
              <Text style={styles.botonCancelarTexto}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.boton, styles.botonGuardar]}
              onPress={handleGuardar}
              disabled={cargando}
            >
              <Text style={styles.botonGuardarTexto}>
                {cargando ? 'Guardando...' : 'Guardar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  cerrarBoton: {
    fontSize: 28,
    color: '#95a5a6',
    fontWeight: '300',
  },
  body: {
    padding: 20,
  },
  campo: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ecf0f1',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#1a1a1a',
    backgroundColor: '#fff',
  },
  inputText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  textArea: {
    height: 100,
    paddingTop: 14,
  },
  fotoContainer: {
    marginBottom: 12,
  },
  foto: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#ecf0f1',
    marginBottom: 12,
  },
  botonesImagen: {
    flexDirection: 'row',
    gap: 12,
  },
  botonFoto: {
    flex: 1,
    backgroundColor: '#e74c3c',
    padding: 14,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonFotoTexto: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  botonCambiarFoto: {
    flex: 1,
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  botonCambiarFotoTexto: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  botonEliminarFoto: {
    flex: 1,
    backgroundColor: '#95a5a6',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  botonEliminarFotoTexto: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    gap: 12,
  },
  boton: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  botonCancelar: {
    backgroundColor: '#ecf0f1',
  },
  botonCancelarTexto: {
    fontSize: 16,
    fontWeight: '600',
    color: '#95a5a6',
  },
  botonGuardar: {
    backgroundColor: '#e74c3c',
  },
  botonGuardarTexto: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default ModalTrabajo;
