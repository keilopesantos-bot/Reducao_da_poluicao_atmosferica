// ============================================================
// inicio.js - Ecrã 1: Início (objetivo, instruções, calibração do microfone
// e botão Começar).
// Cada ecrã tem duas funções: desenharX() e cliqueX().
// ============================================================

const botaoComecar    = new Botao("Começar", 220, 56);
const botaoAtivarMic  = new Botao("Ativar microfone", 260, 48);
const botaoRecalibrar = new Botao("Recalibrar", 150, 36);

function desenharInicio() {
  push();
  fill(COR.destaque);
  textAlign(CENTER, CENTER);
  textSize(52);
  text("Clean Air Drone", width / 2, height * 0.14);

  fill(COR.texto);
  textSize(20);
  const linhas = [
    "Objetivo: reduzir a poluição do ar da cidade em 60 segundos.",
    "Move o drone com o RATO.",
    "Liga a ventoinha com a VOZ ou um SOPRO no microfone.",
    "Quanto maior o volume, maior o raio de aspiração."
  ];
  // Desenha cada linha 30 px abaixo da anterior
  for (let i = 0; i < linhas.length; i++) {
    text(linhas[i], width / 2, height * 0.28 + i * 30);
  }
  pop();

  desenharCalibracao();

  // "Começar" só fica ativo quando o microfone está pronto (ou falhou: nesse
  // caso joga-se com o rato premido como alternativa).
  botaoComecar.ativo = (microfone.estado === "pronto" || microfone.estado === "erro");
  // max(): em janelas pequenas, empurra o botão para baixo para não tapar a calibração
  botaoComecar.posicionar(width / 2, max(height * 0.84, height * 0.52 + 175));
  botaoComecar.desenhar();
}

// Zona do ecrã de início que mostra o estado do microfone e da calibração.
function desenharCalibracao() {
  const cx = width / 2;
  const y = height * 0.52;

  push();
  textAlign(CENTER, CENTER);
  fill(COR.texto);
  textSize(18);

  switch (microfone.estado) {
    case "inativo":
      text("Para jogar com a voz, ativa o microfone.", cx, y);
      botaoAtivarMic.posicionar(cx, y + 50);
      botaoAtivarMic.desenhar();
      break;

    case "a_pedir":
      text("A aguardar autorização do microfone (aceita no browser)...", cx, y);
      break;

    case "a_calibrar": {
      text("A medir o ruído ambiente: fica em silêncio...", cx, y);
      // Barra de progresso dos 3 segundos: fração de tempo já passada
      const progresso = constrain((millis() - microfone.inicioCalibracao) / MIC_CALIBRACAO_MS, 0, 1);
      noStroke();
      fill(255, 255, 255, 40);
      rect(cx - 150, y + 30, 300, 14, 7);
      fill(COR.destaque);
      if (progresso > 0) {
        rect(cx - 150, y + 30, 300 * progresso, 14, min(7, (300 * progresso) / 2));
      }
      break;
    }

    case "pronto":
      text("Microfone calibrado! Experimenta falar ou soprar.", cx, y);
      microfone.desenharMedidor(cx - 160, y + 36, 320);
      fill(COR.rodape);
      textSize(14);
      text("Ruído ambiente: " + nf(microfone.ruido * 100, 1, 1) +
           "   |   liga acima de " + nf(microfone.limiteSuperior * 100, 1, 1) +
           "   |   desliga abaixo de " + nf(microfone.limiteInferior * 100, 1, 1),
           cx, y + 80);
      if (microfone.ambienteRuidoso()) {
        fill(COR.alerta);
        textSize(13);
        text("Ambiente muito ruidoso (ou falaste durante a medição). Recalibra em silêncio.", cx, y + 100);
      }
      botaoRecalibrar.posicionar(cx, y + 130);
      botaoRecalibrar.desenhar();
      break;

    case "erro":
      text("Não foi possível usar o microfone.", cx, y);
      textSize(15);
      fill(COR.rodape);
      text("Alternativa: mantém o botão do rato premido para ligar a ventoinha.", cx, y + 30);
      break;
  }
  pop();
}

// Chamada pelo sketch.js quando há um clique e o estado é INICIO.
function cliqueInicio() {
  if (botaoComecar.clicado(mouseX, mouseY)) {
    mudarEstado(EXECUCAO);
  } else if (microfone.estado === "inativo" && botaoAtivarMic.clicado(mouseX, mouseY)) {
    microfone.ativar();      // este clique é o "gesto do utilizador" que o browser exige
  } else if (microfone.estado === "pronto" && botaoRecalibrar.clicado(mouseX, mouseY)) {
    microfone.ativar();      // recalibra
  }
}