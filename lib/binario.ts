// Empacar posiciones en binario: cada número ocupa siempre 4 bytes.
// En texto (JSON) una posición pesa unos 32 bytes; empacada pesa 8.
// Sirve igual para una moto que para 200: se juntan todas en un solo mensaje.

export type Posicion = [number, number]; // [latitud, longitud]

export function empacar(posiciones: Posicion[]): ArrayBuffer {
  // Ojo: se manda el .buffer. Si mandas el Float32Array tal cual, la librería lo convierte en texto.
  return new Float32Array(posiciones.flat()).buffer;
}

export function desempacar(paquete: ArrayBuffer): Posicion[] {
  const numeros = new Float32Array(paquete);
  const posiciones: Posicion[] = [];
  for (let i = 0; i < numeros.length; i += 2) {
    posiciones.push([numeros[i], numeros[i + 1]]);
  }
  return posiciones;
}

// Cuánto pesa una posición mandada de cada forma, para verlo en pantalla.
export function pesoEnTexto([lat, lng]: Posicion) {
  return JSON.stringify({ lat, lng }).length;
}

export function pesoEnBinario(posicion: Posicion) {
  return empacar([posicion]).byteLength;
}
