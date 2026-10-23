// ============================================================
// PowerUp.js - Um power-up de energia limpa que cai do céu.
//
// Pode ser um painel solar ("solar") ou uma turbina eólica ("eolica").
// Cai devagar, a oscilar para os lados. Se o drone lhe tocar, é apanhado;
// se chegar ao chão, desaparece. O efeito em si é tratado pelo GestorPowerUps.
// ============================================================

class PowerUp {
  constructor(tipo) {
    this.tipo = tipo;                                          // "solar" ou "eolica"
    this.raio = POWERUP_RAIO;
    this.x = random(this.raio + 30, width - this.raio - 30);   // posição horizontal aleatória
    this.y = HUD_ALTURA + this.raio;                           // nasce logo abaixo da faixa do HUD
    this.vy = random(POWERUP_VEL_MIN, POWERUP_VEL_MAX);        // velocidade de queda aleatória
    this.fase = random(TWO_PI);                                // cada um oscila de forma diferente
    this.angulo = 0;                                           // rotação das pás da turbina
  }

  atualizar() {
    this.y += this.vy;
    this.x += sin(frameCount * 0.04 + this.fase) * 0.8;        // balança de um lado para o outro
    this.angulo += 0.08;
  }

  // Colisão círculo-círculo com o corpo do drone (a mesma ideia das partículas)
  tocouNoDrone(drone) {
    return dist(this.x, this.y, drone.x, drone.y) < drone.raio + this.raio;
  }

  // Já passou da linha do chão da cidade?
  chegouAoChao() {
    return this.y - this.raio > height * SOLO_Y;
  }

  desenhar() {
    const cor = this.tipo === "solar" ? COR.solar : COR.eolica;
    const u = this.raio / 22;                                  // unidade proporcional ao tamanho

    push();
    translate(this.x, this.y);

    // Halo pulsante, para se ver bem e parecer "especial"
    const pulso = 1 + 0.1 * sin(frameCount * 0.15 + this.fase);
    noStroke();
    fill(...cor, 70);
    circle(0, 0, this.raio * 2.7 * pulso);

    // Disco escuro de fundo, com contorno da cor do power-up
    fill(18, 28, 42, 225);
    stroke(...cor);
    strokeWeight(2);
    circle(0, 0, this.raio * 2);

    noStroke();
    if (this.tipo === "solar") {
      // Painel solar: trapézio azul com a grelha das células e um pequeno sol
      fill(COR.painelSolar);
      quad(-12 * u, 8 * u, 12 * u, 8 * u, 9 * u, -6 * u, -9 * u, -6 * u);
      stroke(255, 255, 255, 170);
      strokeWeight(1);
      line(-4 * u, 8 * u, -3 * u, -6 * u);
      line(4 * u, 8 * u, 3 * u, -6 * u);
      line(-10.5 * u, 1 * u, 10.5 * u, 1 * u);
      noStroke();
      fill(COR.solar);
      circle(10 * u, -11 * u, 8 * u);
    } else {
      // Turbina eólica: torre e três pás a rodar
      stroke(COR.texto);
      strokeWeight(2 * u);
      line(0, -3 * u, 0, 14 * u);
      noStroke();
      fill(COR.texto);
      translate(0, -3 * u);
      for (let k = 0; k < 3; k++) {
        push();
        rotate(this.angulo + (k * TWO_PI) / 3);
        ellipse(0, -7 * u, 4 * u, 13 * u);
        pop();
      }
      fill(COR.eolica);
      circle(0, 0, 4 * u);
    }
    pop();
  }
}
