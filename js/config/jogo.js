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

// ---------- Partículas de poluição (fase 2B) ----------
// ALEATORIEDADE CONTROLADA: cada partícula é aleatória (tamanho, velocidade,
// origem), mas sempre dentro dos intervalos [mín, máx] definidos aqui, e
// nunca há mais do que PARTICULAS_MAX em simultâneo.
const PARTICULAS_MAX      = 40;    // limite máximo em simultâneo
const SPAWN_INTERVALO_MIN = 250;   // tempo mínimo entre partículas novas (ms)
const SPAWN_INTERVALO_MAX = 700;   // tempo máximo (ms)
const PROB_FABRICA        = 0.6;   // 60% nascem em fábricas, 40% em carros
const PARTICULA_DERIVA    = 0.4;   // desvio lateral máximo (vento), px por frame
const ASPIRACAO_FORCA     = 5;     // velocidade (px por frame) a que o drone puxa

// Características por origem. As das fábricas são maiores (valem mais pontos).
const PARTICULA = {
  fabrica: { raioMin: 9, raioMax: 18, velMin: 0.5, velMax: 1.3 },
  carro:   { raioMin: 5, raioMax: 10, velMin: 0.8, velMax: 1.8 }
};

// ---------- Carros ----------
const NUM_CARROS    = 5;
const CARRO_VEL_MIN = 1.5;   // px por frame
const CARRO_VEL_MAX = 3.5;

// ---------- Regras do jogo (fase 3) ----------
const DURACAO_JOGO       = 60;     // duração da partida, em segundos
const AQI_MAX            = 100;    // DERROTA se o AQI chegar a este valor
const AQI_INICIAL        = 30;     // AQI no início da partida
const AQI_LIMITE_VITORIA = 50;     // VITÓRIA se o tempo acabar com o AQI abaixo disto
const AQI_POR_ESCAPE     = 0.09;   // AQI que sobe por cada unidade de tamanho que escapa
const AQI_POR_ASPIRACAO  = 0.04;   // AQI que desce por cada unidade de tamanho aspirada

// ---------- Interface durante o jogo ----------
const HUD_ALTURA = 68;             // altura da faixa de informação no topo (px)