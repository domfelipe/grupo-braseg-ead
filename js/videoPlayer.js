/**
 * Player Interativo de Vídeo EAD com Telemetria Dinâmica Canvas,
 * Legendas Sincronizadas, Narração por Voz e Checkpoints MTE.
 */

import { State } from './state.js';

export class VideoPlayer {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = options;
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 480; // padrão 8 min
    this.playbackRate = 1.0;
    this.volume = 0.9;
    this.isMuted = false;
    this.subtitlesEnabled = true;
    this.voiceEnabled = true;
    this.currentLesson = null;
    this.currentCourse = null;
    this.activeCheckpoint = null;
    this.animationFrameId = null;
    this.speechUtterance = null;
    this.isSeeking = false;

    this.initDOM();
    this.bindEvents();
  }

  initDOM() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="player-wrapper" id="playerWrapper" tabindex="0">
        <!-- Canvas de Simulação Visual & Telemetria Industrial -->
        <canvas id="playerCanvas" width="960" height="540"></canvas>

        <!-- Elemento de Vídeo HTML5 (fallback/suporte de mídia) -->
        <video id="htmlVideo" playsinline style="display: none;"></video>

        <!-- Overlay de Tela Cheia / Efeitos -->
        <div class="player-glow-overlay"></div>

        <!-- Big Play Button Central -->
        <button class="big-play-btn" id="bigPlayBtn" aria-label="Reproduzir Vídeo">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </button>

        <!-- Badge de Status & MTE Conforme -->
        <div class="player-top-bar">
          <div class="player-badge">
            <span class="pulse-dot"></span>
            <span id="playerBadgeText">MTE EAD 100% HOMOLOGADO</span>
          </div>
          <div class="player-telemetry-pill" id="telemetryPill">
            <span class="icon">⚡</span>
            <span id="telemetryText">TELEMETRIA ATIVA: 60 FPS</span>
          </div>
        </div>

        <!-- Legenda Flutuante Dinâmica (Closed Captions) -->
        <div class="player-captions-container" id="playerCaptions">
          <p id="captionText">Bem-vindo à plataforma de capacitação oficial MedTrab EAD.</p>
        </div>

        <!-- Checkpoint Popup / Trava Obrigatória MTE -->
        <div class="checkpoint-modal" id="checkpointModal" style="display: none;">
          <div class="checkpoint-card">
            <div class="checkpoint-header">
              <span class="checkpoint-tag">⚠️ TRAVA OBRIGATÓRIA MTE - NR-01 / NR-35</span>
              <h3>Pergunta de Fixação Interativa</h3>
              <p>Responda corretamente para liberar a continuação da videoaula.</p>
            </div>
            <div class="checkpoint-body" id="checkpointQuestionText">
              <!-- Injetado dinamicamente -->
            </div>
            <div class="checkpoint-options" id="checkpointOptionsContainer">
              <!-- Injetado dinamicamente -->
            </div>
            <div class="checkpoint-feedback" id="checkpointFeedback" style="display: none;"></div>
            <div class="checkpoint-footer">
              <button class="btn btn-primary" id="btnSubmitCheckpoint" disabled>Confirmar Resposta</button>
            </div>
          </div>
        </div>

        <!-- Barra de Controles Inferior -->
        <div class="player-controls">
          <!-- Linha de Progresso & Scrubbing -->
          <div class="progress-bar-container" id="progressBarContainer">
            <div class="progress-buffered" id="progressBuffered" style="width: 100%;"></div>
            <div class="progress-played" id="progressPlayed" style="width: 0%;"></div>
            <div class="progress-scrubber" id="progressScrubber"></div>
            <!-- Marcadores de Checkpoint na barra -->
            <div class="checkpoint-markers" id="checkpointMarkers"></div>
            <!-- Tooltip de tempo ao passar o mouse -->
            <div class="scrub-tooltip" id="scrubTooltip">00:00</div>
          </div>

          <!-- Botões de Controle -->
          <div class="controls-row">
            <div class="controls-left">
              <!-- Play / Pause -->
              <button class="ctrl-btn" id="ctrlPlayBtn" title="Play/Pause (Espaço)">
                <svg class="icon-play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                <svg class="icon-pause" viewBox="0 0 24 24" fill="currentColor" style="display:none;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              </button>

              <!-- Retroceder 10s -->
              <button class="ctrl-btn" id="ctrlRewindBtn" title="Voltar 10s (←)">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8zm-1.1 11h-.85v-3.26l-1.01.31v-.67l1.76-.57h.1V16zm4.29-1.92c0 .66-.17 1.18-.5 1.54-.33.36-.8.54-1.39.54-.6 0-1.07-.18-1.4-.54-.33-.36-.5-.88-.5-1.54v-.73c0-.66.17-1.18.5-1.54.33-.36.8-.54 1.4-.54.59 0 1.06.18 1.39.54.33.36.5.88.5 1.54v.73zm-.83-.82c0-.43-.07-.75-.2-.96-.13-.21-.35-.32-.66-.32-.31 0-.53.11-.66.32-.13.21-.2.53-.2.96v.91c0 .43.07.75.2.96.13.21.35.32.66.32.31 0 .53-.11-.66-.32.13-.21.2-.53.2-.96v-.91z"/></svg>
              </button>

              <!-- Avançar 10s -->
              <button class="ctrl-btn" id="ctrlForwardBtn" title="Avançar 10s (→)">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8zm-1.1 11h-.85v-3.26l-1.01.31v-.67l1.76-.57h.1V16zm4.29-1.92c0 .66-.17 1.18-.5 1.54-.33.36-.8.54-1.39.54-.6 0-1.07-.18-1.4-.54-.33-.36-.5-.88-.5-1.54v-.73c0-.66.17-1.18.5-1.54.33-.36.8-.54 1.4-.54.59 0 1.06.18 1.39.54.33.36.5.88.5 1.54v.73zm-.83-.82c0-.43-.07-.75-.2-.96-.13-.21-.35-.32-.66-.32-.31 0-.53.11-.66.32-.13.21-.2.53-.2.96v.91c0 .43.07.75.2.96.13.21.35.32.66.32.31 0 .53-.11-.66-.32.13-.21.2-.53.2-.96v-.91z"/></svg>
              </button>

              <!-- Volume / Mudo -->
              <div class="volume-control-group">
                <button class="ctrl-btn" id="ctrlVolumeBtn" title="Mudo (M)">
                  <svg class="icon-vol-high" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                  <svg class="icon-vol-mute" viewBox="0 0 24 24" fill="currentColor" style="display:none;"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
                </button>
                <input type="range" class="volume-slider" id="volumeSlider" min="0" max="1" step="0.05" value="0.9">
              </div>

              <!-- Time display -->
              <div class="time-display">
                <span id="timeCurrent">00:00</span>
                <span class="time-divider">/</span>
                <span id="timeDuration">08:00</span>
              </div>
            </div>

            <div class="controls-right">
              <!-- Narração por Voz TTS -->
              <button class="ctrl-btn voice-btn active" id="ctrlVoiceBtn" title="Narração em Áudio Português (Voz IA)">
                <span class="voice-icon">🎙️</span>
                <span class="voice-label">Voz IA</span>
              </button>

              <!-- Legendas CC -->
              <button class="ctrl-btn cc-btn active" id="ctrlCcBtn" title="Legendas (C)">
                <span class="cc-badge">CC</span>
              </button>

              <!-- Velocidade de Reprodução -->
              <div class="dropdown-control">
                <button class="ctrl-btn speed-btn" id="ctrlSpeedBtn" title="Velocidade">
                  <span id="speedLabel">1.0x</span>
                </button>
                <div class="speed-menu" id="speedMenu" style="display: none;">
                  <div class="speed-item" data-speed="0.5">0.5x</div>
                  <div class="speed-item" data-speed="0.75">0.75x</div>
                  <div class="speed-item active" data-speed="1.0">1.0x (Normal)</div>
                  <div class="speed-item" data-speed="1.25">1.25x</div>
                  <div class="speed-item" data-speed="1.5">1.5x</div>
                  <div class="speed-item" data-speed="2.0">2.0x</div>
                </div>
              </div>

              <!-- Anotar Timestamp -->
              <button class="ctrl-btn" id="ctrlAddNoteBtn" title="Criar Anotação neste Minuto">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
              </button>

              <!-- Fullscreen -->
              <button class="ctrl-btn" id="ctrlFullscreenBtn" title="Tela Cheia (F)">
                <svg class="icon-expand" viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
                <svg class="icon-compress" viewBox="0 0 24 24" fill="currentColor" style="display:none;"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-14v3h3v2h-5V5h2z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.canvas = document.getElementById('playerCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.htmlVideo = document.getElementById('htmlVideo');
    this.playerWrapper = document.getElementById('playerWrapper');
  }

  bindEvents() {
    const bigPlayBtn = document.getElementById('bigPlayBtn');
    const ctrlPlayBtn = document.getElementById('ctrlPlayBtn');
    const ctrlRewindBtn = document.getElementById('ctrlRewindBtn');
    const ctrlForwardBtn = document.getElementById('ctrlForwardBtn');
    const ctrlVolumeBtn = document.getElementById('ctrlVolumeBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const ctrlCcBtn = document.getElementById('ctrlCcBtn');
    const ctrlVoiceBtn = document.getElementById('ctrlVoiceBtn');
    const ctrlSpeedBtn = document.getElementById('ctrlSpeedBtn');
    const speedMenu = document.getElementById('speedMenu');
    const ctrlFullscreenBtn = document.getElementById('ctrlFullscreenBtn');
    const ctrlAddNoteBtn = document.getElementById('ctrlAddNoteBtn');
    const progressBar = document.getElementById('progressBarContainer');

    // Play / Pause
    bigPlayBtn?.addEventListener('click', () => this.togglePlay());
    ctrlPlayBtn?.addEventListener('click', () => this.togglePlay());
    this.canvas?.addEventListener('click', () => this.togglePlay());

    // Seek / Progress Click & Drag
    progressBar?.addEventListener('mousedown', (e) => this.handleProgressBarClick(e));
    progressBar?.addEventListener('mousemove', (e) => this.handleProgressBarHover(e));

    // Rewind / Forward
    ctrlRewindBtn?.addEventListener('click', () => this.seekBy(-10));
    ctrlForwardBtn?.addEventListener('click', () => this.seekBy(10));

    // Volume
    volumeSlider?.addEventListener('input', (e) => {
      this.volume = parseFloat(e.target.value);
      this.isMuted = this.volume === 0;
      this.updateVolumeUI();
    });

    ctrlVolumeBtn?.addEventListener('click', () => {
      this.isMuted = !this.isMuted;
      this.updateVolumeUI();
    });

    // Subtitles
    ctrlCcBtn?.addEventListener('click', () => {
      this.subtitlesEnabled = !this.subtitlesEnabled;
      ctrlCcBtn.classList.toggle('active', this.subtitlesEnabled);
      const cap = document.getElementById('playerCaptions');
      if (cap) cap.style.display = this.subtitlesEnabled ? 'block' : 'none';
    });

    // Voice Narration
    ctrlVoiceBtn?.addEventListener('click', () => {
      this.voiceEnabled = !this.voiceEnabled;
      ctrlVoiceBtn.classList.toggle('active', this.voiceEnabled);
      if (!this.voiceEnabled) {
        window.speechSynthesis?.cancel();
      } else if (this.isPlaying) {
        this.narrateCurrentSegment();
      }
    });

    // Speed Menu
    ctrlSpeedBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      speedMenu.style.display = speedMenu.style.display === 'none' ? 'block' : 'none';
    });

    document.addEventListener('click', () => {
      if (speedMenu) speedMenu.style.display = 'none';
    });

    speedMenu?.querySelectorAll('.speed-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const spd = parseFloat(e.target.getAttribute('data-speed'));
        this.setPlaybackRate(spd);
      });
    });

    // Fullscreen
    ctrlFullscreenBtn?.addEventListener('click', () => this.toggleFullscreen());

    // Add note shortcut
    ctrlAddNoteBtn?.addEventListener('click', () => {
      if (this.options.onAddNoteRequest) {
        this.options.onAddNoteRequest(this.currentTime, this.formatTime(this.currentTime));
      }
    });

    // Keyboard Shortcuts
    this.playerWrapper?.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        this.togglePlay();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.seekBy(10);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.seekBy(-10);
      } else if (e.key === 'f') {
        e.preventDefault();
        this.toggleFullscreen();
      } else if (e.key === 'm') {
        e.preventDefault();
        this.isMuted = !this.isMuted;
        this.updateVolumeUI();
      } else if (e.key === 'c') {
        e.preventDefault();
        ctrlCcBtn?.click();
      }
    });
  }

  loadLesson(course, lesson) {
    this.currentCourse = course;
    this.currentLesson = lesson;
    this.duration = lesson.duration || 480;
    this.currentTime = 0;
    this.isPlaying = false;
    this.activeCheckpoint = null;

    // Reset UI
    const timeDur = document.getElementById('timeDuration');
    const timeCur = document.getElementById('timeCurrent');
    if (timeDur) timeDur.textContent = this.formatTime(this.duration);
    if (timeCur) timeCur.textContent = '00:00';

    this.renderCheckpointsOnBar();
    this.updateProgressUI();
    this.updatePlayStateUI();

    // Iniciar loop de renderização do canvas
    this.startCanvasLoop();
    this.renderCanvasFrame();

    // Atualizar legenda inicial
    const cap = document.getElementById('captionText');
    if (cap) {
      cap.textContent = `[${course.code}] ${lesson.title} - ${course.instructor.name}`;
    }
  }

  startCanvasLoop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    let lastTick = performance.now();

    const loop = (now) => {
      const delta = (now - lastTick) / 1000;
      lastTick = now;

      if (this.isPlaying && !this.activeCheckpoint) {
        this.currentTime += delta * this.playbackRate;
        if (this.currentTime >= this.duration) {
          this.currentTime = this.duration;
          this.onLessonComplete();
        } else {
          this.checkCheckpoints();
        }
        this.updateProgressUI();
      }

      this.renderCanvasFrame();
      this.animationFrameId = requestAnimationFrame(loop);
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }

  renderCanvasFrame() {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const c = this.currentCourse || { code: 'NR-35', title: 'Segurança Ocupacional' };
    const l = this.currentLesson || { title: 'Módulo de Treinamento' };

    // Fundo Gradiente Industrial Escuro
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#090f1d');
    grad.addColorStop(0.5, '#0e172a');
    grad.addColorStop(1, '#050914');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Grade de Engenharia / Grid Tecnológica
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Painel Principal Central: Ilustração e Simulação do Cenário
    const panelX = 40;
    const panelY = 40;
    const panelW = w - 80;
    const panelH = h - 110;

    // Moldura de Vidro (Glassmorphism card)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    this.roundRect(ctx, panelX, panelY, panelW, panelH, 16, true, true);

    // Header do Painel de Vídeo
    ctx.fillStyle = '#f4c602';
    ctx.font = 'bold 12px "Inter", sans-serif';
    ctx.fillText(`TRANSMISSÃO OFICIAL • ${c.code} • GRUPO BRASEG EAD (LENÇÓIS PTA/SP)`, panelX + 24, panelY + 32);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px "Inter", sans-serif';
    ctx.fillText(l.title || 'Treinamento Ocupacional', panelX + 24, panelY + 62);

    // Linha divisória suave
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.moveTo(panelX + 24, panelY + 76);
    ctx.lineTo(panelX + panelW - 24, panelY + 76);
    ctx.stroke();

    // Área de Simulação Visual Dinâmica baseada no Curso
    const simX = panelX + 24;
    const simY = panelY + 95;
    const simW = panelW - 320;
    const simH = panelH - 120;

    // Caixa de Vídeo/Cenário
    ctx.fillStyle = '#060a12';
    this.roundRect(ctx, simX, simY, simW, simH, 12, true, false);

    // Elementos dinâmicos animados conforme o tempo
    this.renderCourseSpecificSimulation(ctx, simX, simY, simW, simH, c.id);

    // Painel Lateral de Telemetria e Biometria
    const sideX = panelX + panelW - 275;
    const sideY = panelY + 95;
    const sideW = 250;
    const sideH = panelH - 120;

    this.renderTelemetryHUD(ctx, sideX, sideY, sideW, sideH, c);

    // Efeito de Áudio Waveform na barra inferior
    if (this.isPlaying) {
      this.renderAudioWave(ctx, panelX + 24, panelY + panelH - 25, panelW - 48);
    }
  }

  renderCourseSpecificSimulation(ctx, x, y, w, h, courseId) {
    const t = this.currentTime;

    if (courseId === 'nr35') {
      // Simulação de Trabalho em Altura & Fator de Queda
      ctx.save();
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x, y, w, h);

      // Estrutura metálica industrial
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + 50, y + h);
      ctx.lineTo(x + 50, y + 40);
      ctx.lineTo(x + w - 50, y + 40);
      ctx.lineTo(x + w - 50, y + h);
      ctx.stroke();

      // Linha de vida horizontal
      ctx.strokeStyle = '#f4c602';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(x + 60, y + 60);
      ctx.lineTo(x + w - 60, y + 60);
      ctx.stroke();
      ctx.setLineDash([]);

      // Ponto de Ancoragem e Trabalhador em suspensão segura
      const workerX = x + w / 2 + Math.sin(t * 0.8) * 40;
      const workerY = y + 150 + Math.sin(t * 1.5) * 6;

      // Talabarte com absorvedor
      ctx.strokeStyle = '#3774c2';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(workerX, y + 60);
      ctx.lineTo(workerX, workerY - 20);
      ctx.stroke();

      // Absorvedor de energia (caixa amarela)
      ctx.fillStyle = '#f4c602';
      ctx.fillRect(workerX - 6, y + 80, 12, 24);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 8px sans-serif';
      ctx.fillText('ABS', workerX - 8, y + 95);

      // Capacete azul Braseg
      ctx.fillStyle = '#002e5a';
      ctx.beginPath();
      ctx.arc(workerX, workerY - 30, 10, Math.PI, 0);
      ctx.fill();

      // Cabeça
      ctx.fillStyle = '#fbcfe8';
      ctx.beginPath();
      ctx.arc(workerX, workerY - 24, 7, 0, Math.PI * 2);
      ctx.fill();

      // Tronco e Cinto Paraquedista
      ctx.fillStyle = '#3774c2';
      this.roundRect(ctx, workerX - 10, workerY - 16, 20, 30, 4, true, false);

      // Fitas pretas do cinto
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(workerX - 10, workerY - 16);
      ctx.lineTo(workerX + 10, workerY + 14);
      ctx.moveTo(workerX + 10, workerY - 16);
      ctx.lineTo(workerX - 10, workerY + 14);
      ctx.stroke();

      // Pernas
      ctx.strokeStyle = '#002e5a';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(workerX - 6, workerY + 14);
      ctx.lineTo(workerX - 8, workerY + 45);
      ctx.moveTo(workerX + 6, workerY + 14);
      ctx.lineTo(workerX + 8, workerY + 45);
      ctx.stroke();

      // HUD de Zona Livre de Queda (ZLQ)
      ctx.fillStyle = 'rgba(0, 46, 90, 0.88)';
      ctx.strokeStyle = '#3774c2';
      this.roundRect(ctx, x + 15, y + h - 75, 220, 60, 8, true, true);
      ctx.fillStyle = '#f4c602';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('CÁLCULO ZLQ • GRUPO BRASEG SST', x + 25, y + h - 58);
      ctx.fillStyle = '#ffffff';
      ctx.font = '11px monospace';
      ctx.fillText(`Talabarte: 1.50m | ABS Aberto: 1.20m`, x + 25, y + h - 42);
      ctx.fillText(`ZLQ Segura: 5.20m | Fator Queda: 0 (Ideal)`, x + 25, y + h - 26);

      ctx.restore();
    } else if (courseId === 'nr10') {
      // Simulação Elétrica / Painel LOTO
      ctx.save();
      ctx.fillStyle = '#0a1120';
      ctx.fillRect(x, y, w, h);

      // Painel elétrico industrial
      ctx.fillStyle = '#1e293b';
      this.roundRect(ctx, x + 40, y + 20, w - 80, h - 40, 8, true, false);

      // Disjuntores e Bloqueio LOTO
      ctx.fillStyle = '#dc2626';
      this.roundRect(ctx, x + 80, y + 50, 70, 90, 4, true, false);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('BLOQUEIO', x + 86, y + 80);
      ctx.fillText('LOTO #01', x + 88, y + 96);

      // Cadeado Dourado
      ctx.fillStyle = '#f4c602';
      ctx.beginPath();
      ctx.arc(x + 115, y + 120, 10, 0, Math.PI * 2);
      ctx.fill();

      // Voltímetro Digital HUD
      ctx.fillStyle = '#050811';
      this.roundRect(ctx, x + w - 230, y + 50, 170, 90, 6, true, false);
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('STATUS: DESENERGIZADO', x + w - 220, y + 75);
      ctx.font = 'bold 26px monospace';
      ctx.fillText('0.00 V', x + w - 220, y + 112);

      // Aterramento temporário
      ctx.fillStyle = 'rgba(0, 46, 90, 0.85)';
      ctx.fillRect(x + 40, y + h - 55, w - 80, 35);
      ctx.fillStyle = '#f4c602';
      ctx.font = '11px sans-serif';
      ctx.fillText('⚡ 6 ETAPAS NR-10 CONCLUÍDAS | Aterramento Temporário Equipotencializado', x + 55, y + h - 33);
      ctx.restore();
    } else if (courseId === 'nr33') {
      // Simulação Espaço Confinado & Detecção 4 Gases
      ctx.save();
      ctx.fillStyle = '#0a0e1a';
      ctx.fillRect(x, y, w, h);

      // Tubulação / Tanque Confinado
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(x + w / 2, y + h / 2 + 20, 80, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f4c602';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Tripé de Resgate com Guincho
      ctx.strokeStyle = '#3774c2';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + w / 2, y + 30);
      ctx.lineTo(x + w / 2 - 70, y + h - 30);
      ctx.moveTo(x + w / 2, y + 30);
      ctx.lineTo(x + w / 2 + 70, y + h - 30);
      ctx.stroke();

      // Monitor Multigás 4 Sensores
      ctx.fillStyle = '#002e5a';
      this.roundRect(ctx, x + 20, y + 20, 190, 115, 8, true, true);
      ctx.fillStyle = '#f4c602';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('DETECTOR MULTIGÁS 4X BRASEG', x + 30, y + 38);
      ctx.fillStyle = '#22c55e';
      ctx.font = '11px monospace';
      ctx.fillText('O2 : 20.9% (Normal Seguro)', x + 30, y + 58);
      ctx.fillText('LEL: 0% (Livre de Inflamáveis)', x + 30, y + 74);
      ctx.fillText('CO : 0 ppm (Monóxido Zero)', x + 30, y + 90);
      ctx.fillText('H2S: 0 ppm (Gás Sulfídrico Zero)', x + 30, y + 106);

      ctx.restore();
    } else if (courseId === 'nr12') {
      // Simulação NR-12: Cortina de Luz Óptica & Parada de Emergência
      ctx.save();
      ctx.fillStyle = '#09111e';
      ctx.fillRect(x, y, w, h);

      // Prensa / Máquina Industrial
      ctx.fillStyle = '#1e293b';
      this.roundRect(ctx, x + 60, y + 30, w - 120, h - 70, 8, true, false);

      // Feixes ópticos da Cortina de Luz (Laser Vermelho)
      const beamCount = 8;
      ctx.strokeStyle = (Math.sin(t * 8) > 0.3) ? '#ef4444' : '#f87171';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < beamCount; i++) {
        const by = y + 70 + i * 15;
        ctx.beginPath();
        ctx.moveTo(x + 90, by);
        ctx.lineTo(x + w - 90, by);
        ctx.stroke();
      }

      // Sensores Ópticos nas extremidades
      ctx.fillStyle = '#f4c602';
      this.roundRect(ctx, x + 80, y + 60, 12, 130, 3, true, false);
      this.roundRect(ctx, x + w - 92, y + 60, 12, 130, 3, true, false);

      // Botão de Parada de Emergência Tipo Cogumelo
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(x + w / 2, y + h - 65, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f4c602';
      ctx.beginPath();
      ctx.arc(x + w / 2, y + h - 65, 18, 0, Math.PI * 2);
      ctx.stroke();

      // Painel de Status do Relé de Segurança
      ctx.fillStyle = '#002e5a';
      this.roundRect(ctx, x + 20, y + 20, 200, 50, 6, true, true);
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('RELÉ SEGURANÇA: CAT. 4 ATIVO', x + 30, y + 40);
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px sans-serif';
      ctx.fillText('Intertravamento Duplo Homologado', x + 30, y + 56);

      ctx.restore();
    } else if (courseId === 'nr31') {
      // Simulação NR-31: Trator Agrícola, Escudo TDP e Inclinômetro EPCC
      ctx.save();
      ctx.fillStyle = '#0b1622';
      ctx.fillRect(x, y, w, h);

      // Linha de solo / declive do talhão
      const groundAngle = Math.sin(t * 0.5) * 6; // oscilação suave de terreno
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x + 20, y + h - 40 + groundAngle);
      ctx.lineTo(x + w - 20, y + h - 40 - groundAngle);
      ctx.stroke();

      // Representação do Trator & Arco EPCC
      const tratorX = x + w / 2;
      const tratorY = y + h - 90;

      // Gaiola EPCC (Estrutura contra capotamento)
      ctx.strokeStyle = '#f4c602';
      ctx.lineWidth = 4;
      ctx.strokeRect(tratorX - 35, tratorY - 50, 70, 50);

      // Rodas
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(tratorX - 35, tratorY + 15, 20, 0, Math.PI * 2);
      ctx.arc(tratorX + 35, tratorY + 15, 24, 0, Math.PI * 2);
      ctx.fill();

      // Escudo da Tomada de Força (TDP)
      ctx.fillStyle = '#3774c2';
      ctx.fillRect(tratorX - 10, tratorY - 5, 20, 15);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px sans-serif';
      ctx.fillText('TDP 540', tratorX - 16, tratorY + 5);

      // Inclinômetro Digital HUD
      ctx.fillStyle = '#002e5a';
      this.roundRect(ctx, x + 20, y + 20, 210, 80, 6, true, true);
      ctx.fillStyle = '#f4c602';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('INCLINÔMETRO EPCC • BRASEG AGRO', x + 30, y + 38);
      ctx.fillStyle = '#22c55e';
      ctx.font = '11px monospace';
      ctx.fillText(`Inclinação Atual: ${Math.abs(groundAngle * 1.5).toFixed(1)}° (SEGURO)`, x + 30, y + 56);
      ctx.fillText('Limite Seguro: < 18.0° contra tombamento', x + 30, y + 72);

      ctx.restore();
    } else if (courseId === 'nr20') {
      // Simulação NR-20: Inflamáveis, Pressão de Vapor e Aterramento
      ctx.save();
      ctx.fillStyle = '#0d131f';
      ctx.fillRect(x, y, w, h);

      // Tanque de Armazenamento de Combustível
      ctx.fillStyle = '#334155';
      this.roundRect(ctx, x + w / 2 - 80, y + 50, 160, 120, 16, true, false);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('DIESEL / CLASSE B', x + w / 2 - 60, y + 105);
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px sans-serif';
      ctx.fillText('Ponto de Fulgor <= 60°C', x + w / 2 - 55, y + 125);

      // Cabo de Aterramento Antiestático Verde
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + w / 2 + 70, y + 140);
      ctx.lineTo(x + w - 40, y + h - 40);
      ctx.stroke();

      // Indicador de LEL e Pressão
      ctx.fillStyle = '#002e5a';
      this.roundRect(ctx, x + 20, y + 20, 200, 75, 6, true, true);
      ctx.fillStyle = '#f4c602';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('ÁREA CLASSIFICADA • ZONA 1', x + 30, y + 38);
      ctx.fillStyle = '#22c55e';
      ctx.font = '11px monospace';
      ctx.fillText('Concentração LEL: 0.0% (Zero Risco)', x + 30, y + 56);
      ctx.fillText('Aterramento Estático: 100% CONECTADO', x + 30, y + 72);

      ctx.restore();
    } else if (courseId === 'nr05') {
      // Simulação NR-05: CIPA e Mapa de Riscos
      ctx.save();
      ctx.fillStyle = '#09131d';
      ctx.fillRect(x, y, w, h);

      // 5 Círculos do Mapa de Riscos (Físico, Químico, Biológico, Ergonômico, Acidentes)
      const colors = ['#22c55e', '#ef4444', '#78350f', '#f4c602', '#3b82f6'];
      const labels = ['Físico', 'Químico', 'Biológico', 'Ergonômico', 'Acidentes'];
      for (let i = 0; i < 5; i++) {
        const cx = x + 70 + i * (w - 140) / 4;
        const cy = y + h / 2 + 10;
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.arc(cx, cy, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText(labels[i], cx - 18, cy + 38);
      }

      // Painel CIPA BRASEG
      ctx.fillStyle = '#002e5a';
      this.roundRect(ctx, x + 20, y + 20, w - 40, 50, 6, true, true);
      ctx.fillStyle = '#f4c602';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('GESTÃO INTEGRADA CIPA & COMBATE AO ASSÉDIO • LEI 14.457/22', x + 35, y + 40);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px sans-serif';
      ctx.fillText('Inspeções de Segurança Mensais e Canal de Ouvidoria Ativo', x + 35, y + 56);

      ctx.restore();
    } else {
      // Padrão Geral / Saúde Ocupacional / Primeiros Socorros / Ergonomia / EPI
      ctx.save();
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x, y, w, h);

      // Monitor Cardíaco / ECG dinâmico
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const ecgY = y + h / 2 + 10;
      for (let px = 0; px < w; px += 4) {
        const offset = ((px + t * 60) % 180);
        let dy = 0;
        if (offset > 50 && offset < 60) dy = -30;
        else if (offset >= 60 && offset < 70) dy = 40;
        else if (offset >= 70 && offset < 80) dy = -10;
        ctx.lineTo(x + px, ecgY + dy);
      }
      ctx.stroke();

      // Card Informativo Oficial BRASEG
      ctx.fillStyle = 'rgba(0, 46, 90, 0.90)';
      this.roundRect(ctx, x + 20, y + 20, w - 40, 60, 8, true, false);
      ctx.fillStyle = '#f4c602';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('PROTOCOLO MÉDICO OCUPACIONAL • GRUPO BRASEG', x + 35, y + 42);
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '11px sans-serif';
      ctx.fillText('Supervisão: Dr. Carlos Eduardo Menezes (CRM-SP 148.920) e Eng. Ricardo S. Albuquerque (CREA-SP)', x + 35, y + 60);

      ctx.restore();
    }
  }

  renderTelemetryHUD(ctx, x, y, w, h, course) {
    ctx.fillStyle = '#0b1120';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    this.roundRect(ctx, x, y, w, h, 10, true, true);

    // Título Telemetria
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('📊 PAINEL DE CONTROLE SESMT', x + 15, y + 24);

    // Aluno Conectado
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.fillText('COLABORADOR:', x + 15, y + 48);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px sans-serif';
    const sName = State.currentStudent.name || 'Carlos Alberto';
    ctx.fillText(sName.length > 20 ? sName.substring(0, 18) + '...' : sName, x + 15, y + 64);

    // Matrícula & CPF
    ctx.fillStyle = '#64748b';
    ctx.font = '10px monospace';
    ctx.fillText(`CPF: ${State.currentStudent.cpf}`, x + 15, y + 80);

    // Divisor
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.beginPath();
    ctx.moveTo(x + 15, y + 92);
    ctx.lineTo(x + w - 15, y + 92);
    ctx.stroke();

    // Indicadores Regulatórios
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.fillText('STATUS REGULATÓRIO:', x + 15, y + 112);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('● ASO: Apto (Validade 2027)', x + 15, y + 130);

    ctx.fillStyle = '#38bdf8';
    ctx.fillText('● Portaria MTE: 6.730/2020', x + 15, y + 148);

    ctx.fillStyle = '#eab308';
    ctx.fillText(`● Carga Horária: ${course.durationFormatted}`, x + 15, y + 166);

    // Instrutor Responsável
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.fillText('RESPONSÁVEL TÉCNICO:', x + 15, y + 194);
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText(course.instructor.name, x + 15, y + 210);
    ctx.fillStyle = '#64748b';
    ctx.font = '9px monospace';
    ctx.fillText(course.instructor.credentials.split('|')[0] || '', x + 15, y + 224);
  }

  renderAudioWave(ctx, x, y, w) {
    ctx.fillStyle = '#38bdf8';
    const numBars = 32;
    const barW = (w / numBars) - 2;
    const t = performance.now() / 150;
    for (let i = 0; i < numBars; i++) {
      const barH = 3 + Math.abs(Math.sin(t + i * 0.4)) * 12;
      ctx.fillRect(x + i * (barW + 2), y - barH, barW, barH);
    }
  }

  roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof radius === 'undefined') radius = 5;
    if (typeof radius === 'number') {
      radius = { tl: radius, tr: radius, br: radius, bl: radius };
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }

  togglePlay() {
    if (this.activeCheckpoint) return; // bloqueado pelo quiz
    this.isPlaying = !this.isPlaying;
    this.updatePlayStateUI();

    if (this.isPlaying && this.voiceEnabled) {
      this.narrateCurrentSegment();
    } else {
      window.speechSynthesis?.cancel();
    }
  }

  updatePlayStateUI() {
    const bigPlayBtn = document.getElementById('bigPlayBtn');
    const iconPlay = document.querySelector('#ctrlPlayBtn .icon-play');
    const iconPause = document.querySelector('#ctrlPlayBtn .icon-pause');

    if (bigPlayBtn) {
      bigPlayBtn.style.display = this.isPlaying ? 'none' : 'flex';
    }
    if (iconPlay && iconPause) {
      iconPlay.style.display = this.isPlaying ? 'none' : 'block';
      iconPause.style.display = this.isPlaying ? 'block' : 'none';
    }
  }

  seekTo(time) {
    this.currentTime = Math.max(0, Math.min(time, this.duration));
    this.updateProgressUI();
    if (this.isPlaying && this.voiceEnabled) {
      this.narrateCurrentSegment();
    }
  }

  seekBy(seconds) {
    this.seekTo(this.currentTime + seconds);
  }

  handleProgressBarClick(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    this.seekTo(pos * this.duration);
  }

  handleProgressBarHover(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min((e.clientX - rect.left) / rect.width, 1));
    const targetTime = pos * this.duration;
    const tooltip = document.getElementById('scrubTooltip');
    if (tooltip) {
      tooltip.textContent = this.formatTime(targetTime);
      tooltip.style.left = `${pos * 100}%`;
    }
  }

  updateProgressUI() {
    const pct = (this.currentTime / this.duration) * 100;
    const progressPlayed = document.getElementById('progressPlayed');
    const progressScrubber = document.getElementById('progressScrubber');
    const timeCur = document.getElementById('timeCurrent');

    if (progressPlayed) progressPlayed.style.width = `${pct}%`;
    if (progressScrubber) progressScrubber.style.left = `${pct}%`;
    if (timeCur) timeCur.textContent = this.formatTime(this.currentTime);

    // Atualizar legendas se tiver transcrição
    this.updateCaptions();
  }

  updateCaptions() {
    const cap = document.getElementById('captionText');
    if (!cap || !this.currentLesson) return;

    if (this.currentLesson.transcription) {
      const sentences = this.currentLesson.transcription.split('. ');
      const totalSentences = sentences.length;
      const idx = Math.min(
        Math.floor((this.currentTime / this.duration) * totalSentences),
        totalSentences - 1
      );
      if (sentences[idx]) {
        cap.textContent = sentences[idx].trim() + (sentences[idx].endsWith('.') ? '' : '.');
      }
    }
  }

  narrateCurrentSegment() {
    if (!window.speechSynthesis || !this.voiceEnabled || !this.currentLesson) return;
    window.speechSynthesis.cancel();

    const textToSpeak = `${this.currentLesson.title}. ${this.currentLesson.transcription || ''}`;
    const utter = new SpeechSynthesisUtterance(textToSpeak);
    utter.lang = 'pt-BR';
    utter.rate = this.playbackRate;

    // Buscar voz em Português
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find(v => v.lang.startsWith('pt'));
    if (ptVoice) utter.voice = ptVoice;

    this.speechUtterance = utter;
    window.speechSynthesis.speak(utter);
  }

  checkCheckpoints() {
    if (!this.currentLesson || !this.currentLesson.checkpoints || this.currentLesson.checkpoints.length === 0) return;

    for (const cp of this.currentLesson.checkpoints) {
      // Se estamos a menos de 1 segundo do checkpoint e ele ainda não foi respondido nesta sessão
      if (Math.abs(this.currentTime - cp.time) < 1.0 && !State.coursesProgress[this.currentCourse.id]?.completedCheckpoints?.includes(cp.time)) {
        this.triggerCheckpoint(cp);
        break;
      }
    }
  }

  triggerCheckpoint(cp) {
    this.isPlaying = false;
    this.updatePlayStateUI();
    window.speechSynthesis?.cancel();
    this.activeCheckpoint = cp;

    const modal = document.getElementById('checkpointModal');
    const qText = document.getElementById('checkpointQuestionText');
    const optsContainer = document.getElementById('checkpointOptionsContainer');
    const feedback = document.getElementById('checkpointFeedback');
    const btnSubmit = document.getElementById('btnSubmitCheckpoint');

    if (!modal || !qText || !optsContainer || !btnSubmit) return;

    modal.style.display = 'flex';
    feedback.style.display = 'none';
    btnSubmit.disabled = true;

    qText.innerHTML = `<strong>${cp.question}</strong>`;
    optsContainer.innerHTML = '';

    let selectedIndex = -1;

    cp.options.forEach((opt, idx) => {
      const optEl = document.createElement('div');
      optEl.className = 'checkpoint-option';
      optEl.innerHTML = `
        <input type="radio" name="cp_opt" id="opt_${idx}" value="${idx}">
        <label for="opt_${idx}">${opt}</label>
      `;
      optEl.addEventListener('click', () => {
        optsContainer.querySelectorAll('.checkpoint-option').forEach(o => o.classList.remove('selected'));
        optEl.classList.add('selected');
        const radio = optEl.querySelector('input');
        if (radio) radio.checked = true;
        selectedIndex = idx;
        btnSubmit.disabled = false;
      });
      optsContainer.appendChild(optEl);
    });

    btnSubmit.onclick = () => {
      if (selectedIndex === cp.correctIndex) {
        feedback.className = 'checkpoint-feedback success';
        feedback.innerHTML = `
          <strong>✅ Resposta Correta!</strong>
          <p>${cp.explanation}</p>
        `;
        feedback.style.display = 'block';
        btnSubmit.textContent = 'Continuar Videoaula';
        btnSubmit.onclick = () => {
          State.addCheckpoint(this.currentCourse.id, cp.time);
          modal.style.display = 'none';
          this.activeCheckpoint = null;
          this.togglePlay();
        };
      } else {
        feedback.className = 'checkpoint-feedback error';
        feedback.innerHTML = `
          <strong>❌ Resposta Incorreta.</strong>
          <p>Reveja o conteúdo apresentado nos minutos anteriores e tente novamente.</p>
        `;
        feedback.style.display = 'block';
      }
    };
  }

  renderCheckpointsOnBar() {
    const container = document.getElementById('checkpointMarkers');
    if (!container || !this.currentLesson) return;
    container.innerHTML = '';

    if (this.currentLesson.checkpoints) {
      this.currentLesson.checkpoints.forEach(cp => {
        const marker = document.createElement('div');
        marker.className = 'checkpoint-marker';
        marker.style.left = `${(cp.time / this.duration) * 100}%`;
        marker.title = `Trava MTE aos ${this.formatTime(cp.time)}`;
        container.appendChild(marker);
      });
    }
  }

  setPlaybackRate(rate) {
    this.playbackRate = rate;
    const label = document.getElementById('speedLabel');
    if (label) label.textContent = `${rate}x`;

    const menu = document.getElementById('speedMenu');
    if (menu) {
      menu.querySelectorAll('.speed-item').forEach(item => {
        item.classList.toggle('active', parseFloat(item.getAttribute('data-speed')) === rate);
      });
      menu.style.display = 'none';
    }

    if (this.isPlaying && this.voiceEnabled) {
      this.narrateCurrentSegment();
    }
  }

  updateVolumeUI() {
    const iconHigh = document.querySelector('#ctrlVolumeBtn .icon-vol-high');
    const iconMute = document.querySelector('#ctrlVolumeBtn .icon-vol-mute');
    const slider = document.getElementById('volumeSlider');

    if (this.isMuted) {
      if (iconHigh) iconHigh.style.display = 'none';
      if (iconMute) iconMute.style.display = 'block';
      if (slider) slider.value = 0;
    } else {
      if (iconHigh) iconHigh.style.display = 'block';
      if (iconMute) iconMute.style.display = 'none';
      if (slider) slider.value = this.volume;
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.playerWrapper?.requestFullscreen().catch(err => console.warn('Erro fullscreen', err));
      document.querySelector('#ctrlFullscreenBtn .icon-expand').style.display = 'none';
      document.querySelector('#ctrlFullscreenBtn .icon-compress').style.display = 'block';
    } else {
      document.exitFullscreen();
      document.querySelector('#ctrlFullscreenBtn .icon-expand').style.display = 'block';
      document.querySelector('#ctrlFullscreenBtn .icon-compress').style.display = 'none';
    }
  }

  onLessonComplete() {
    this.isPlaying = false;
    this.updatePlayStateUI();
    window.speechSynthesis?.cancel();

    // Marcar aula como concluída no estado
    State.markLessonCompleted(this.currentCourse.id, this.currentLesson.id);

    if (this.options.onLessonCompleted) {
      this.options.onLessonCompleted(this.currentCourse, this.currentLesson);
    }
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.speechSynthesis?.cancel();
  }
}
