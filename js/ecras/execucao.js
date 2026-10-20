// ============================================================
// execucao.js - Ecrã 2: Execução (o jogo propriamente dito).
// Fase 2B: drone, carros, partículas de poluição, aspiração e colisões.
// ============================================================

// Botão TEMPORÁRIO para testar a ida para o resultado.
// Não uso teclado porque o enunciado só permite microfone + rato.
const botaoTerminar = new Botao("Terminar (teste)", 240, 48);

// Estado do jogo em execução (tudo é recriado em iniciarExecucao)
let drone;              // o drone do jogador
let carros = [];        // lista de carros na estrada
let particulas = [];    // lista de partículas de poluição em jogo
let proximoSpawn = 0;   // instante (em ms) em que nasce a próxima partícula
let pontuacao = 0;      // provisório: a fase 3 organiza a pontuação e o AQI
let aspiradas = 0;      // quantas partículas já aspirou
let escapadas = 0;      // quantas escaparam para o céu

// Chamada UMA vez de cada vez que se entra no ecrã de execução
// (ver mudarEstado em sketch.js). Prepara um jogo novo do zero.
function iniciarExecucao() {
  drone = new Drone();
  particulas = [];
  carros = [];
  for (let i = 0; i < NUM_CARROS; i++) {
    carros.push(new Carro());
  }
  pontuacao = 0;
  aspiradas = 0;
  escapadas = 0;
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
  for (const c of carros) {
    c.atualizar();
  }

  // Nasce uma partícula quando chega a hora; o intervalo até à seguinte é aleatório
  if (millis() >= proximoSpawn) {
    gerarParticula();
    proximoSpawn = millis() + random(SPAWN_INTERVALO_MIN, SPAWN_INTERVALO_MAX);
  }

  // TEMPORÁRIO: rato premido = ventoinha à potência máxima.
  // Na fase 4 isto passa a ser o volume do microfone.
  drone.definirPotencia(mouseIsPressed ? 1 : 0);
  drone.atualizar();

  // Percorremos a lista AO CONTRÁRIO (do fim para o princípio) porque podemos
  // remover elementos com splice(). Se fosse do princípio para o fim, ao remover
  // um elemento os seguintes "andavam uma casa" e saltávamos um sem o verificar.
  for (let i = particulas.length - 1; i >= 0; i--) {
    const p = particulas[i];
    p.atualizar(drone);

    if (p.tocouNoDrone(drone)) {
      pontuacao += p.pontos();
      aspiradas++;
      particulas.splice(i, 1);       // remove 1 elemento na posição i
    } else if (p.escapou()) {
      escapadas++;
      particulas.splice(i, 1);
    }
  }

  // ---------- 2. DESENHAR (o que vem depois fica por cima) ----------
  desenharCidade();
  for (const c of carros) c.desenhar();
  for (const p of particulas) p.desenhar();
  drone.desenhar();

  desenharInfoProvisoria();

  botaoTerminar.posicionar(width / 2, height * 0.08);
  botaoTerminar.desenhar();
}

// TEMPORÁRIO: mostra os contadores para vermos que tudo funciona.
// A fase 3 substitui isto pelo HUD final (tempo, pontuação e barra de AQI).
function desenharInfoProvisoria() {
  push();
  fill(COR.texto);
  noStroke();
  textSize(18);
  textAlign(LEFT, TOP);
  text("Pontos: " + pontuacao, MARGEM, MARGEM);
  text("Aspiradas: " + aspiradas, MARGEM, MARGEM + 26);
  text("Escaparam: " + escapadas, MARGEM, MARGEM + 52);
  text("Em jogo: " + particulas.length + " / " + PARTICULAS_MAX, MARGEM, MARGEM + 78);
  pop();
}

function cliqueExecucao() {
  if (botaoTerminar.contem(mouseX, mouseY)) {
    mudarEstado(RESULTADO);
  }
}