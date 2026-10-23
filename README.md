# Clean Air Drone

Exercício prático individual de **Sistemas Multimédia** (Engenharia da Computação Gráfica e Multimédia, IPVC/ESTG, 2026-2027), desenvolvido em **p5.js**.

- **Autora:** Keila Santos · nº 34668 · ECGM
- **Tema atribuído:** Air Pollution Reduction (Sustentabilidade e Ambiente)
- **Repositório:** https://github.com/keilopesantos-bot/Reducao_da_poluicao_atmosferica
- **Protótipo de baixa fidelidade (Figma):** ➜ _(cola aqui o link que já tens)_

## O jogo

O jogador controla um **drone purificador de ar** que voa sobre uma cidade poluída. As fábricas e os carros lançam partículas de poluição para o ar; o drone tem de as aspirar antes que cheguem ao céu.

- O **rato** move o drone.
- A **ventoinha** liga-se com o **volume do microfone** (voz ou sopro): quanto maior o volume, maior o raio de aspiração.
- Cada partícula aspirada dá pontos (as maiores valem mais) e baixa o **AQI** (Índice de Qualidade do Ar). Cada partícula que escapa para o céu sobe o AQI.
- **Power-ups de energia limpa** (funcionalidade original): caem do céu painéis solares e turbinas eólicas. Ao apanhá-los com o drone, dão um bónus durante 5 segundos.
- A partida dura **60 segundos**. **Vitória** se o tempo acabar com o AQI abaixo da meta; **derrota** se o AQI chegar ao máximo.

### Os power-ups

| Power-up | Efeito (5 s) |
|---|---|
| Painel solar | Raio de aspiração ×1,5 |
| Turbina eólica | Sucção ×1,6 (as partículas são puxadas mais depressa) |

Os dois efeitos podem estar ativos ao mesmo tempo. Aparecem em intervalos aleatórios de 8 a 14 s, no máximo um de cada vez.

### O microfone

No ecrã de início, o jogador clica em **Ativar microfone** (os browsers só permitem áudio depois de um clique) e fica em silêncio durante 3 segundos. O jogo mede o ruído ambiente e calcula dois limites:

- limite **superior** (a ventoinha liga acima dele) = ruído médio × 2 + margem;
- limite **inferior** (a ventoinha desliga abaixo dele) = ruído médio × 1,3 + margem.

Entre os dois limites a ventoinha mantém o estado em que estava: é a **histerese**, que evita que ligue e desligue sem parar. Se o microfone não estiver disponível, a ventoinha liga-se mantendo o botão do rato premido.

### Regras (valores em `js/config/`)

| Regra | Valor |
|---|---|
| Duração da partida | 60 s |
| AQI inicial / máximo (derrota) | 30 / 100 |
| Meta de vitória | AQI abaixo de 50 no fim do tempo |
| Partícula que escapa | AQI sobe `raio × 0,09` |
| Partícula aspirada | AQI desce `raio × 0,04` e dá `raio` pontos |
| Partículas em simultâneo | máximo 40, a nascer a cada 250 a 700 ms |
| Potência da ventoinha | 25% a 100%, conforme o volume (raio máximo 160 px) |

## Ecrãs
1. **Início:** objetivo, instruções, ativação e calibração do microfone, botão Começar.
2. **Execução:** o jogo, com HUD (pontuação, tempo, AQI), painel do microfone e botão para silenciar.
3. **Resultado:** vitória/derrota, pontuação, tempo, AQI final, partículas aspiradas e escapadas, power-ups apanhados e botão Recomeçar.

O rodapé obrigatório (tema à esquerda; nome, nº e sigla à direita) aparece em todos os ecrãs.

## Como executar
1. Colocar a pasta do projeto num servidor local (por exemplo, XAMPP: `C:\xampp\htdocs\SM\PoluicaoAtmosferica`).
2. Abrir `http://localhost/SM/PoluicaoAtmosferica/` no browser.
3. Não abrir o `index.html` diretamente (`file://`): o acesso ao microfone exige `localhost` ou `https`, e o browser pede autorização.
4. Para evitar que o microfone ouça o jogo, usar **auscultadores** ou colunas com volume baixo.

## Estrutura do projeto

```
PoluicaoAtmosferica/
├── index.html        carrega as bibliotecas e os scripts (a ORDEM importa)
├── sketch.js         setup, draw, rato e mudança de estado (só orquestra)
├── p5/Soundlib/      p5.js e p5.sound (fornecidos nas aulas)
├── assets/
│   ├── sons/         8 ficheiros .wav
│   └── imagens/      (vazia: todos os gráficos são desenhados com primitivas)
├── docs/             diario.md (diário de desenvolvimento)
├── tools/            gerar_sons.py (gera os sons por síntese)
└── js/
    ├── config/       cores · estados · rodape · jogo · microfone · sons · powerups
    ├── classes/      Botao · BotaoSom · Drone · Particula · Carro · BarraAQI ·
    │                 PowerUp · GestorPowerUps · Microfone · GestorSons
    ├── ui/           rodape · cidade · hud
    └── ecras/        inicio · execucao · resultado
```

### Classes e responsabilidades

| Classe | Responsabilidade |
|---|---|
| `Botao` | Botão com deteção de clique, hover e estado ativo/inativo |
| `BotaoSom` | Herda de `Botao`: botão redondo para silenciar |
| `Drone` | Segue o rato com suavização; guarda a potência, o raio de aspiração e os bónus dos power-ups |
| `Particula` | Poluição com tamanho e velocidade aleatórios; é aspirada, removida ou escapa |
| `Carro` | Circula na estrada e emite poluição pelo escape |
| `BarraAQI` | Guarda o AQI, decide vitória/derrota e desenha a barra |
| `PowerUp` | Painel solar ou turbina eólica que cai do céu |
| `GestorPowerUps` | Faz nascer os power-ups, deteta o toque, guarda os efeitos e aplica os bónus |
| `Microfone` | Acesso ao microfone, calibração de 3 s, histerese e conversão do volume em potência |
| `GestorSons` | Carrega e toca os sons; volume e tom da ventoinha; silenciar |

## Como alterar o jogo (todos os valores estão em `js/config/`)

| Quero mudar... | Onde |
|---|---|
| A dificuldade | `jogo.js`: `AQI_POR_ESCAPE`, `SPAWN_INTERVALO_MIN/MAX`, `AQI_LIMITE_VITORIA` |
| A duração da partida | `jogo.js`: `DURACAO_JOGO` |
| A sensibilidade do microfone | `microfone.js`: `MIC_MARGEM_SUP`, `MIC_MARGEM_INF` |
| Os power-ups (duração, bónus, frequência) | `powerups.js` |
| Os volumes dos sons | `sons.js` |
| As cores | `cores.js` |

## Estado dos requisitos

| # | Requisito | Estado |
|---|---|---|
| 1 | Objetivo quantificável (pontos, tempo, AQI) 
| 2 | Sustentabilidade; primitivas gráficas e áudio 
| 3 | Rodapé obrigatório 
| 4 | Aleatoriedade controlada
| 5 | Controlo só por microfone + rato 
| 6 | Calibração do microfone e histerese 
| 7 | Colisões entre objetos 
| 8 | Sons integrados 
| 9 | Feedback constante 
| 10 | Mínimo de 3 ecrãs 
| 11 | Código estruturado e comentado, com classes
| 12 | Funcionalidade original: power-ups de energia limpa 
| 14 | Repositório Git com commits progressivos |
| 15 | Diário de desenvolvimento 
| 16 | Relatório final | entrega a 26/10 |

## Limitações conhecidas
- Com colunas altas, o microfone pode ouvir o jogo e ligar a ventoinha; recomenda-se usar auscultadores.
- Em janelas muito pequenas, parte do texto pode sair do ecrã.
- O som do power-up reutiliza temporariamente o som de recolha.

## Utilização de IA
Foi usada IA (Claude, da Anthropic) como apoio, como o enunciado permite: propostas de estrutura e de código, explicações, depuração, geração dos sons por script e testes. O registo detalhado (ferramenta, finalidade, resultado usado e as minhas decisões, sessão a sessão) está no [Diário de Desenvolvimento](docs/diario.md).

## Créditos e licenças
- **p5.js** e **p5.sound** — Processing Foundation, licença LGPL 2.1, https://p5js.org. Versões fornecidas pelo professor nas aulas.
- **Sons**: gerados por síntese com o script `tools/gerar_sons.py` (próprio, feito com apoio de IA). Sem material de terceiros.
- **Gráficos**: desenhados com primitivas do p5.js (sem imagens externas).