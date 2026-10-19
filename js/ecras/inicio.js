// ============================================================
// inicio.js - Ecrã 1: Início (objetivo, instruções, botão Começar).
// Cada ecrã tem duas funções: desenharX() e cliqueX().
// ============================================================

const botaoComecar = new Botao("Começar", 220, 56);

function desenharInicio() {
  push();
  fill(COR.destaque);
  textAlign(CENTER, CENTER);
  textSize(52);
  text("Clean Air Drone", width / 2, height * 0.18);

  fill(COR.texto);
  textSize(20);
  const linhas = [
    "Objetivo: reduzir a poluição do ar da cidade em 60 segundos.",
    "Move o drone com o RATO.",
    "Liga a ventoinha com a VOZ ou um SOPRO no microfone.",
    "Quanto maior o volume, maior o raio de aspiração.",
    "",
    "[Calibração do microfone: fase 4]"
  ];
  // Desenha cada linha 32 px abaixo da anterior
  for (let i = 0; i < linhas.length; i++) {
    text(linhas[i], width / 2, height * 0.34 + i * 32);
  }
  pop();

  botaoComecar.posicionar(width / 2, height * 0.74);
  botaoComecar.desenhar();
}

// Chamada pelo sketch.js quando há um clique e o estado é INICIO.
function cliqueInicio() {
  if (botaoComecar.contem(mouseX, mouseY)) {
    mudarEstado(EXECUCAO);
  }
}