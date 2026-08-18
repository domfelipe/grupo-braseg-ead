/**
 * Grupo BRASEG EAD - Aplicação Principal & Roteador SPA
 * Plataforma Oficial de Streaming & Treinamentos em SST (NRs)
 * Grupo BRASEG Consultoria e Treinamentos - Lençóis Paulista / SP
 */

import { COURSES_DATA, SUBSCRIPTION_PLANS, B2B_CORPORATE_PACKS, BRASEG_INSTITUTIONAL } from './coursesData.js';
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
        this.showToast('Matrícula ativada via Asaas Gateway! Bons estudos.');
      },
      onNavigateToCatalog: () => {
        this.navigateTo('catalog');
        this.showToast('Assinatura BRASEG Pass ativada com sucesso!');
      }
    });

    this.dashboardManager = new DashboardManager('dashboardContainer');
    this.dashboardManager.onStudentSwitched = (student) => {
      this.updateHeaderProfile();
      this.showToast(`Perfil alterado para: ${student.name}`);
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

    // Navegação Principal (Pill Menu)
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = link.getAttribute('data-view');
        this.navigateTo(targetView);
      });
    });

    // Links de Rodapé
    document.querySelectorAll('.footer-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = link.getAttribute('data-view');
        this.navigateTo(targetView);
      });
    });

    // Top Bar CTA Membership
    document.getElementById('btnTopBarMembership')?.addEventListener('click', () => {
      this.navigateTo('membership');
    });

    // Hero CTAs
    document.getElementById('btnHeroStartCourse')?.addEventListener('click', () => {
      this.navigateTo('player', 'nr35');
    });

    document.getElementById('btnHeroBuyCourse')?.addEventListener('click', () => {
      const course = State.getCourse('nr35');
      this.checkoutEngine.openCheckout('course', course);
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
    document.querySelectorAll('.cat-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
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
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-view') === view);
    });

    // Ocultar todas as seções de visualização
    document.querySelectorAll('.view-section').forEach(sec => {
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
        <div class="liquid-course-card" data-id="${course.id}">
          <div class="card-thumb-wrapper">
            <img src="${course.thumb}" alt="${course.title}" class="card-thumb-img" loading="lazy" onerror="this.src='assets/images/nr35.jpg'">
            <div class="card-top-badges">
              <span class="badge-norma-code">${course.code}</span>
              <span class="badge-duration-pill">⏱️ ${course.duration}</span>
            </div>
          </div>

          <div class="card-info-body">
            <div class="card-category-row">
              <span>${course.categoryLabel || 'Norma Regulamentadora'}</span>
              <span>⭐ ${course.rating || '4.9'}</span>
            </div>

            <h3 class="card-title">${course.title}</h3>
            <p class="card-subtitle">${course.subtitle || course.description}</p>

            <!-- Barra de Progresso do Aluno -->
            <div class="card-progress-box">
              <div class="progress-labels">
                <span>Progresso: <strong>${prog.percent}%</strong></span>
                <span>${prog.completedCount}/${prog.totalCount} Aulas</span>
              </div>
              <div class="progress-track">
                <div class="progress-bar-fill" style="width: ${prog.percent}%;"></div>
              </div>
            </div>

            <!-- Preço e Ações de Compra / Acesso -->
            <div class="card-bottom-actions">
              <div class="card-price-display">
                ${course.originalPrice ? `<span class="price-strike">R$ ${course.originalPrice.toFixed(2).replace('.', ',')}</span>` : ''}
                <span class="price-current">R$ ${course.price.toFixed(2).replace('.', ',')}</span>
              </div>

              <div class="card-buttons-group">
                ${prog.isPassed ? `
                  <button class="btn btn-sm btn-outline btn-card-cert" data-id="${course.id}" title="Ver Certificado">
                    📜 Certificado
                  </button>
                ` : ''}

                ${isUnlocked ? `
                  <button class="btn btn-sm btn-primary btn-access-course" data-id="${course.id}">
                    ${prog.percent > 0 ? '▶️ Continuar' : '▶️ Assistir'}
                  </button>
                ` : `
                  <button class="btn btn-sm btn-hero-buy btn-buy-single-course" data-id="${course.id}" style="padding: 6px 12px; font-size: 0.8rem;">
                    ⚡ Comprar (Asaas)
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

    grid.querySelectorAll('.liquid-course-card').forEach(card => {
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
    // Botões de seleção de planos
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

    // Achar aula atual ou primeira aula
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

    // Atualizar Títulos da Página
    document.getElementById('playerCourseTitle').textContent = `${course.code}: ${course.title}`;
    document.getElementById('playerCourseNorma').textContent = `${course.norm} • Carga Horária: ${course.duration}`;

    // Inicializar VideoPlayer
    if (!this.videoPlayer) {
      this.videoPlayer = new VideoPlayer('videoPlayerMount', {
        onLessonCompleted: (c, l) => {
          this.playSuccessChime();
          this.showToast(`Aula "${l.title}" concluída com sucesso!`);
          this.renderSidebarModules(course, targetLesson);
          this.renderPlayerTabs(course, targetLesson);
        },
        onAddNoteRequest: (time, formatted) => {
          const tabNotesBtn = document.querySelector('.tab-btn[data-tab="tabNotes"]');
          tabNotesBtn?.click();
          const noteInput = document.getElementById('newNoteInput');
          if (noteInput) {
            noteInput.focus();
            noteInput.placeholder = `Adicionar anotação no minuto [${formatted}]...`;
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
      <div style="background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: var(--radius-lg); padding: 20px; box-shadow: var(--glass-shadow);">
        <div style="margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 6px;">
            <span>Progresso no Treinamento</span>
            <strong style="color: var(--braseg-gold);">${prog.percent}%</strong>
          </div>
          <div class="progress-track">
            <div class="progress-bar-fill" style="width: ${prog.percent}%;"></div>
          </div>
        </div>

        <!-- Lista de Módulos e Aulas -->
        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${course.modules.map((mod, modIdx) => `
            <div style="background: var(--bg-elevated); border: 1px solid var(--border-glass); border-radius: var(--radius-md); padding: 12px;">
              <strong style="font-size: 0.85rem; color: var(--braseg-gold); display: block; margin-bottom: 8px;">${mod.title}</strong>
              <div style="display: flex; flex-direction: column; gap: 6px;">
                ${mod.lessons.map(l => {
                  const isCompleted = State.isLessonCompleted(course.id, l.id);
                  const isActive = l.id === activeLesson.id;

                  return `
                    <div class="sidebar-lesson-item" data-lesson-id="${l.id}" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; border-radius: var(--radius-sm); background: ${isActive ? 'rgba(0, 46, 90, 0.6)' : 'transparent'}; border: 1px solid ${isActive ? 'var(--braseg-gold)' : 'transparent'}; cursor: pointer;">
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <span>${isCompleted ? '✅' : (isActive ? '▶️' : '⚪')}</span>
                        <div>
                          <strong style="display: block; font-size: 0.82rem; color: var(--text-primary);">${l.title}</strong>
                          <small style="color: var(--text-muted);">⏱️ ${Math.floor(l.duration / 60)} min • Simulação Canvas</small>
                        </div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `).join('')}

          <!-- Card da Prova Final MTE -->
          <div style="background: linear-gradient(135deg, #002e5a 0%, #001a35 100%); border: 1px solid var(--braseg-gold); border-radius: var(--radius-md); padding: 14px; text-align: center;">
            <span style="font-size: 1.6rem; display: block; margin-bottom: 4px;">🏆</span>
            <strong style="display: block; font-size: 0.9rem; color: #ffffff;">Avaliação Oficial MTE</strong>
            <small style="color: #cbd5e1; display: block; margin-bottom: 10px;">${prog.isPassed ? `Aprovado com ${prog.score}%` : 'Obrigatória para Emissão do Certificado'}</small>
            <button class="btn btn-primary btn-sm btn-block" id="btnSidebarExam">
              ${prog.isPassed ? 'Revisar Prova Final' : 'Fazer Avaliação Final →'}
            </button>
          </div>

          ${prog.isPassed ? `
            <button class="btn btn-hero-buy btn-sm btn-block" id="btnSidebarCert">
              📜 Ver Certificado Homologado
            </button>
          ` : ''}
        </div>
      </div>
    `;

    // Bind clique nas aulas
    sidebar.querySelectorAll('.sidebar-lesson-item').forEach(row => {
      row.addEventListener('click', () => {
        const lid = row.getAttribute('data-lesson-id');
        this.renderPlayerView(course.id, lid);
      });
    });

    // Prova
    document.getElementById('btnSidebarExam')?.addEventListener('click', () => {
      this.navigateTo('exam', course.id);
    });

    // Certificado
    document.getElementById('btnSidebarCert')?.addEventListener('click', () => {
      this.navigateTo('certificate', course.id);
    });
  }

  renderPlayerTabs(course, lesson) {
    const tabsContainer = document.getElementById('playerTabsContainer');
    if (!tabsContainer) return;

    // Tab buttons click
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetTab = btn.getAttribute('data-tab');
        document.getElementById(targetTab)?.classList.add('active');
      });
    });

    // Renderizar conteúdo de cada aba
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
      <div style="background: var(--bg-elevated); padding: 12px; border-radius: var(--radius-md); margin-bottom: 10px; border-left: 3px solid var(--braseg-gold);" data-id="${n.id}">
        <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-muted); margin-bottom: 4px;">
          <span style="font-family: var(--font-mono); color: var(--braseg-gold); font-weight: 700;">⏱️ [${n.timeFormatted}]</span>
          <span>${n.createdAt}</span>
        </div>
        <p style="font-size: 0.88rem; color: var(--text-primary);">${n.text}</p>
      </div>
    `).join('') : '<p style="color: var(--text-muted); font-size: 0.85rem; padding: 10px;">Nenhuma anotação criada ainda. Pause o vídeo e salve seus apontamentos técnicos aqui!</p>';

    form.onsubmit = (e) => {
      e.preventDefault();
      const txt = input.value.trim();
      if (!txt) return;

      const curTime = this.videoPlayer ? this.videoPlayer.currentTime : 0;
      const fmtTime = this.videoPlayer ? this.videoPlayer.formatTime(curTime) : '00:00';

      State.addNote(course.id, lesson.id, curTime, fmtTime, txt);
      input.value = '';
      this.renderNotesTab(course, lesson);
      this.showToast('Anotação salva com sucesso!');
    };
  }

  renderSummaryTab(course, lesson) {
    const container = document.getElementById('tabSummaryContent');
    if (!container) return;

    container.innerHTML = `
      <div style="line-height: 1.6; padding: 10px;">
        <h3 style="font-size: 1.3rem; color: var(--braseg-blue); margin-bottom: 10px;">📝 Resumo Normativo & Transcrição da Aula</h3>
        <p style="font-size: 0.92rem; color: var(--text-secondary); margin-bottom: 16px;">${lesson.transcript || 'Transcrição oficial gravada pelo corpo docente do Grupo BRASEG.'}</p>

        <h4 style="font-size: 1.05rem; color: var(--braseg-gold); margin-bottom: 8px;">Pontos Fundamentais de Segurança (Checkpoints MTE):</h4>
        <ul style="padding-left: 20px; font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 16px;">
          ${(lesson.keyPoints || []).map(k => `<li style="margin-bottom: 6px;">${k}</li>`).join('')}
        </ul>

        <div style="background: var(--bg-elevated); border-left: 4px solid var(--braseg-navy); padding: 12px 16px; border-radius: 4px; font-size: 0.85rem; color: var(--text-muted);">
          <strong>Amparo Legal:</strong> ${course.norm} • Portaria SEPRT / MTE nº 6.730/2020.
        </div>
      </div>
    `;
  }

  renderMaterialsTab(course, lesson) {
    const list = document.getElementById('attachmentsList');
    if (!list) return;

    const materials = [
      { title: `Checklist Pré-Operacional de Segurança - ${course.code}`, type: 'PDF / Formato A4', size: '1.2 MB' },
      { title: `Modelo de Permissão de Trabalho (PT / APR) - ${course.code}`, type: 'DOCX Editável', size: '850 KB' },
      { title: `Guia de Boas Práticas e Procedimentos Operacionais Padrão (POP)`, type: 'PDF Técnico', size: '2.4 MB' }
    ];

    list.innerHTML = materials.map(att => `
      <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-elevated); padding: 14px; border-radius: var(--radius-md); margin-bottom: 10px; border: 1px solid var(--border-glass);">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 1.5rem;">📁</span>
          <div>
            <strong style="display: block; font-size: 0.9rem; color: var(--text-primary);">${att.title}</strong>
            <small style="color: var(--text-muted);">${att.type} • ${att.size} • Grupo BRASEG</small>
          </div>
        </div>
        <button class="btn btn-sm btn-outline btn-dl-mat" data-title="${att.title}">
          ⬇️ Baixar Modelo
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
      <div style="background: var(--bg-elevated); border: 1px solid var(--border-glass); border-radius: var(--radius-md); padding: 16px; margin-bottom: 14px;">
        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 6px;">
          <strong>👤 ${q.author} (${q.role})</strong>
          <span>${q.date}</span>
        </div>
        <p style="font-size: 0.9rem; color: var(--text-primary); margin-bottom: 12px;">${q.text}</p>

        <div style="background: rgba(0, 46, 90, 0.4); border-left: 3px solid var(--braseg-gold); padding: 10px 14px; border-radius: 4px;">
          <div style="font-size: 0.78rem; font-weight: 700; color: var(--braseg-gold); margin-bottom: 4px;">
            👨‍⚕️ ${q.answeredBy}
          </div>
          <p style="font-size: 0.85rem; color: #cbd5e1;">${q.answer}</p>
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
      this.showToast('Sua dúvida foi enviada para a equipe médica e de engenharia do Grupo BRASEG!');
    };
  }

  renderAboutBrasegView() {
    const container = document.getElementById('docsMountContainer');
    if (!container) return;

    container.innerHTML = `
      <div class="docs-wrapper" style="max-width: 1200px; margin: 30px auto; padding: 0 20px;">
        <!-- Hero Institucional BRASEG -->
        <div style="background: var(--bg-card); backdrop-filter: var(--glass-blur); border: 1px solid var(--border-glass); border-radius: var(--radius-xl); padding: 40px; text-align: center; margin-bottom: 30px; box-shadow: var(--glass-shadow);">
          <img src="assets/images/braseg_logo_white.png" alt="Grupo BRASEG" style="height: 56px; margin-bottom: 16px;">
          <h2 style="font-family: var(--font-heading); font-size: 2.8rem; color: var(--braseg-gold); margin-bottom: 10px;">${BRASEG_INSTITUTIONAL.companyName}</h2>
          <p style="font-size: 1.15rem; color: var(--text-secondary); max-width: 800px; margin: 0 auto 20px;">
            "${BRASEG_INSTITUTIONAL.mission}"
          </p>
          <div style="display: inline-flex; gap: 14px; flex-wrap: wrap; justify-content: center;">
            <a href="${BRASEG_INSTITUTIONAL.whatsappLink}" target="_blank" class="btn btn-whatsapp">
              💬 WhatsApp Comercial: ${BRASEG_INSTITUTIONAL.whatsapp}
            </a>
            <a href="mailto:${BRASEG_INSTITUTIONAL.email}" class="btn btn-outline">
              ✉️ ${BRASEG_INSTITUTIONAL.email}
            </a>
          </div>
        </div>

        <!-- Grid de Especialidades e Responsáveis Técnicos -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; margin-bottom: 30px;">
          <div style="background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--glass-shadow);">
            <h3 style="font-size: 1.3rem; color: var(--braseg-blue); margin-bottom: 12px;">👨‍⚕️ Coordenação Médica PCMSO (NR-07)</h3>
            <p style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary);">${BRASEG_INSTITUTIONAL.technicalDirectors[0].name}</p>
            <p style="font-size: 0.82rem; color: var(--braseg-gold); margin-bottom: 10px;">${BRASEG_INSTITUTIONAL.technicalDirectors[0].credential}</p>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">Elaboração e coordenação de PCMSO, emissão de ASOs (Admissional, Periódico, Demissional), gestão de exames complementares e enquadramento eSocial S-2220.</p>
          </div>

          <div style="background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--glass-shadow);">
            <h3 style="font-size: 1.3rem; color: var(--braseg-blue); margin-bottom: 12px;">👷 Responsabilidade Técnica SST (PGR / NRs)</h3>
            <p style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary);">${BRASEG_INSTITUTIONAL.technicalDirectors[1].name}</p>
            <p style="font-size: 0.82rem; color: var(--braseg-gold); margin-bottom: 10px;">${BRASEG_INSTITUTIONAL.technicalDirectors[1].credential}</p>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">Projetos pedagógicos de treinamentos EAD, laudos de insalubridade e periculosidade (LTCAT), APRs, implementação de GRO/PGR e conformidade eSocial S-2240.</p>
          </div>
        </div>

        <!-- Clientes e Atuação Regional -->
        <div style="background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: var(--radius-lg); padding: 30px; box-shadow: var(--glass-shadow);">
          <h3 style="font-size: 1.4rem; color: var(--text-primary); margin-bottom: 16px;">Grandes Empresas Atendidas pelo Grupo BRASEG</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
            ${BRASEG_INSTITUTIONAL.partners.map(p => `
              <div style="background: var(--bg-elevated); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-glass); text-align: center;">
                <strong style="font-family: var(--font-heading); font-size: 1.5rem; color: var(--braseg-blue); display: block;">${p.logoText}</strong>
                <span style="font-size: 0.85rem; color: var(--text-primary); font-weight: 700; display: block;">${p.name}</span>
                <small style="color: var(--text-muted);">${p.sector}</small>
              </div>
            `).join('')}
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
    this.showToast(`Arquivo "${filename}" baixado com sucesso!`);
  }

  showToast(message) {
    let toast = document.getElementById('appToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'appToast';
      toast.className = 'app-toast';
      toast.style.cssText = 'position: fixed; bottom: 24px; right: 24px; background: rgba(0, 46, 90, 0.95); backdrop-filter: blur(12px); color: #f4c602; border: 1px solid #f4c602; padding: 14px 20px; border-radius: 12px; font-weight: 700; font-size: 0.9rem; z-index: 9999; box-shadow: 0 8px 30px rgba(0,0,0,0.6); opacity: 0; transform: translateY(20px); transition: all 0.3s ease; pointer-events: none;';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
    }, 3500);
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
      osc.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      // Audio context policy
    }
  }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  window.medTrabApp = new App();
});
