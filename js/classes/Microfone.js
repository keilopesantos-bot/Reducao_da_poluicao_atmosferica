// ============================================================
// Microfone.js - Entrada de áudio: calibração, histerese e potência.
//
// Responsabilidades:
//  1. pedir acesso ao microfone (p5.AudioIn)
//  2. CALIBRAR: medir o ruído ambiente durante 3 s e calcular os dois limites
//  3. HISTERESE: ligar a ventoinha acima do limite superior e só a desligar
//     abaixo do limite inferior
//  4. converter o volume em potência (0 a 1), que define o raio de aspiração
//  5. desenhar o medidor de volume
//
// Estados: "inativo" -> "a_pedir" -> "a_calibrar" -> "pronto"   (ou "erro")
// ============================================================

class Microfone {
  constructor() {
    this.entrada = null;          // objeto p5.AudioIn (só é criado ao ativar)
    this.estado = "inativo";
    this.inicioCalibracao = 0;    // instante (ms) em que começou a calibração
    this.amostras = [];           // volumes medidos durante a calibração

    this.nivel = 0;               // volume atual, suavizado (0 a 1)
    this.ruido = 0;               // média do ruído ambiente (resultado da calibração)
    this.limiteInferior = 0;      // abaixo disto a ventoinha desliga
    this.limiteSuperior = 0;      // acima disto a ventoinha liga
    this.nivelCheio = 0;          // volume a que a potência chega a 100%

    this.ligada = false;          // a ventoinha está ligada? (saída da histerese)
    this.potencia = 0;            // 0 (desligada) a 1 (máxima)
  }

  // Pede o microfone e começa a calibrar. Tem de ser chamado a partir de um
  // CLIQUE: os browsers só deixam ativar o áudio depois de uma ação do utilizador.
  ativar() {
    if (this.estado === "a_pedir" || this.estado === "a_calibrar") return;

    if (this.entrada) {            // já tinha acesso: só recalibra
      this.iniciarCalibracao();
      return;
    }

    userStartAudio();              // desbloqueia o áudio do browser (função do p5.sound)
    this.entrada = new p5.AudioIn();
    this.estado = "a_pedir";       // à espera de o utilizador autorizar
    this.entrada.start(
      () => {                            // autorizou
        this.desativarProcessamento();
        this.iniciarCalibracao();
      },
      () => { this.estado = "erro"; }    // recusou ou não há microfone
    );
  }

  // Por defeito o browser "melhora" o som do microfone: corta ruído constante
  // (noiseSuppression) e ajusta o ganho aos poucos (autoGainControl). Num jogo
  // controlado pelo VOLUME isso atrapalha: um sopro ou um "aaa" contínuo é
  // atenuado e a ventoinha demora a ligar. Aqui pedimos o som sem esse tratamento.
  desativarProcessamento() {
    const pista = this.entrada.stream && this.entrada.stream.getAudioTracks()[0];
    if (!pista) return;
    pista.applyConstraints({
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false
    }).catch(() => {});                  // se o browser não deixar, segue com o som normal
  }

  iniciarCalibracao() {
    this.estado = "a_calibrar";
    this.amostras = [];
    this.inicioCalibracao = millis();
    this.ligada = false;
    this.potencia = 0;
  }

  // Corre em cada frame (chamado no draw do sketch.js).
  atualizar() {
    if (this.estado !== "a_calibrar" && this.estado !== "pronto") return;

    // getLevel() dá o volume atual (0 a 1). Suavizamos com a mesma ideia do drone:
    // o valor anda uma fração da diferença em cada frame -> menos saltos.
    this.nivel += (this.entrada.getLevel() - this.nivel) * MIC_SUAVIZACAO;

    if (this.estado === "a_calibrar") {
      this.amostras.push(this.nivel);
      if (millis() - this.inicioCalibracao >= MIC_CALIBRACAO_MS) {
        this.terminarCalibracao();
      }
    } else {
      this.aplicarHisterese();
    }
  }

  // Fim dos 3 segundos: calcula a média do ruído e define os dois limites.
  terminarCalibracao() {
    let soma = 0;
    for (const a of this.amostras) soma += a;

    // Se o volume foi sempre exatamente 0, o microfone não está a enviar som
    if (soma === 0) {
      this.estado = "erro";
      return;
    }

    this.ruido = soma / this.amostras.length;                         // média
    // min(...) aplica as proteções: os limites ficam sempre ao alcance de uma voz alta
    this.limiteSuperior = min(this.ruido * MIC_FATOR_SUP + MIC_MARGEM_SUP, MIC_LIMITE_MAX_SUP);
    this.limiteInferior = min(this.ruido * MIC_FATOR_INF + MIC_MARGEM_INF,
                              this.limiteSuperior * MIC_SEPARACAO_MIN);
    this.nivelCheio = min(this.limiteSuperior * MIC_FATOR_CHEIO, 1);
    this.estado = "pronto";
  }

  // O ruído medido na calibração foi alto? (sala barulhenta ou falou-se durante a medição)
  ambienteRuidoso() {
    return this.ruido > MIC_RUIDO_ALTO;
  }

  // HISTERESE: o limite para LIGAR é diferente do limite para DESLIGAR.
  // Entre os dois, a ventoinha mantém o estado em que estava. Sem isto, um volume
  // a oscilar à volta de um único limite ligava e desligava a ventoinha sem parar.
  aplicarHisterese() {
    if (!this.ligada && this.nivel > this.limiteSuperior) {
      this.ligada = true;
    } else if (this.ligada && this.nivel < this.limiteInferior) {
      this.ligada = false;
    }

    if (this.ligada) {
      // map converte o volume (de limiteSuperior a nivelCheio) numa potência
      // (de MIC_POTENCIA_MIN a 1); constrain impede que saia desse intervalo.
      const p = map(this.nivel, this.limiteSuperior, this.nivelCheio, MIC_POTENCIA_MIN, 1);
      this.potencia = constrain(p, MIC_POTENCIA_MIN, 1);
    } else {
      this.potencia = 0;
    }
  }

  // Medidor de volume: barra com o nível atual e duas marcas (os limites).
  desenharMedidor(x, y, largura) {
    const altura = 12;
    const t = constrain(this.nivel / this.nivelCheio, 0, 1);   // fração preenchida

    push();
    noStroke();
    fill(255, 255, 255, 40);
    rect(x, y, largura, altura, altura / 2);                   // fundo

    if (t > 0) {
      fill(this.ligada ? COR.destaque : COR.rodape);           // verde = ventoinha ligada
      rect(x, y, largura * t, altura, min(altura / 2, (largura * t) / 2));
    }

    // Marcas dos dois limites da histerese
    const xInf = x + largura * constrain(this.limiteInferior / this.nivelCheio, 0, 1);
    const xSup = x + largura * constrain(this.limiteSuperior / this.nivelCheio, 0, 1);
    stroke(COR.texto);
    strokeWeight(2);
    line(xInf, y - 3, xInf, y + altura + 3);
    line(xSup, y - 3, xSup, y + altura + 3);

    noStroke();
    fill(COR.texto);
    textSize(11);
    textAlign(RIGHT, TOP);
    text("desliga", xInf, y + altura + 5);   // termina na marca inferior
    textAlign(LEFT, TOP);
    text("liga", xSup, y + altura + 5);      // começa na marca superior
    pop();
  }

  // Painel usado durante o jogo: estado da ventoinha + medidor.
  desenharPainel(x, y, largura) {
    push();
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(13);
    fill(this.ligada ? COR.destaque : COR.rodape);
    text(this.ligada ? "MICROFONE · VENTOINHA LIGADA" : "MICROFONE · VENTOINHA DESLIGADA",
         x + largura / 2, y - 6);
    pop();
    this.desenharMedidor(x, y, largura);
  }
}
