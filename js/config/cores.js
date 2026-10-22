// ============================================================
// cores.js - Paleta de cores num só sítio.
// Para mudar o visual do jogo basta mexer aqui.
// ============================================================

const COR = {
  // Interface
  fundo:       [18, 32, 47],
  texto:       [235, 245, 250],
  destaque:    [80, 200, 160],
  botao:       [80, 200, 160],
  botaoHover:  [130, 230, 195],
  botaoInativo:[70, 85, 100],     // botão desativado (cinzento)
  rodape:      [150, 175, 195],

  // Cidade (fase 2)
  ceuTopo:     [24, 40, 66],      // céu limpo, em cima
  ceuBase:     [125, 108, 92],    // horizonte acastanhado pela poluição
  predios:     [45, 58, 75],
  fabrica:     [74, 64, 64],
  solo:        [28, 34, 40],
  estrada:     [52, 56, 62],

  // Drone (fase 2)
  drone:       [230, 240, 248],
  droneBraco:  [150, 175, 195],

  // Poluição e carros (fase 2B)
  particula:   [55, 50, 48],      // fumo escuro
  particulaContorno: [190, 180, 170],   // contorno claro para se ver sobre o céu escuro
  carros:      [[200, 70, 70], [70, 120, 200], [230, 190, 70], [190, 190, 200]],

// Barra de AQI e alertas (fase 3)
  aqiBom:      [80, 200, 120],    // ar limpo
  aqiMedio:    [240, 200, 70],
  aqiMau:      [230, 80, 70],     // ar muito poluído
  alerta:      [240, 90, 80]

};