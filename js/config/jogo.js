// ============================================================
// jogo.js - Valores que definem a cidade e o drone.
// Quase tudo está em FRAÇÕES da janela (0 a 1) em vez de píxeis:
// assim o jogo adapta-se a qualquer tamanho de janela.
// ============================================================

// ---------- Cidade ----------
const SOLO_Y          = 0.84;   // linha do chão = 84% da altura da janela
const ESTRADA_ALTURA  = 0.06;   // altura da estrada (fração da altura)

// Fábricas: só precisamos da posição horizontal do centro de cada uma.
// A partícula vai nascer no topo da chaminé (fase 2B), por isso este array
// é usado tanto para DESENHAR as fábricas como para fazer NASCER a poluição.
const FABRICAS = [0.18, 0.50, 0.82];
const FABRICA_LARGURA = 0.10;   // fração da largura da janela
const FABRICA_ALTURA  = 0.10;   // fração da altura da janela
const FABRICA_CHAMINE = 0.10;   // altura da chaminé (fração da altura)

// Prédios de fundo: x e w são frações da LARGURA, h é fração da ALTURA.
const PREDIOS = [
  { x: 0.00, w: 0.045, h: 0.28 },
  { x: 0.05, w: 0.060, h: 0.20 },
  { x: 0.25, w: 0.060, h: 0.24 },
  { x: 0.32, w: 0.060, h: 0.32 },
  { x: 0.38, w: 0.060, h: 0.18 },
  { x: 0.57, w: 0.070, h: 0.26 },
  { x: 0.65, w: 0.050, h: 0.20 },
  { x: 0.69, w: 0.070, h: 0.30 },
  { x: 0.89, w: 0.050, h: 0.22 },
  { x: 0.94, w: 0.060, h: 0.30 }
];

// ---------- Drone ----------
const DRONE_RAIO              = 26;    // raio do corpo (px)
const DRONE_SUAVIDADE         = 0.15;  // 0 = não se mexe, 1 = cola-se ao rato
const DRONE_RAIO_ASPIRACAO_MAX = 160;  // raio máximo de aspiração (px), com potência 1