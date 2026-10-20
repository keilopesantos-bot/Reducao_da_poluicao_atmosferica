# Clean Air Drone

Exercício prático individual de **Sistemas Multimédia** (Engenharia da Computação Gráfica e Multimédia, IPVC/ESTG, 2026-2027), desenvolvido em **p5.js**.

- **Autora:** Keila Santos · nº 34668 · ECGM
- **Tema atribuído:** Air Pollution Reduction (Sustentabilidade e Ambiente)
- **Protótipo de baixa fidelidade (Figma):** _(cola aqui o link que já tens)_

## O jogo

O jogador controla um **drone purificador de ar** que voa sobre uma cidade poluída. As fábricas e os carros lançam partículas de poluição para o ar; o drone tem de as aspirar antes que cheguem ao céu.

- O **rato** move o drone.
- A **ventoinha** liga-se com o **volume do microfone** (voz ou sopro): quanto maior o volume, maior o raio de aspiração.
- Cada partícula aspirada dá pontos (as maiores valem mais) e baixa o **AQI** (Índice de Qualidade do Ar). Cada partícula que escapa para o céu sobe o AQI.
- A partida dura **60 segundos**. **Vitória** se o tempo acabar com o AQI abaixo da meta; **derrota** se o AQI chegar ao máximo.

> **Estado atual:** o microfone ainda não está ligado. Por agora, a ventoinha liga-se mantendo o **botão do rato premido** (solução provisória, a substituir na fase 4).

### Regras (valores em `js/config/jogo.js`)

| Regra | Valor |
|---|---|
| Duração da partida | 60 s |
| AQI inicial / máximo (derrota) | 30 / 100 |
| Meta de vitória | AQI abaixo de 50 no fim do tempo |
| Partícula que escapa | AQI sobe `raio × 0,09` |
| Partícula aspirada | AQI desce `raio × 0,04` e dá `raio` pontos |
| Partículas em simultâneo | máximo 40 |

## Ecrãs
1. **Início:** objetivo, instruções e botão Começar.
2. **Execução:** o jogo, com HUD (pontuação, tempo, barra de AQI).
3. **Resultado:** vitória/derrota, pontuação, tempo, AQI final e botão Recomeçar.

O rodapé obrigatório (tema à esquerda; nome, nº e sigla à direita) aparece em todos os ecrãs.

## Como executar
1. Colocar a pasta do projeto num servidor local (por exemplo, XAMPP: `C:\xampp\htdocs\SM\PoluicaoAtmosferica`).
2. Abrir `http://localhost/SM/PoluicaoAtmosferica/` no browser.
3. Não abrir o `index.html` diretamente (`file://`): o acesso ao microfone exige `localhost` ou `https`, e o browser vai pedir autorização.

## Estrutura do projeto

```
PoluicaoAtmosferica/
├── index.html        carrega as bibliotecas e os scripts (a ORDEM importa)
├── sketch.js         setup, draw, rato e mudança de estado (só orquestra)
├── p5/Soundlib/      p5.js e p5.sound (fornecidos nas aulas)
├── assets/           sons/ e imagens/
├── docs/             diario.md (diário de desenvolvimento)
└── js/
    ├── config/       cores.js · estados.js · rodape.js · jogo.js
    ├── classes/      Botao.js · Drone.js · Particula.js · Carro.js · BarraAQI.js
    ├── ui/           rodape.js · cidade.js · hud.js
    └── ecras/        inicio.js · execucao.js · resultado.js
```

### Classes e responsabilidades

| Classe | Responsabilidade |
|---|---|
| `Botao` | Botão com deteção de clique e feedback de hover |
| `Drone` | Segue o rato com suavização, guarda a potência da ventoinha e o raio de aspiração |
| `Particula` | Poluição com tamanho/velocidade aleatórios; é aspirada, removida ou escapa |
| `Carro` | Circula na estrada e emite poluição pelo escape |
| `BarraAQI` | Guarda o AQI, decide vitória/derrota e desenha a barra |

## Estado dos requisitos

| # | Requisito | Estado |
|---|---|---|
| 1 | Exercício interativo com objetivo quantificável (pontos, tempo, AQI) | ✅ |
| 2 | Âmbito de Sustentabilidade; primitivas gráficas | ✅ (áudio pendente) |
| 3 | Rodapé obrigatório | ✅ |
| 4 | Aleatoriedade controlada (limites e máximo em simultâneo) | ✅ |
| 5 | Controlo só por microfone + rato | ⏳ rato feito; microfone na fase 4 |
| 6 | Calibração do microfone e histerese | ⏳ fase 4 |
| 7 | Colisões entre objetos | ✅ (círculo–círculo) |
| 8 | Sons integrados | ⏳ fase 5 |
| 9 | Feedback constante (tempo, pontuação, AQI) | ✅ |
| 10 | Mínimo de 3 ecrãs | ✅ |
| 11 | Código estruturado e comentado, com classes | ✅ (em curso) |
| 12 | Funcionalidade original: power-ups de energia limpa | ⏳ fase 6 |
| 14 | Repositório Git com commits progressivos | ✅ |
| 15 | Diário de desenvolvimento | ✅ (em curso) |
| 16 | Relatório final | ⏳ |

## Utilização de IA
Foi usada IA (Claude, da Anthropic) como apoio, como o enunciado permite: propostas de estrutura e de código, explicações e depuração. O registo detalhado (ferramenta, finalidade, resultado usado e as minhas alterações e decisões) está no [Diário de Desenvolvimento](docs/diario.md).

## Créditos e licenças
- **p5.js** e **p5.sound** — Processing Foundation, licença LGPL 2.1, https://p5js.org. Versões fornecidas pelo professor no exemplo das aulas.
- Gráficos desenhados com primitivas do p5.js (sem imagens externas até ao momento).
- Sons: _(a preencher na fase 5, com fonte e licença de cada um)_.