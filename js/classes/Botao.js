// ============================================================
// Botao.js - Botão retangular desenhado com primitivas gráficas.
// Como o rato é um dos controlos permitidos, os botões respondem ao clique.
// ============================================================

class Botao {
  constructor(texto, largura, altura) {
    this.texto = texto;
    this.w = largura;
    this.h = altura;
    this.x = 0;  // centro do botão; é definido por posicionar()
    this.y = 0;
  }

  // Posiciona o centro do botão. Chamamos isto em cada frame porque
  // a janela pode mudar de tamanho (windowResized).
  posicionar(cx, cy) {
    this.x = cx;
    this.y = cy;
  }

  // O ponto (px, py) está dentro do botão? Teste ponto-retângulo:
  // a distância ao centro, em cada eixo, tem de ser menor que meia dimensão.
  contem(px, py) {
    return abs(px - this.x) < this.w / 2 && abs(py - this.y) < this.h / 2;
  }

  desenhar() {
    const sobre = this.contem(mouseX, mouseY);
    if (sobre) cursor(HAND);   // feedback visual: o cursor muda para "mão"

    push();                    // isola estilos: nada "vaza" para o resto do desenho
    rectMode(CENTER);
    noStroke();
    fill(sobre ? COR.botaoHover : COR.botao);
    rect(this.x, this.y, this.w, this.h, 12);   // 12 = cantos arredondados
    fill(COR.fundo);
    textAlign(CENTER, CENTER);
    textSize(22);
    text(this.texto, this.x, this.y);
    pop();
  }
}