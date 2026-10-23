// ============================================================
// GestorSons.js - Carrega e toca todos os sons do jogo.
//
//  - cidade     : som de fundo em loop (no início e durante o jogo)
//  - ventoinha  : loop cujo volume e tom seguem a potência da aspiração
//  - recolha_*  : efeito pontual de cada partícula aspirada
//  - vitoria / derrota : jingle no fim da partida
//
// Os browsers só deixam tocar áudio depois de um clique do utilizador, por isso
// nada toca antes de desbloquear() ser chamado (a partir de um clique).
// ============================================================

class GestorSons {
  constructor() {
    this.sons = {};              // nome -> objeto p5.SoundFile
    this.desbloqueado = false;   // o browser já deixa tocar áudio?
    this.mudo = false;
  }

  // Carrega os ficheiros. Faz-se no setup() e NÃO no preload(): se um ficheiro
  // faltar, o preload ficava à espera para sempre e o jogo nunca arrancava.
  // Assim, se faltar um som, o jogo funciona na mesma (só fica sem esse som).
  carregar() {
    for (const nome in SONS_FICHEIROS) {
      this.sons[nome] = loadSound(
        SONS_FICHEIROS[nome],
        null,                                                       // sem ação ao carregar
        () => console.warn("Som não encontrado: " + SONS_FICHEIROS[nome])
      );
    }
  }

  // Este som existe e já está carregado?
  pronto(nome) {
    return this.sons[nome] !== undefined && this.sons[nome].isLoaded();
  }

  // Chamado num clique: levanta o bloqueio de áudio do browser.
  desbloquear() {
    userStartAudio();
    this.desbloqueado = true;
  }

  // Corre em cada frame: liga e desliga os sons de fundo conforme o ecrã.
  atualizar(estadoJogo) {
    if (!this.desbloqueado) return;

    if (estadoJogo === RESULTADO) {       // no resultado só se ouve o jingle
      this.parar("cidade");
      this.parar("ventoinha");
      return;
    }

    this.tocarLoop("cidade", SOM_VOL_CIDADE);
    if (estadoJogo === EXECUCAO) {
      this.tocarLoop("ventoinha", 0);     // arranca sem som: o volume vem da potência
    } else {
      this.parar("ventoinha");
    }
  }

  // Volume e tom da ventoinha seguem a potência (0 a 1) que vem do microfone.
  atualizarVentoinha(potencia) {
    if (!this.desbloqueado || !this.pronto("ventoinha")) return;
    const s = this.sons.ventoinha;
    s.setVolume(potencia * SOM_VOL_VENTOINHA, 0.05);   // 0,05 s de transição evita estalidos
    s.rate(SOM_VENTOINHA_VEL_MIN + potencia * (SOM_VENTOINHA_VEL_MAX - SOM_VENTOINHA_VEL_MIN));
  }

  // Efeito de recolha: partículas pequenas soam agudas, grandes soam graves.
  tocarRecolha(raio) {
    let nome = "recolha_med";
    if (raio < SOM_RAIO_PEQ) nome = "recolha_peq";
    else if (raio >= SOM_RAIO_GRA) nome = "recolha_gra";
    this.tocarUma(nome, SOM_VOL_RECOLHA);
  }

  tocarFim(vitoria) {
    this.tocarUma(vitoria ? "vitoria" : "derrota", SOM_VOL_FIM);
  }

  tocarPowerUp() {
    this.tocarUma("powerup", SOM_VOL_POWERUP);
  }

  // Silencia ou repõe TODOS os sons, com o volume geral do p5.sound.
  // Esse volume chama-se outputVolume() nas versões recentes e masterVolume() nas
  // antigas; o typeof confirma qual existe, para funcionar com qualquer versão.
  alternarMudo() {
    this.mudo = !this.mudo;
    const volume = this.mudo ? 0 : 1;
    if (typeof outputVolume === "function") {
      outputVolume(volume, 0.05);
    } else if (typeof masterVolume === "function") {
      masterVolume(volume, 0.05);
    }
  }

  // ---------- auxiliares ----------
  // Toca um som em loop, se ainda não estiver a tocar.
  tocarLoop(nome, volume) {
    if (!this.pronto(nome)) return;
    const s = this.sons[nome];
    if (!s.isPlaying()) {
      s.setVolume(volume);
      s.loop();
    }
  }

  // Toca um som uma vez. Várias chamadas seguidas sobrepõem-se (útil nas recolhas).
  tocarUma(nome, volume) {
    if (!this.desbloqueado || !this.pronto(nome)) return;
    const s = this.sons[nome];
    s.setVolume(volume);
    s.play();
  }

  parar(nome) {
    if (this.pronto(nome) && this.sons[nome].isPlaying()) {
      this.sons[nome].stop();
    }
  }
}
