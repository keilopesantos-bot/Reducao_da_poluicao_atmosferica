// ============================================================
// resultado.js - Ecrã 3: Resultado (pontuação, tempo, AQI final, Recomeçar).
// Os dados chegam de terminarJogo(), em execucao.js.
// ============================================================

let dadosResultado = null;   // objeto com os dados da última partida

const botaoRecomecar = new Botao("Recomeçar", 220, 56);

function desenharResultado() {
  const r = dadosResultado;

  push();
  textAlign(CENTER, CENTER);

  if (r) {
    // Título: verde se ganhou, vermelho se perdeu
    fill(r.vitoria ? COR.destaque : COR.alerta);
    textSize(56);
    text(r.vitoria ? "Vitória!" : "Derrota", width / 2, height * 0.16);

    fill(COR.texto);
    textSize(20);
    text(r.motivo, width / 2, height * 0.26);

    // Estatísticas da partida, uma por linha
    textSize(26);
    const linhas = [
      "Pontuação: " + r.pontos,
      "Tempo de jogo: " + nf(r.tempo, 1, 1) + " s",
      "AQI final: " + round(r.aqi) + "  (meta: abaixo de " + AQI_LIMITE_VITORIA + ")",
      "Partículas aspiradas: " + r.aspiradas + "   |   Escaparam: " + r.escapadas,
      "Power-ups apanhados: " + r.powerups
    ];
    for (let i = 0; i < linhas.length; i++) {
      text(linhas[i], width / 2, height * 0.38 + i * 42);
    }
  }
  pop();

  botaoRecomecar.posicionar(width / 2, height * 0.76);
  botaoRecomecar.desenhar();
}

function cliqueResultado() {
  if (botaoRecomecar.contem(mouseX, mouseY)) {
    mudarEstado(INICIO);
  }
}