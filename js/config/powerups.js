// ============================================================
// powerups.js - Valores dos power-ups de energia limpa (funcionalidade original).
//
// Dois tipos, escolhidos ao acaso:
//   "solar"  : painel solar     -> aumenta o RAIO de aspiração
//   "eolica" : turbina eólica   -> aumenta a FORÇA com que o drone puxa as partículas
// Ao serem apanhados dão o bónus durante POWERUP_DURACAO_MS.
// ============================================================

const POWERUP_DURACAO_MS = 5000;    // quanto tempo dura o bónus (5 segundos)

// Aleatoriedade controlada: o tempo até ao próximo power-up é aleatório, entre estes limites
const POWERUP_INTERVALO_MIN = 8000; // ms
const POWERUP_INTERVALO_MAX = 14000;
const POWERUP_MAX = 1;              // máximo de power-ups em jogo ao mesmo tempo

const POWERUP_RAIO = 22;            // tamanho do power-up (px)
const POWERUP_VEL_MIN = 0.8;        // velocidade de queda (px por frame)
const POWERUP_VEL_MAX = 1.4;

// Bónus
const POWERUP_BONUS_RAIO  = 1.5;    // painel solar: raio de aspiração x1,5
const POWERUP_BONUS_FORCA = 1.6;    // turbina eólica: sucção x1,6