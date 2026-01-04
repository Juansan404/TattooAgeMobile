import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { TrabajoPortfolio } from '../../types/TrabajoPortfolio';

interface PortfolioItemProps {
  trabajo: TrabajoPortfolio;
  onPress: () => void;
}

/**
 * Item de portfolio para mostrar trabajos del artista
 */
const PortfolioItem: React.FC<PortfolioItemProps> = ({ trabajo, onPress }) => {
  const formatearFecha = (fecha: string) => {
    const [year, month, day] = fecha.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {trabajo.fotoUrl ? (
        <Image source={{ uri: trabajo.fotoUrl }} style={styles.imagen} resizeMode="cover" />
      ) : (
        <View style={styles.imagenPlaceholder}>
          <Text style={styles.placeholderText}>Sin imagen</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.titulo} numberOfLines={1}>
          {trabajo.titulo}
        </Text>

        <Text style={styles.descripcion} numberOfLines={2}>
          {trabajo.descripcion}
        </Text>

        <View style={styles.footer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{trabajo.estiloTatuaje}</Text>
          </View>

          <Text style={styles.fecha}>{formatearFecha(trabajo.fechaRealizado)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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

export default PortfolioItem;
