// ============================================================
// sons.js - Ficheiros de som e volumes.
// Os ficheiros estão em assets/sons/ e foram gerados por tools/gerar_sons.py.
// Volumes: 0 (mudo) a 1 (máximo).
// ============================================================

// Nome interno -> caminho do ficheiro (relativo ao index.html)
const SONS_FICHEIROS = {
  cidade:      "assets/sons/cidade.wav",        // som de fundo (loop)
  ventoinha:   "assets/sons/ventoinha.wav",     // zumbido da ventoinha (loop)
  recolha_peq: "assets/sons/recolha_peq.wav",   // recolha de partícula pequena (agudo)
  recolha_med: "assets/sons/recolha_med.wav",
  recolha_gra: "assets/sons/recolha_gra.wav",   // recolha de partícula grande (grave)
  vitoria:     "assets/sons/vitoria.wav",
  derrota:     "assets/sons/derrota.wav",
  powerup:     "assets/sons/powerup.wav"        // power-up apanhado
};

// ---------- Volumes ----------
const SOM_VOL_CIDADE    = 0.30;   // baixo: não deve tapar os outros sons nem "entrar" no microfone
const SOM_VOL_VENTOINHA = 0.45;   // volume da ventoinha à potência máxima
const SOM_VOL_RECOLHA   = 0.60;
const SOM_VOL_FIM       = 0.70;   // jingles de vitória/derrota
const SOM_VOL_POWERUP   = 0.70;   // power-up apanhado

// ---------- Ventoinha ----------
// A velocidade de reprodução muda o tom: mais potência = som mais agudo (pás mais rápidas)
const SOM_VENTOINHA_VEL_MIN = 0.8;
const SOM_VENTOINHA_VEL_MAX = 1.5;

// ---------- Recolha ----------
// Raio da partícula -> qual dos 3 sons usar: pequena = agudo, grande = grave
const SOM_RAIO_PEQ = 8;           // abaixo disto: recolha_peq
const SOM_RAIO_GRA = 13;          // a partir disto: recolha_gra (entre os dois: recolha_med)