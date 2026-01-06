import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Artista } from '../../types/Artista';

interface ArtistaCardProps {
  artista: Artista;
  onPress: () => void;
  onPressChat?: () => void;
}

/**
 * Tarjeta de artista con información básica
 */
const ArtistaCard: React.FC<ArtistaCardProps> = ({ artista, onPress, onPressChat }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.avatarContainer}>
        {artista.fotoPerfil ? (
          <Image source={{ uri: artista.fotoPerfil }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {artista.nombre.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.nombre}>{artista.nombre}</Text>
        <Text style={styles.especialidad}>{artista.especialidad}</Text>
        <Text style={styles.experiencia}>
          {artista.añosExperiencia} años de experiencia
        </Text>
      </View>

      {onPressChat ? (
        <TouchableOpacity
          style={styles.botonChat}
          onPress={(e) => {
            e.stopPropagation();
            onPressChat();
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="chatbubble-ellipses" size={22} color="#fff" />
        </TouchableOpacity>
      ) : (
        <View style={styles.arrow}>
          <Text style={styles.arrowText}>›</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  info: {
    flex: 1,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  especialidad: {
    fontSize: 14,
    color: '#e74c3c',
    marginBottom: 4,
    fontWeight: '600',
  },
  experiencia: {
    fontSize: 12,
    color: '#95a5a6',
  },
  arrow: {
    marginLeft: 8,
  },
  arrowText: {
    fontSize: 32,
    color: '#95a5a6',
    fontWeight: '300',
  },
  botonChat: {
    backgroundColor: '#e74c3c',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
});

export default ArtistaCard;
