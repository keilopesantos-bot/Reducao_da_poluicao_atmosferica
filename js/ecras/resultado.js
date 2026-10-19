// ============================================================
// resultado.js - Ecrã 3: Resultado (pontuação, tempo, AQI final, Recomeçar).
// ============================================================

const botaoRecomecar = new Botao("Recomeçar", 220, 56);

function desenharResultado() {
  push();
  fill(COR.destaque);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("Resultado", width / 2, height * 0.2);

  fill(COR.texto);
  textSize(22);
  text("[Pontuação, tempo e AQI final: fases seguintes]", width / 2, height * 0.4);
  pop();

  botaoRecomecar.posicionar(width / 2, height * 0.66);
  botaoRecomecar.desenhar();
}

function cliqueResultado() {
  if (botaoRecomecar.contem(mouseX, mouseY)) {
    mudarEstado(INICIO);
  }
}