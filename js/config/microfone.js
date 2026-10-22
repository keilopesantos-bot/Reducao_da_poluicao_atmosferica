// ============================================================
// microfone.js - Valores da calibração e da histerese do microfone.
// O volume (nível) do microfone vai de 0 (silêncio) a 1 (máximo).
// ============================================================

// ---------- Calibração ----------
const MIC_CALIBRACAO_MS = 3000;   // tempo a medir o ruído ambiente (3 segundos)
const MIC_SUAVIZACAO    = 0.3;    // 0 = não reage, 1 = sem suavização (evita saltos no volume)

// Os limites são calculados a partir da MÉDIA do ruído ambiente medida na calibração:
//   limite = média * fator + margem
// A margem garante que, mesmo numa sala muito silenciosa, o limite fica acima do ruído.
const MIC_FATOR_SUP  = 2.0;       // limite SUPERIOR: acima dele a ventoinha LIGA
const MIC_MARGEM_SUP = 0.02;
const MIC_FATOR_INF  = 1.3;       // limite INFERIOR: abaixo dele a ventoinha DESLIGA
const MIC_MARGEM_INF = 0.01;      // (sempre menor que o superior -> é isto que cria a histerese)

// Proteções: se o jogador falar (ou houver muito barulho) durante a calibração, a média
// sobe muito e os limites ficariam acima de qualquer volume possível.
const MIC_LIMITE_MAX_SUP = 0.30;  // o limite superior nunca passa deste valor
const MIC_SEPARACAO_MIN  = 0.8;   // o inferior fica no máximo a 80% do superior (garante a histerese)
const MIC_RUIDO_ALTO     = 0.08;  // acima desta média, avisa que o ambiente está muito ruidoso

// ---------- Volume -> potência da ventoinha ----------
const MIC_FATOR_CHEIO  = 4;       // potência máxima quando o volume é 4x o limite superior
const MIC_POTENCIA_MIN = 0.25;    // potência mínima (25%) assim que a ventoinha liga