// ============================================================
// hud.js - HUD (heads-up display): a faixa de informação no topo do jogo.
// Dá feedback constante ao jogador (requisito 9): pontuação, tempo e AQI.
// ============================================================

function desenharHUD(segundosRestantes, pontos, aqi) {
  push();
  noStroke();

  // Faixa escura e translúcida, para o texto se ler sobre qualquer fundo
  fill(0, 0, 0, 120);
  rect(0, 0, width, HUD_ALTURA);

  // Pontuação (à esquerda)
  fill(COR.texto);
  textAlign(LEFT, CENTER);
  textSize(14);
  text("PONTUAÇÃO", MARGEM, 18);
  textSize(30);
  text(pontos, MARGEM, 44);

  // Tempo (ao centro). Nos últimos 10 segundos fica vermelho para alertar.
  textAlign(CENTER, CENTER);
  fill(COR.texto);
  textSize(14);
  text("TEMPO", width / 2, 18);
  textSize(30);
  fill(segundosRestantes <= 10 ? COR.alerta : COR.texto);
  text(formatarTempo(segundosRestantes), width / 2, 44);

  // Barra de AQI (à direita). A largura adapta-se a janelas pequenas.
  const largura = min(320, width * 0.3);
  aqi.desenhar(width - MARGEM - largura, 10, largura, 12);
  pop();
}

// Converte segundos em "m:ss". ceil arredonda para cima: assim mostra
// 1:00 no arranque e só chega a 0:00 quando o tempo acaba mesmo.
function formatarTempo(segundos) {
  const s = max(0, ceil(segundos));
  return floor(s / 60) + ":" + nf(s % 60, 2);   // nf(5, 2) -> "05"
}