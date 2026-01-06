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
} from 'react-native';
import { Artista } from '../../types/Artista';

interface ModalArtistaProps {
  visible: boolean;
  onClose: () => void;
  onGuardar: (artista: Omit<Artista, 'id' | 'fotoPerfil'>) => Promise<void>;
  artistaEditar?: Artista | null;
}

/**
 * Modal para crear/editar artistas
 */
const ModalArtista: React.FC<ModalArtistaProps> = ({
  visible,
  onClose,
  onGuardar,
  artistaEditar,
}) => {
  const [nombre, setNombre] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [añosExperiencia, setAñosExperiencia] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (artistaEditar) {
      setNombre(artistaEditar.nombre);
      setEspecialidad(artistaEditar.especialidad);
      setDescripcion(artistaEditar.descripcion);
      setAñosExperiencia(artistaEditar.añosExperiencia.toString());
    } else {
      limpiarFormulario();
    }
  }, [artistaEditar, visible]);

  const limpiarFormulario = () => {
    setNombre('');
    setEspecialidad('');
    setDescripcion('');
    setAñosExperiencia('');
  };

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }

    if (!especialidad.trim()) {
      Alert.alert('Error', 'La especialidad es obligatoria');
      return;
    }

    if (!descripcion.trim()) {
      Alert.alert('Error', 'La descripción es obligatoria');
      return;
    }

    const años = parseInt(añosExperiencia);
    if (!años || años < 0) {
      Alert.alert('Error', 'Los años de experiencia deben ser un número válido');
      return;
    }

    setCargando(true);

    try {
      await onGuardar({
        nombre: nombre.trim(),
        especialidad: especialidad.trim(),
        descripcion: descripcion.trim(),
        añosExperiencia: años,
      });

      limpiarFormulario();
      onClose();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el artista');
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
              {artistaEditar ? 'Editar Artista' : 'Nuevo Artista'}
            </Text>
            <TouchableOpacity onPress={handleCancelar}>
              <Text style={styles.cerrarBoton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <View style={styles.campo}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: María García"
                value={nombre}
                onChangeText={setNombre}
              />
            </View>

            <View style={styles.campo}>
              <Text style={styles.label}>Especialidad</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Realismo, Tradicional, Japonés..."
                value={especialidad}
                onChangeText={setEspecialidad}
              />
            </View>

            <View style={styles.campo}>
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe tu experiencia y estilo..."
                value={descripcion}
                onChangeText={setDescripcion}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.campo}>
              <Text style={styles.label}>Años de Experiencia</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: 5"
                value={añosExperiencia}
                onChangeText={setAñosExperiencia}
                keyboardType="numeric"
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
    maxHeight: '80%',
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
  botonGuardar: {
    backgroundColor: '#e74c3c',
  },
  botonGuardarTexto: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default ModalArtista;
