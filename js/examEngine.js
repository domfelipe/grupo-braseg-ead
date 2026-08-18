/**
 * Motor de Avaliação Final (Prova Homologada MTE)
 * Grupo BRASEG Consultoria e Treinamentos - Lençóis Paulista / SP
 * Com cronômetro, pontuação mínima (70%), revisão de respostas e desbloqueio de certificado oficial.
 */

import { State } from './state.js';

export class ExamEngine {
  constructor(options = {}) {
    this.options = options;
    this.currentCourse = null;
    this.currentQuestionIndex = 0;
    this.userAnswers = {}; // { [questionId]: selectedIndex }
    this.timerSeconds = 0;
    this.timerInterval = null;
    this.isSubmitted = false;
  }

  getQuestions() {
    if (!this.currentCourse) return [];
    return this.currentCourse.examQuestions || this.currentCourse.finalExam?.questions || [];
  }

  startExam(course, containerEl) {
    this.currentCourse = course;
    this.currentQuestionIndex = 0;
    this.userAnswers = {};
    this.isSubmitted = false;
    this.timerSeconds = (course.finalExam?.timeLimitMinutes || 20) * 60;

    this.container = containerEl;
    this.render();
    this.startTimer();
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      if (this.timerSeconds > 0 && !this.isSubmitted) {
        this.timerSeconds--;
        this.updateTimerUI();
      } else if (this.timerSeconds <= 0 && !this.isSubmitted) {
        clearInterval(this.timerInterval);
        this.submitExam(true);
      }
    }, 1000);
  }

  updateTimerUI() {
    const timerEl = document.getElementById('examTimerDisplay');
    if (!timerEl) return;
    const mins = Math.floor(this.timerSeconds / 60);
    const secs = this.timerSeconds % 60;
    timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    if (this.timerSeconds < 180) {
      timerEl.style.color = '#ef4444';
      timerEl.style.animation = 'pulse 1s infinite';
    }
  }

  render() {
    if (!this.container || !this.currentCourse) return;

    const questions = this.getQuestions();
    const totalQuestions = questions.length;
    if (totalQuestions === 0) {
      this.container.innerHTML = `
        <div style="text-align: center; padding: 40px;">
          <h3>Nenhuma questão cadastrada para este treinamento.</h3>
          <button class="btn btn-primary" id="btnBackNoExam">← Voltar às Videoaulas</button>
        </div>
      `;
      document.getElementById('btnBackNoExam')?.addEventListener('click', () => {
        if (this.options.onBackToVideos) this.options.onBackToVideos(this.currentCourse.id);
      });
      return;
    }

    const currentQ = questions[this.currentQuestionIndex];
    const answeredCount = Object.keys(this.userAnswers).length;

    this.container.innerHTML = `
      <div class="exam-container" style="max-width: 900px; margin: 30px auto; padding: 0 20px;">
        <!-- Barra de Status Superior da Prova -->
        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px; display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 20px; box-shadow: var(--shadow-sm); flex-wrap: wrap;">
          <div>
            <div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(0, 46, 90, 0.4); border: 1px solid var(--braseg-gold); color: var(--braseg-gold); padding: 3px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 800; margin-bottom: 6px;">
              <span class="pulse-dot"></span>
              <span>AVALIAÇÃO OFICIAL MTE • GRUPO BRASEG</span>
            </div>
            <h2 style="font-size: 1.6rem; color: var(--text-primary); margin-bottom: 2px;">${this.currentCourse.code}: ${this.currentCourse.title}</h2>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">Nota mínima para aprovação e emissão do certificado: <strong>70%</strong></p>
          </div>

          <div style="text-align: right; background: var(--bg-elevated); padding: 10px 18px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <span style="display: block; font-size: 0.72rem; color: var(--text-muted); font-weight: 700;">TEMPO RESTANTE</span>
            <div style="font-family: var(--font-mono); font-size: 1.6rem; font-weight: 700; color: var(--braseg-gold);" id="examTimerDisplay">--:--</div>
          </div>
        </div>

        <!-- Grade de Navegação das Questões -->
        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-bottom: 20px; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-secondary);">Questões:</span>
            ${questions.map((q, idx) => {
              const isAnswered = this.userAnswers[q.id] !== undefined;
              const isCurrent = idx === this.currentQuestionIndex;
              let bg = isCurrent ? 'var(--braseg-navy)' : (isAnswered ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-elevated)');
              let border = isCurrent ? 'var(--braseg-gold)' : (isAnswered ? '#10b981' : 'var(--border-color)');
              let color = isCurrent ? 'var(--braseg-gold)' : (isAnswered ? '#10b981' : 'var(--text-primary)');
              return `<button class="nav-pill" data-index="${idx}" style="background: ${bg}; border: 1px solid ${border}; color: ${color}; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 0.8rem; cursor: pointer;">${idx + 1}</button>`;
            }).join('')}
          </div>
          <div style="font-size: 0.82rem; color: var(--text-muted);">
            Respondidas: <strong style="color: var(--text-primary);">${answeredCount}/${totalQuestions}</strong>
          </div>
        </div>

        <!-- Card da Questão Atual -->
        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 28px; box-shadow: var(--shadow-md);">
          <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px;">
            <span>Questão ${this.currentQuestionIndex + 1} de ${totalQuestions}</span>
            <span>Peso: ${Math.round(100 / totalQuestions)}%</span>
          </div>

          <div style="margin-bottom: 24px;">
            <h3 style="font-size: 1.25rem; color: var(--text-primary); line-height: 1.4;">${currentQ.question}</h3>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 28px;">
            ${currentQ.options.map((opt, optIdx) => {
              const isSelected = this.userAnswers[currentQ.id] === optIdx;
              return `
                <div class="exam-option" data-opt="${optIdx}" style="display: flex; align-items: center; gap: 14px; padding: 14px 18px; border-radius: var(--radius-md); background: ${isSelected ? 'rgba(0, 46, 90, 0.4)' : 'var(--bg-elevated)'}; border: 1px solid ${isSelected ? 'var(--braseg-gold)' : 'var(--border-color)'}; cursor: pointer; transition: all 0.2s ease;">
                  <div style="width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem; background: ${isSelected ? 'var(--braseg-gold)' : 'var(--bg-input)'}; color: ${isSelected ? 'var(--braseg-navy)' : 'var(--text-secondary)'};">
                    ${String.fromCharCode(65 + optIdx)}
                  </div>
                  <div style="font-size: 0.95rem; color: var(--text-primary); font-weight: ${isSelected ? '700' : '400'};">${opt}</div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Rodapé de Ações -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 20px;">
            <button class="btn btn-outline" id="btnPrevQuestion" ${this.currentQuestionIndex === 0 ? 'disabled' : ''}>
              ← Questão Anterior
            </button>

            <div>
              ${this.currentQuestionIndex < totalQuestions - 1 ? `
                <button class="btn btn-primary" id="btnNextQuestion">
                  Próxima Questão →
                </button>
              ` : `
                <button class="btn btn-primary" style="background: #15803d; border-color: #22c55e; color: #ffffff;" id="btnFinishExam">
                  Finalizar e Enviar Prova Oficial 🎓
                </button>
              `}
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    this.updateTimerUI();
  }

  bindEvents() {
    const questions = this.getQuestions();

    // Clique nas opções
    this.container.querySelectorAll('.exam-option').forEach(optEl => {
      optEl.addEventListener('click', () => {
        const optIdx = parseInt(optEl.getAttribute('data-opt'), 10);
        const currentQ = questions[this.currentQuestionIndex];
        this.userAnswers[currentQ.id] = optIdx;
        this.render();
      });
    });

    // Navegador de Questões
    this.container.querySelectorAll('.nav-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        const idx = parseInt(e.target.getAttribute('data-index'), 10);
        this.currentQuestionIndex = idx;
        this.render();
      });
    });

    // Anterior / Próxima
    document.getElementById('btnPrevQuestion')?.addEventListener('click', () => {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
        this.render();
      }
    });

    document.getElementById('btnNextQuestion')?.addEventListener('click', () => {
      if (this.currentQuestionIndex < questions.length - 1) {
        this.currentQuestionIndex++;
        this.render();
      }
    });

    // Finalizar Prova
    document.getElementById('btnFinishExam')?.addEventListener('click', () => {
      const total = questions.length;
      const answered = Object.keys(this.userAnswers).length;
      if (answered < total) {
        if (!confirm(`Você respondeu ${answered} de ${total} questões. Deseja realmente finalizar e entregar agora?`)) {
          return;
        }
      }
      this.submitExam(false);
    });
  }

  submitExam(isTimeout = false) {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.isSubmitted = true;

    const questions = this.getQuestions();
    let correctCount = 0;
    const reviewData = [];

    questions.forEach((q, idx) => {
      const userSelected = this.userAnswers[q.id];
      const isCorrect = userSelected === q.correctIndex;
      if (isCorrect) correctCount++;

      reviewData.push({
        index: idx + 1,
        question: q.question,
        userAnswerText: userSelected !== undefined ? q.options[userSelected] : 'Não respondida',
        correctAnswerText: q.options[q.correctIndex],
        isCorrect,
        explanation: q.explanation
      });
    });

    const scorePercent = Math.round((correctCount / questions.length) * 100);
    const passed = scorePercent >= 70;

    let certCode = null;
    if (passed) {
      certCode = State.saveExamSuccess(this.currentCourse.id, scorePercent);
    }

    this.renderResult(scorePercent, passed, correctCount, questions.length, reviewData, certCode, isTimeout);
  }

  renderResult(score, passed, correctCount, totalQuestions, reviewData, certCode, isTimeout) {
    this.container.innerHTML = `
      <div style="max-width: 860px; margin: 30px auto; padding: 0 20px;">
        <div style="background: var(--bg-card); border: 2px solid ${passed ? '#10b981' : '#ef4444'}; border-radius: var(--radius-lg); padding: 36px; text-align: center; box-shadow: var(--shadow-lg); margin-bottom: 24px;">
          <div style="font-size: 3.5rem; margin-bottom: 10px;">${passed ? '🏆' : '⚠️'}</div>
          <h1 style="font-size: 2.2rem; color: ${passed ? '#10b981' : '#ef4444'}; margin-bottom: 8px;">
            ${passed ? 'Parabéns! Você foi Aprovado(a)!' : 'Aproveitamento Insuficiente.'}
          </h1>
          <p style="font-size: 1rem; color: var(--text-secondary); max-width: 600px; margin: 0 auto 20px;">
            ${passed 
              ? 'Você atingiu o índice mínimo legal de proficiência exigido pela NR-01 do Ministério do Trabalho e Emprego.' 
              : 'Você não atingiu a pontuação mínima de 70%. Revise o conteúdo das videoaulas e refaça a avaliação.'}
          </p>

          <div style="display: inline-flex; align-items: baseline; gap: 10px; background: var(--bg-elevated); padding: 12px 28px; border-radius: var(--radius-md); margin-bottom: 24px; border: 1px solid var(--border-color);">
            <span style="font-family: var(--font-heading); font-size: 3rem; color: var(--braseg-gold); line-height: 1;">${score}%</span>
            <span style="font-size: 0.9rem; color: var(--text-secondary);">(${correctCount} de ${totalQuestions} corretas)</span>
          </div>

          <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
            ${passed ? `
              <button class="btn btn-primary" id="btnGoToCert" style="padding: 12px 28px; font-size: 1rem;">
                📜 Visualizar e Imprimir Certificado Homologado
              </button>
            ` : `
              <button class="btn btn-primary" id="btnRetryExam">
                🔄 Refazer Avaliação
              </button>
            `}
            <button class="btn btn-outline" id="btnBackToCourse">
              ← Voltar às Videoaulas
            </button>
          </div>
        </div>

        <!-- Revisão Detalhada das Questões -->
        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px;">
          <h3 style="font-size: 1.3rem; color: var(--text-primary); margin-bottom: 16px;">Gabarito Comentado pelos Especialistas do Grupo BRASEG</h3>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${reviewData.map(r => `
              <div style="background: var(--bg-elevated); border-left: 4px solid ${r.isCorrect ? '#10b981' : '#ef4444'}; padding: 16px; border-radius: 4px;">
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; margin-bottom: 6px;">
                  <span>Questão ${r.index}</span>
                  <span style="color: ${r.isCorrect ? '#10b981' : '#ef4444'};">${r.isCorrect ? '✅ Resposta Correta' : '❌ Resposta Incorreta'}</span>
                </div>
                <p style="font-size: 0.92rem; color: var(--text-primary); margin-bottom: 8px;">${r.question}</p>
                <div style="font-size: 0.85rem; margin-bottom: 4px;">
                  <strong style="color: var(--text-secondary);">Sua Resposta:</strong> <span style="color: ${r.isCorrect ? '#10b981' : '#ef4444'};">${r.userAnswerText}</span>
                </div>
                ${!r.isCorrect ? `
                  <div style="font-size: 0.85rem; margin-bottom: 6px;">
                    <strong style="color: var(--text-secondary);">Resposta Correta:</strong> <span style="color: #10b981;">${r.correctAnswerText}</span>
                  </div>
                ` : ''}
                <div style="background: rgba(0, 46, 90, 0.3); padding: 8px 12px; border-radius: 4px; font-size: 0.82rem; color: #cbd5e1; margin-top: 8px;">
                  <strong>Fundamentação Normativa:</strong> ${r.explanation}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    document.getElementById('btnGoToCert')?.addEventListener('click', () => {
      if (this.options.onViewCertificate) {
        this.options.onViewCertificate(this.currentCourse.id);
      }
    });

    document.getElementById('btnRetryExam')?.addEventListener('click', () => {
      this.startExam(this.currentCourse, this.container);
    });

    document.getElementById('btnBackToCourse')?.addEventListener('click', () => {
      if (this.options.onBackToVideos) {
        this.options.onBackToVideos(this.currentCourse.id);
      }
    });
  }
}
