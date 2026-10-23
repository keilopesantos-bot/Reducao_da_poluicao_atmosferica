# Diário de Desenvolvimento - Clean Air Drone

Keila Santos · 34668 · ECGM · Sistemas Multimédia 2026-2027
Tema: Air Pollution Reduction · Repositório: https://github.com/keilopesantos-bot/Reducao_da_poluicao_atmosferica

> Ferramenta de IA usada em todas as sessões: **Claude (Anthropic)**, como apoio permitido pelo enunciado
> (propostas de estrutura e de código, explicações, depuração e testes). Em cada sessão indico a finalidade,
> o resultado que usei e as minhas decisões. A ideia do jogo (Clean Air Drone) e o relatório inicial
> são anteriores a este diário e foram feitos por mim.

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

**Uso de IA:** propor o plano e a estrutura do projeto, o código base do esqueleto, e explicar cada parte (máquina de estados, `push()/pop()`, ordem de carregamento dos scripts). Usei a estrutura do esqueleto, a classe `Botao` e as funções de cada ecrã, que li e testei no browser.

**Decisões minhas:** pedi que o código ficasse separado por pastas (classes, ecrãs, sons...) para perceber onde está cada parte; dividi a configuração em três ficheiros (`cores.js`, `estados.js`, `rodape.js`); decidi usar as bibliotecas p5 das aulas em vez de CDN.

**Problemas e soluções:**
1. Criei os ficheiros de `config/` sem a extensão `.js` e o editor não os reconhecia como JavaScript. Renomeei-os.
2. Criei `assets` e `docs` dentro de `js/`; os caminhos dos sons são relativos ao `index.html`, por isso movi-as para a raiz.
3. O ficheiro do p5 chamava-se `p5 (1).js`, com espaço e parênteses; renomeei-o para `p5.js` e usei exatamente as maiúsculas de `Soundlib` nos caminhos.

---

## Sessão 2 - 20/10/2026

**Objetivo:** criar a cidade, o drone controlado pelo rato, as partículas de poluição e as colisões (fase 2).

**Atividades realizadas:**
- `config/jogo.js` com as constantes da cidade, do drone e da poluição, em frações da janela para o jogo se adaptar ao tamanho.
- Classe `Drone`: segue o rato com suavização, fica limitado à zona de jogo, tem potência da ventoinha (0 a 1) e raio de aspiração proporcional; hélices animadas.
- Cidade desenhada só com primitivas (`ui/cidade.js`): céu em degradê, prédios, fábricas, chão e estrada.
- Classe `Particula`: nasce de fábricas ou carros com tamanho, velocidade e deriva aleatórios, dentro de intervalos definidos; é puxada pelo drone dentro do raio de aspiração.
- Classe `Carro`: circula na estrada e emite poluição pelo escape.
- Aleatoriedade controlada: intervalos mínimo/máximo por tipo de partícula, tempo aleatório entre nascimentos e limite de 40 partículas em simultâneo.
- Colisões círculo–círculo: partícula/raio de aspiração (é puxada) e partícula/corpo do drone (é removida e dá pontos).

**Uso de IA:** propor as classes `Drone`, `Particula` e `Carro`, o desenho da cidade e o algoritmo de aspiração e colisão, e explicar a suavização do movimento, o `translate`, a colisão círculo–círculo e a remoção de elementos de uma lista percorrida ao contrário. Usei o código proposto, que testei no browser.

**Decisões minhas:** adotei o limite de partículas e a regra de a ventoinha só aspirar quando está ligada; o fumo escuro confundia-se com o céu e passou a ter um contorno claro.

**Problemas e soluções:**
- Ao clicar em "Começar" nada acontecia e a consola mostrava `Drone is not defined` e um erro 404 em `Drone.js`. Tinha criado o ficheiro em `js/config` em vez de `js/classes`, por isso o browser não o encontrava. Como `iniciarExecucao()` falhava antes de `estado = novoEstado`, o jogo ficava no ecrã de início. Resolvi movendo o ficheiro para `js/classes/`.

---

## Sessão 3 - 20/10/2026

**Objetivo:** tempo de 60 s, pontuação, barra de AQI, vitória e derrota e ecrã de resultado com dados reais (fase 3).

**Atividades realizadas:**
- Classe `BarraAQI`: o AQI sobe quando uma partícula escapa e desce quando é aspirada; decide vitória/derrota e desenha a barra (verde, amarelo, vermelho) com a marca da meta.
- HUD (`ui/hud.js`) com pontuação, tempo `m:ss` (vermelho nos últimos 10 s) e barra de AQI.
- Cronómetro com `millis()`; vitória se o tempo acabar com AQI abaixo de 50; derrota se o AQI chegar a 100.
- Ecrã de resultado com motivo, pontuação, tempo, AQI final e partículas aspiradas e escapadas.
- Teste de equilíbrio: parado e sem ventoinha, perde-se por volta dos 45 s.

**Uso de IA:** propor `BarraAQI`, o HUD, as regras do AQI e a estrutura de `dadosResultado`; explicar o cronómetro com `millis()`, a diferença entre `valor` e `valorVisivel` e o uso de `constrain`. Usei o código dos novos ficheiros, que testei.

**Decisões minhas:** escala de AQI de 0 a 100 (simplificação do índice oficial, que vai de 0 a 500); escapar pesa mais do que aspirar (0,09 contra 0,04) para haver pressão; as regras ficam todas em `jogo.js` para as afinar num só sítio; retirei o botão provisório "Terminar (teste)".

**Problemas e soluções:**
- Apareceu `desenharHUD is not defined`: o `hud.js` não estava a ser carregado pelo `index.html`. Confirmei a pasta, o conteúdo guardado e a linha `<script>`, e passou a funcionar. Lição: com ficheiros novos, verificar sempre pasta, conteúdo guardado e linha no `index.html`, pela ordem certa.

---

## Sessão 4 - 21/10/2026

**Objetivo:** ligar o microfone ao jogo, com calibração e histerese (fase 4).

**Atividades realizadas:**
- Classe `Microfone` (estados: inativo, a pedir, a calibrar, pronto, erro) com `p5.AudioIn`.
- Calibração de 3 s no ecrã de início, com barra de progresso: mede o ruído ambiente e calcula a média.
- Limites a partir da média: `superior = média*2 + margem` e `inferior = média*1,3 + margem`.
- Histerese: a ventoinha liga acima do limite superior e só desliga abaixo do inferior.
- O volume passa a potência (25% a 100%), que define o raio de aspiração (`potência * 160 px`).
- Medidor de volume com as marcas dos dois limites, no início e durante o jogo; botão "Recalibrar".
- O botão "Começar" só fica ativo depois da calibração.
- Alternativa: se o microfone falhar, o botão do rato premido liga a ventoinha.

**Uso de IA:** propor `Microfone`, o cálculo dos limites e a histerese, e explicar por que o áudio exige um clique do utilizador. A IA testou o código num browser com um microfone simulado (ficheiro de áudio), incluindo a histerese com sons controlados.

**Decisões minhas:** o microfone só é ativado ao clicar em "Ativar microfone" (exigência do browser); limites calculados da média do ruído, para o jogo se adaptar a cada sala; alternativa com o rato só quando o microfone não está disponível, para a apresentação não falhar.

**Problemas e soluções:**
1. Nos testes com áudio simulado, ao recalibrar com som alto durante a medição, a média subia tanto que os limites ficavam acima de qualquer volume e a ventoinha nunca ligava. Solução: o limite superior nunca passa de 0,30, o inferior fica no máximo a 80% do superior, e o ecrã avisa para recalibrar quando o ambiente é ruidoso.
2. `Microfone is not defined`: o ficheiro não estava a ser carregado.
3. `Illegal return statement` no `execucao.js`: uma chaveta a mais/menos ao colar partes do código. Passei a substituir ficheiros inteiros em vez de remendar.
4. No meu computador, a primeira calibração deu ruído de 1,2%, "liga acima de" 6,4% e "desliga abaixo de" 3,5%, e a ventoinha demorava a ligar com a voz. Duas causas: limites altos para o meu microfone, e o browser aplicar supressão de ruído e controlo automático de ganho, que atenuam sons constantes. Solução: margens dos limites mais baixas (0,02 e 0,01) e pedir o microfone sem esse tratamento (`applyConstraints`). A ventoinha passou a responder depressa.

---

## Sessão 5 - 22/10/2026

**Objetivo:** sons: fundo da cidade, ventoinha ligada à aspiração e efeito de recolha (fase 5).

**Atividades realizadas:**
- Classe `GestorSons`: carrega os `.wav`, toca loops e efeitos, silencia tudo.
- Som da cidade em loop; som da ventoinha em loop com volume e tom que seguem a potência vinda do microfone; 3 efeitos de recolha (agudo, médio, grave) conforme o tamanho da partícula; jingles de vitória e derrota.
- Classe `BotaoSom` (herda de `Botao`) para silenciar só com o rato, na faixa do HUD.
- Os sons só começam depois de um clique, por regra dos browsers.

**Uso de IA:** gerar os sons por síntese num script Python (`tools/gerar_sons.py`), propor `GestorSons` e a ligação dos sons ao jogo, e testar num browser com áudio real. Usei os ficheiros `.wav` e o código; como os sons são gerados por script, são originais e não precisam de crédito de terceiros.

**Decisões minhas:** escolhi a opção de sons originais gerados por código, em vez de descarregar sons de terceiros, para evitar licenças e créditos e cumprir o requisito de ficheiros de áudio; 3 ficheiros de recolha em vez de mudar o tom de um só; volume baixo para a cidade, porque o microfone pode ouvir as colunas.

**Problemas e soluções:**
1. O botão de silenciar rebentava com `masterVolume is not defined`: na versão do p5.sound o volume geral chama-se `outputVolume`. Solução: usar `typeof` para chamar a função que existir.
2. `loadSound` no `preload()` deixaria o jogo parado se faltasse um ficheiro. Solução: carregar no `setup()` com tratamento de erro; testei sem os ficheiros e o jogo arranca na mesma, só sem som.
3. Faltavam ficheiros `.wav` na pasta e a linha de `sons.js` no `index.html`; a consola mostrava `404` e `SONS_FICHEIROS is not defined`. Corrigi a pasta e o `index.html`.
4. O botão de silenciar estava num sítio onde o drone também voa; passei-o para a faixa do HUD.

---

## Sessão 6 - 22/10/2026 e 23/10/2026

**Objetivo:** criar a funcionalidade original: power-ups de energia limpa que aumentam a potência da ventoinha durante 5 segundos (fase 6), e integrá-la no projeto.

**Atividades realizadas:**
- Classe `PowerUp`: painel solar e turbina eólica desenhados com primitivas, a cair do céu com halo pulsante; deteção de toque no drone e de chegada ao chão.
- Classe `GestorPowerUps`: faz nascer power-ups com tempo e tipo aleatórios (máximo 1 em jogo), mantém os efeitos ativos e aplica os bónus ao drone.
- Painel solar: raio de aspiração x1,5 durante 5 s. Turbina eólica: sucção x1,6 durante 5 s. Os dois efeitos acumulam-se.
- Feedback: som ao apanhar, anel à volta do drone, indicadores com barra de tempo e contador no resultado.
- Verificação final: um script em PowerShell confirma que todas as alterações da fase estão nos ficheiros.

**Uso de IA:** propor o desenho da funcionalidade e as classes `PowerUp` e `GestorPowerUps`, gerar o som por síntese, testar o comportamento (duração, efeitos, aleatoriedade, reinício) num browser, e ajudar a diagnosticar os erros de integração. Usei o código dos novos ficheiros e as alterações a `Drone`, `Particula` e ao ecrã de execução.

**Decisões minhas:** aceitei o desenho com dois tipos de efeito (alcance e força) e máximo de 1 power-up em simultâneo; como não consegui descarregar o `powerup.wav`, **copiei temporariamente o som de recolha** (`recolha_peq.wav`) com esse nome, para o jogo ficar completo.

**Problemas e soluções:** várias alterações em vários ficheiros ficaram por aplicar ou mal aplicadas, e cada uma deu um erro diferente na consola:
1. `ang is not defined` em `Particula.js`: ao colar a alteração apaguei a linha `const ang = ...`.
2. Linha de "Partículas aspiradas" duplicada e `Power-ups apanhados: undefined`: o `resultado.js` e o `terminarJogo` do `execucao.js` estavam desatualizados.
3. `404` em `PowerUp.js`: o ficheiro chamava-se `PowerUps.js` (com s) e o `index.html` pedia `PowerUp.js`.
4. `undefined is not iterable` em `PowerUp.js`: faltavam as cores `solar`, `eolica` e `painelSolar` no `cores.js`.
5. `SOM_VOL_POWERUP is not defined`: o `config/sons.js` estava na versão antiga.

**Solução e aprendizagem:** em vez de remendar, passei a substituir ficheiros inteiros e a usar um verificador (`Select-String` em PowerShell) que lista, ficheiro a ficheiro, o que falta. Aprendi a ler o primeiro erro da consola, a usar `typeof` para ver se uma classe ou constante existe, e que o nome do ficheiro tem de ser exatamente o do `index.html`.

---

## Recursos externos e créditos (para o relatório)
- **p5.js** e **p5.sound**: Processing Foundation, licença LGPL 2.1, https://p5js.org. Versões fornecidas pelo professor nas aulas.
- **Sons**: gerados por mim com um script próprio (`tools/gerar_sons.py`), feito com apoio de IA. Não há sons de terceiros. O som do power-up reutiliza temporariamente o de recolha.
- **Imagens**: nenhuma. Todos os gráficos são desenhados com primitivas do p5.js.

