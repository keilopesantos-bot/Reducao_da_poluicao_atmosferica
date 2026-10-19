// ============================================================
// rodape.js (ui) - Rodapé obrigatório (requisito 3), desenhado em TODOS os ecrãs.
// Os textos vêm de js/config/rodape.js.
// ============================================================

function desenharRodape() {
  push();
  noStroke();
  fill(COR.rodape);
  textSize(16);

  // Esquerda: tema. A âncora (LEFT, BOTTOM) faz com que (x, y) seja o canto
  // inferior esquerdo do texto.
  textAlign(LEFT, BOTTOM);
  text(TEMA, MARGEM, height - MARGEM);

  // Direita: nome, nº e sigla. A âncora (RIGHT, BOTTOM) alinha o texto
  // pelo seu canto inferior DIREITO.
  textAlign(RIGHT, BOTTOM);
  text(AUTOR, width - MARGEM, height - MARGEM);
  pop();
}