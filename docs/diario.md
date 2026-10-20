# Diário de Desenvolvimento - Clean Air Drone

Keila Santos · 34668 · ECGM · Sistemas Multimédia 2026-2027
Tema: Air Pollution Reduction · Repositório: https://github.com/keilopesantos-bot/Reducao_da_poluicao_atmosferica

---

## Sessão 1 - 19/10/2026

**Objetivo:** criar o esqueleto do jogo em p5.js com os 3 ecrãs obrigatórios (início, execução, resultado) e o rodapé com o tema e os meus dados em todos os ecrãs.

**Atividades realizadas:**
- Defini um plano por fases para os dias até à entrega (26/10).
- Criei o `index.html` e o `sketch.js` com uma máquina de estados (início, execução, resultado).
- Implementei a classe `Botao` (desenho, deteção de clique com o rato e mudança do cursor).
- Implementei o rodapé obrigatório: tema em inglês em baixo à esquerda; nome, nº de aluno e sigla em baixo à direita.
- Organizei o projeto em pastas: `js/config`, `js/classes`, `js/ui`, `js/ecras`, `assets/sons`, `assets/imagens` e `docs`.
- Liguei as bibliotecas p5.js e p5.sound fornecidas pelo professor no exemplo das aulas (pasta `p5/Soundlib`).
- Testei em `localhost` (XAMPP): os 3 ecrãs funcionam, o rodapé aparece em todos e a consola não mostra erros.

**Uso de IA:**
- Ferramenta: Claude (Anthropic), através do Claude Code.
- Finalidade: propor o plano por fases, sugerir a estrutura do projeto e o código base do esqueleto, e explicar cada parte (máquina de estados, `push()/pop()`, ordem de carregamento dos scripts).
- Resultado usado: a estrutura do esqueleto, a classe `Botao` e as funções de cada ecrã, que li e testei no browser.
- Alterações e decisões minhas: pedi a organização do código em pastas por tipo (classes, ecrãs, sons...) para perceber onde está cada parte; dividi a configuração em três ficheiros (`cores.js`, `estados.js`, `rodape.js`); decidi usar as bibliotecas p5 das aulas em vez de CDN.

**Problemas e soluções:**
1. Criei os ficheiros de `config/` sem a extensão `.js` e o editor não os reconhecia como JavaScript. Renomeei-os para `cores.js`, `estados.js` e `rodape.js`.
2. Criei as pastas `assets` e `docs` dentro de `js/`. Os caminhos dos sons são relativos ao `index.html`, por isso movi-as para a raiz do projeto.
3. O ficheiro do p5 chamava-se `p5 (1).js`, com espaço e parênteses; renomeei-o para `p5.js`. Usei exatamente as maiúsculas de `Soundlib` nos caminhos para funcionarem noutros sistemas.

**Decisões:**
- Canvas com o tamanho da janela, para o rodapé ficar sempre nos cantos.
- Estados do jogo em constantes, para evitar erros de escrita.
- Um ficheiro por classe e por ecrã, para ser fácil encontrar cada parte do código.
- Scripts normais em vez de módulos ES, para manter o código simples; a ordem no `index.html` é: configuração, classes, interface, ecrãs e `sketch.js`.

---

## Sessão 2 - 20/10/2026

**Objetivo:** criar a cidade, o drone controlado pelo rato, as partículas de poluição e as colisões (fase 2).

**Atividades realizadas:**
- Ficheiro `config/jogo.js` com as constantes da cidade, do drone e da poluição, em frações da janela para o jogo se adaptar a qualquer tamanho.
- Classe `Drone`: segue o rato com suavização, fica limitado à zona de jogo, tem potência da ventoinha (0 a 1) e raio de aspiração proporcional à potência; hélices animadas.
- Desenho da cidade só com primitivas (`ui/cidade.js`): céu em degradê, prédios, fábricas, chão e estrada.
- Classe `Particula`: nasce de fábricas ou carros com tamanho, velocidade e deriva aleatórios, dentro de intervalos definidos; sobe, ondula e é puxada pelo drone quando entra no raio de aspiração.
- Classe `Carro`: circula na estrada em duas direções e emite poluição pelo escape.
- Aleatoriedade controlada: intervalos mínimo/máximo por tipo de partícula, tempo aleatório entre nascimentos e limite de 40 partículas em simultâneo.
- Colisões círculo–círculo: partícula/raio de aspiração (é puxada) e partícula/corpo do drone (é removida e dá pontos).
- Ventoinha provisória: botão do rato premido liga a ventoinha, até ligar o microfone (fase 4).

**Uso de IA:**
- Ferramenta: Claude (Anthropic).
- Finalidade: propor a estrutura das classes `Drone`, `Particula` e `Carro`, o desenho da cidade e o algoritmo de aspiração e colisão, e explicar a suavização do movimento (`x += (rato - x) * fator`), o `translate`, a colisão círculo–círculo e a remoção de elementos de uma lista a percorrer ao contrário.
- Resultado usado: o código das classes e do ecrã de execução, que testei no browser.
- Alterações e decisões minhas: adotei o limite de partículas e a ideia de a ventoinha só aspirar quando está ligada; vi que o fumo se confundia com o céu escuro e acrescentei-lhe um contorno claro.

**Problemas e soluções:**
- O clique em "Começar" deixou de fazer nada e a consola mostrava `Drone is not defined` e um erro 404 em `Drone.js`. Tinha criado o ficheiro na pasta `js/config` em vez de `js/classes`, por isso o browser não o encontrava. Como `iniciarExecucao()` falhava antes de `estado = novoEstado`, o jogo ficava no ecrã de início. Resolvi movendo o ficheiro para `js/classes/`.

**Decisões:**
- Dados da cidade (`FABRICAS`, `PREDIOS`) em listas, usadas tanto para desenhar como para fazer nascer a poluição.
- A remoção de partículas faz-se a percorrer a lista do fim para o princípio, para não saltar elementos ao usar `splice()`.
- As partículas maiores (fábricas) valem mais pontos que as dos carros.

---

## Sessão 3 - 20/10/2026

**Objetivo:** adicionar o tempo de 60 s, a pontuação, a barra de AQI, as condições de vitória e derrota e o ecrã de resultado com dados reais (fase 3).

**Atividades realizadas:**
- Classe `BarraAQI`: guarda o AQI, sobe quando uma partícula escapa e desce quando é aspirada, decide vitória/derrota e desenha a barra com cor (verde, amarelo, vermelho) e a marca da meta.
- HUD (`ui/hud.js`) com pontuação, tempo no formato `m:ss` (vermelho nos últimos 10 s) e barra de AQI.
- Cronómetro com `millis()`; vitória se o tempo acabar com AQI abaixo de 50; derrota se o AQI chegar a 100.
- Ecrã de resultado com título, motivo, pontuação, tempo de jogo, AQI final, partículas aspiradas e escapadas.
- Reinício limpo da partida ao carregar em Recomeçar e Começar.
- Teste do equilíbrio: sem mexer e sem ventoinha, perde-se por volta dos 45 s (AQI chega a 100).

**Uso de IA:**
- Ferramenta: Claude (Anthropic).
- Finalidade: propor a classe `BarraAQI`, o HUD, as regras de AQI e a estrutura do resultado (`dadosResultado`), e explicar o cronómetro com `millis()`, a diferença entre `valor` e `valorVisivel` e o uso de `constrain`.
- Resultado usado: o código dos novos ficheiros, que testei no browser.
- Alterações e decisões minhas: adotei a escala do AQI de 0 a 100 e os valores das regras, que ficam todos em `jogo.js` para os poder afinar; retirei o botão provisório "Terminar (teste)" porque o jogo já tem um fim a sério.

**Problemas e soluções:**
- Ao carregar em Começar apareceu `desenharHUD is not defined`. O `hud.js` não estava a ser carregado pelo `index.html`. Confirmei que o ficheiro estava em `js/ui/` e tinha a sua linha `<script>`, e passou a funcionar. Lição: quando um ficheiro é novo, verificar sempre a pasta, o conteúdo guardado e a linha no `index.html`, pela ordem certa.

**Decisões:**
- Escala de AQI de 0 a 100 (simplificação do índice oficial, que vai de 0 a 500), para o jogador perceber o progresso.
- Escapar pesa mais do que aspirar (0,09 contra 0,04), para haver pressão sobre o jogador.
- O valor do AQI mostrado na barra acompanha o real com suavização, mas as regras usam sempre o valor real.

---

## Recursos externos e créditos (para o relatório)
- p5.js e p5.sound: Processing Foundation, licença LGPL 2.1, versões fornecidas pelo professor nas aulas.
- Sem imagens nem sons externos até ao momento.

## Próximos passos
- Fase 4: microfone com calibração de 3 s, histerese entre dois limites e volume a controlar o raio de aspiração.
- Fase 5: sons (cidade, ventoinha, recolha).
- Fase 6: power-ups de energia limpa.
- Fase 7: revisão, créditos e relatório.