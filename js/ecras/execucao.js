// ============================================================
// execucao.js - Ecrã 2: Execução (o jogo propriamente dito).
// Fase 3: tempo, pontuação, AQI, vitória e derrota.
// Fase 4: a ventoinha é controlada pelo microfone.
// Fase 5: sons (ventoinha, recolha, vitória/derrota) e botão de silenciar.
// Fase 6: power-ups de energia limpa (funcionalidade original).
// ============================================================

// Botão de silenciar (só com o rato). Fica na faixa do HUD, onde o drone nunca entra.
const botaoSom = new BotaoSom(40);

// Estado da partida em curso (tudo é recriado em iniciarExecucao)
let drone;              // o drone do jogador
let carros = [];        // lista de carros na estrada
let particulas = [];    // lista de partículas de poluição em jogo
let aqi;                // índice de qualidade do ar (BarraAQI)
let powerups;           // power-ups de energia limpa (GestorPowerUps)
let proximoSpawn = 0;   // instante (em ms) em que nasce a próxima partícula
let inicioJogo = 0;     // instante (em ms) em que a partida começou
let tempoRestante = DURACAO_JOGO;   // segundos que faltam
let pontuacao = 0;
let aspiradas = 0;      // quantas partículas já aspirou
let escapadas = 0;      // quantas escaparam para o céu

// Chamada UMA vez de cada vez que se entra no ecrã de execução
// (ver mudarEstado em sketch.js). Prepara uma partida nova do zero.
function iniciarExecucao() {
  drone = new Drone();
  aqi = new BarraAQI();
  powerups = new GestorPowerUps();
  particulas = [];
  carros = [];
  for (let i = 0; i < NUM_CARROS; i++) {
    carros.push(new Carro());
  }
  pontuacao = 0;
  aspiradas = 0;
  escapadas = 0;
  inicioJogo = millis();           // millis() = milissegundos desde que o sketch arrancou
  tempoRestante = DURACAO_JOGO;
  proximoSpawn = millis() + 500;   // primeira partícula daqui a meio segundo
}

// Cria UMA partícula nova, numa fábrica ou num carro (ao acaso).
function gerarParticula() {
  // Limite máximo: se já há demasiadas em jogo, não nasce nenhuma
  if (particulas.length >= PARTICULAS_MAX) return;

  if (random() < PROB_FABRICA) {
    // random(lista) devolve um elemento ao acaso da lista
    const chamine = posicaoChamine(random(FABRICAS));
    particulas.push(new Particula(chamine.x, chamine.y, "fabrica"));
  } else {
    const escape = random(carros).posicaoEscape();
    particulas.push(new Particula(escape.x, escape.y, "carro"));
  }
}

function desenharExecucao() {
  // ---------- 1. ATUALIZAR o mundo ----------
  // O tempo que falta é a duração total menos o tempo já passado (ms -> s)
  tempoRestante = DURACAO_JOGO - (millis() - inicioJogo) / 1000;

  for (const c of carros) {
    c.atualizar();
  }

  // Nasce uma partícula quando chega a hora; o intervalo até à seguinte é aleatório
  if (millis() >= proximoSpawn) {
    gerarParticula();
    proximoSpawn = millis() + random(SPAWN_INTERVALO_MIN, SPAWN_INTERVALO_MAX);
  }

  // Power-ups: nascem, caem, são apanhados e dão bónus ao drone.
  // Vêm ANTES de calcular a potência, porque o bónus altera o raio de aspiração.
  if (powerups.atualizar(drone)) {
    sons.tocarPowerUp();
  }

  // A ventoinha é controlada pelo volume do microfone (já com calibração e histerese).
  // Só se o microfone não estiver disponível é que se usa o rato premido como alternativa.
  if (microfone.estado === "pronto") {
    drone.definirPotencia(microfone.potencia);
  } else {
    drone.definirPotencia(mouseIsPressed ? 1 : 0);
  }
  sons.atualizarVentoinha(drone.potencia);   // o som da ventoinha acompanha a aspiração
  drone.atualizar();

  // Percorremos a lista AO CONTRÁRIO porque podemos remover elementos com splice():
  // se fosse do princípio para o fim, ao remover um elemento os seguintes
  // "andavam uma casa" e saltávamos um sem o verificar.
  for (let i = particulas.length - 1; i >= 0; i--) {
    const p = particulas[i];
    p.atualizar(drone);

    if (p.tocouNoDrone(drone)) {
      pontuacao += p.pontos();
      aspiradas++;
      aqi.particulaAspirada(p);      // o ar melhora
      sons.tocarRecolha(p.raio);     // efeito sonoro de recolha (tom depende do tamanho)
      particulas.splice(i, 1);
    } else if (p.escapou()) {
      escapadas++;
      aqi.particulaEscapou(p);       // o ar piora
      particulas.splice(i, 1);
    }
  }

  aqi.atualizar();

  // ---------- 2. VERIFICAR O FIM DA PARTIDA ----------
  // A derrota por AQI máximo tem prioridade sobre o resto.
  if (aqi.atingiuMaximo()) {
    terminarJogo(false, "A poluição chegou ao limite máximo.");
    return;   // sai já: não vale a pena desenhar mais um frame da execução
  }
  if (tempoRestante <= 0) {
    if (aqi.abaixoDoLimite()) {
      terminarJogo(true, "O tempo acabou e o AQI ficou abaixo da meta!");
    } else {
      terminarJogo(false, "O tempo acabou, mas o AQI ficou acima da meta.");
    }
    return;
  }

  // ---------- 3. DESENHAR (o que vem depois fica por cima) ----------
  desenharCidade();
  for (const c of carros) c.desenhar();
  for (const p of particulas) p.desenhar();
  powerups.desenhar();
  drone.desenhar();
  desenharHUD(tempoRestante, pontuacao, aqi);
  powerups.desenharIndicadores();
  if (microfone.estado === "pronto") {
    microfone.desenharPainel(width / 2 - 130, height - 46, 260);   // em baixo, ao centro
  }

  botaoSom.posicionar(MARGEM + 140, HUD_ALTURA / 2);   // dentro da faixa do HUD, à direita da pontuação
  botaoSom.silenciado = sons.mudo;
  botaoSom.desenhar();
}

// Guarda os dados finais e passa ao ecrã de resultado.
function terminarJogo(vitoria, motivo) {
  dadosResultado = {
    vitoria: vitoria,
    motivo: motivo,
    pontos: pontuacao,
    tempo: constrain((millis() - inicioJogo) / 1000, 0, DURACAO_JOGO),
    aqi: aqi.valor,
    aspiradas: aspiradas,
    escapadas: escapadas,
    powerups: powerups.apanhados
  };
  sons.tocarFim(vitoria);            // jingle de vitória ou de derrota
  mudarEstado(RESULTADO);
}

// Durante o jogo o rato controla o drone; o único botão é o de silenciar.
function cliqueExecucao() {
  if (botaoSom.clicado(mouseX, mouseY)) {
    sons.alternarMudo();
  }
}
