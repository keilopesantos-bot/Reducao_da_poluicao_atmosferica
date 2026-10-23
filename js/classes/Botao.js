// ============================================================
// Botao.js - Botão retangular desenhado com primitivas gráficas.
// Como o rato é um dos controlos permitidos, os botões respondem ao clique.
// ============================================================

class Botao {
  constructor(texto, largura, altura) {
    this.texto = texto;
    this.w = largura;
    this.h = altura;
    this.x = 0;       // centro do botão; é definido por posicionar()
    this.y = 0;
    this.ativo = true;   // um botão inativo aparece cinzento e não responde ao clique
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

  // Clique válido: o ponto está dentro E o botão está ativo.
  clicado(px, py) {
    return this.ativo && this.contem(px, py);
  }

  desenhar() {
    const sobre = this.ativo && this.contem(mouseX, mouseY);
    if (sobre) cursor(HAND);   // feedback visual: o cursor muda para "mão"

    push();                    // isola estilos: nada "vaza" para o resto do desenho
    rectMode(CENTER);
    noStroke();
    if (!this.ativo) {
      fill(COR.botaoInativo);
    } else if (sobre) {
      fill(COR.botaoHover);
    } else {
      fill(COR.botao);
    }
    rect(this.x, this.y, this.w, this.h, 12);   // 12 = cantos arredondados
    fill(this.ativo ? COR.fundo : COR.rodape);
    textAlign(CENTER, CENTER);
    textSize(22);
    text(this.texto, this.x, this.y);
    pop();
  }
}
