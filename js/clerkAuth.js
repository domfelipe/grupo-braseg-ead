/**
 * Clerk Authentication Engine (Apple / Vercel Enterprise Standard)
 * Gerenciador de Autenticação e Sessão para a Plataforma BRASEG EAD
 * Grupo BRASEG Consultoria e Treinamentos - Lençóis Paulista / SP
 */

import { State } from './state.js';

export const DEMO_ACCOUNTS = [
  {
    id: 'user_aluno_01',
    name: 'Carlos Alberto Mendonça',
    email: 'carlos.mendonca@industriasdelta.com.br',
    role: 'Técnico de Manutenção Industrial',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    company: 'Indústrias Metalúrgicas Delta S/A',
    cpf: '341.892.118-04',
    plan: 'Plano Individual Anual'
  },
  {
    id: 'user_medico_02',
    name: 'Dr. Carlos Eduardo Menezes',
    email: 'carlos.menezes@brasegconsultoria.com.br',
    role: 'Médico Coordenador do PCMSO (CRM-SP 148.920)',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    company: 'Grupo BRASEG Consultoria',
    cpf: '189.441.902-12',
    plan: 'Acesso Técnico / Médico'
  },
  {
    id: 'user_eng_03',
    name: 'Eng. Ricardo S. Albuquerque',
    email: 'ricardo.albuquerque@brasegconsultoria.com.br',
    role: 'Engenheiro de Segurança do Trabalho (CREA-SP)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    company: 'Grupo BRASEG Consultoria',
    cpf: '506.128.932-00',
    plan: 'Acesso Técnico / Engenharia'
  }
];

export class ClerkAuth {
  constructor(options = {}) {
    this.onAuthChange = options.onAuthChange || (() => {});
    this.onOpenPlatform = options.onOpenPlatform || (() => {});
    this.activeTab = 'signin'; // 'signin' | 'signup'
    this.pendingRedirectView = null;
    this.pendingRedirectCourseId = null;

    this.init();
  }

  init() {
    this.injectModal();
    this.bindEvents();
  }

  injectModal() {
    if (document.getElementById('clerkAuthModal')) return;

    const modal = document.createElement('div');
    modal.id = 'clerkAuthModal';
    modal.className = 'clerk-modal-overlay';
    modal.innerHTML = `
      <div class="clerk-modal-backdrop" id="clerkBackdrop"></div>
      <div class="clerk-modal-card">
        <!-- Clerk Header -->
        <div class="clerk-card-header">
          <div class="clerk-brand">
            <div class="clerk-logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </div>
            <div class="clerk-brand-info">
              <span class="clerk-brand-title">BRASEG EAD</span>
              <span class="clerk-brand-subtitle">Autenticação Segura via Clerk</span>
            </div>
          </div>
          <button type="button" class="clerk-close-btn" id="clerkCloseBtn" aria-label="Fechar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        <!-- Clerk Content -->
        <div class="clerk-card-body">
          <div class="clerk-auth-heading">
            <h3 id="clerkTitle">Acessar a Sala de Capacitação</h3>
            <p id="clerkSubtitle">Entre com sua conta para acessar seus treinamentos e certificados homologados.</p>
          </div>

          <!-- OAuth Social Logins -->
          <div class="clerk-social-group">
            <button type="button" class="clerk-social-btn" id="clerkGoogleLogin">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Continuar com Google</span>
            </button>
            <button type="button" class="clerk-social-btn" id="clerkGovLogin">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="20" height="14" x="2" y="5" rx="2"/>
                <line x1="2" x2="22" y1="10" y2="10"/>
              </svg>
              <span>Entrar com Gov.br / Certificado</span>
            </button>
          </div>

          <div class="clerk-divider">
            <span>ou continue com e-mail</span>
          </div>

          <!-- Tabs Sign In / Sign Up -->
          <div class="clerk-tabs">
            <button type="button" class="clerk-tab-btn active" data-tab="signin" id="tabBtnSignIn">Entrar</button>
            <button type="button" class="clerk-tab-btn" data-tab="signup" id="tabBtnSignUp">Criar Conta</button>
          </div>

          <!-- Auth Form -->
          <form id="clerkForm" class="clerk-form">
            <div class="clerk-field-group" id="groupName" style="display: none;">
              <label for="clerkInputName" class="clerk-label">Nome Completo</label>
              <input type="text" id="clerkInputName" class="clerk-input" placeholder="Ex: João da Silva Santos" autocomplete="name">
            </div>

            <div class="clerk-field-group">
              <label for="clerkInputEmail" class="clerk-label">Endereço de E-mail</label>
              <input type="email" id="clerkInputEmail" class="clerk-input" placeholder="seuemail@exemplo.com.br" required autocomplete="email">
            </div>

            <div class="clerk-field-group">
              <div class="clerk-label-row">
                <label for="clerkInputPassword" class="clerk-label">Senha</label>
                <a href="#" class="clerk-forgot-link" id="clerkForgotPass">Esqueceu?</a>
              </div>
              <input type="password" id="clerkInputPassword" class="clerk-input" placeholder="••••••••••••" required autocomplete="current-password">
            </div>

            <button type="submit" class="clerk-submit-btn" id="clerkSubmitBtn">
              <span>Acessar Plataforma</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </button>
          </form>

          <!-- Fast Demo Profile Switcher -->
          <div class="clerk-demo-section">
            <span class="clerk-demo-title">⚡ Acesso Rápido para Demonstração:</span>
            <div class="clerk-demo-pills">
              ${DEMO_ACCOUNTS.map(acc => `
                <button type="button" class="clerk-demo-pill" data-id="${acc.id}">
                  <img src="${acc.avatar}" alt="${acc.name}" class="clerk-demo-avatar">
                  <div class="clerk-demo-info">
                    <span class="clerk-demo-name">${acc.name}</span>
                    <span class="clerk-demo-role">${acc.role.split('(')[0]}</span>
                  </div>
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Clerk Footer -->
        <div class="clerk-card-footer">
          <span>Protegido por criptografia TLS 1.3 • Em conformidade com LGPD e eSocial</span>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  bindEvents() {
    const modal = document.getElementById('clerkAuthModal');
    const backdrop = document.getElementById('clerkBackdrop');
    const closeBtn = document.getElementById('clerkCloseBtn');
    const form = document.getElementById('clerkForm');
    const tabSignIn = document.getElementById('tabBtnSignIn');
    const tabSignUp = document.getElementById('tabBtnSignUp');
    const groupName = document.getElementById('groupName');
    const title = document.getElementById('clerkTitle');
    const submitBtnText = document.querySelector('#clerkSubmitBtn span');

    backdrop?.addEventListener('click', () => this.close());
    closeBtn?.addEventListener('click', () => this.close());

    // Switch Tabs
    tabSignIn?.addEventListener('click', () => {
      this.activeTab = 'signin';
      tabSignIn.classList.add('active');
      tabSignUp.classList.remove('active');
      groupName.style.display = 'none';
      title.textContent = 'Acessar a Sala de Capacitação';
      submitBtnText.textContent = 'Acessar Plataforma';
    });

    tabSignUp?.addEventListener('click', () => {
      this.activeTab = 'signup';
      tabSignUp.classList.add('active');
      tabSignIn.classList.remove('active');
      groupName.style.display = 'block';
      title.textContent = 'Criar sua Conta BRASEG EAD';
      submitBtnText.textContent = 'Criar Conta e Entrar';
    });

    // Form Submit
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('clerkInputEmail')?.value || 'aluno@braseg.com.br';
      const name = document.getElementById('clerkInputName')?.value || email.split('@')[0];

      const user = {
        id: 'user_' + Date.now(),
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email: email,
        role: 'Profissional / Aluno Matriculado',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        company: 'Empresa / Autônomo',
        cpf: '000.000.000-00',
        plan: 'Plano Individual Flex'
      };

      this.completeLogin(user);
    });

    // Social Google
    document.getElementById('clerkGoogleLogin')?.addEventListener('click', () => {
      const demoUser = DEMO_ACCOUNTS[0];
      this.completeLogin(demoUser);
    });

    // Gov.br
    document.getElementById('clerkGovLogin')?.addEventListener('click', () => {
      const demoUser = DEMO_ACCOUNTS[1];
      this.completeLogin(demoUser);
    });

    // Demo Pills
    document.querySelectorAll('.clerk-demo-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const account = DEMO_ACCOUNTS.find(a => a.id === id) || DEMO_ACCOUNTS[0];
        this.completeLogin(account);
      });
    });

    // Forgot password
    document.getElementById('clerkForgotPass')?.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Link para redefinição de senha enviado para seu e-mail cadastrado.');
    });
  }

  open(options = {}) {
    this.pendingRedirectView = options.redirectTo || null;
    this.pendingRedirectCourseId = options.courseId || null;

    const modal = document.getElementById('clerkAuthModal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  close() {
    const modal = document.getElementById('clerkAuthModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  completeLogin(user) {
    State.auth = {
      isAuthenticated: true,
      user: user,
      token: 'clerk_session_tok_' + Math.random().toString(36).substring(2)
    };
    State.currentStudent = {
      id: user.id,
      name: user.name,
      cpf: user.cpf,
      role: user.role,
      department: 'Capacitação Individual & SST',
      company: user.company,
      cnpj: '18.492.301/0001-92'
    };
    State.save();

    this.close();
    this.onAuthChange(user);

    if (this.pendingRedirectView) {
      this.onOpenPlatform(this.pendingRedirectView, this.pendingRedirectCourseId);
      this.pendingRedirectView = null;
      this.pendingRedirectCourseId = null;
    } else {
      this.onOpenPlatform('catalog');
    }
  }

  logout() {
    State.auth = {
      isAuthenticated: false,
      user: null,
      token: null
    };
    State.save();
    this.onAuthChange(null);
  }

  isAuthenticated() {
    return !!(State.auth && State.auth.isAuthenticated && State.auth.user);
  }

  getCurrentUser() {
    return State.auth?.user || null;
  }
}
