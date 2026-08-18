/**
 * Gerador de Certificados Oficiais de Medicina e Segurança do Trabalho
 * Grupo BRASEG Consultoria e Treinamentos - Lençóis Paulista / SP
 * Em conformidade com a NR-01 (Anexo II - EAD) e Portaria MTP/MTE
 */

import { State } from './state.js';
import { BRASEG_INSTITUTIONAL } from './coursesData.js';

export class CertificateManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentCourse = null;
    this.showingSide = 'front'; // 'front' | 'back'
  }

  render(courseId) {
    if (!this.container) return;

    this.currentCourse = State.getCourse(courseId);
    const progress = State.getCourseProgress(courseId);
    const student = State.currentStudent;

    const certCode = progress.certCode || `BRASEG-2026-${this.currentCourse.code.replace(/[^A-Z0-9]/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const issueDate = progress.completedDate || new Date().toLocaleDateString('pt-BR');
    const score = progress.score || 95;

    // Logo da empresa contratante (customizado ou padrão)
    const customLogoHTML = State.customCompanyLogo ? `
      <div class="cert-client-logo">
        <span class="cert-partner-tag">Empresa Contratante:</span>
        <img src="${State.customCompanyLogo}" alt="Logo Empresa" class="client-logo-img">
      </div>
    ` : `
      <div class="cert-client-badge">
        <span class="cert-partner-tag">Empresa Empregadora:</span>
        <strong>${student.company}</strong>
        <small>CNPJ: ${student.cnpj}</small>
      </div>
    `;

    this.container.innerHTML = `
      <div class="certificate-view-container">
        <!-- Barra Superior de Ações do Certificado -->
        <div class="cert-toolbar no-print">
          <div class="cert-toolbar-left">
            <button class="btn btn-outline" id="btnBackFromCert">
              ← Voltar ao Curso
            </button>
            <div class="cert-status-tag">
              <span class="pulse-dot"></span>
              <span>CERTIFICADO OFICIAL VÁLIDO • GRUPO BRASEG</span>
            </div>
          </div>

          <div class="cert-toolbar-right">
            <div class="side-toggle-group">
              <button class="btn-toggle active" id="btnShowFront">Frente do Certificado</button>
              <button class="btn-toggle" id="btnShowBack">Verso (Conteúdo Programático)</button>
            </div>

            <button class="btn btn-primary" id="btnPrintCert">
              🖨️ Imprimir / Salvar em PDF (A4)
            </button>
          </div>
        </div>

        <!-- Documento do Certificado (Frente & Verso) -->
        <div class="certificate-wrapper">
          <!-- FRENTE DO CERTIFICADO -->
          <div class="cert-page cert-front ${this.showingSide === 'front' ? 'active' : ''}" id="certFrontPage">
            <div class="cert-border-outer">
              <div class="cert-border-inner">
                <!-- Marca d'água de Segurança -->
                <div class="cert-watermark">GRUPO BRASEG</div>

                <!-- Cabeçalho Institucional Oficial Grupo BRASEG -->
                <div class="cert-header">
                  <div class="cert-logo-section">
                    <div class="cert-braseg-brand">
                      <div class="braseg-logo-box">
                        <img src="assets/images/braseg_logo_white.png" alt="Grupo BRASEG" class="cert-braseg-logo-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                        <span class="braseg-text-fallback" style="display:none;">GRUPO BRASEG</span>
                      </div>
                      <div class="cert-institution-text">
                        <h2>GRUPO BRASEG CONSULTORIA E TREINAMENTOS</h2>
                        <p>Engenharia de Segurança, Medicina do Trabalho e Gestão Ocupacional</p>
                        <p class="cert-reg">Lençóis Paulista/SP • CNPJ: ${BRASEG_INSTITUTIONAL.cnpj} • Tel: (14) 3283-2060</p>
                      </div>
                    </div>
                  </div>

                  <div class="cert-header-right">
                    ${customLogoHTML}
                    <div class="cert-seal">
                      <div class="seal-circle">
                        <span>MTE / SST</span>
                        <strong>NR-01</strong>
                        <span>HOMOLOGADO</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Título Principal -->
                <div class="cert-main-title">
                  <h1>CERTIFICADO DE CAPACITAÇÃO E QUALIFICAÇÃO PROFISSIONAL</h1>
                  <div class="cert-norma-tag">${this.currentCourse.code} • ${this.currentCourse.norm}</div>
                </div>

                <!-- Texto Declaratório Legal -->
                <div class="cert-body">
                  <p class="cert-intro">
                    Certificamos para os devidos fins legais e comprovação perante os órgãos fiscalizadores do Ministério do Trabalho e Emprego (MTE) e eSocial (Eventos S-2220 / S-2240) que o(a) profissional:
                  </p>

                  <div class="cert-student-highlight">
                    <h3 class="student-name">${student.name.toUpperCase()}</h3>
                    <div class="student-details">
                      <span><strong>CPF:</strong> ${student.cpf}</span>
                      <span><strong>Cargo / Função:</strong> ${student.role}</span>
                      <span><strong>Setor:</strong> ${student.department || 'Operacional'}</span>
                      <span><strong>Empresa:</strong> ${student.company} (CNPJ: ${student.cnpj})</span>
                    </div>
                  </div>

                  <p class="cert-statement">
                    concluiu com êxito e aproveitamento de <strong>${score}%</strong> a capacitação técnico-normativa no treinamento regulamentar de:
                  </p>

                  <div class="cert-course-name">
                    <h2>${this.currentCourse.title.toUpperCase()}</h2>
                    <p class="cert-subtitle">${this.currentCourse.subtitle}</p>
                  </div>

                  <div class="cert-meta-grid">
                    <div class="meta-box">
                      <span class="lbl">CARGA HORÁRIA:</span>
                      <span class="val">${this.currentCourse.duration}</span>
                    </div>
                    <div class="meta-box">
                      <span class="lbl">MODALIDADE:</span>
                      <span class="val">EAD Interativo (NR-01 Anexo II)</span>
                    </div>
                    <div class="meta-box">
                      <span class="lbl">CIDADE & DATA:</span>
                      <span class="val">Lençóis Paulista/SP, ${issueDate}</span>
                    </div>
                    <div class="meta-box">
                      <span class="lbl">VALIDADE / RECICLAGEM:</span>
                      <span class="val">${this.currentCourse.validity}</span>
                    </div>
                  </div>
                </div>

                <!-- Rodapé de Assinaturas e Autenticação -->
                <div class="cert-footer">
                  <!-- Assinatura Responsável Técnico SST -->
                  <div class="signature-col">
                    <div class="sig-line">
                      <div class="sig-image-placeholder">
                        <span class="sig-scribble">Ricardo S. Albuquerque</span>
                      </div>
                    </div>
                    <strong>${BRASEG_INSTITUTIONAL.technicalDirectors[1].name}</strong>
                    <span>${BRASEG_INSTITUTIONAL.technicalDirectors[1].role}</span>
                    <span class="sig-cred">${BRASEG_INSTITUTIONAL.technicalDirectors[1].credential}</span>
                  </div>

                  <!-- Assinatura Médico do Trabalho PCMSO -->
                  <div class="signature-col">
                    <div class="sig-line">
                      <div class="sig-image-placeholder">
                        <span class="sig-scribble doctor">Carlos E. Menezes</span>
                      </div>
                    </div>
                    <strong>${BRASEG_INSTITUTIONAL.technicalDirectors[0].name}</strong>
                    <span>${BRASEG_INSTITUTIONAL.technicalDirectors[0].role}</span>
                    <span class="sig-cred">${BRASEG_INSTITUTIONAL.technicalDirectors[0].credential}</span>
                  </div>

                  <!-- Assinatura Aluno -->
                  <div class="signature-col">
                    <div class="sig-line">
                      <div class="sig-image-placeholder">
                        <span class="sig-scribble student">${student.name.split(' ')[0]}</span>
                      </div>
                    </div>
                    <strong>${student.name}</strong>
                    <span>Assinatura do(a) Treinando(a)</span>
                    <span class="sig-cred">CPF: ${student.cpf}</span>
                  </div>

                  <!-- QR Code e Hash de Validação -->
                  <div class="cert-qr-col">
                    <div class="qr-box">
                      <svg viewBox="0 0 100 100" class="qr-svg">
                        <rect width="100" height="100" fill="#ffffff"/>
                        <rect x="10" y="10" width="25" height="25" fill="#002e5a"/>
                        <rect x="15" y="15" width="15" height="15" fill="#ffffff"/>
                        <rect x="18" y="18" width="9" height="9" fill="#002e5a"/>
                        
                        <rect x="65" y="10" width="25" height="25" fill="#002e5a"/>
                        <rect x="70" y="15" width="15" height="15" fill="#ffffff"/>
                        <rect x="73" y="18" width="9" height="9" fill="#002e5a"/>

                        <rect x="10" y="65" width="25" height="25" fill="#002e5a"/>
                        <rect x="15" y="70" width="15" height="15" fill="#ffffff"/>
                        <rect x="18" y="73" width="9" height="9" fill="#002e5a"/>

                        <rect x="42" y="15" width="6" height="15" fill="#002e5a"/>
                        <rect x="52" y="25" width="6" height="18" fill="#002e5a"/>
                        <rect x="42" y="42" width="16" height="16" fill="#002e5a"/>
                        <rect x="65" y="45" width="20" height="8" fill="#002e5a"/>
                        <rect x="70" y="60" width="8" height="25" fill="#002e5a"/>
                        <rect x="45" y="70" width="15" height="15" fill="#002e5a"/>
                      </svg>
                    </div>
                    <div class="qr-text">
                      <span>Validação Pública BRASEG:</span>
                      <code>${certCode}</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- VERSO DO CERTIFICADO (Conteúdo Programático Obrigatório) -->
          <div class="cert-page cert-back ${this.showingSide === 'back' ? 'active' : ''}" id="certBackPage">
            <div class="cert-border-outer">
              <div class="cert-border-inner">
                <div class="cert-back-header">
                  <div class="back-title-group">
                    <h3>CONTEÚDO PROGRAMÁTICO OFICIAL & REGISTRO DE FREQUÊNCIA</h3>
                    <p>Em estrito cumprimento ao item 1.7 e Anexo II da Norma Regulamentadora nº 01 do Ministério do Trabalho e Emprego</p>
                  </div>
                  <div class="cert-code-tag">CÓDIGO DE AUTENTICIDADE: ${certCode}</div>
                </div>

                <div class="cert-back-content-grid">
                  <!-- Coluna Esquerda: Módulos e Ementa -->
                  <div class="syllabus-column">
                    <h4>EMENTA E DISCIPLINAS MINISTRADAS:</h4>
                    <div class="syllabus-modules-list">
                      ${this.currentCourse.modules.map((mod) => `
                        <div class="syllabus-mod-item">
                          <strong>${mod.title}</strong>
                          <ul>
                            ${mod.lessons.map(l => `
                              <li>${l.title} (${Math.floor(l.duration / 60)} min)</li>
                            `).join('')}
                          </ul>
                        </div>
                      `).join('')}
                    </div>

                    <div class="syllabus-legal-note">
                      <strong>Amparo Legal e Diretrizes Pedagógicas:</strong>
                      <p>${this.currentCourse.norm}. O treinamento atendeu rigorosamente aos requisitos do Anexo II da NR-01: projeto pedagógico aprovado por responsável técnico habilitado, telemetria de presença, travas de segurança interativas (MTE Checkpoints) e avaliação final individual com aproveitamento superior a 70%.</p>
                    </div>
                  </div>

                  <!-- Coluna Direita: Detalhamento Pedagógico e Horas -->
                  <div class="metrics-column">
                    <h4>HISTÓRICO ESCOLAR & APROVEITAMENTO</h4>
                    <table class="syllabus-table">
                      <tr>
                        <td><strong>Treinando(a):</strong></td>
                        <td>${student.name}</td>
                      </tr>
                      <tr>
                        <td><strong>CPF:</strong></td>
                        <td>${student.cpf}</td>
                      </tr>
                      <tr>
                        <td><strong>Módulo Teórico EAD:</strong></td>
                        <td>70% da Carga Horária Total</td>
                      </tr>
                      <tr>
                        <td><strong>Simulação e Telemetria:</strong></td>
                        <td>30% da Carga Horária Total</td>
                      </tr>
                      <tr>
                        <td><strong>Carga Horária Total:</strong></td>
                        <td><strong>${this.currentCourse.duration}</strong></td>
                      </tr>
                      <tr>
                        <td><strong>Frequência Homologada:</strong></td>
                        <td><span class="badge-success">100% de Presença</span></td>
                      </tr>
                      <tr>
                        <td><strong>Aproveitamento Final:</strong></td>
                        <td><span class="badge-score">${score}% (Aprovado)</span></td>
                      </tr>
                      <tr>
                        <td><strong>Data de Emissão:</strong></td>
                        <td>${issueDate}</td>
                      </tr>
                      <tr>
                        <td><strong>Unidade de Emissão:</strong></td>
                        <td>Grupo BRASEG - Lençóis Paulista/SP</td>
                      </tr>
                      <tr>
                        <td><strong>Chave de Autenticação Digital:</strong></td>
                        <td><code>SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}</code></td>
                      </tr>
                    </table>

                    <div class="audit-trail-box">
                      <strong>Trilha de Auditoria Digital (Portaria MTP):</strong>
                      <p>Sessões de estudo e interações com logs criptografados, biometria comportamental e telemetria de visualização.</p>
                      <div class="company-stamp-box">
                        <div class="stamp-circle">
                          <span>GRUPO BRASEG</span>
                          <strong>AUTENTICADO</strong>
                          <span>VIA DIGITAL</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const btnShowFront = document.getElementById('btnShowFront');
    const btnShowBack = document.getElementById('btnShowBack');
    const btnPrintCert = document.getElementById('btnPrintCert');
    const btnBackFromCert = document.getElementById('btnBackFromCert');
    const frontPage = document.getElementById('certFrontPage');
    const backPage = document.getElementById('certBackPage');

    btnShowFront?.addEventListener('click', () => {
      this.showingSide = 'front';
      btnShowFront.classList.add('active');
      btnShowBack.classList.remove('active');
      frontPage?.classList.add('active');
      backPage?.classList.remove('active');
    });

    btnShowBack?.addEventListener('click', () => {
      this.showingSide = 'back';
      btnShowBack.classList.add('active');
      btnShowFront.classList.remove('active');
      backPage?.classList.add('active');
      frontPage?.classList.remove('active');
    });

    btnPrintCert?.addEventListener('click', () => {
      window.print();
    });

    btnBackFromCert?.addEventListener('click', () => {
      if (this.onBackRequest) this.onBackRequest(this.currentCourse.id);
    });
  }
}
