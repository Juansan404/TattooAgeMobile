import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Cita } from '../../types/Cita';

interface CitaItemProps {
  cita: Cita;
  onPress?: () => void;
}

/**
 * Item de cita para mostrar en la lista de citas del cliente
 */
const CitaItem: React.FC<CitaItemProps> = ({ cita, onPress }) => {
  const getEstadoColor = (estado: Cita['estado']) => {
    switch (estado) {
      case 'confirmada':
        return '#27ae60'; // Verde
      case 'pendiente':
        return '#f39c12'; // Naranja
      case 'completada':
        return '#3498db'; // Azul
      case 'cancelada':
        return '#95a5a6'; // Gris
      default:
        return '#95a5a6';
    }
  };

  const getEstadoTexto = (estado: Cita['estado']) => {
    switch (estado) {
      case 'confirmada':
        return 'Confirmada';
      case 'pendiente':
        return 'Pendiente';
      case 'completada':
        return 'Completada';
      case 'cancelada':
        return 'Cancelada';
      default:
        return estado;
    }
  };

  const formatearFecha = (fecha: string) => {
    const [year, month, day] = fecha.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <Text style={styles.artistaNombre}>{cita.artistaNombre}</Text>
        <View style={[styles.badge, { backgroundColor: getEstadoColor(cita.estado) }]}>
          <Text style={styles.badgeText}>{getEstadoTexto(cita.estado)}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.body}>
        <View style={styles.row}>
          <Text style={styles.label}>Fecha:</Text>
          <Text style={styles.value}>{formatearFecha(cita.fecha)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Hora:</Text>
          <Text style={styles.value}>{cita.hora}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Diseño:</Text>
          <Text style={styles.valueDescription} numberOfLines={2}>
            {cita.disenoDescripcion}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  artistaNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#ecf0f1',
    marginBottom: 12,
  },
  body: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#95a5a6',
    width: 70,
  },
  value: {
    fontSize: 14,
    color: '#1a1a1a',
    flex: 1,
  },
  valueDescription: {
    fontSize: 14,
    color: '#1a1a1a',
    flex: 1,
  },
});

export default CitaItem;
