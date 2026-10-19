// ============================================================
// sketch.js - Ficheiro principal: só ORQUESTRA.
// Não desenha nada de concreto: decide qual ecrã corre e reencaminha o rato.
// Clean Air Drone - Sistemas Multimédia (ECGM, IPVC/ESTG) - Keila Santos, 34668
// ============================================================

let estado = INICIO;   // estado atual do jogo (só um de cada vez)

// setup() corre UMA vez no arranque.
function setup() {
  createCanvas(windowWidth, windowHeight);   // canvas = janela inteira
}

// Se o utilizador redimensionar a janela, o canvas acompanha.
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// draw() corre ~60 vezes por segundo.
function draw() {
  background(COR.fundo);
  cursor(ARROW);   // por defeito seta; os botões mudam para mão se o rato estiver sobre eles

  // Máquina de estados: em cada frame só se desenha o ecrã do estado atual.
  switch (estado) {
    case INICIO:    desenharInicio();    break;
    case EXECUCAO:  desenharExecucao();  break;
    case RESULTADO: desenharResultado(); break;
  }

  desenharRodape();   // fora do switch: aparece em TODOS os ecrãs
}

// O p5 chama esta função uma vez por clique.
// Reencaminha o clique para o ecrã que está ativo.
function mousePressed() {
  switch (estado) {
    case INICIO:    cliqueInicio();    break;
    case EXECUCAO:  cliqueExecucao();  break;
    case RESULTADO: cliqueResultado(); break;
  }
}

// Ponto único de mudança de estado. Mais tarde é aqui que vamos
// reiniciar o tempo, a pontuação e o AQI ao entrar em EXECUCAO.
function mudarEstado(novoEstado) {
  estado = novoEstado;
}