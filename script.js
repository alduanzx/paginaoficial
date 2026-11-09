 <!-- INÍCIO JOGO -->
  <main class="conteudo">
    <section class="jogo" aria-label="Jogo Enduro">

      <div class="jogo__topo">
        <div>
          <h1 class="jogo__titulo">Enduro</h1>
          <p class="jogo__legenda">Ultrapasse os carros antes do fim da etapa. Cuidado com a noite!</p>
        </div>
        <div class="jogo__acoes">
          <button class="btn btn--fantasma btn--som" id="btn-som" type="button" aria-pressed="false">🔇 Som</button>
          <button class="btn btn--fantasma" id="btn-pausa" type="button">⏸ Pausa</button>
        </div>
      </div>

      <!-- Placar / HUD -->
      <div class="hud" role="status" aria-live="off">
        <div class="hud__item"><span class="hud__rotulo">Etapa</span><span class="hud__valor" id="hud-etapa">1</span></div>
        <div class="hud__item"><span class="hud__rotulo">Fase</span><span class="hud__valor" id="hud-fase">Manhã</span></div>
        <div class="hud__item"><span class="hud__rotulo">km/h</span><span class="hud__valor" id="hud-velocidade">0</span></div>
        <div class="hud__item"><span class="hud__rotulo">Passados</span><span class="hud__valor hud__valor--destaque" id="hud-passadas">0</span></div>
        <div class="hud__item"><span class="hud__rotulo">Meta</span><span class="hud__valor" id="hud-meta">16</span></div>
        <div class="hud__item"><span class="hud__rotulo">Tempo</span><span class="hud__valor" id="hud-tempo">0</span></div>
        <div class="hud__item"><span class="hud__rotulo">Pontos</span><span class="hud__valor" id="hud-pontos">0</span></div>
        <div class="hud__item"><span class="hud__rotulo">Vidas</span><span class="hud__valor hud__valor--vidas" id="hud-vidas">♥♥♥</span></div>
        <div class="hud__item"><span class="hud__rotulo">Recorde</span><span class="hud__valor" id="hud-recorde">0</span></div>
      </div>

      <!-- Palco do jogo -->
      <div class="palco" id="jogo-palco">
        <canvas id="enduro-canvas" width="960" height="600" aria-label="Pista de corrida"></canvas>

        <div class="banner" id="jogo-banner" role="status"></div>

        <!-- Tela inicial -->
        <div class="sobreposicao sobreposicao--visivel" id="tela-inicio">
          <h2 class="sobreposicao__titulo">Enduro</h2>
          <p class="sobreposicao__texto">
            Pise fundo e ultrapasse o número de carros de cada etapa antes do tempo acabar.
            A cada etapa o dia muda: manhã, dia, tarde e a temida <strong>noite</strong>.
          </p>
          <button class="btn btn--principal" id="btn-iniciar" type="button">▶ Começar a correr</button>
          <p class="sobreposicao__texto">Setas ← → para dirigir • ↑ acelerar • ↓ frear</p>
        </div>

        <!-- Tela de pausa -->
        <div class="sobreposicao" id="tela-pausa">
          <h2 class="sobreposicao__titulo">Pausa</h2>
          <button class="btn btn--principal" id="btn-continuar" type="button">Continuar</button>
          <p class="sobreposicao__texto">Pressione P ou Enter para voltar à corrida.</p>
        </div>

        <!-- Tela de fim de jogo -->
        <div class="sobreposicao" id="tela-fim">
          <h2 class="sobreposicao__titulo">Fim da corrida</h2>
          <div class="sobreposicao__placar">
            <div><b id="fim-pontos">0</b><span>Pontos</span></div>
            <div><b id="fim-ultrapassagens">0</b><span>Carros</span></div>
            <div><b id="fim-etapas">0</b><span>Etapas</span></div>
          </div>
          <p class="sobreposicao__texto">Recorde: <strong id="fim-recorde">0</strong> pontos</p>
          <span class="selo-recorde" id="fim-novo-recorde">🏆 Novo recorde!</span>
          <button class="btn btn--principal" id="btn-reiniciar" type="button">↻ Jogar novamente</button>
        </div>
      </div>

      <!-- Controles de toque (aparecem em celulares/tablets) -->
      <div class="controles" aria-label="Controles de toque">
        <div class="controles__grupo">
          <button class="controles__btn" id="toque-esquerda" type="button" aria-label="Virar para a esquerda">◀</button>
          <button class="controles__btn" id="toque-direita" type="button" aria-label="Virar para a direita">▶</button>
        </div>
        <div class="controles__grupo controles__grupo--dir">
          <button class="controles__btn" id="toque-frear" type="button" aria-label="Frear">▼</button>
          <button class="controles__btn controles__btn--acelerar" id="toque-acelerar" type="button" aria-label="Acelerar">▲</button>
        </div>
      </div>

      <p class="dicas">
        <span><kbd>←</kbd> <kbd>→</kbd> dirigir</span>
        <span><kbd>↑</kbd> acelerar</span>
        <span><kbd>↓</kbd> frear</span>
        <span><kbd>P</kbd> pausa</span>
        <span><kbd>M</kbd> som</span>
        <span><kbd>R</kbd> reiniciar</span>
      </p>
    </section>
  </main>