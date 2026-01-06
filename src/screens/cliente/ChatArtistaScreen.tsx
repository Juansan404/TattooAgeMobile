import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type ClienteStackParamList = {
  MisCitas: undefined;
  ListaArtistas: undefined;
  PortfolioArtista: { artistaId: number; artistaNombre: string };
  ChatArtista: { artistaId: number; artistaNombre: string };
};

type ChatArtistaScreenProps = NativeStackScreenProps<
  ClienteStackParamList,
  'ChatArtista'
>;

interface Mensaje {
  id: number;
  texto: string;
  esPropio: boolean;
  hora: string;
}

/**
 * Pantalla de chat con el artista
 */
const ChatArtistaScreen: React.FC<ChatArtistaScreenProps> = ({ route }) => {
  const { artistaNombre } = route.params;
  const [mensaje, setMensaje] = useState('');
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);

  const enviarMensaje = () => {
    if (mensaje.trim()) {
      const nuevoMensaje: Mensaje = {
        id: mensajes.length + 1,
        texto: mensaje.trim(),
        esPropio: true,
        hora: new Date().toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMensajes([...mensajes, nuevoMensaje]);
      setMensaje('');
    }
  };

  const renderMensaje = ({ item }: { item: Mensaje }) => (
    <View
      style={[
        styles.mensajeContainer,
        item.esPropio ? styles.mensajePropio : styles.mensajeArtista,
      ]}
    >
      <View
        style={[
          styles.burbuja,
          item.esPropio ? styles.burbujaPropria : styles.burbujaArtista,
        ]}
      >
        <Text
          style={[
            styles.textoMensaje,
            item.esPropio ? styles.textoPropio : styles.textoArtista,
          ]}
        >
          {item.texto}
        </Text>
        <Text
          style={[
            styles.horaMensaje,
            item.esPropio ? styles.horaPropia : styles.horaArtista,
          ]}
        >
          {item.hora}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header del chat */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={24} color="#fff" />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.nombreArtista}>{artistaNombre}</Text>
              <View style={styles.estadoContainer}>
                <View style={styles.puntosEstado} />
                <Text style={styles.estadoTexto}>En línea</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Lista de mensajes */}
        <FlatList
          data={mensajes}
          renderItem={renderMensaje}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listaMensajes}
          showsVerticalScrollIndicator={false}
          inverted={false}
        />

        {/* Input de mensaje */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.botonAdjuntar}>
            <Ionicons name="add-circle" size={28} color="#95a5a6" />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Escribe un mensaje..."
            placeholderTextColor="#95a5a6"
            value={mensaje}
            onChangeText={setMensaje}
            multiline
            maxLength={500}
          />

          <TouchableOpacity
            style={[
              styles.botonEnviar,
              mensaje.trim() && styles.botonEnviarActivo,
            ]}
            onPress={enviarMensaje}
            disabled={!mensaje.trim()}
          >
            <Ionicons
              name="send"
              size={20}
              color={mensaje.trim() ? '#fff' : '#95a5a6'}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  nombreArtista: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  estadoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  puntosEstado: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2ecc71',
    marginRight: 6,
  },
  estadoTexto: {
    fontSize: 12,
    color: '#95a5a6',
  },
  listaMensajes: {
    padding: 16,
    flexGrow: 1,
  },
  mensajeContainer: {
    marginBottom: 12,
    maxWidth: '75%',
  },
  mensajePropio: {
    alignSelf: 'flex-end',
  },
  mensajeArtista: {
    alignSelf: 'flex-start',
  },
  burbuja: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  burbujaPropria: {
    backgroundColor: '#e74c3c',
    borderBottomRightRadius: 4,
  },
  burbujaArtista: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  textoMensaje: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },
  textoPropio: {
    color: '#fff',
  },
  textoArtista: {
    color: '#1a1a1a',
  },
  horaMensaje: {
    fontSize: 11,
    alignSelf: 'flex-end',
  },
  horaPropia: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  horaArtista: {
    color: '#95a5a6',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  botonAdjuntar: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1a1a1a',
    maxHeight: 100,
    marginHorizontal: 8,
  },
  botonEnviar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  botonEnviarActivo: {
    backgroundColor: '#e74c3c',
  },
});

export default ChatArtistaScreen;
