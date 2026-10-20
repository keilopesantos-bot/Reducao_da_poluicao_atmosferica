// ============================================================
// BarraAQI.js - Índice de Qualidade do Ar (AQI) do jogo.
//
// Sobe quando as partículas escapam para o céu e desce quando são aspiradas.
// Guarda o valor, decide se há vitória/derrota e desenha a barra.
//   - chegou a AQI_MAX                -> derrota
//   - tempo acabou e está abaixo da meta (AQI_LIMITE_VITORIA) -> vitória
// ============================================================

class BarraAQI {
  constructor() {
    this.valor = AQI_INICIAL;          // valor REAL, usado nas regras do jogo
    this.valorVisivel = AQI_INICIAL;   // valor mostrado: acompanha o real devagar (animação)
  }

  // Uma partícula escapou: o ar piora. As maiores poluem mais.
  // constrain() garante que o valor fica sempre entre 0 e AQI_MAX.
  particulaEscapou(particula) {
    this.valor = constrain(this.valor + particula.raio * AQI_POR_ESCAPE, 0, AQI_MAX);
  }

  // Uma partícula foi aspirada: o ar melhora.
  particulaAspirada(particula) {
    this.valor = constrain(this.valor - particula.raio * AQI_POR_ASPIRACAO, 0, AQI_MAX);
  }

  // Corre em cada frame: o valor visível aproxima-se do real (mesma ideia da
  // suavização do drone), para a barra mexer-se de forma fluida e não aos saltos.
  atualizar() {
    this.valorVisivel += (this.valor - this.valorVisivel) * 0.1;
  }

  atingiuMaximo() {
    return this.valor >= AQI_MAX;
  }

  abaixoDoLimite() {
    return this.valor < AQI_LIMITE_VITORIA;
  }

  // Cor da barra: verde (limpo) -> amarelo -> vermelho (poluído).
  // lerpColor mistura duas cores; t vai de 0 a 1.
  corAtual() {
    const t = this.valorVisivel / AQI_MAX;
    const bom = color(COR.aqiBom);
    const medio = color(COR.aqiMedio);
    const mau = color(COR.aqiMau);
    if (t < 0.5) {
      return lerpColor(bom, medio, t * 2);
    }
    return lerpColor(medio, mau, (t - 0.5) * 2);
  }

  // Desenha a barra com o canto superior esquerdo em (x, y).
  desenhar(x, y, largura, altura) {
    const t = this.valorVisivel / AQI_MAX;   // fração preenchida, de 0 a 1
    const barraY = y + 22;                   // a barra fica abaixo do texto

    push();
    // Texto: nome à esquerda e valor à direita
    noStroke();
    fill(COR.texto);
    textSize(14);
    textAlign(LEFT, TOP);
    text("AQI (qualidade do ar)", x, y);
    textAlign(RIGHT, TOP);
    text(round(this.valor) + " / " + AQI_MAX, x + largura, y);

    // Fundo da barra
    fill(255, 255, 255, 40);
    rect(x, barraY, largura, altura, altura / 2);

    // Parte preenchida (o raio dos cantos nunca pode passar de metade da largura)
    const preenchido = largura * t;
    if (preenchido > 0) {
      fill(this.corAtual());
      rect(x, barraY, preenchido, altura, min(altura / 2, preenchido / 2));
    }

    // Marca da meta: se o tempo acabar com o AQI à esquerda desta linha, ganhas
    const metaX = x + largura * (AQI_LIMITE_VITORIA / AQI_MAX);
    stroke(COR.texto);
    strokeWeight(2);
    line(metaX, barraY - 3, metaX, barraY + altura + 3);
    noStroke();
    textSize(12);
    textAlign(CENTER, TOP);
    text("meta", metaX, barraY + altura + 4);
    pop();
  }
}