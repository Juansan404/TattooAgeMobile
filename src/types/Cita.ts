export type Cita = {
  id: number;
  clienteId: number;
  clienteNombre: string;
  artistaId: number;
  artistaNombre: string;
  fecha: string;
  hora: string;
  disenoDescripcion: string;
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  notificationId?: string | null;
  createdAt: string;
};
