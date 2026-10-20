// ============================================================
// Particula.js - Uma partícula de poluição.
//
// Nasce numa fábrica ou num carro, com tamanho e velocidade aleatórios,
// e sobe em direção ao céu. Se o drone a aspirar, é puxada para ele e
// removida ao tocar no corpo (dá pontos). Se chegar ao topo, escapa
// (na fase 3 isso faz subir o AQI).
// ============================================================

class Particula {
  constructor(x, y, origem) {
    const tipo = PARTICULA[origem];            // "fabrica" ou "carro"
    this.origem = origem;
    this.x = x + random(-6, 6);                // pequena variação na posição de nascimento
    this.y = y;
    this.raio = random(tipo.raioMin, tipo.raioMax);   // tamanho aleatório
    this.vy = -random(tipo.velMin, tipo.velMax);      // velocidade aleatória (negativa = sobe)
    this.vx = random(-PARTICULA_DERIVA, PARTICULA_DERIVA);  // deriva lateral aleatória
    this.fase = random(TWO_PI);                // para cada uma ondular de forma diferente
    this.aspirada = false;                     // está dentro do raio de aspiração?
  }

  // Corre em cada frame. Recebe o drone para saber se está a ser aspirada.
  atualizar(drone) {
    // COLISÃO 1 - círculo com círculo: a partícula entra no raio de aspiração
    // se a distância entre os centros for menor que a soma dos raios.
    const d = dist(this.x, this.y, drone.x, drone.y);
    this.aspirada = drone.raioAspiracao > 0 && d < drone.raioAspiracao + this.raio;

    if (this.aspirada) {
      // atan2 dá o ângulo da direção partícula -> drone; cos e sin transformam
      // esse ângulo num passo em x e em y.
      const ang = atan2(drone.y - this.y, drone.x - this.x);
      this.x += cos(ang) * ASPIRACAO_FORCA;
      this.y += sin(ang) * ASPIRACAO_FORCA;
    } else {
      // Sobe, com deriva lateral e uma ligeira ondulação (como fumo)
      this.x += this.vx + sin(frameCount * 0.03 + this.fase) * 0.3;
      this.y += this.vy;
    }
  }

  // COLISÃO 2 - círculo com círculo: a partícula toca no corpo do drone.
  // Só conta com a ventoinha ligada (raioAspiracao > 0): sem aspiração, passa.
  tocouNoDrone(drone) {
    return drone.raioAspiracao > 0 &&
           dist(this.x, this.y, drone.x, drone.y) < drone.raio + this.raio;
  }

  // Chegou ao topo da janela? Então escapou para o céu.
  escapou() {
    return this.y + this.raio < 0;
  }

  // As partículas maiores valem mais pontos (raio arredondado).
  pontos() {
    return round(this.raio);
  }

  desenhar() {
    push();
    if (this.aspirada) {
      noStroke();
      fill(...COR.destaque, 220);     // fica verde quando está a ser aspirada
    } else {
      fill(...COR.particula, 200);    // fumo escuro, um pouco transparente
      stroke(...COR.particulaContorno, 130);   // contorno claro: vê-se bem sobre o céu escuro
      strokeWeight(1.5);
    }
    circle(this.x, this.y, this.raio * 2);
    pop();
  }
}