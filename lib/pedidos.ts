// Los estados por los que pasa todo pedido, en orden.
export type Estado = "recibido" | "preparando" | "en_camino" | "entregado";

export const ESTADOS: Estado[] = ["recibido", "preparando", "en_camino", "entregado"];

// Lo que se lee en pantalla para cada estado.
export const NOMBRE_ESTADO = {
  recibido: "Recibido",
  preparando: "Preparando",
  en_camino: "En camino",
  entregado: "Entregado",
};

// Un pedido tal como viene de la tabla "pedidos" de Supabase.
export type Pedido = {
  id: number;
  created_at: string;
  descripcion: string;
  direccion: string;
  telefono: string;
  estado: Estado;
};

// El estado que sigue, o null si el pedido ya se entregó.
export function siguienteEstado(estado: Estado): Estado | null {
  const posicion = ESTADOS.indexOf(estado);
  return ESTADOS[posicion + 1] ?? null;
}
