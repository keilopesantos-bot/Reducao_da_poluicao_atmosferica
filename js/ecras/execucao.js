// ============================================================
// execucao.js - Ecrã 2: Execução (o jogo propriamente dito).
// Por agora é só um espaço reservado; o jogo vem nas fases 2 a 6.
// ============================================================

// Botão TEMPORÁRIO para testar a ida para o resultado.
// Não uso teclado porque o enunciado só permite microfone + rato.
const botaoTerminar = new Botao("Terminar (teste)", 240, 48);

function desenharExecucao() {
  push();
  fill(COR.texto);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("A jogar...  (o jogo vem nas próximas fases)", width / 2, height * 0.4);
  pop();

  botaoTerminar.posicionar(width / 2, height * 0.6);
  botaoTerminar.desenhar();
}

function cliqueExecucao() {
  if (botaoTerminar.contem(mouseX, mouseY)) {
    mudarEstado(RESULTADO);
  }
}