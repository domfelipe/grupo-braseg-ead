/**
 * BRASEG EAD - Painel SESMT, Faturamento Asaas & Gestão de ASOs (NR-07)
 * Grupo BRASEG Consultoria e Treinamentos - Lençóis Paulista / SP
 */

import { State } from './state.js';
import { COURSES_DATA, B2B_CORPORATE_PACKS, BRASEG_INSTITUTIONAL } from './coursesData.js';

export class DashboardManager {
  constructor(containerId = 'dashboardContainer') {
    this.containerId = containerId;
    this.activeTab = 'matrix'; // matrix | aso | branding | financial | esocial
    this.onStudentSwitched = null;
    this.onEmployeeAddedToast = null;
    this.onBuyPackRequest = null;
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const stats = State.getSESMTStats();
    const students = State.students;
    const currentStudent = State.currentStudent;
    const branding = State.branding;
    const slots = State.corporateSlots;
    const orders = State.orders;

    container.innerHTML = `
      <div class="dashboard-wrapper">
        
        <!-- Header do Painel SESMT -->
        <div class="dashboard-header-card">
          <div>
            <div class="dash-badge">SISTEMA INTEGRADO DE GESTÃO DE CONFORMIDADE SST</div>
            <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary);">
              Portal Corporativo do SESMT & Faturamento
            </h2>
            <p style="font-size: 0.82rem; color: var(--text-secondary);">
              Empresa Contratante: <strong>${currentStudent.company}</strong> • CNPJ: ${currentStudent.cnpj}
            </p>
          </div>

          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <div style="background: var(--bg-surface-2); border: 1px solid var(--border-subtle); padding: 8px 14px; border-radius: var(--radius-sm); font-size: 0.78rem;">
              <span style="color: var(--text-muted);">Saldo de Licenças:</span>
              <strong style="color: var(--color-accent-gold); font-family: var(--font-mono); font-size: 0.95rem; margin-left: 4px;">${slots.available} disponíveis</strong>
            </div>

            <button type="button" class="btn btn-outline btn-sm" id="btnRecarregarLicencasAsaas">
              + Adicionar Licenças (Asaas)
            </button>
          </div>
        </div>

        <!-- KPIs Executivos -->
        <div class="dash-kpi-grid">
          <div class="kpi-card">
            <span class="kpi-title">TOTAL DE COLABORADORES</span>
            <span class="kpi-value">${stats.totalStudents}</span>
            <span class="kpi-sub">Cadastrados no SESMT</span>
          </div>

          <div class="kpi-card">
            <span class="kpi-title">TAXA DE CONFORMIDADE LEGAL</span>
            <span class="kpi-value" style="color: ${stats.complianceRate >= 80 ? 'var(--color-success)' : 'var(--color-accent-gold)'};">${stats.complianceRate}%</span>
            <span class="kpi-sub">Média de NRs Obrigatórias Concluídas</span>
          </div>

          <div class="kpi-card">
            <span class="kpi-title">CERTIFICADOS HOMOLOGADOS</span>
            <span class="kpi-value">${stats.totalCompleted}</span>
            <span class="kpi-sub">Com Assinatura CRM/CREA e QR Code</span>
          </div>

          <div class="kpi-card">
            <span class="kpi-title">HORAS DE TREINAMENTO EAD</span>
            <span class="kpi-value">${stats.totalHours}h</span>
            <span class="kpi-sub">Carga Registrada conforme NR-01</span>
          </div>
        </div>

        <!-- Barra de Abas do Painel -->
        <div class="dash-tabs-bar">
          <button type="button" class="dash-tab-btn ${this.activeTab === 'matrix' ? 'active' : ''}" data-tab="matrix">
            Matriz de Treinamentos (GNR)
          </button>
          <button type="button" class="dash-tab-btn ${this.activeTab === 'aso' ? 'active' : ''}" data-tab="aso">
            Coordenação Médica & ASO (NR-07)
          </button>
          <button type="button" class="dash-tab-btn ${this.activeTab === 'branding' ? 'active' : ''}" data-tab="branding">
            Co-Marcação de Certificados
          </button>
          <button type="button" class="dash-tab-btn ${this.activeTab === 'financial' ? 'active' : ''}" data-tab="financial">
            Faturamento & Notas Fiscais (Asaas)
          </button>
          <button type="button" class="dash-tab-btn ${this.activeTab === 'esocial' ? 'active' : ''}" data-tab="esocial">
            Exportação eSocial (S-2220 / S-2240)
          </button>
        </div>

        <!-- Conteúdo da Aba Selecionada -->
        <div id="dashTabContent">
          ${this.renderActiveTabContent(stats, students, currentStudent, branding, slots, orders)}
        </div>

      </div>
    `;

    this.bindEvents();
  }

  renderActiveTabContent(stats, students, currentStudent, branding, slots, orders) {
    if (this.activeTab === 'matrix') {
      return `
        <div>
          <!-- Seletor de Perfil Ativo -->
          <div style="background: var(--bg-surface-1); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 14px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
            <div>
              <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Simulador de Login de Colaborador:</span>
              <div style="display: flex; gap: 8px; margin-top: 6px; flex-wrap: wrap;">
                ${students.map(s => `
                  <button type="button" class="btn btn-sm ${s.id === currentStudent.id ? 'btn-primary' : 'btn-outline'} btn-switch-student" data-id="${s.id}">
                    ${s.name.split(' ')[0]} (${s.role.split(' ')[0]})
                  </button>
                `).join('')}
              </div>
            </div>

            <button type="button" class="btn btn-outline btn-sm" id="btnOpenAddEmployee">
              + Cadastrar Novo Colaborador
            </button>
          </div>

          <!-- Formulário Novo Colaborador (Oculto por padrão) -->
          <div id="addEmployeeFormContainer" style="display: none; background: var(--bg-surface-2); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 16px; margin-bottom: 16px;">
            <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--text-primary); margin-bottom: 10px;">Adicionar Colaborador ao Quadro do SESMT</h4>
            <form id="formAddEmployee" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
              <div class="form-field">
                <label>Nome Completo:</label>
                <input type="text" id="newEmpName" required placeholder="Ex: Roberto Carlos Silva">
              </div>
              <div class="form-field">
                <label>CPF:</label>
                <input type="text" id="newEmpCpf" required placeholder="000.000.000-00">
              </div>
              <div class="form-field">
                <label>Cargo / Função:</label>
                <input type="text" id="newEmpRole" required placeholder="Ex: Operador de Caldeira">
              </div>
              <div class="form-field">
                <label>Setor / Departamento:</label>
                <input type="text" id="newEmpDept" required placeholder="Ex: Produção Industrial">
              </div>
              <div style="grid-column: 1 / -1; display: flex; gap: 8px; justify-content: flex-end;">
                <button type="button" class="btn btn-outline btn-sm" id="btnCancelAddEmp">Cancelar</button>
                <button type="submit" class="btn btn-primary btn-sm">Salvar Matrícula</button>
              </div>
            </form>
          </div>

          <!-- Tabela de Matriz GNR -->
          <div class="matrix-table-wrapper">
            <table class="matrix-table">
              <thead>
                <tr>
                  <th>Colaborador</th>
                  <th>Cargo / Setor</th>
                  <th>NR-35 (Altura)</th>
                  <th>NR-10 (Elétrica)</th>
                  <th>NR-33 (Esp. Conf.)</th>
                  <th>NR-12 (Máquinas)</th>
                  <th>NR-31 (Agro)</th>
                  <th>NR-06 (EPI)</th>
                  <th>SBV (Socorros)</th>
                </tr>
              </thead>
              <tbody>
                ${students.map(st => `
                  <tr style="${st.id === currentStudent.id ? 'background: rgba(0, 46, 90, 0.25);' : ''}">
                    <td>
                      <strong style="color: var(--text-primary); display: block;">${st.name}</strong>
                      <small style="color: var(--text-muted); font-family: var(--font-mono);">${st.cpf}</small>
                    </td>
                    <td>
                      <span style="color: var(--text-secondary); display: block;">${st.role}</span>
                      <small style="color: var(--text-muted);">${st.department}</small>
                    </td>
                    ${this.renderCourseCell(st, 'nr35')}
                    ${this.renderCourseCell(st, 'nr10')}
                    ${this.renderCourseCell(st, 'nr33')}
                    ${this.renderCourseCell(st, 'nr12')}
                    ${this.renderCourseCell(st, 'nr31')}
                    ${this.renderCourseCell(st, 'nr06')}
                    ${this.renderCourseCell(st, 'socorros')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    if (this.activeTab === 'aso') {
      return `
        <div style="background: var(--bg-surface-1); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; flex-wrap: wrap; gap: 16px;">
            <div>
              <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">
                Coordenação de Medicina Ocupacional (NR-07 / PCMSO)
              </h3>
              <p style="font-size: 0.82rem; color: var(--text-secondary);">
                Responsável Médico: <strong>Dr. Carlos Eduardo Menezes (CRM-SP 148.920 / RQE 72.104)</strong>
              </p>
            </div>
            <button type="button" class="btn btn-outline btn-sm" id="btnAgendarExameAso">
              + Solicitar Agendamento de ASO
            </button>
          </div>

          <div class="matrix-table-wrapper">
            <table class="matrix-table">
              <thead>
                <tr>
                  <th>Colaborador</th>
                  <th>Tipo de ASO</th>
                  <th>Exames Complementares Vinculados</th>
                  <th>Aptidão para NRs</th>
                  <th>Data do Exame</th>
                  <th>Validade</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Carlos Alberto Mendonça</strong><br><small>Técnico de Manutenção</small></td>
                  <td>Periódico</td>
                  <td>Audiometria • ECG • EEG • Glicemia</td>
                  <td><span class="cell-status completed">✓ Apto NR-35 / NR-10</span></td>
                  <td>15/05/2026</td>
                  <td>15/05/2027</td>
                  <td><button class="btn btn-outline btn-sm btn-print-aso" data-name="Carlos Alberto Mendonça">Visualizar ASO</button></td>
                </tr>
                <tr>
                  <td><strong>Mariana Duarte Silveira</strong><br><small>Operadora de Trator</small></td>
                  <td>Periódico</td>
                  <td>Acuidade Visual • Audiometria</td>
                  <td><span class="cell-status completed">✓ Apto NR-31 / NR-12</span></td>
                  <td>10/06/2026</td>
                  <td>10/06/2027</td>
                  <td><button class="btn btn-outline btn-sm btn-print-aso" data-name="Mariana Duarte Silveira">Visualizar ASO</button></td>
                </tr>
                <tr>
                  <td><strong>Fernando Ribeiro dos Santos</strong><br><small>Eletricista de Alta Tensão</small></td>
                  <td>Mudança de Risco</td>
                  <td>ECG • EEG • Avaliação Psicossocial</td>
                  <td><span class="cell-status completed">✓ Apto NR-10 / NR-35</span></td>
                  <td>20/07/2026</td>
                  <td>20/07/2027</td>
                  <td><button class="btn btn-outline btn-sm btn-print-aso" data-name="Fernando Ribeiro dos Santos">Visualizar ASO</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    if (this.activeTab === 'branding') {
      return `
        <div style="background: var(--bg-surface-1); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 24px; max-width: 800px;">
          <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">
            Co-Marcação de Logotipo da Empresa Contratante
          </h3>
          <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 20px;">
            Configure o nome corporativo e o logotipo da sua empresa para serem impressos automaticamente ao lado da marca do Grupo BRASEG em todos os certificados homologados.
          </p>

          <form id="brandingForm">
            <div class="form-field">
              <label>Razão Social da Empresa:</label>
              <input type="text" id="brandCompanyName" value="${branding.companyName}" required>
            </div>

            <div class="form-field">
              <label>CNPJ da Empresa:</label>
              <input type="text" id="brandCnpj" value="${branding.cnpj}" required>
            </div>

            <div class="form-field">
              <label>Texto do Logotipo (Marca d'água):</label>
              <input type="text" id="brandLogoText" value="${branding.logoText}" placeholder="Ex: DELTA S/A">
            </div>

            <div class="form-field">
              <label>Cor de Destaque Primária da Empresa:</label>
              <input type="color" id="brandPrimaryColor" value="${branding.primaryColor}" style="height: 38px; padding: 2px;">
            </div>

            <button type="submit" class="btn btn-primary" style="margin-top: 10px;">
              Salvar Personalização de Marca
            </button>
          </form>
        </div>
      `;
    }

    if (this.activeTab === 'financial') {
      return `
        <div>
          <!-- Pacotes Corporativos -->
          <div style="background: var(--bg-surface-1); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 24px; margin-bottom: 24px;">
            <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">
              Aquisição de Licenças em Lote (Asaas Gateway)
            </h3>
            <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 18px;">
              Contrate pacotes de vagas flexíveis para treinar colaboradores sob demanda, com faturamento direto no CNPJ e emissão de NFS-e.
            </p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
              ${B2B_CORPORATE_PACKS.map(pk => `
                <div style="background: var(--bg-surface-2); border: 1px solid ${pk.popular ? 'var(--color-primary-light)' : 'var(--border-subtle)'}; border-radius: var(--radius-sm); padding: 18px; display: flex; flex-direction: column;">
                  <span style="font-size: 0.7rem; font-weight: 700; color: var(--color-accent-gold); text-transform: uppercase; letter-spacing: 0.5px;">${pk.badge}</span>
                  <strong style="font-size: 1.05rem; color: var(--text-primary); margin: 4px 0 2px;">${pk.name}</strong>
                  <p style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 12px;">${pk.description}</p>
                  <div style="font-family: var(--font-mono); font-size: 1.3rem; font-weight: 700; color: #ffffff; margin-bottom: 14px; margin-top: auto;">
                    R$ ${pk.price.toFixed(2).replace('.', ',')}
                  </div>
                  <button type="button" class="btn ${pk.popular ? 'btn-primary' : 'btn-outline'} btn-sm btn-buy-b2b-pack" data-pack-id="${pk.id}">
                    Contratar Lote (Asaas)
                  </button>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Histórico Financeiro e NFS-e -->
          <div class="orders-table-wrapper">
            <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin-bottom: 12px;">
              Extrato Financeiro & Notas Fiscais Eletrônicas Emitidas
            </h3>
            
            ${orders.length > 0 ? `
              <table class="orders-table">
                <thead>
                  <tr>
                    <th>Identificador</th>
                    <th>Data</th>
                    <th>Discriminação do Serviço</th>
                    <th>Forma de Pagamento</th>
                    <th>Valor</th>
                    <th>NFS-e (Lençóis Paulista)</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  ${orders.map(ord => `
                    <tr>
                      <td style="font-family: var(--font-mono); font-weight: 700; color: var(--text-primary);">${ord.orderId}</td>
                      <td>${ord.date}</td>
                      <td>${ord.title}</td>
                      <td>${ord.method}</td>
                      <td style="font-family: var(--font-mono); font-weight: 700;">R$ ${ord.price.toFixed(2).replace('.', ',')}</td>
                      <td><span class="status-badge-paid">${ord.nfse || 'Emitida'}</span></td>
                      <td>
                        <button type="button" class="btn btn-outline btn-sm btn-download-table-nfse" data-nfse="${ord.nfse}" data-title="${ord.title}" data-price="${ord.price}">
                          ⬇️ NFS-e
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : `
              <div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
                Nenhuma transação registrada nesta sessão. Realize uma compra avulsa ou adquira um lote corporativo via Asaas para visualizar o espelho fiscal aqui.
              </div>
            `}
          </div>
        </div>
      `;
    }

    if (this.activeTab === 'esocial') {
      return `
        <div style="background: var(--bg-surface-1); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 24px;">
          <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">
            Exportação de Eventos SST para o eSocial
          </h3>
          <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 20px;">
            Gere arquivos em formato XML e JSON padronizados conforme os leiautes oficiais dos eventos <strong>S-2220 (Monitoramento da Saúde do Trabalhador)</strong> e <strong>S-2240 (Condições Ambientais do Trabalho)</strong>.
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 20px;">
            <div style="background: var(--bg-surface-2); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 18px;">
              <strong style="font-size: 0.95rem; color: var(--text-primary); display: block; margin-bottom: 4px;">Evento S-2220</strong>
              <p style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 14px;">Monitoramento da Saúde do Trabalhador (ASO Admissional, Periódico, Demissional e Retorno ao Trabalho).</p>
              <button type="button" class="btn btn-outline btn-sm btn-export-xml" data-event="S-2220">
                ⬇️ Exportar Lote XML (S-2220)
              </button>
            </div>

            <div style="background: var(--bg-surface-2); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 18px;">
              <strong style="font-size: 0.95rem; color: var(--text-primary); display: block; margin-bottom: 4px;">Evento S-2240</strong>
              <p style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 14px;">Condições Ambientais do Trabalho - Agentes Nocivos (Físicos, Químicos, Biológicos e NRs).</p>
              <button type="button" class="btn btn-outline btn-sm btn-export-xml" data-event="S-2240">
                ⬇️ Exportar Lote XML (S-2240)
              </button>
            </div>
          </div>
        </div>
      `;
    }
  }

  renderCourseCell(student, courseId) {
    const data = student.courses[courseId];
    if (!data || data.status === 'pending') {
      return '<td class="cell-status pending">—</td>';
    }
    if (data.status === 'in_progress') {
      return `<td class="cell-status in-progress">${data.progress}%</td>`;
    }
    if (data.status === 'completed') {
      return `<td class="cell-status completed">✓ ${data.score}%</td>`;
    }
    return '<td>—</td>';
  }

  bindEvents() {
    // Alternar Abas
    document.querySelectorAll('.dash-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeTab = btn.getAttribute('data-tab');
        this.render();
      });
    });

    // Trocar Aluno Ativo
    document.querySelectorAll('.btn-switch-student').forEach(btn => {
      btn.addEventListener('click', () => {
        const sid = btn.getAttribute('data-id');
        const st = State.students.find(s => s.id === sid);
        if (st) {
          State.currentStudent = st;
          State.save();
          if (this.onStudentSwitched) this.onStudentSwitched(st);
          this.render();
        }
      });
    });

    // Recarregar Licenças Asaas
    document.getElementById('btnRecarregarLicencasAsaas')?.addEventListener('click', () => {
      this.activeTab = 'financial';
      this.render();
    });

    // Comprar Pacote B2B
    document.querySelectorAll('.btn-buy-b2b-pack').forEach(btn => {
      btn.addEventListener('click', () => {
        const packId = btn.getAttribute('data-pack-id');
        const pack = B2B_CORPORATE_PACKS.find(p => p.id === packId);
        if (pack && this.onBuyPackRequest) {
          this.onBuyPackRequest(pack);
        }
      });
    });

    // Toggle Formulário Novo Colaborador
    document.getElementById('btnOpenAddEmployee')?.addEventListener('click', () => {
      const box = document.getElementById('addEmployeeFormContainer');
      if (box) box.style.display = 'block';
    });

    document.getElementById('btnCancelAddEmp')?.addEventListener('click', () => {
      const box = document.getElementById('addEmployeeFormContainer');
      if (box) box.style.display = 'none';
    });

    // Submit Novo Colaborador
    document.getElementById('formAddEmployee')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('newEmpName').value.trim();
      const cpf = document.getElementById('newEmpCpf').value.trim();
      const role = document.getElementById('newEmpRole').value.trim();
      const dept = document.getElementById('newEmpDept').value.trim();

      const newEmp = {
        id: `emp_${Date.now().toString().slice(-4)}`,
        name,
        cpf,
        role,
        department: dept,
        company: State.currentStudent.company,
        cnpj: State.currentStudent.cnpj,
        avatar: 'assets/images/doctor.jpg',
        courses: {
          nr35: { status: 'in_progress', progress: 0 },
          nr10: { status: 'pending', progress: 0 },
          nr33: { status: 'pending', progress: 0 },
          nr12: { status: 'pending', progress: 0 },
          nr06: { status: 'pending', progress: 0 }
        }
      };

      State.students.push(newEmp);
      State.save();
      if (this.onEmployeeAddedToast) this.onEmployeeAddedToast(`Colaborador ${name} matriculado com sucesso no SESMT.`);
      this.render();
    });

    // Salvar Branding
    document.getElementById('brandingForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      State.branding.companyName = document.getElementById('brandCompanyName').value;
      State.branding.cnpj = document.getElementById('brandCnpj').value;
      State.branding.logoText = document.getElementById('brandLogoText').value;
      State.branding.primaryColor = document.getElementById('brandPrimaryColor').value;
      State.save();
      alert('Configurações de co-marcação atualizadas com sucesso.');
      this.render();
    });

    // Visualizar ASO
    document.querySelectorAll('.btn-print-aso').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        alert(`ASO de ${name} emitido pelo Dr. Carlos Eduardo Menezes (CRM-SP 148.920 / RQE 72.104). Documento em conformidade com a NR-07.`);
      });
    });

    // Exportar XML eSocial
    document.querySelectorAll('.btn-export-xml').forEach(btn => {
      btn.addEventListener('click', () => {
        const ev = btn.getAttribute('data-event');
        this.downloadEsocialXml(ev);
      });
    });

    // Download NFS-e da Tabela
    document.querySelectorAll('.btn-download-table-nfse').forEach(btn => {
      btn.addEventListener('click', () => {
        const nfse = btn.getAttribute('data-nfse');
        const title = btn.getAttribute('data-title');
        const price = parseFloat(btn.getAttribute('data-price') || '0');
        this.downloadNfseDirect(nfse, title, price);
      });
    });
  }

  downloadEsocialXml(eventCode) {
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evt${eventCode}/v_S_01_02_00">\n  <evt${eventCode} Id="ID1182345670000002026081812000000001">\n    <ideEvento>\n      <tpAmb>1</tpAmb>\n      <procEmi>1</procEmi>\n      <verProc>BRASEG-EAD-2.0</verProc>\n    </ideEvento>\n    <ideEmpregador>\n      <tpInsc>1</tpInsc>\n      <nrInsc>${State.currentStudent.cnpj.replace(/\\D/g, '')}</nrInsc>\n    </ideEmpregador>\n    <ideVinculo>\n      <cpfTrab>${State.currentStudent.cpf.replace(/\\D/g, '')}</cpfTrab>\n    </ideVinculo>\n    <respRegistro>\n      <medico>\n        <crm>148920</crm>\n        <uf>SP</uf>\n        <nome>Dr. Carlos Eduardo Menezes</nome>\n      </medico>\n      <engSeguranca>\n        <crea>506128932D</crea>\n        <uf>SP</uf>\n        <nome>Eng. Ricardo S. Albuquerque</nome>\n      </engSeguranca>\n    </respRegistro>\n  </evt${eventCode}>\n</eSocial>`;

    const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eSocial_${eventCode}_${State.currentStudent.name.replace(/\\s+/g, '_')}.xml`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  downloadNfseDirect(nfse, title, price) {
    const textContent = `PREFEITURA MUNICIPAL DE LENÇÓIS PAULISTA - SP\nSECRETARIA DE FINANÇAS E TRIBUTAÇÃO\nNOTA FISCAL DE SERVIÇOS ELETRÔNICA - NFS-e\n\nNÚMERO DA NFS-e: ${nfse}\nDATA/HORA DE EMISSÃO: ${new Date().toLocaleString('pt-BR')}\n\nPRESTADOR DE SERVIÇOS:\nRazão Social: ${BRASEG_INSTITUTIONAL.companyName}\nCNPJ: ${BRASEG_INSTITUTIONAL.cnpj}\nEndereço: ${BRASEG_INSTITUTIONAL.address}\n\nTOMADOR DE SERVIÇOS:\nNome/Razão: ${State.currentStudent.company}\nCNPJ: ${State.currentStudent.cnpj}\n\nDISCRIMINAÇÃO DOS SERVIÇOS:\nTreinamento Regulamentar em SST - ${title}\nValor Total: R$ ${price.toFixed(2).replace('.', ',')}\nAlíquota ISSQN: 2.00% (Lençóis Paulista/SP)\n\nConformidade com a NR-01 e eSocial.`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NFSE_${nfse}_BRASEG.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
}
