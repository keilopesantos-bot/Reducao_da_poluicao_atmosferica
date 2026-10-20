// ============================================================
// Carro.js - Um carro que circula na estrada e emite poluição pelo escape.
// Anda numa direção (esquerda ou direita) com velocidade aleatória.
// ============================================================

class Carro {
  constructor() {
    this.direcao = random([1, -1]);                       // 1 = para a direita, -1 = para a esquerda
    this.velocidade = random(CARRO_VEL_MIN, CARRO_VEL_MAX);
    this.x = random(width);                               // posição inicial aleatória
    this.cor = random(COR.carros);                        // cor escolhida ao acaso da paleta
  }

  // Tamanho e altura (y) do carro, calculados a partir da janela.
  // Cada direção usa a sua faixa da estrada, para não se sobreporem.
  medidas() {
    const estradaH = height * ESTRADA_ALTURA;
    const h = estradaH * 0.38;
    const faixa = this.direcao === 1 ? 0.72 : 0.30;      // posição vertical dentro da estrada
    return { w: h * 2.8, h: h, y: height * SOLO_Y + estradaH * faixa };
  }

  atualizar() {
    const { w } = this.medidas();
    this.x += this.direcao * this.velocidade;
    // Saiu por um lado -> reaparece do outro
    if (this.x > width + w) this.x = -w;
    if (this.x < -w) this.x = width + w;
  }

  // Onde está o escape (na traseira, oposta à direção em que anda).
  // É daqui que nasce a poluição dos carros.
  posicaoEscape() {
    const m = this.medidas();
    return { x: this.x - this.direcao * m.w / 2, y: m.y - m.h / 2 };
  }

  desenhar() {
    const m = this.medidas();
    push();
    noStroke();
    fill(this.cor);
    rect(this.x - m.w / 2, m.y - m.h / 2, m.w, m.h, 3);                  // carroçaria
    rect(this.x - m.w * 0.22, m.y - m.h * 0.95, m.w * 0.44, m.h * 0.6, 3); // cabine
    fill(20);
    circle(this.x - m.w * 0.28, m.y + m.h / 2, m.h * 0.55);              // roda de trás
    circle(this.x + m.w * 0.28, m.y + m.h / 2, m.h * 0.55);              // roda da frente
    fill(255, 240, 160);
    circle(this.x + this.direcao * m.w / 2, m.y - m.h * 0.1, m.h * 0.3); // farol
    pop();
  }
}