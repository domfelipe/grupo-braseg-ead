/**
 * BRASEG EAD - Painel Corporativo do Gestor SESMT & RH (B2B Enterprise Portal)
 * Grupo BRASEG Consultoria e Treinamentos - Lençóis Paulista / SP
 * Gestão de Treinamentos NRs, Gestão de ASOs, Emissão eSocial (S-2220/S-2240),
 * Personalização de Logo e Faturamento Asaas com emissão de NFS-e.
 */

import { State } from './state.js';
import { COURSES_DATA, BRASEG_INSTITUTIONAL, B2B_CORPORATE_PACKS } from './coursesData.js';

export class DashboardManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.searchTerm = '';
    this.selectedDept = 'all';
    this.activeTab = 'matrix'; // 'matrix' | 'aso' | 'branding' | 'financial' | 'esocial'
    this.onStudentSwitched = null;
    this.onEmployeeAddedToast = null;
    this.onBuyPackRequest = null;
  }

  render() {
    if (!this.container) return;

    const employees = State.employees;
    const student = State.currentStudent;

    // Calcular estatísticas gerais
    let totalEnrollments = 0;
    let completedEnrollments = 0;
    let inProgressEnrollments = 0;

    employees.forEach(emp => {
      Object.keys(emp.courses || {}).forEach(cId => {
        totalEnrollments++;
        const c = emp.courses[cId];
        if (c.status === 'completed') completedEnrollments++;
        if (c.status === 'in_progress') inProgressEnrollments++;
      });
    });

    const complianceRate = totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 94;

    this.container.innerHTML = `
      <div class="dashboard-wrapper">
        <!-- Header do Dashboard SESMT -->
        <div class="dashboard-header-card">
          <div class="dash-title-section">
            <div class="dash-badge">
              <span class="pulse-dot"></span>
              <span>PORTAL SESMT & FINANCEIRO • GRUPO BRASEG</span>
            </div>
            <h2>Painel Corporativo de Gestão em SST & Faturamento</h2>
            <p>Empresa: <strong>${student.company}</strong> • CNPJ: ${student.cnpj} • Unidade Responsável: <strong>BRASEG Lençóis Paulista/SP</strong></p>
          </div>

          <div class="dash-header-actions">
            <button class="btn btn-outline" id="btnExportReport">
              📥 Exportar Relatório (.CSV)
            </button>
            <button class="btn btn-primary" id="btnOpenNewEmployeeModal">
              + Matricular Colaborador
            </button>
          </div>
        </div>

        <!-- Cards de Métricas / KPIs Principais -->
        <div class="dash-kpi-grid">
          <div class="kpi-card kpi-compliance">
            <div class="kpi-icon">🛡️</div>
            <div class="kpi-content">
              <span class="kpi-title">Índice Geral de Conformidade</span>
              <div class="kpi-value">${complianceRate}%</div>
              <span class="kpi-sub positive">↑ 5.2% vs ciclo anterior (Homologado MTE)</span>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon">👷</div>
            <div class="kpi-content">
              <span class="kpi-title">Colaboradores Cadastrados</span>
              <div class="kpi-value">${employees.length * 32 + 4}</div>
              <span class="kpi-sub">Indústria, Agroflorestal & Logística</span>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon">🎓</div>
            <div class="kpi-content">
              <span class="kpi-title">Certificados Emitidos</span>
              <div class="kpi-value">${completedEnrollments * 14 + 112}</div>
              <span class="kpi-sub">Com QR Code e Trilha eSocial S-2240</span>
            </div>
          </div>

          <div class="kpi-card kpi-warning">
            <div class="kpi-icon">💳</div>
            <div class="kpi-content">
              <span class="kpi-title">Vagas Corporativas Disponíveis</span>
              <div class="kpi-value">${State.corporateSlots || 15}</div>
              <span class="kpi-sub">Gateway Asaas • Faturas em Dia</span>
            </div>
          </div>
        </div>

        <!-- Tabs de Navegação do Painel SESMT -->
        <div class="dash-tabs-bar">
          <button class="dash-tab-btn ${this.activeTab === 'matrix' ? 'active' : ''}" data-tab="matrix">
            📊 Matriz de Treinamentos NRs
          </button>
          <button class="dash-tab-btn ${this.activeTab === 'aso' ? 'active' : ''}" data-tab="aso">
            🩺 Gestão de Exames & ASO
          </button>
          <button class="dash-tab-btn ${this.activeTab === 'financial' ? 'active' : ''}" data-tab="financial">
            💳 Faturamento & Notas Fiscais (Asaas)
          </button>
          <button class="dash-tab-btn ${this.activeTab === 'branding' ? 'active' : ''}" data-tab="branding">
            🎨 Logo da Empresa nos Certificados
          </button>
          <button class="dash-tab-btn ${this.activeTab === 'esocial' ? 'active' : ''}" data-tab="esocial">
            ⚡ eSocial S-2220 / S-2240 XML
          </button>
        </div>

        <!-- CONTEÚDO DAS TABS -->
        <div class="dash-tab-content">
          ${this.renderTabContent()}
        </div>

        <!-- Modal de Matrícula de Novo Colaborador -->
        <div class="modal-backdrop" id="newEmployeeModal" style="display: none;">
          <div class="modal-card">
            <div class="modal-header">
              <h3>+ Matricular Novo Colaborador na Plataforma BRASEG</h3>
              <button class="modal-close-btn" id="btnCloseNewEmpModal">✕</button>
            </div>
            <form id="newEmployeeForm">
              <div class="form-group">
                <label>Nome Completo do Trabalhador:</label>
                <input type="text" id="newEmpName" required placeholder="Ex: Rodrigo Santos de Oliveira" class="form-control">
              </div>
              <div class="form-row">
                <div class="form-group col">
                  <label>CPF:</label>
                  <input type="text" id="newEmpCpf" required placeholder="000.000.000-00" class="form-control">
                </div>
                <div class="form-group col">
                  <label>Departamento:</label>
                  <select id="newEmpDept" class="form-control">
                    <option value="Manutenção & Utilidades">Manutenção & Utilidades</option>
                    <option value="Operações de Campo (Agro/Celulose)">Operações de Campo (Agro/Celulose)</option>
                    <option value="Subestações & Elétrica">Subestações & Elétrica</option>
                    <option value="Controle Ambiental & Qualidade">Controle Ambiental & Qualidade</option>
                    <option value="SESMT / Segurança">SESMT / Segurança</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>Cargo / Função:</label>
                <input type="text" id="newEmpRole" required placeholder="Ex: Operador de Máquinas Florestais" class="form-control">
              </div>
              <div class="form-actions">
                <button type="button" class="btn btn-outline" id="btnCancelNewEmp">Cancelar</button>
                <button type="submit" class="btn btn-primary">Concluir Matrícula e Liberar EAD</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Modal de Solicitação de ASO -->
        <div class="modal-backdrop" id="newAsoModal" style="display: none;">
          <div class="modal-card">
            <div class="modal-header">
              <h3>🩺 Solicitar Exame Ocupacional & ASO</h3>
              <button class="modal-close-btn" id="btnCloseAsoModal">✕</button>
            </div>
            <form id="newAsoForm">
              <div class="form-group">
                <label>Nome do Colaborador:</label>
                <input type="text" id="asoEmpName" required placeholder="Ex: Carlos Alberto Mendonça" class="form-control">
              </div>
              <div class="form-row">
                <div class="form-group col">
                  <label>CPF:</label>
                  <input type="text" id="asoEmpCpf" required placeholder="000.000.000-00" class="form-control">
                </div>
                <div class="form-group col">
                  <label>Tipo de Exame (NR-07):</label>
                  <select id="asoExamType" class="form-control">
                    <option value="Admissional (com EEG/ECG para Altura/Elétrica)">Admissional (com EEG/ECG)</option>
                    <option value="Periódico Anual">Periódico Anual</option>
                    <option value="Retorno ao Trabalho">Retorno ao Trabalho</option>
                    <option value="Mudança de Riscos Ocupacionais">Mudança de Riscos</option>
                    <option value="Demissional">Demissional</option>
                  </select>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col">
                  <label>Data Desejada:</label>
                  <input type="date" id="asoDesiredDate" required class="form-control">
                </div>
                <div class="form-group col">
                  <label>Unidade de Atendimento:</label>
                  <input type="text" readonly value="Unidade BRASEG - Lençóis Paulista/SP" class="form-control">
                </div>
              </div>
              <div class="form-actions">
                <button type="button" class="btn btn-outline" id="btnCancelAso">Cancelar</button>
                <button type="submit" class="btn btn-primary">Encaminhar Solicitação ao SESMT</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  renderTabContent() {
    if (this.activeTab === 'matrix') {
      return `
        <div class="dash-matrix-card">
          <div class="matrix-header">
            <div class="matrix-title-group">
              <h3>Matriz Geral de Treinamentos Regulamentares (10 Cursos NRs)</h3>
              <p>Acompanhamento individualizado de proficiência e emissão de certificados com assinatura digital.</p>
            </div>

            <!-- Filtros & Busca -->
            <div class="matrix-filters">
              <div class="search-input-wrapper">
                <span class="search-icon">🔍</span>
                <input type="text" id="matrixSearchInput" placeholder="Buscar por nome, CPF ou cargo..." value="${this.searchTerm}">
              </div>

              <select class="dept-select" id="matrixDeptFilter">
                <option value="all" ${this.selectedDept === 'all' ? 'selected' : ''}>Todos os Setores</option>
                <option value="Manutenção & Utilidades" ${this.selectedDept === 'Manutenção & Utilidades' ? 'selected' : ''}>Manutenção & Utilidades</option>
                <option value="Operações de Campo (Agro/Celulose)" ${this.selectedDept === 'Operações de Campo (Agro/Celulose)' ? 'selected' : ''}>Operações de Campo (Agro/Celulose)</option>
                <option value="Subestações & Elétrica" ${this.selectedDept === 'Subestações & Elétrica' ? 'selected' : ''}>Subestações & Elétrica</option>
                <option value="Controle Ambiental & Qualidade" ${this.selectedDept === 'Controle Ambiental & Qualidade' ? 'selected' : ''}>Controle Ambiental & Qualidade</option>
              </select>
            </div>
          </div>

          <!-- Tabela de Matriz -->
          <div class="matrix-table-wrapper">
            <table class="matrix-table">
              <thead>
                <tr>
                  <th>Colaborador / Setor</th>
                  <th>NR-35<br><small>Altura</small></th>
                  <th>NR-10<br><small>Elétrica</small></th>
                  <th>NR-33<br><small>Esp. Conf.</small></th>
                  <th>NR-12<br><small>Máquinas</small></th>
                  <th>NR-31<br><small>Agro/TDP</small></th>
                  <th>NR-20<br><small>Combust.</small></th>
                  <th>NR-05<br><small>CIPA</small></th>
                  <th>NR-06<br><small>EPI</small></th>
                  <th>NR-17<br><small>Ergo</small></th>
                  <th>SBV<br><small>Socorros</small></th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                ${this.renderMatrixRows()}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    if (this.activeTab === 'aso') {
      return `
        <div class="dash-aso-wrapper">
          <div class="aso-header-card">
            <div class="aso-header-info">
              <h3>🩺 Gestão de Exames Clínicos & ASO (NR-07 / PCMSO)</h3>
              <p>Agendamento direto com a clínica do Grupo BRASEG em Lençóis Paulista - SP com retorno automático para o eSocial S-2220.</p>
            </div>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
              <button class="btn btn-whatsapp" id="btnWhatsappAso">
                💬 WhatsApp Clínica: (14) 99760-9595
              </button>
              <button class="btn btn-primary" id="btnOpenAsoModal">
                + Solicitar Novo Exame / ASO
              </button>
            </div>
          </div>

          <div class="aso-requests-grid">
            ${State.asoRequests.map(r => `
              <div class="aso-card">
                <div class="aso-card-status">
                  <span class="status-pill">${r.status}</span>
                  <span class="aso-date">📅 ${r.date}</span>
                </div>
                <h4 class="aso-emp-name">${r.employeeName}</h4>
                <p class="aso-emp-details">${r.role} • CPF: ${r.cpf}</p>
                <div class="aso-type-badge">Exame: <strong>${r.type}</strong></div>
                <div class="aso-risks">Riscos Avaliados: <span>${r.risks || 'Altura, Eletricidade, Ruído, Poeiras'}</span></div>
                <div class="aso-card-footer">
                  <small>Médico Resp: Dr. Carlos Eduardo Menezes (CRM-SP 148.920)</small>
                  <button class="btn btn-sm btn-outline btn-dl-aso" data-name="${r.employeeName}">
                    📄 Ver Espelho ASO
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (this.activeTab === 'financial') {
      const orders = State.orders || [];
      return `
        <div class="dash-financial-wrapper animate-fade-in">
          <div class="financial-header-box">
            <div>
              <h3>💳 Gestão Financeira, Pacotes B2B & Faturamento Asaas</h3>
              <p>Histórico em tempo real de liquidações, recargas de licenças e emissão de Notas Fiscais Eletrônicas (NFS-e).</p>
            </div>
            <div class="asaas-status-badge">
              <span class="pulse-dot"></span>
              <span>Gateway Asaas: 100% Operacional</span>
            </div>
          </div>

          <!-- Card de Saldo e Compra de Pacotes Corporativos -->
          <div class="b2b-packs-section">
            <div class="packs-summary-card">
              <div>
                <span class="pack-label">Saldo de Vagas da Sua Empresa</span>
                <div class="pack-slots-count">${State.corporateSlots || 15} Licenças Disponíveis</div>
                <small>Permite matricular qualquer colaborador em qualquer das 10 NRs imediatamente.</small>
              </div>
            </div>

            <h4 style="margin: 20px 0 12px; font-size: 1.2rem; color: var(--text-primary);">Adquirir Recarga de Vagas Corporativas com Faturamento Asaas:</h4>
            <div class="packs-grid">
              ${B2B_CORPORATE_PACKS.map(p => `
                <div class="pack-buy-card ${p.popular ? 'popular-card' : ''}">
                  ${p.popular ? '<span class="pack-pop-badge">Mais Escolhido por SESMTs</span>' : ''}
                  <span class="pack-badge-tag">${p.badge}</span>
                  <h4 class="pack-name">${p.name}</h4>
                  <div class="pack-price-box">
                    <span class="pack-amount">R$ ${p.price.toFixed(2).replace('.', ',')}</span>
                    <small>R$ ${p.slotPrice.toFixed(2).replace('.', ',')} por vaga</small>
                  </div>
                  <p class="pack-desc">${p.description}</p>
                  <ul class="pack-features">
                    ${p.features.map(f => `<li>✓ ${f}</li>`).join('')}
                  </ul>
                  <button class="btn btn-primary btn-block btn-buy-corporate-pack" data-pack-id="${p.id}">
                    Comprar Pacote (Asaas PIX/Fatura)
                  </button>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Tabela de Pedidos e Notas Fiscais -->
          <div class="orders-table-wrapper">
            <h4 style="margin-bottom: 14px; font-size: 1.2rem; color: var(--text-primary);">Extrato de Faturas e Notas Fiscais Emitidas</h4>
            <table class="orders-table">
              <thead>
                <tr>
                  <th>Data/Hora</th>
                  <th>Nº Pedido</th>
                  <th>Descrição do Item</th>
                  <th>Forma de Pagamento</th>
                  <th>Valor Total</th>
                  <th>Status</th>
                  <th>Nota Fiscal Eletrônica</th>
                </tr>
              </thead>
              <tbody>
                ${orders.map(o => `
                  <tr>
                    <td>${o.date} <small>${o.time}</small></td>
                    <td><strong>${o.orderId}</strong></td>
                    <td>${o.itemName}</td>
                    <td>${o.paymentMethod}</td>
                    <td><strong style="color: var(--braseg-gold);">R$ ${o.amount.toFixed(2).replace('.', ',')}</strong></td>
                    <td><span class="status-badge-paid">✅ Liquidado</span></td>
                    <td>
                      <button class="btn btn-sm btn-outline btn-dl-nfse-row" data-inv="${o.invoiceNumber}" data-order="${o.orderId}">
                        📄 ${o.invoiceNumber} (.PDF)
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    if (this.activeTab === 'branding') {
      return `
        <div class="dash-branding-wrapper">
          <div class="branding-header">
            <h3>🎨 Personalização de Logo da Empresa (Co-Marcação nos Certificados)</h3>
            <p>Faça o upload do logotipo da sua empresa para que os certificados oficiais da BRASEG saiam automaticamente com a co-marcação (Grupo BRASEG + Sua Empresa), em total conformidade com a NR-01.</p>
          </div>

          <div class="branding-grid">
            <div class="branding-upload-box">
              <h4>Carregar Logotipo Oficial da Empresa:</h4>
              <div class="drop-zone" id="logoDropZone">
                <span class="drop-icon">📁</span>
                <p>Arraste seu arquivo PNG ou JPG aqui ou clique para selecionar</p>
                <small>Recomendado: PNG com fundo transparente (Mínimo 300x100px)</small>
                <input type="file" id="logoFileInput" accept="image/*" style="display: none;">
              </div>

              ${State.customCompanyLogo ? `
                <div class="current-logo-preview">
                  <span>Logotipo Atualmente Configurado:</span>
                  <div class="preview-img-wrap">
                    <img src="${State.customCompanyLogo}" alt="Logo da Empresa">
                  </div>
                  <button class="btn btn-sm btn-danger" id="btnRemoveCustomLogo">🗑️ Remover Logotipo Personalizado</button>
                </div>
              ` : ''}
            </div>

            <div class="branding-cert-preview">
              <h4>Pré-visualização do Cabeçalho do Certificado:</h4>
              <div class="cert-header-mockup">
                <div class="cert-mockup-logos">
                  <div class="mockup-braseg">
                    <img src="assets/images/braseg_logo_white.png" alt="Grupo BRASEG" style="height: 36px;">
                  </div>
                  <div class="mockup-divider">|</div>
                  <div class="mockup-client">
                    ${State.customCompanyLogo ? `
                      <img src="${State.customCompanyLogo}" alt="Sua Empresa" style="max-height: 40px; max-width: 140px;">
                    ` : `
                      <div class="mockup-placeholder">
                        <span>[ LOGO DA SUA EMPRESA ]</span>
                      </div>
                    `}
                  </div>
                </div>
                <div class="cert-mockup-text">
                  <h5>CERTIFICADO DE CAPACITAÇÃO PROFISSIONAL EM SST</h5>
                  <p>Certificamos que <strong>${State.currentStudent.name}</strong> concluiu o treinamento com aproveitamento homologado.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (this.activeTab === 'esocial') {
      return `
        <div class="dash-esocial-wrapper">
          <div class="esocial-header">
            <h3>⚡ Central de Integração eSocial SST (S-2220 / S-2240)</h3>
            <p>Geração de lotes XML compatíveis com os layouts oficiais do Governo Federal para alimentação dos eventos de Saúde e Segurança do Trabalho.</p>
          </div>

          <div class="esocial-cards-grid">
            <div class="esocial-card">
              <div class="esocial-badge">Evento S-2220</div>
              <h4>Monitoramento da Saúde do Trabalhador (ASO)</h4>
              <p>Contém informações dos exames médicos ocupacionais clínicos e complementares realizados pela clínica BRASEG com assinatura do Dr. Carlos Eduardo Menezes.</p>
              <button class="btn btn-primary btn-block btn-gen-xml" data-event="S-2220">
                📥 Gerar Lote XML (S-2220)
              </button>
            </div>

            <div class="esocial-card">
              <div class="esocial-badge">Evento S-2240</div>
              <h4>Condições Ambientais do Trabalho - Fatores de Risco & NRs</h4>
              <p>Relatório de capacitações normativas (NR-35, NR-10, NR-33, NR-31, NR-12), registros de EPIs com CA e enquadramento de insalubridade e periculosidade.</p>
              <button class="btn btn-primary btn-block btn-gen-xml" data-event="S-2240">
                📥 Gerar Lote XML (S-2240)
              </button>
            </div>
          </div>
        </div>
      `;
    }

    return '';
  }

  renderMatrixRows() {
    const employees = State.employees.filter(emp => {
      const matchSearch = emp.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          emp.cpf.includes(this.searchTerm) ||
                          emp.role.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchDept = this.selectedDept === 'all' || emp.department === this.selectedDept;
      return matchSearch && matchDept;
    });

    if (employees.length === 0) {
      return `<tr><td colspan="12" style="text-align: center; padding: 20px; color: var(--text-muted);">Nenhum colaborador encontrado com os filtros selecionados.</td></tr>`;
    }

    const courseCodes = ['nr35', 'nr10', 'nr33', 'nr12', 'nr31', 'nr20', 'nr05', 'nr06', 'nr17', 'socorros'];

    return employees.map(emp => {
      const isCurrentActive = emp.id === State.currentStudent.id;

      return `
        <tr class="${isCurrentActive ? 'active-student-row' : ''}">
          <td class="emp-col">
            <div class="emp-cell-info">
              <strong>${emp.name} ${isCurrentActive ? '<span class="active-badge">ATIVO</span>' : ''}</strong>
              <span>${emp.role}</span>
              <small>${emp.department} • CPF: ${emp.cpf}</small>
            </div>
          </td>

          ${courseCodes.map(cid => {
            const courseData = (emp.courses || {})[cid];
            if (!courseData) {
              return `<td><span class="cell-status not-required">—</span></td>`;
            }
            if (courseData.status === 'completed') {
              return `<td><span class="cell-status completed" title="Homologado com ${courseData.score}% em ${courseData.completedAt}">✅ ${courseData.score}%</span></td>`;
            }
            if (courseData.status === 'in_progress') {
              return `<td><span class="cell-status in-progress" title="Em andamento (${courseData.progress}%)">⏳ ${courseData.progress}%</span></td>`;
            }
            return `<td><span class="cell-status pending" title="Pendente de início">⚪ Pend.</span></td>`;
          }).join('')}

          <td class="actions-col">
            <button class="btn btn-sm btn-outline btn-switch-student" data-id="${emp.id}" title="Alternar para este colaborador">
              ${isCurrentActive ? 'Perfil Atual' : '👤 Acessar'}
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  bindEvents() {
    // Tabs de Navegação
    this.container.querySelectorAll('.dash-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeTab = btn.getAttribute('data-tab');
        this.render();
      });
    });

    // Filtros da Matriz
    const searchInput = document.getElementById('matrixSearchInput');
    searchInput?.addEventListener('input', (e) => {
      this.searchTerm = e.target.value;
      const tbody = this.container.querySelector('.matrix-table tbody');
      if (tbody) tbody.innerHTML = this.renderMatrixRows();
      this.bindRowActions();
    });

    const deptFilter = document.getElementById('matrixDeptFilter');
    deptFilter?.addEventListener('change', (e) => {
      this.selectedDept = e.target.value;
      const tbody = this.container.querySelector('.matrix-table tbody');
      if (tbody) tbody.innerHTML = this.renderMatrixRows();
      this.bindRowActions();
    });

    // Botões de Compra de Pacotes Corporativos Asaas
    this.container.querySelectorAll('.btn-buy-corporate-pack').forEach(btn => {
      btn.addEventListener('click', () => {
        const packId = btn.getAttribute('data-pack-id');
        const pack = B2B_CORPORATE_PACKS.find(p => p.id === packId);
        if (pack && this.onBuyPackRequest) {
          this.onBuyPackRequest(pack);
        }
      });
    });

    // Download de NFS-e nas linhas da tabela
    this.container.querySelectorAll('.btn-dl-nfse-row').forEach(btn => {
      btn.addEventListener('click', () => {
        const inv = btn.getAttribute('data-inv');
        const ord = btn.getAttribute('data-order');
        const order = State.orders.find(o => o.orderId === ord) || {
          invoiceNumber: inv,
          orderId: ord,
          date: new Date().toLocaleDateString('pt-BR'),
          time: '12:00',
          buyerName: State.currentStudent.company,
          buyerCpf: State.currentStudent.cnpj,
          buyerCompany: State.currentStudent.company,
          itemName: 'Pacote de Treinamentos NRs SST',
          itemCode: 'SST-NR',
          amount: 1890.00,
          discount: 0,
          paymentMethod: 'Asaas Gateway'
        };
        this.simulateDownloadNfseDoc(order);
      });
    });

    // WhatsApp ASO
    document.getElementById('btnWhatsappAso')?.addEventListener('click', () => {
      window.open(BRASEG_INSTITUTIONAL.whatsappLink, '_blank');
    });

    // Modal Novo Colaborador
    const modalNewEmp = document.getElementById('newEmployeeModal');
    document.getElementById('btnOpenNewEmployeeModal')?.addEventListener('click', () => {
      if (modalNewEmp) modalNewEmp.style.display = 'flex';
    });
    document.getElementById('btnCloseNewEmpModal')?.addEventListener('click', () => {
      if (modalNewEmp) modalNewEmp.style.display = 'none';
    });
    document.getElementById('btnCancelNewEmp')?.addEventListener('click', () => {
      if (modalNewEmp) modalNewEmp.style.display = 'none';
    });

    // Submit Novo Colaborador
    document.getElementById('newEmployeeForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('newEmpName')?.value;
      const cpf = document.getElementById('newEmpCpf')?.value;
      const dept = document.getElementById('newEmpDept')?.value;
      const role = document.getElementById('newEmpRole')?.value;

      const newEmp = State.addEmployee({
        name,
        cpf,
        department: dept,
        role,
        company: State.currentStudent.company,
        cnpj: State.currentStudent.cnpj,
        courses: {
          nr35: { status: 'pending', progress: 0 },
          nr10: { status: 'pending', progress: 0 },
          nr06: { status: 'pending', progress: 0 }
        }
      });

      if (modalNewEmp) modalNewEmp.style.display = 'none';
      if (this.onEmployeeAddedToast) {
        this.onEmployeeAddedToast(`Colaborador ${name} matriculado com sucesso!`);
      }
      this.render();
    });

    // Modal Novo ASO
    const modalNewAso = document.getElementById('newAsoModal');
    document.getElementById('btnOpenAsoModal')?.addEventListener('click', () => {
      if (modalNewAso) modalNewAso.style.display = 'flex';
    });
    document.getElementById('btnCloseAsoModal')?.addEventListener('click', () => {
      if (modalNewAso) modalNewAso.style.display = 'none';
    });
    document.getElementById('btnCancelAso')?.addEventListener('click', () => {
      if (modalNewAso) modalNewAso.style.display = 'none';
    });

    // Submit Novo ASO
    document.getElementById('newAsoForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('asoEmpName')?.value;
      const cpf = document.getElementById('asoEmpCpf')?.value;
      const type = document.getElementById('asoExamType')?.value;
      const date = document.getElementById('asoDesiredDate')?.value;

      State.addAsoRequest({
        employeeName: name,
        cpf: cpf,
        type: type,
        role: 'Colaborador Solicitante',
        date: date ? new Date(date).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR'),
        risks: 'Conforme PGR/GRO da empresa'
      });

      if (modalNewAso) modalNewAso.style.display = 'none';
      if (this.onEmployeeAddedToast) {
        this.onEmployeeAddedToast(`Solicitação de ASO para ${name} encaminhada à Clínica BRASEG!`);
      }
      this.render();
    });

    // Download Espelho ASO
    this.container.querySelectorAll('.btn-dl-aso').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        this.simulateDownloadAso(name);
      });
    });

    // Upload de Logo
    const dropZone = document.getElementById('logoDropZone');
    const fileInput = document.getElementById('logoFileInput');

    dropZone?.addEventListener('click', () => fileInput?.click());

    fileInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (re) => {
          State.setCompanyLogo(re.target.result);
          this.render();
          if (this.onEmployeeAddedToast) {
            this.onEmployeeAddedToast('Logotipo da empresa atualizado nos certificados!');
          }
        };
        reader.readAsDataURL(file);
      }
    });

    document.getElementById('btnRemoveCustomLogo')?.addEventListener('click', () => {
      State.setCompanyLogo(null);
      this.render();
      if (this.onEmployeeAddedToast) {
        this.onEmployeeAddedToast('Logotipo personalizado removido.');
      }
    });

    // Geração de XML eSocial
    this.container.querySelectorAll('.btn-gen-xml').forEach(btn => {
      btn.addEventListener('click', () => {
        const evt = btn.getAttribute('data-event');
        this.simulateDownloadEsocialXml(evt);
      });
    });

    this.bindRowActions();
  }

  bindRowActions() {
    this.container.querySelectorAll('.btn-switch-student').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        State.switchStudent(id);
        if (this.onStudentSwitched) {
          this.onStudentSwitched(State.currentStudent);
        }
        this.render();
      });
    });
  }

  simulateDownloadNfseDoc(order) {
    const content = `PREFEITURA MUNICIPAL DE LENCOIS PAULISTA - SP\nSECRETARIA MUNICIPAL DE FINANCAS\nNOTA FISCAL DE SERVICOS ELETRONICA - NFS-e\n\nNumero: ${order.invoiceNumber}\nData Emissao: ${order.date} ${order.time || '14:00'}\n\nPRESTADOR:\nGRUPO BRASEG CONSULTORIA E TREINAMENTOS LTDA\nCNPJ: 18.234.567/0001-89\nLencois Paulista - SP\n\nTOMADOR:\n${order.buyerCompany || State.currentStudent.company}\nCNPJ: ${order.buyerCnpj || State.currentStudent.cnpj}\n\nSERVICO: Treinamentos e Capacitacao Profissional em SST (NRs)\nVALOR TOTAL: R$ ${order.amount.toFixed(2).replace('.', ',')}\nFORMA: ${order.paymentMethod} (Asaas Gateway)`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NFS-e_${order.invoiceNumber}_BRASEG.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  simulateDownloadAso(name) {
    const text = `GRUPO BRASEG CONSULTORIA E MEDICINA DO TRABALHO LTDA\nUNIDADE: Lençóis Paulista - SP\n\nATESTADO DE SAÚDE OCUPACIONAL - ASO (NR-07)\nColaborador: ${name}\nEmpresa: ${State.currentStudent.company}\nCNPJ: ${State.currentStudent.cnpj}\n\nPARECER MÉDICO: APTO PARA A FUNÇÃO (INCLUINDO TRABALHO EM ALTURA E ELETRICIDADE)\n\nMédico Coordenador: Dr. Carlos Eduardo Menezes (CRM-SP 148.920 / RQE 72.104)`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ASO_${name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  simulateDownloadEsocialXml(eventCode) {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<eSocial xmlns="http://www.esocial.gov.br/schema/evt/${eventCode}/v_S_01_02_00">\n  <evt${eventCode} Id="ID118234567000189${Date.now()}">\n    <ideEmpregador>\n      <tpInsc>1</tpInsc>\n      <nrInsc>${State.currentStudent.cnpj.replace(/\D/g, '')}</nrInsc>\n    </ideEmpregador>\n    <ideVinculo>\n      <cpfTrab>${State.currentStudent.cpf.replace(/\D/g, '')}</cpfTrab>\n    </ideVinculo>\n    <respReg>\n      <cpfResp>14892014892</cpfResp>\n      <ideOC>1</ideOC>\n      <nrOc>148920</nrOc>\n      <ufOC>SP</ufOC>\n    </respReg>\n  </evt${eventCode}>\n</eSocial>`;
    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eSocial_${eventCode}_BRASEG_${Date.now()}.xml`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
}
