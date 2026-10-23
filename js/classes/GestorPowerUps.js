// ============================================================
// GestorPowerUps.js - Faz nascer, mover e apanhar os power-ups, e guarda os efeitos.
//
// Responsabilidades:
//  - fazer nascer um power-up de tempos a tempos (aleatoriedade controlada)
//  - mover cada um e ver se o drone lhe tocou (colisão) ou se chegou ao chão
//  - quando é apanhado, ativar o efeito durante POWERUP_DURACAO_MS
//  - aplicar os bónus ao drone enquanto o efeito durar
//  - desenhar os power-ups e os indicadores de tempo restante
// ============================================================

class GestorPowerUps {
  constructor() {
    this.lista = [];                                  // power-ups em jogo
    this.proximo = millis() + random(POWERUP_INTERVALO_MIN, POWERUP_INTERVALO_MAX);
    this.fimEfeito = { solar: 0, eolica: 0 };         // instante (ms) em que cada efeito acaba
    this.apanhados = 0;                               // quantos o jogador já apanhou
  }

  // Corre em cada frame. Devolve true se o drone apanhou um power-up NESTE frame
  // (o ecrã de execução usa isso para tocar o som).
  atualizar(drone) {
    // 1. Nascer: quando chega a hora, e o intervalo até ao seguinte é aleatório
    if (millis() >= this.proximo) {
      this.gerar();
      this.proximo = millis() + random(POWERUP_INTERVALO_MIN, POWERUP_INTERVALO_MAX);
    }

    // 2. Mover, apanhar ou remover (lista percorrida ao contrário, por causa do splice)
    let apanhou = false;
    for (let i = this.lista.length - 1; i >= 0; i--) {
      const p = this.lista[i];
      p.atualizar();

      if (p.tocouNoDrone(drone)) {
        this.ativar(p.tipo);
        this.lista.splice(i, 1);
        apanhou = true;
      } else if (p.chegouAoChao()) {
        this.lista.splice(i, 1);                      // deixou-se cair: desaparece
      }
    }

    // 3. Aplicar os bónus ao drone enquanto os efeitos durarem
    drone.multRaio  = this.ativo("solar")  ? POWERUP_BONUS_RAIO  : 1;
    drone.multForca = this.ativo("eolica") ? POWERUP_BONUS_FORCA : 1;

    return apanhou;
  }

  // Cria um power-up de tipo aleatório, se ainda houver espaço (limite máximo).
  gerar() {
    if (this.lista.length >= POWERUP_MAX) return;
    this.lista.push(new PowerUp(random(["solar", "eolica"])));
  }

  // Apanhar outro do mesmo tipo reinicia os 5 segundos desse efeito.
  ativar(tipo) {
    this.fimEfeito[tipo] = millis() + POWERUP_DURACAO_MS;
    this.apanhados++;
  }

  ativo(tipo) {
    return millis() < this.fimEfeito[tipo];
  }

  segundosRestantes(tipo) {
    return max(0, (this.fimEfeito[tipo] - millis()) / 1000);
  }

  desenhar() {
    for (const p of this.lista) p.desenhar();
  }

  // Indicadores no canto superior direito, por baixo do HUD: um por efeito ativo,
  // com uma barra que vai encolhendo até acabar os 5 segundos.
  desenharIndicadores() {
    const efeitos = [
      { tipo: "solar",  texto: "Painel solar: raio ×1,5",     cor: COR.solar },
      { tipo: "eolica", texto: "Turbina eólica: sucção ×1,6", cor: COR.eolica }
    ];
    const w = 240;
    const h = 24;
    const x = width - MARGEM - w;
    let y = HUD_ALTURA + 10;

    push();
    noStroke();
    textSize(13);
    textAlign(LEFT, CENTER);
    for (const e of efeitos) {
      const resto = this.segundosRestantes(e.tipo);
      if (resto <= 0) continue;                       // só mostra os efeitos ativos

      const fracao = resto / (POWERUP_DURACAO_MS / 1000);
      fill(0, 0, 0, 130);
      rect(x, y, w, h, 6);                            // fundo
      fill(...e.cor, 170);
      rect(x, y, w * fracao, h, min(6, (w * fracao) / 2));   // barra que encolhe
      fill(COR.texto);
      text(e.texto + "  " + nf(resto, 1, 1) + " s", x + 8, y + h / 2);
      y += h + 6;
    }
    pop();
  }
}
