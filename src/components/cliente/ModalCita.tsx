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
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Artista } from '../../types/Artista';
import { obtenerArtistas } from '../../services/artistasService';
import { crearCita } from '../../services/citasService';

interface ModalCitaProps {
  visible: boolean;
  onClose: () => void;
  onCitaCreada: () => void;
  clienteId: number;
  clienteNombre: string;
}

/**
 * Modal para crear una nueva cita (usado por clientes)
 */
const ModalCita: React.FC<ModalCitaProps> = ({
  visible,
  onClose,
  onCitaCreada,
  clienteId,
  clienteNombre,
}) => {
  const [artistas, setArtistas] = useState<Artista[]>([]);
  const [artistaSeleccionado, setArtistaSeleccionado] = useState<number | null>(null);
  const [fecha, setFecha] = useState(new Date());
  const [hora, setHora] = useState(new Date());
  const [disenoDescripcion, setDisenoDescripcion] = useState('');
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const [mostrarTimePicker, setMostrarTimePicker] = useState(false);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (visible) {
      cargarArtistas();
    }
  }, [visible]);

  const cargarArtistas = async () => {
    try {
      const listaArtistas = await obtenerArtistas();
      setArtistas(listaArtistas);
      if (listaArtistas.length > 0 && !artistaSeleccionado) {
        setArtistaSeleccionado(listaArtistas[0].id);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los artistas');
    }
  };

  const handleCrearCita = async () => {
    if (!artistaSeleccionado) {
      Alert.alert('Error', 'Selecciona un artista');
      return;
    }

    if (!disenoDescripcion.trim()) {
      Alert.alert('Error', 'Describe el diseño que deseas');
      return;
    }

    setCargando(true);

    try {
      const artistaSeleccionadoObj = artistas.find((a) => a.id === artistaSeleccionado);

      const fechaStr = fecha.toISOString().split('T')[0];
      const horaStr = `${hora.getHours().toString().padStart(2, '0')}:${hora
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;

      await crearCita({
        clienteId,
        clienteNombre,
        artistaId: artistaSeleccionado,
        artistaNombre: artistaSeleccionadoObj?.nombre || '',
        fecha: fechaStr,
        hora: horaStr,
        disenoDescripcion: disenoDescripcion.trim(),
        estado: 'pendiente',
        notificationId: null,
      });

      Alert.alert('Éxito', 'Cita creada correctamente. Recibirás una notificación 24h antes.');
      limpiarFormulario();
      onCitaCreada();
      onClose();
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear la cita');
    } finally {
      setCargando(false);
    }
  };

  const limpiarFormulario = () => {
    setDisenoDescripcion('');
    setFecha(new Date());
    setHora(new Date());
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
            <Text style={styles.titulo}>Nueva Cita</Text>
            <TouchableOpacity onPress={handleCancelar}>
              <Text style={styles.cerrarBoton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <View style={styles.campo}>
              <Text style={styles.label}>Artista</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={artistaSeleccionado}
                  onValueChange={(value) => setArtistaSeleccionado(value)}
                  style={styles.picker}
                >
                  {artistas.map((artista) => (
                    <Picker.Item
                      key={artista.id}
                      label={`${artista.nombre} - ${artista.especialidad}`}
                      value={artista.id}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.campo}>
              <Text style={styles.label}>Fecha</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setMostrarDatePicker(true)}
              >
                <Text style={styles.inputText}>
                  {fecha.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </Text>
              </TouchableOpacity>
              {mostrarDatePicker && (
                <DateTimePicker
                  value={fecha}
                  mode="date"
                  display="default"
                  minimumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    setMostrarDatePicker(Platform.OS === 'ios');
                    if (selectedDate) {
                      setFecha(selectedDate);
                    }
                  }}
                />
              )}
            </View>

            <View style={styles.campo}>
              <Text style={styles.label}>Hora</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setMostrarTimePicker(true)}
              >
                <Text style={styles.inputText}>
                  {hora.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </TouchableOpacity>
              {mostrarTimePicker && (
                <DateTimePicker
                  value={hora}
                  mode="time"
                  display="default"
                  onChange={(event, selectedTime) => {
                    setMostrarTimePicker(Platform.OS === 'ios');
                    if (selectedTime) {
                      setHora(selectedTime);
                    }
                  }}
                />
              )}
            </View>

            <View style={styles.campo}>
              <Text style={styles.label}>Descripción del Diseño</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe el tatuaje que deseas..."
                value={disenoDescripcion}
                onChangeText={setDisenoDescripcion}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
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
              style={[styles.boton, styles.botonCrear]}
              onPress={handleCrearCita}
              disabled={cargando}
            >
              <Text style={styles.botonCrearTexto}>
                {cargando ? 'Creando...' : 'Crear Cita'}
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ecf0f1',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
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
  botonCrear: {
    backgroundColor: '#e74c3c',
  },
  botonCrearTexto: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default ModalCita;
