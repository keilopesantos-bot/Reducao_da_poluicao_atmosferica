// ============================================================
// execucao.js - Ecrã 2: Execução (o jogo propriamente dito).
// Fase 2A: cidade + drone a seguir o rato. O resto vem nas fases seguintes.
// ============================================================

// Botão TEMPORÁRIO para testar a ida para o resultado.
// Não uso teclado porque o enunciado só permite microfone + rato.
const botaoTerminar = new Botao("Terminar (teste)", 240, 48);

let drone;   // o drone do jogador (criado em iniciarExecucao)

// Chamada UMA vez de cada vez que se entra no ecrã de execução
// (ver mudarEstado em sketch.js). Prepara um jogo novo do zero.
function iniciarExecucao() {
  drone = new Drone();
}

function desenharExecucao() {
  desenharCidade();

  // TEMPORÁRIO: rato premido = ventoinha à potência máxima.
  // Na fase 4 isto passa a ser o volume do microfone.
  drone.definirPotencia(mouseIsPressed ? 1 : 0);
  drone.atualizar();
  drone.desenhar();

  botaoTerminar.posicionar(width / 2, height * 0.08);
  botaoTerminar.desenhar();
}

function cliqueExecucao() {
  if (botaoTerminar.contem(mouseX, mouseY)) {
    mudarEstado(RESULTADO);
  }
}