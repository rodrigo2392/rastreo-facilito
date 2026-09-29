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
  cliente_id: string | null; // desde la clase 2: quién hizo el pedido
  foto_entrega: string | null; // desde la clase 5: dónde quedó la foto de entrega
  historial?: Historial[]; // desde la clase 6: cada cambio de estado con su hora
};

// Un renglón del historial: la base lo anota sola cada que el pedido cambia de estado.
export type Historial = {
  id: number;
  estado: Estado;
  created_at: string;
};

// El estado que sigue, o null si el pedido ya se entregó.
export function siguienteEstado(estado: Estado): Estado | null {
  const posicion = ESTADOS.indexOf(estado);
  return ESTADOS[posicion + 1] ?? null;
}

// La hora de la Ciudad de México, sin importar dónde corra el servidor.
export function horaMexico(fecha: string) {
  return new Date(fecha).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Mexico_City",
  });
}
