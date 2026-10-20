// ============================================================
// Drone.js - O drone purificador de ar controlado pelo rato.
//
// Responsabilidades:
//  - seguir o rato de forma suave, sem sair da zona de jogo
//  - guardar a "potência" da ventoinha (0 a 1) e o raio de aspiração
//  - desenhar-se
// Quem decide a potência é o ecrã de execução (na fase 4, o microfone).
// ============================================================

class Drone {
  constructor() {
    this.x = width / 2;
    this.y = height * 0.4;
    this.raio = DRONE_RAIO;       // raio do corpo
    this.potencia = 0;            // 0 = ventoinha desligada, 1 = potência máxima
    this.raioAspiracao = 0;       // alcance da aspiração, em px
    this.anguloHelice = 0;        // só para a animação das hélices
  }

  // Recebe a potência (0 a 1) e calcula o raio de aspiração.
  // Quanto maior a potência, maior o raio: é a regra do jogo.
  definirPotencia(p) {
    this.potencia = constrain(p, 0, 1);
    this.raioAspiracao = this.potencia * DRONE_RAIO_ASPIRACAO_MAX;
  }

  // Corre em cada frame: move o drone e roda as hélices.
  atualizar() {
    // Suavização: em cada frame o drone anda uma FRAÇÃO da distância que o separa
    // do rato. Longe do rato anda depressa, perto anda devagar -> movimento fluido.
    this.x += (mouseX - this.x) * DRONE_SUAVIDADE;
    this.y += (mouseY - this.y) * DRONE_SUAVIDADE;

    // constrain(valor, min, max) impede que o drone saia da zona de jogo:
    // nos lados, no topo e em baixo (não entra no chão da cidade).
    this.x = constrain(this.x, this.raio, width - this.raio);
    this.y = constrain(this.y, HUD_ALTURA + this.raio, height * SOLO_Y - this.raio);
    // As hélices giram mais depressa com a ventoinha ligada
    this.anguloHelice += 0.5 + this.potencia * 0.8;
  }

  desenhar() {
    push();
    translate(this.x, this.y);   // a partir daqui, (0, 0) é o centro do drone

    // Raio de aspiração: só se vê com a ventoinha ligada
    if (this.raioAspiracao > 0) {
      fill(...COR.destaque, 40);                 // ...  "espalha" o array em 3 valores
      noStroke();
      circle(0, 0, this.raioAspiracao * 2);      // circle recebe o DIÂMETRO
      noFill();
      stroke(...COR.destaque, 170);
      strokeWeight(2);
      circle(0, 0, this.raioAspiracao * 2);
    }

    // Braços e hélices (uma de cada lado)
    const bx = this.raio * 1.4;    // posição horizontal da hélice
    const by = -this.raio * 0.7;   // posição vertical da hélice
    for (const lado of [-1, 1]) {  // -1 = esquerda, 1 = direita
      stroke(COR.droneBraco);
      strokeWeight(4);
      line(0, 0, lado * bx, by);   // braço

      // Hélice vista de lado: a largura varia com o cosseno do ângulo,
      // o que dá a ilusão de que está a rodar.
      const meia = this.raio * 0.9 * abs(cos(this.anguloHelice + (lado === 1 ? 1 : 0)));
      line(lado * bx - meia, by - 5, lado * bx + meia, by - 5);
    }

    // Corpo
    noStroke();
    fill(COR.drone);
    ellipse(0, 0, this.raio * 2, this.raio * 1.4);

    // Vidro/cúpula
    fill(...COR.destaque);
    ellipse(0, -this.raio * 0.15, this.raio * 0.9, this.raio * 0.55);

    // Boca da ventoinha, por baixo do drone
    fill(30, 40, 50);
    ellipse(0, this.raio * 0.62, this.raio * 1.1, this.raio * 0.3);
    pop();
  }
}