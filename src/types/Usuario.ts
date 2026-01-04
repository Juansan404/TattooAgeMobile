export type Usuario = {
  id: number;
  nombre: string;
  email: string;
  rol: 'cliente' | 'artista';
  artistaId?: number;
};
