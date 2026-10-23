// ============================================================
// BotaoSom.js - Botão redondo com um altifalante, para silenciar o jogo.
//
// É um tipo especial de Botao (herança: "extends Botao"): aproveita a posição
// e o teste de clique do Botao e só muda a forma de se desenhar.
// ============================================================

class BotaoSom extends Botao {
  constructor(tamanho) {
    super("", tamanho, tamanho);   // super() chama o construtor do Botao
    this.silenciado = false;       // se true, mostra o altifalante riscado
  }

  // Substitui o desenhar() do Botao
  desenhar() {
    const sobre = this.contem(mouseX, mouseY);
    if (sobre) cursor(HAND);

    const u = this.w / 40;         // unidade proporcional ao tamanho do botão

    push();
    translate(this.x, this.y);     // (0, 0) passa a ser o centro do botão
    noStroke();
    fill(0, 0, 0, sobre ? 170 : 115);
    circle(0, 0, this.w);          // fundo redondo

    // Altifalante: uma caixa e um cone
    fill(COR.texto);
    rect(-11 * u, -4 * u, 6 * u, 8 * u);
    quad(-5 * u, -4 * u, 3 * u, -10 * u, 3 * u, 10 * u, -5 * u, 4 * u);

    noFill();
    strokeWeight(2 * u);
    if (this.silenciado) {
      stroke(COR.alerta);          // um X vermelho: está silenciado
      line(7 * u, -5 * u, 15 * u, 5 * u);
      line(15 * u, -5 * u, 7 * u, 5 * u);
    } else {
      stroke(COR.texto);           // duas ondas de som
      arc(4 * u, 0, 10 * u, 12 * u, -PI / 3, PI / 3);
      arc(4 * u, 0, 20 * u, 22 * u, -PI / 3, PI / 3);
    }
    pop();
  }
}
