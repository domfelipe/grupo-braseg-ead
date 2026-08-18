/**
 * Grupo BRASEG EAD - Aplicação SPA Principal
 * Padrão Corporativo Suíço / Apple Enterprise
 * Grupo BRASEG Consultoria e Treinamentos - Lençóis Paulista / SP
 */

import { COURSES_DATA, SUBSCRIPTION_PLANS, BRASEG_INSTITUTIONAL } from './coursesData.js';
import { State } from './state.js';
import { VideoPlayer } from './videoPlayer.js';
import { ExamEngine } from './examEngine.js';
import { CertificateManager } from './certificate.js';
import { DashboardManager } from './dashboard.js';
import { CheckoutEngine } from './checkoutEngine.js';

class App {
  constructor() {
    this.videoPlayer = null;
    this.examEngine = null;
    this.certificateManager = null;
    this.dashboardManager = null;
    this.checkoutEngine = null;
    this.activeCategory = 'all';

    this.init();
  }

  init() {
    State.init();

    // Inicializar sub-módulos
    this.examEngine = new ExamEngine({
      onViewCertificate: (courseId) => this.navigateTo('certificate', courseId),
      onBackToVideos: (courseId) => this.navigateTo('player', courseId)
    });

    this.certificateManager = new CertificateManager('certificateContainer');
    this.certificateManager.onBackRequest = (courseId) => this.navigateTo('player', courseId);

    this.checkoutEngine = new CheckoutEngine({
      onNavigateToCourse: (courseId) => {
        this.navigateTo('player', courseId);
        this.showToast('Matrícula homologada via Asaas Gateway.');
      },
      onNavigateToCatalog: () => {
        this.navigateTo('catalog');
        this.showToast('Assinatura ativada com sucesso.');
      }
    });

    this.dashboardManager = new DashboardManager('dashboardContainer');
    this.dashboardManager.onStudentSwitched = (student) => {
      this.updateHeaderProfile();
      this.showToast(`Perfil alterado: ${student.name}`);
      this.renderCatalog();
    };
    this.dashboardManager.onEmployeeAddedToast = (msg) => this.showToast(msg);
    this.dashboardManager.onBuyPackRequest = (pack) => {
      this.checkoutEngine.openCheckout('pack', pack);
    };

    this.bindGlobalEvents();
    this.updateHeaderProfile();
    this.applyTheme(State.theme);

    // Renderizar View Inicial
    this.navigateTo(State.activeView || 'catalog', State.activeCourseId);
  }

  bindGlobalEvents() {
    // Logo Click -> Catálogo
    document.getElementById('brandLogo')?.addEventListener('click', () => {
      this.navigateTo('catalog');
    });

    // Navegação Principal (Tabs do Header)
    document.querySelectorAll('.nav-item').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = link.getAttribute('data-view');
        this.navigateTo(targetView);
      });
    });

    // Links de Rodapé
    document.querySelectorAll('.footer-nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = link.getAttribute('data-view');
        this.navigateTo(targetView);
      });
    });

    // Hero CTAs
    document.getElementById('btnHeroStartCourse')?.addEventListener('click', () => {
      this.navigateTo('player', 'nr35');
    });

    document.getElementById('btnHeroPass')?.addEventListener('click', () => {
      this.navigateTo('membership');
    });

    // Botão Voltar ao Catálogo no Player
    document.getElementById('btnBackToCatalog')?.addEventListener('click', () => {
      this.navigateTo('catalog');
    });

    // Theme Toggle
    document.getElementById('btnThemeToggle')?.addEventListener('click', () => {
      const nextTheme = State.theme === 'dark' ? 'light' : 'dark';
      State.setTheme(nextTheme);
      this.applyTheme(nextTheme);
    });

    // Filtros de Categoria no Catálogo
    document.querySelectorAll('.filter-tab').forEach(pill => {
      pill.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-tab').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.activeCategory = pill.getAttribute('data-cat');
        State.setCategory(this.activeCategory);
        this.renderCatalog();
      });
    });

    // Busca de Cursos no Catálogo
    const catalogSearch = document.getElementById('catalogSearchInput');
    catalogSearch?.addEventListener('input', () => {
      this.renderCatalog();
    });

    // Profile Card -> Dashboard
    document.getElementById('headerProfileCard')?.addEventListener('click', () => {
      this.navigateTo('dashboard');
    });
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  updateHeaderProfile() {
    const nameEl = document.getElementById('headerUserName');
    const roleEl = document.getElementById('headerUserRole');
    const compEl = document.getElementById('headerUserCompany');

    if (nameEl) nameEl.textContent = State.currentStudent.name;
    if (roleEl) roleEl.textContent = `${State.currentStudent.role}`;
    if (compEl) compEl.textContent = State.currentStudent.company;
  }

  navigateTo(view, courseId = null, lessonId = null) {
    State.activeView = view;
    if (courseId) State.activeCourseId = courseId;
    if (lessonId) State.activeLessonId = lessonId;
    State.save();

    // Atualizar classe ativa no menu
    document.querySelectorAll('.nav-item').forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-view') === view);
    });

    // Ocultar todas as seções de visualização
    document.querySelectorAll('.view-panel').forEach(sec => {
      sec.style.display = 'none';
    });

    // Destruir player anterior se sair da tela de vídeo
    if (view !== 'player' && this.videoPlayer) {
      this.videoPlayer.destroy();
      this.videoPlayer = null;
    }

    // Renderizar a view selecionada
    switch (view) {
      case 'catalog':
        document.getElementById('viewCatalog').style.display = 'block';
        this.renderCatalog();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;

      case 'membership':
        document.getElementById('viewMembership').style.display = 'block';
        this.renderMembershipView();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;

      case 'player':
        document.getElementById('viewPlayer').style.display = 'block';
        this.renderPlayerView(courseId || State.activeCourseId, lessonId || State.activeLessonId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;

      case 'exam':
        document.getElementById('viewExam').style.display = 'block';
        const courseForExam = State.getCourse(courseId || State.activeCourseId);
        this.examEngine.startExam(courseForExam, document.getElementById('examContainer'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;

      case 'certificate':
        document.getElementById('viewCertificate').style.display = 'block';
        this.certificateManager.render(courseId || State.activeCourseId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;

      case 'dashboard':
        document.getElementById('viewDashboard').style.display = 'block';
        this.dashboardManager.render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;

      case 'docs':
        document.getElementById('viewDocs').style.display = 'block';
        this.renderAboutBrasegView();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;

      default:
        document.getElementById('viewCatalog').style.display = 'block';
        this.renderCatalog();
    }
  }

  renderCatalog() {
    const grid = document.getElementById('coursesGrid');
    if (!grid) return;

    const searchTerm = (document.getElementById('catalogSearchInput')?.value || '').toLowerCase();

    const filtered = COURSES_DATA.filter(course => {
      const matchCat = this.activeCategory === 'all' || course.category === this.activeCategory;
      const matchSearch = course.title.toLowerCase().includes(searchTerm) ||
                          course.code.toLowerCase().includes(searchTerm) ||
                          course.description.toLowerCase().includes(searchTerm);
      return matchCat && matchSearch;
    });

    grid.innerHTML = filtered.map(course => {
      const prog = State.getCourseProgress(course.id);
      const isUnlocked = State.isCourseUnlocked(course.id);

      return `
        <div class="executive-course-card" data-id="${course.id}">
          <div class="card-media-wrapper">
            <img src="${course.thumb}" alt="${course.title}" class="card-media-image" loading="lazy" onerror="this.src='assets/images/nr35.jpg'">
            <span class="card-floating-badge">${course.code}</span>
            <span class="card-duration-badge">Carga: ${course.duration}</span>
          </div>

          <div class="card-body-content">
            <div class="card-meta-category">${course.categoryLabel || 'Norma Regulamentadora'}</div>
            <h3 class="card-main-title">${course.title}</h3>
            <p class="card-description-text">${course.subtitle || course.description}</p>

            <!-- Barra de Progresso do Aluno -->
            <div class="card-progress-indicator">
              <div class="progress-info-text">
                <span>Progresso: <strong>${prog.percent}%</strong></span>
                <span>${prog.completedCount}/${prog.totalCount} aulas</span>
              </div>
              <div class="progress-track-bg">
                <div class="progress-bar-fill" style="width: ${prog.percent}%;"></div>
              </div>
            </div>

            <!-- Preço e Ações -->
            <div class="card-footer-controls">
              <div class="pricing-info-block">
                ${course.originalPrice ? `<span class="price-strike-val">R$ ${course.originalPrice.toFixed(2).replace('.', ',')}</span>` : ''}
                <span class="price-active-val">R$ ${course.price.toFixed(2).replace('.', ',')}</span>
              </div>

              <div class="card-action-btns">
                ${prog.isPassed ? `
                  <button type="button" class="btn btn-sm btn-outline btn-card-cert" data-id="${course.id}">
                    Certificado
                  </button>
                ` : ''}

                ${isUnlocked ? `
                  <button type="button" class="btn btn-sm btn-primary btn-access-course" data-id="${course.id}">
                    ${prog.percent > 0 ? 'Continuar' : 'Acessar'}
                  </button>
                ` : `
                  <button type="button" class="btn btn-sm btn-outline btn-buy-single-course" data-id="${course.id}">
                    Contratar
                  </button>
                `}
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Bind cliques nos botões dos cards
    grid.querySelectorAll('.btn-access-course').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cid = btn.getAttribute('data-id');
        this.navigateTo('player', cid);
      });
    });

    grid.querySelectorAll('.btn-buy-single-course').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cid = btn.getAttribute('data-id');
        const course = State.getCourse(cid);
        this.checkoutEngine.openCheckout('course', course);
      });
    });

    grid.querySelectorAll('.btn-card-cert').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cid = btn.getAttribute('data-id');
        this.navigateTo('certificate', cid);
      });
    });

    grid.querySelectorAll('.executive-course-card').forEach(card => {
      card.addEventListener('click', () => {
        const cid = card.getAttribute('data-id');
        const isUnlocked = State.isCourseUnlocked(cid);
        if (isUnlocked) {
          this.navigateTo('player', cid);
        } else {
          const course = State.getCourse(cid);
          this.checkoutEngine.openCheckout('course', course);
        }
      });
    });
  }

  renderMembershipView() {
    document.querySelectorAll('.btn-select-plan').forEach(btn => {
      btn.addEventListener('click', () => {
        const planId = btn.getAttribute('data-plan');
        const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId) || SUBSCRIPTION_PLANS[0];
        this.checkoutEngine.openCheckout('subscription', plan);
      });
    });
  }

  renderPlayerView(courseId, lessonId) {
    const course = State.getCourse(courseId);
    if (!course) return;

    let targetLesson = null;
    if (lessonId) {
      course.modules.forEach(m => {
        const found = m.lessons.find(l => l.id === lessonId);
        if (found) targetLesson = found;
      });
    }
    if (!targetLesson && course.modules[0]?.lessons[0]) {
      targetLesson = course.modules[0].lessons[0];
    }
    State.activeLessonId = targetLesson?.id || '';

    document.getElementById('playerCourseTitle').textContent = `${course.code}: ${course.title}`;
    document.getElementById('playerCourseNorma').textContent = `${course.norm} • Carga Horária: ${course.duration}`;

    if (!this.videoPlayer) {
      this.videoPlayer = new VideoPlayer('videoPlayerMount', {
        onLessonCompleted: (c, l) => {
          this.playSuccessChime();
          this.showToast(`Aula "${l.title}" concluída.`);
          this.renderSidebarModules(course, targetLesson);
          this.renderPlayerTabs(course, targetLesson);
        },
        onAddNoteRequest: (time, formatted) => {
          const tabNotesBtn = document.querySelector('.pedagogical-tab-btn[data-tab="tabNotes"]');
          tabNotesBtn?.click();
          const noteInput = document.getElementById('newNoteInput');
          if (noteInput) {
            noteInput.focus();
            noteInput.placeholder = `Anotação no minuto [${formatted}]...`;
          }
        }
      });
    }

    this.videoPlayer.loadLesson(course, targetLesson);
    this.renderSidebarModules(course, targetLesson);
    this.renderPlayerTabs(course, targetLesson);
  }

  renderSidebarModules(course, activeLesson) {
    const sidebar = document.getElementById('curriculumAccordion');
    if (!sidebar) return;

    const prog = State.getCourseProgress(course.id);

    sidebar.innerHTML = `
      <div>
        <div style="margin-bottom: 16px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.78rem; margin-bottom: 6px;">
            <span style="color: var(--text-secondary);">Progresso do Treinamento</span>
            <strong style="color: var(--color-accent-gold); font-family: var(--font-mono);">${prog.percent}%</strong>
          </div>
          <div class="progress-track-bg">
            <div class="progress-bar-fill" style="width: ${prog.percent}%;"></div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${course.modules.map(mod => `
            <div style="background: var(--bg-surface-2); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 10px;">
              <strong style="font-size: 0.8rem; color: var(--color-accent-gold); display: block; margin-bottom: 6px;">${mod.title}</strong>
              <div style="display: flex; flex-direction: column; gap: 4px;">
                ${mod.lessons.map(l => {
                  const isCompleted = State.isLessonCompleted(course.id, l.id);
                  const isActive = l.id === activeLesson.id;

                  return `
                    <div class="sidebar-lesson-item" data-lesson-id="${l.id}" style="display: flex; align-items: center; justify-content: space-between; padding: 6px 8px; border-radius: var(--radius-xs); background: ${isActive ? 'var(--color-primary)' : 'transparent'}; cursor: pointer;">
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 0.75rem; color: ${isCompleted ? 'var(--color-success)' : (isActive ? '#ffffff' : 'var(--text-muted)')};">${isCompleted ? '✓' : (isActive ? '▶' : '○')}</span>
                        <div>
                          <strong style="display: block; font-size: 0.78rem; color: ${isActive ? '#ffffff' : 'var(--text-primary)'};">${l.title}</strong>
                          <small style="color: ${isActive ? '#cbd5e1' : 'var(--text-muted)'}; font-size: 0.7rem;">${Math.floor(l.duration / 60)} min • Simulação</small>
                        </div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `).join('')}

          <div style="background: var(--color-primary-dark); border: 1px solid var(--border-medium); border-radius: var(--radius-sm); padding: 14px; text-align: center;">
            <strong style="display: block; font-size: 0.85rem; color: #ffffff; margin-bottom: 2px;">Avaliação Final MTE</strong>
            <small style="color: var(--text-secondary); display: block; margin-bottom: 10px;">${prog.isPassed ? `Aprovado com ${prog.score}%` : 'Obrigatória para Emissão'}</small>
            <button type="button" class="btn btn-primary btn-sm btn-block" id="btnSidebarExam">
              ${prog.isPassed ? 'Revisar Avaliação' : 'Iniciar Avaliação →'}
            </button>
          </div>

          ${prog.isPassed ? `
            <button type="button" class="btn btn-outline btn-sm btn-block" id="btnSidebarCert">
              Visualizar Certificado Homologado
            </button>
          ` : ''}
        </div>
      </div>
    `;

    sidebar.querySelectorAll('.sidebar-lesson-item').forEach(row => {
      row.addEventListener('click', () => {
        const lid = row.getAttribute('data-lesson-id');
        this.renderPlayerView(course.id, lid);
      });
    });

    document.getElementById('btnSidebarExam')?.addEventListener('click', () => {
      this.navigateTo('exam', course.id);
    });

    document.getElementById('btnSidebarCert')?.addEventListener('click', () => {
      this.navigateTo('certificate', course.id);
    });
  }

  renderPlayerTabs(course, lesson) {
    document.querySelectorAll('.pedagogical-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.pedagogical-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.pedagogical-tab-panel').forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetTab = btn.getAttribute('data-tab');
        document.getElementById(targetTab)?.classList.add('active');
      });
    });

    this.renderNotesTab(course, lesson);
    this.renderSummaryTab(course, lesson);
    this.renderMaterialsTab(course, lesson);
    this.renderForumTab(course, lesson);
  }

  renderNotesTab(course, lesson) {
    const list = document.getElementById('notesList');
    const form = document.getElementById('addNoteForm');
    const input = document.getElementById('newNoteInput');

    if (!list || !form) return;

    const courseNotes = State.notes.filter(n => n.courseId === course.id);

    list.innerHTML = courseNotes.length > 0 ? courseNotes.map(n => `
      <div style="background: var(--bg-surface-2); padding: 10px 12px; border-radius: var(--radius-xs); margin-bottom: 8px; border-left: 2px solid var(--color-accent-gold);" data-id="${n.id}">
        <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-muted); margin-bottom: 2px;">
          <span style="font-family: var(--font-mono); color: var(--color-accent-gold); font-weight: 700;">[${n.timeFormatted}]</span>
          <span>${n.createdAt}</span>
        </div>
        <p style="font-size: 0.82rem; color: var(--text-primary);">${n.text}</p>
      </div>
    `).join('') : '<p style="color: var(--text-muted); font-size: 0.8rem;">Nenhum apontamento registrado.</p>';

    form.onsubmit = (e) => {
      e.preventDefault();
      const txt = input.value.trim();
      if (!txt) return;

      const curTime = this.videoPlayer ? this.videoPlayer.currentTime : 0;
      const fmtTime = this.videoPlayer ? this.videoPlayer.formatTime(curTime) : '00:00';

      State.addNote(course.id, lesson.id, curTime, fmtTime, txt);
      input.value = '';
      this.renderNotesTab(course, lesson);
      this.showToast('Anotação salva.');
    };
  }

  renderSummaryTab(course, lesson) {
    const container = document.getElementById('tabSummaryContent');
    if (!container) return;

    container.innerHTML = `
      <div>
        <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">Resumo Normativo & Transcrição Oficial</h3>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 14px; line-height: 1.6;">${lesson.transcript}</p>

        <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--color-accent-gold); margin-bottom: 6px;">Checkpoints de Conformidade:</h4>
        <ul style="padding-left: 18px; font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 14px;">
          ${(lesson.keyPoints || []).map(k => `<li style="margin-bottom: 4px;">${k}</li>`).join('')}
        </ul>

        <div style="background: var(--bg-surface-2); border-left: 3px solid var(--color-primary); padding: 10px 14px; border-radius: var(--radius-xs); font-size: 0.78rem; color: var(--text-muted);">
          <strong>Amparo Legal:</strong> ${course.norm} • Portaria MTP nº 6.730/2020.
        </div>
      </div>
    `;
  }

  renderMaterialsTab(course, lesson) {
    const list = document.getElementById('attachmentsList');
    if (!list) return;

    const materials = [
      { title: `Checklist Pré-Operacional de Segurança - ${course.code}`, type: 'PDF Técnico', size: '1.2 MB' },
      { title: `Modelo de Permissão de Trabalho (PT / APR) - ${course.code}`, type: 'DOCX Editável', size: '850 KB' },
      { title: `Procedimento Operacional Padrão (POP) - ${course.code}`, type: 'PDF Homologado', size: '2.4 MB' }
    ];

    list.innerHTML = materials.map(att => `
      <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-surface-2); padding: 10px 14px; border-radius: var(--radius-xs); margin-bottom: 8px; border: 1px solid var(--border-subtle);">
        <div>
          <strong style="display: block; font-size: 0.82rem; color: var(--text-primary);">${att.title}</strong>
          <small style="color: var(--text-muted); font-size: 0.72rem;">${att.type} • ${att.size} • Grupo BRASEG</small>
        </div>
        <button type="button" class="btn btn-sm btn-outline btn-dl-mat" data-title="${att.title}">
          ⬇️ Download
        </button>
      </div>
    `).join('');

    list.querySelectorAll('.btn-dl-mat').forEach(btn => {
      btn.addEventListener('click', () => {
        const title = btn.getAttribute('data-title');
        this.simulateDownloadFile(title);
      });
    });
  }

  renderForumTab(course, lesson) {
    const list = document.getElementById('forumQuestionsList');
    const form = document.getElementById('askForumForm');
    const input = document.getElementById('forumQuestionInput');

    if (!list || !form) return;

    const questions = State.forumQuestions.filter(q => q.courseId === course.id);

    list.innerHTML = questions.map(q => `
      <div style="background: var(--bg-surface-2); border: 1px solid var(--border-subtle); border-radius: var(--radius-xs); padding: 12px; margin-bottom: 10px;">
        <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-muted); margin-bottom: 4px;">
          <strong>${q.author} (${q.role})</strong>
          <span>${q.date}</span>
        </div>
        <p style="font-size: 0.82rem; color: var(--text-primary); margin-bottom: 8px;">${q.text}</p>

        <div style="background: rgba(0, 46, 90, 0.35); border-left: 2px solid var(--color-accent-gold); padding: 8px 10px; border-radius: var(--radius-xs);">
          <div style="font-size: 0.72rem; font-weight: 700; color: var(--color-accent-gold); margin-bottom: 2px;">
            ${q.answeredBy}
          </div>
          <p style="font-size: 0.78rem; color: #cbd5e1;">${q.answer}</p>
        </div>
      </div>
    `).join('');

    form.onsubmit = (e) => {
      e.preventDefault();
      const txt = input.value.trim();
      if (!txt) return;

      State.addForumQuestion(course.id, txt);
      input.value = '';
      this.renderForumTab(course, lesson);
      this.showToast('Pergunta encaminhada ao corpo técnico.');
    };
  }

  renderAboutBrasegView() {
    const container = document.getElementById('docsMountContainer');
    if (!container) return;

    container.innerHTML = `
      <div style="max-width: 1100px; margin: 32px auto; padding: 0 16px;">
        <div style="background: var(--bg-surface-1); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 36px; text-align: center; margin-bottom: 24px;">
          <img src="assets/images/braseg_logo_white.png" alt="Grupo BRASEG" style="height: 48px; margin-bottom: 12px;">
          <h2 style="font-size: 1.8rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">${BRASEG_INSTITUTIONAL.companyName}</h2>
          <p style="font-size: 0.95rem; color: var(--text-secondary); max-width: 700px; margin: 0 auto 16px;">
            "${BRASEG_INSTITUTIONAL.mission}"
          </p>
          <div style="display: inline-flex; gap: 10px; flex-wrap: wrap; justify-content: center;">
            <a href="${BRASEG_INSTITUTIONAL.whatsappLink}" target="_blank" class="btn btn-whatsapp btn-sm">
              WhatsApp SESMT: ${BRASEG_INSTITUTIONAL.whatsapp}
            </a>
            <a href="mailto:${BRASEG_INSTITUTIONAL.email}" class="btn btn-outline btn-sm">
              ${BRASEG_INSTITUTIONAL.email}
            </a>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
          <div style="background: var(--bg-surface-1); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px;">
            <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">Coordenação Médica (PCMSO)</h3>
            <p style="font-size: 0.85rem; font-weight: 700; color: var(--color-accent-gold);">${BRASEG_INSTITUTIONAL.technicalDirectors[0].name}</p>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 8px;">${BRASEG_INSTITUTIONAL.technicalDirectors[0].credential}</p>
            <p style="font-size: 0.8rem; color: var(--text-secondary);">Coordenação de exames ocupacionais (ASO Admissional, Periódico, Demissional) e conformidade eSocial S-2220.</p>
          </div>

          <div style="background: var(--bg-surface-1); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px;">
            <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">Engenharia de Segurança (SST)</h3>
            <p style="font-size: 0.85rem; font-weight: 700; color: var(--color-accent-gold);">${BRASEG_INSTITUTIONAL.technicalDirectors[1].name}</p>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 8px;">${BRASEG_INSTITUTIONAL.technicalDirectors[1].credential}</p>
            <p style="font-size: 0.8rem; color: var(--text-secondary);">Projetos pedagógicos de NRs, laudos LTCAT, gestão de riscos no PGR e integração eSocial S-2240.</p>
          </div>
        </div>
      </div>
    `;
  }

  simulateDownloadFile(filename) {
    const textContent = `GRUPO BRASEG CONSULTORIA E TREINAMENTOS\nUnidade: Lençóis Paulista - SP | CNPJ: 18.234.567/0001-89\nTelefone: (14) 3283-2060 | WhatsApp: (14) 99760-9595\n\nDOCUMENTAÇÃO TÉCNICA HOMOLOGADA\nArquivo: ${filename}\nData de Emissão: ${new Date().toLocaleDateString('pt-BR')}\nResponsável Médico: Dr. Carlos Eduardo Menezes (CRM-SP 148.920 / RQE 72.104)\nResponsável Engenharia: Eng. Ricardo S. Albuquerque (CREA-SP 506.128.932-D)\n\nEm conformidade com a NR-01 (Portaria MTP nº 6.730/2020) e eSocial.`;
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.endsWith('.pdf') ? filename.replace('.pdf', '.txt') : filename + '.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    this.showToast(`Download de "${filename}" concluído.`);
  }

  showToast(message) {
    let toast = document.getElementById('appToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'appToast';
      toast.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: var(--bg-surface-1); color: var(--text-primary); border: 1px solid var(--border-medium); padding: 10px 16px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; z-index: 9999; box-shadow: var(--shadow-lg); opacity: 0; transform: translateY(10px); transition: all 0.2s ease; pointer-events: none;';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
    }, 3000);
  }

  playSuccessChime() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      // Audio policy
    }
  }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  window.medTrabApp = new App();
});
