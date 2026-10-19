# Diário de Desenvolvimento - Clean Air Drone

Keila Santos · 34668 · ECGM · Sistemas Multimédia 2026-2027
Tema: Air Pollution Reduction · Repositório: https://github.com/keilopesantos-bot/Reducao_da_poluicao_atmosferica

## Sessão 1 - 19/10/2026

**Objetivo:** criar o esqueleto do jogo em p5.js com os 3 ecrãs obrigatórios (início, execução, resultado) e o rodapé com o tema e os meus dados em todos os ecrãs.

**Atividades realizadas:**
- Defini um plano por fases para os dias até à entrega (26/10).
- Criei o `index.html` com p5.js 1.9.4 e p5.sound, e o `sketch.js` com a máquina de estados.
- Implementei a classe `Botao` (desenho, deteção de clique com o rato e mudança do cursor).
- Implementei o rodapé obrigatório: tema em inglês em baixo à esquerda; nome, nº de aluno e sigla em baixo à direita.
- Organizei o projeto em pastas: `js/config`, `js/classes`, `js/ui`, `js/ecras`, `assets/sons`, `assets/imagens` e `docs`.
- Testei em `localhost` (XAMPP): os 3 ecrãs funcionam, o rodapé aparece em todos e a consola não mostra erros.

**Uso de IA:**
- Ferramenta: Claude (Anthropic), através do Claude Code.
- Finalidade: propor o plano por fases, sugerir a estrutura do projeto e o código base do esqueleto, e explicar cada parte (máquina de estados, `push()/pop()`, ordem de carregamento dos scripts).
- Resultado usado: a estrutura do esqueleto, a classe `Botao` e as funções de cada ecrã, que li, testei e comentei.
- Alterações e decisões minhas: dividi a configuração em três ficheiros (`cores.js`, `estados.js`, `rodape.js`) em vez de um só; decidi a organização das pastas e corrigi-a quando percebi que estava errada (ver problemas); escolhi não usar teclado de atalho, por causa do requisito de controlo só por rato e microfone.

**Problemas e soluções:**
1. Criei os ficheiros de `config/` sem a extensão `.js`, e o editor não os reconhecia como JavaScript. Renomeei-os para `cores.js`, `estados.js` e `rodape.js`.
2. Criei as pastas `assets` e `docs` dentro de `js/`. Os caminhos dos sons são relativos ao `index.html`, por isso movi-as para a raiz do projeto.
3. As pastas vazias não vão para o Git, por isso vou usar ficheiros `.gitkeep` em `assets/sons` e `assets/imagens`.

**Decisões:**
- Canvas com o tamanho da janela, para o rodapé ficar sempre nos cantos.
- Estados do jogo em constantes, para evitar erros de escrita.
- Um ficheiro por classe e por ecrã, para ser fácil encontrar cada parte do código.
- Scripts normais em vez de módulos ES, para manter o código simples; a ordem no `index.html` é: configuração, classes, interface, ecrãs e `sketch.js`.
- O botão "Terminar (teste)" é provisório e desaparece quando o jogo tiver duração de 60 segundos.

**Próxima sessão:** drone controlado pelo rato, classe `Particula` com aleatoriedade controlada e colisões.

**Material externo  no relatório:** p5.js e p5.sound (Processing Foundation, licença LGPL 2.1, https://p5js.org).