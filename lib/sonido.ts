// Un "ding" hecho por el propio navegador, sin archivo de audio.
// Ojo: el navegador no deja sonar nada hasta que la persona haga clic en la página.
export function sonarDing() {
  const audio = new AudioContext();
  const nota = audio.createOscillator();
  const volumen = audio.createGain();

  nota.frequency.value = 880;
  volumen.gain.setValueAtTime(0.2, audio.currentTime);
  volumen.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.6);

  nota.connect(volumen).connect(audio.destination);
  nota.onended = () => audio.close();
  nota.start();
  nota.stop(audio.currentTime + 0.6);
}
