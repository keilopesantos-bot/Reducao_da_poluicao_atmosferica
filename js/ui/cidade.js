// ============================================================
// cidade.js - Desenha o cenário: céu, prédios, fábricas, chão e estrada.
// Só usa primitivas gráficas (rect, circle, ...) - sem imagens.
// Tudo é calculado a partir de width/height e das constantes de config/jogo.js,
// por isso acompanha o tamanho da janela.
// ============================================================

function desenharCidade() {
  const soloY = height * SOLO_Y;

  push();
  noStroke();

  desenharCeu(soloY);

  // Prédios de fundo (cada um é um retângulo assente no chão)
  fill(COR.predios);
  for (const p of PREDIOS) {
    const h = p.h * height;
    rect(p.x * width, soloY - h, p.w * width, h);
  }

  // Fábricas (desenhadas por cima dos prédios)
  for (const fx of FABRICAS) {
    desenharFabrica(fx, soloY);
  }

  // Chão e estrada
  fill(COR.solo);
  rect(0, soloY, width, height - soloY);

  const estradaH = height * ESTRADA_ALTURA;
  fill(COR.estrada);
  rect(0, soloY, width, estradaH);

  // Faixa central tracejada da estrada
  fill(COR.texto[0], COR.texto[1], COR.texto[2], 90);
  for (let x = 0; x < width; x += 60) {
    rect(x, soloY + estradaH / 2 - 2, 30, 4);
  }
  pop();
}

// Céu com degradê: de limpo (topo) a acastanhado (horizonte).
// Desenha faixas horizontais de 4 px, cada uma com uma cor entre as duas.
function desenharCeu(soloY) {
  const topo = color(COR.ceuTopo);
  const base = color(COR.ceuBase);
  for (let y = 0; y < soloY; y += 4) {
    // lerpColor mistura duas cores; o 3º argumento (0 a 1) diz quanto de cada
    fill(lerpColor(topo, base, y / soloY));
    rect(0, y, width, 4);
  }
}

function desenharFabrica(fx, soloY) {
  const cx = fx * width;                 // centro da fábrica
  const w  = FABRICA_LARGURA * width;
  const h  = FABRICA_ALTURA * height;
  const chW = width * 0.025;             // largura da chaminé
  const chH = FABRICA_CHAMINE * height;  // altura da chaminé

  fill(COR.fabrica);
  rect(cx - w / 2, soloY - h, w, h);                  // edifício
  rect(cx - chW / 2, soloY - h - chH, chW, chH);      // chaminé
}

// Posição (x, y) do topo da chaminé da fábrica que está em 'fx'.
// Na fase 2B é daqui que nascem as partículas de poluição.
function posicaoChamine(fx) {
  return {
    x: fx * width,
    y: height * SOLO_Y - (FABRICA_ALTURA + FABRICA_CHAMINE) * height
  };
}