/**
 * BRASEG EAD - Motor de Checkout Transparente Asaas Gateway
 * Padrão Corporativo B2B / B2C (Stripe / Apple Pay Style)
 * Suporte a PIX com confirmação em tempo real via Webhook, Cartão até 12x, Boleto CNPJ e NFS-e
 */

import { State } from './state.js';
import { BRASEG_INSTITUTIONAL } from './coursesData.js';

export class CheckoutEngine {
  constructor(options = {}) {
    this.containerId = options.containerId || 'checkoutModalContainer';
    this.onNavigateToCourse = options.onNavigateToCourse || null;
    this.onNavigateToCatalog = options.onNavigateToCatalog || null;

    this.currentOrder = null;
    this.selectedMethod = 'pix';
    this.appliedCoupon = null;
    this.pixCountdownSeconds = 900; // 15 minutos
    this.pixTimerInterval = null;
    this.webhookChecking = false;

    this.couponDatabase = {
      'BRASEG10': { type: 'percent', value: 10, label: '10% de Desconto Institucional' },
      'SESMT20': { type: 'percent', value: 20, label: '20% de Desconto Corporativo SESMT' },
      'DIRETORIA': { type: 'percent', value: 50, label: '50% de Desconto Especial Diretoria' }
    };
  }

  openCheckout(itemType, itemData) {
    this.appliedCoupon = null;
    this.selectedMethod = 'pix';
    this.pixCountdownSeconds = 900;
    clearInterval(this.pixTimerInterval);

    let price = 0;
    let title = '';
    let description = '';
    let itemId = '';

    if (itemType === 'course') {
      price = itemData.price || 89.90;
      title = `${itemData.code}: ${itemData.title}`;
      description = `Certificação Regulamentar Homologada • Carga Horária: ${itemData.duration}`;
      itemId = itemData.id;
    } else if (itemType === 'subscription') {
      price = itemData.price || 299.00;
      title = itemData.name;
      description = itemData.description;
      itemId = itemData.id;
    } else if (itemType === 'pack') {
      price = itemData.price || 1890.00;
      title = itemData.name;
      description = `${itemData.slots} Licenças Corporativas Flexíveis com Faturamento CNPJ`;
      itemId = itemData.id;
    }

    this.currentOrder = {
      id: `PED-${Date.now().toString().slice(-6)}`,
      itemType,
      itemId,
      title,
      description,
      originalPrice: price,
      finalPrice: price,
      discount: 0,
      createdAt: new Date().toISOString(),
      student: {
        name: State.currentStudent.name,
        cpf: State.currentStudent.cpf,
        company: State.currentStudent.company,
        cnpj: State.currentStudent.cnpj
      }
    };

    this.renderModal();
    this.startPixCountdown();
  }

  renderModal() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const ord = this.currentOrder;
    const finalPriceFmt = `R$ ${ord.finalPrice.toFixed(2).replace('.', ',')}`;

    container.innerHTML = `
      <div class="checkout-backdrop" id="checkoutBackdrop">
        <div class="checkout-modal-card" id="checkoutCard">
          
          <!-- Cabeçalho do Checkout -->
          <div class="checkout-top-bar">
            <div class="checkout-brand-info">
              <img src="assets/images/braseg_logo_white.png" alt="Grupo BRASEG" class="checkout-logo-img">
              <div class="security-seal">
                <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Ambiente Seguro • Asaas Gateway (BACEN)
              </div>
            </div>
            <button class="btn-close-modal" id="btnCloseCheckout" title="Fechar Checkout">✕</button>
          </div>

          <!-- Grade Principal Dividida (Resumo x Pagamento) -->
          <div class="checkout-split-grid">
            
            <!-- Coluna Esquerda: Resumo do Pedido -->
            <div class="checkout-col-summary">
              <h3 class="checkout-heading">Resumo da Contratação</h3>
              
              <div class="order-item-box">
                <span class="order-item-title">${ord.title}</span>
                <span class="order-item-desc">${ord.description}</span>
              </div>

              <!-- Cupom de Desconto -->
              <div class="coupon-section">
                <label>Cupom Promocional ou Convênio:</label>
                <div class="coupon-input-row">
                  <input type="text" id="checkoutCouponInput" placeholder="Ex: BRASEG10, SESMT20" value="${this.appliedCoupon ? this.appliedCoupon.code : ''}">
                  <button type="button" class="btn btn-outline btn-sm" id="btnApplyCoupon">Aplicar</button>
                </div>
                ${this.appliedCoupon ? `<div style="font-size: 0.72rem; color: #4ade80; margin-top: 4px; font-weight: 600;">✓ ${this.appliedCoupon.label} aplicado com sucesso!</div>` : ''}
              </div>

              <!-- Demonstrativo de Valores -->
              <div class="price-summary-card">
                <div class="summary-row">
                  <span>Valor Original:</span>
                  <span>R$ ${ord.originalPrice.toFixed(2).replace('.', ',')}</span>
                </div>
                ${ord.discount > 0 ? `
                  <div class="summary-row" style="color: #4ade80;">
                    <span>Desconto Aplicado:</span>
                    <span>- R$ ${ord.discount.toFixed(2).replace('.', ',')}</span>
                  </div>
                ` : ''}
                <div class="summary-row total-row">
                  <span>Total a Pagar:</span>
                  <strong>${finalPriceFmt}</strong>
                </div>
              </div>

              <!-- Tomador do Serviço -->
              <div class="buyer-credentials-card">
                <strong>Tomador do Serviço (NFS-e):</strong>
                <span>${ord.student.name}</span>
                <span>CPF: ${ord.student.cpf} • ${ord.student.company}</span>
                <span style="font-size: 0.68rem; color: #64748b; margin-top: 4px; display: block;">Nota Fiscal emitida pela Prefeitura de Lençóis Paulista/SP</span>
              </div>
            </div>

            <!-- Coluna Direita: Métodos de Pagamento Asaas -->
            <div class="checkout-col-payment">
              <h3 class="checkout-heading">Forma de Pagamento</h3>
              
              <!-- Seletor de Métodos -->
              <div class="payment-tabs-selector">
                <button type="button" class="payment-tab-button ${this.selectedMethod === 'pix' ? 'active' : ''}" data-method="pix">
                  PIX Instantâneo
                </button>
                <button type="button" class="payment-tab-button ${this.selectedMethod === 'card' ? 'active' : ''}" data-method="card">
                  Cartão de Crédito
                </button>
                <button type="button" class="payment-tab-button ${this.selectedMethod === 'boleto' ? 'active' : ''}" data-method="boleto">
                  Boleto / Fatura CNPJ
                </button>
              </div>

              <!-- Conteúdo Dinâmico do Método -->
              <div id="paymentMethodContent">
                ${this.renderMethodContent()}
              </div>

            </div>

          </div>

        </div>
      </div>
    `;

    this.bindModalEvents();
  }

  renderMethodContent() {
    const ord = this.currentOrder;
    const finalPriceFmt = `R$ ${ord.finalPrice.toFixed(2).replace('.', ',')}`;

    if (this.selectedMethod === 'pix') {
      const pixCode = `00020126580014br.gov.bcb.pix0136braseg-asaas-${ord.id}-lp-sp5204000053039865405${ord.finalPrice.toFixed(2)}5802BR5925GRUPO BRASEG CONSULTORIA6016LENCOIS PAULISTA62070503***6304`;

      return `
        <div class="pix-render-card">
          <div class="pix-qr-frame">
            <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
              <rect width="140" height="140" fill="white"/>
              <!-- Quadrados de Âncora PIX -->
              <rect x="10" y="10" width="35" height="35" fill="#002e5a"/>
              <rect x="15" y="15" width="25" height="25" fill="white"/>
              <rect x="20" y="20" width="15" height="15" fill="#002e5a"/>
              
              <rect x="95" y="10" width="35" height="35" fill="#002e5a"/>
              <rect x="100" y="15" width="25" height="25" fill="white"/>
              <rect x="105" y="20" width="15" height="15" fill="#002e5a"/>

              <rect x="10" y="95" width="35" height="35" fill="#002e5a"/>
              <rect x="15" y="100" width="25" height="25" fill="white"/>
              <rect x="20" y="105" width="15" height="15" fill="#002e5a"/>

              <!-- Padrão de Bits -->
              <rect x="55" y="15" width="10" height="10" fill="#002e5a"/>
              <rect x="75" y="15" width="10" height="10" fill="#002e5a"/>
              <rect x="55" y="35" width="10" height="10" fill="#002e5a"/>
              <rect x="75" y="35" width="10" height="10" fill="#002e5a"/>
              <rect x="55" y="55" width="30" height="30" fill="#002e5a"/>
              <rect x="62" y="62" width="16" height="16" fill="white"/>
              <rect x="67" y="67" width="6" height="6" fill="#002e5a"/>
              <rect x="15" y="55" width="10" height="25" fill="#002e5a"/>
              <rect x="35" y="65" width="12" height="10" fill="#002e5a"/>
              <rect x="95" y="55" width="10" height="25" fill="#002e5a"/>
              <rect x="115" y="65" width="12" height="10" fill="#002e5a"/>
              <rect x="55" y="95" width="15" height="15" fill="#002e5a"/>
              <rect x="80" y="105" width="15" height="20" fill="#002e5a"/>
              <rect x="105" y="95" width="20" height="10" fill="#002e5a"/>
            </svg>
          </div>

          <div class="pix-timer-indicator">
            QR Code expira em: <strong id="pixTimerDisplay">15:00</strong>
          </div>

          <div class="copy-field-wrap">
            <input type="text" readonly value="${pixCode}" id="pixCopiaColaInput">
            <button type="button" class="btn btn-outline btn-sm" id="btnCopyPix">Copiar Código</button>
          </div>

          <div class="webhook-simulation-block">
            <div class="webhook-status-label">
              <span class="pulse-circle"></span>
              Aguardando confirmação bancária em tempo real...
            </div>
            <button type="button" class="btn btn-success btn-sm btn-block" id="btnSimulateWebhook">
              Simular Confirmação Bancária Asaas
            </button>
          </div>
        </div>
      `;
    }

    if (this.selectedMethod === 'card') {
      const installments = [];
      for (let i = 1; i <= 12; i++) {
        const val = (ord.finalPrice / i).toFixed(2).replace('.', ',');
        installments.push(`<option value="${i}">${i}x de R$ ${val} ${i === 1 ? '(à vista sem juros)' : 'sem juros'}</option>`);
      }

      return `
        <form class="card-form-body" id="cardPaymentForm">
          <div class="form-field">
            <label>Número do Cartão de Crédito:</label>
            <input type="text" id="cardNumberInput" placeholder="0000 0000 0000 0000" maxlength="19" required value="4532 8901 2345 6789">
          </div>

          <div class="form-field">
            <label>Nome Impresso no Cartão:</label>
            <input type="text" id="cardHolderInput" placeholder="NOME DO TITULAR" required value="${ord.student.name.toUpperCase()}">
          </div>

          <div class="form-grid-2">
            <div class="form-field">
              <label>Validade:</label>
              <input type="text" id="cardExpiryInput" placeholder="MM/AA" maxlength="5" required value="08/29">
            </div>
            <div class="form-field">
              <label>Código CVV:</label>
              <input type="password" id="cardCvvInput" placeholder="123" maxlength="4" required value="892">
            </div>
          </div>

          <div class="form-field">
            <label>Condição de Parcelamento:</label>
            <select class="form-select-ctrl" id="cardInstallmentsSelect">
              ${installments.join('')}
            </select>
          </div>

          <button type="submit" class="btn btn-primary btn-block" style="margin-top: 10px;">
            Confirmar Pagamento (${finalPriceFmt})
          </button>
        </form>
      `;
    }

    if (this.selectedMethod === 'boleto') {
      const barcode = `34191.79001 01043.510047 91020.150008 3 981200000${Math.round(ord.finalPrice * 100)}`;

      return `
        <div class="pix-render-card" style="text-align: left;">
          <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 12px;">
            O boleto bancário é registrado diretamente no sistema do Banco Central via Asaas, com vencimento para <strong>3 dias úteis</strong>.
          </div>

          <div class="form-field">
            <label>Linha Digitável Febraban:</label>
            <div class="copy-field-wrap">
              <input type="text" readonly value="${barcode}" id="boletoLineInput">
              <button type="button" class="btn btn-outline btn-sm" id="btnCopyBoleto">Copiar</button>
            </div>
          </div>

          <div style="background: var(--bg-input); padding: 12px; border-radius: var(--radius-xs); border: 1px solid var(--border-subtle); margin-bottom: 14px; text-align: center;">
            <div style="font-family: var(--font-mono); font-size: 0.85rem; letter-spacing: 2px; color: var(--text-primary); font-weight: 700; margin-bottom: 4px;">
              ||| | |||| ||| ||||| || |||||| |||| ||| ||||
            </div>
            <span style="font-size: 0.7rem; color: var(--text-muted);">Banco Asaas S.A. (Código 461) • Beneficiário: Grupo BRASEG</span>
          </div>

          <button type="button" class="btn btn-success btn-block" id="btnSimulateBoletoCompensation">
            Simular Compensação D+0 (Aprovar Pedido)
          </button>
        </div>
      `;
    }
  }

  bindModalEvents() {
    // Fechar Modal
    document.getElementById('btnCloseCheckout')?.addEventListener('click', () => {
      this.closeModal();
    });

    document.getElementById('checkoutBackdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'checkoutBackdrop') this.closeModal();
    });

    // Alternar Método
    document.querySelectorAll('.payment-tab-button').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedMethod = btn.getAttribute('data-method');
        this.renderModal();
      });
    });

    // Cupom
    document.getElementById('btnApplyCoupon')?.addEventListener('click', () => {
      this.applyCoupon();
    });

    // PIX: Copiar
    document.getElementById('btnCopyPix')?.addEventListener('click', () => {
      const input = document.getElementById('pixCopiaColaInput');
      input?.select();
      navigator.clipboard.writeText(input.value);
      alert('Código PIX Copia e Cola copiado com sucesso!');
    });

    // PIX: Simular Webhook
    document.getElementById('btnSimulateWebhook')?.addEventListener('click', () => {
      this.processApprovedPayment('PIX Instantâneo Asaas');
    });

    // Cartão: Submit
    document.getElementById('cardPaymentForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const inst = document.getElementById('cardInstallmentsSelect')?.value || '1';
      this.processApprovedPayment(`Cartão de Crédito (${inst}x)`);
    });

    // Boleto: Copiar & Compensar
    document.getElementById('btnCopyBoleto')?.addEventListener('click', () => {
      const input = document.getElementById('boletoLineInput');
      input?.select();
      navigator.clipboard.writeText(input.value);
      alert('Linha digitável do boleto copiada!');
    });

    document.getElementById('btnSimulateBoletoCompensation')?.addEventListener('click', () => {
      this.processApprovedPayment('Boleto Bancário D+0 (Compensado)');
    });
  }

  applyCoupon() {
    const input = document.getElementById('checkoutCouponInput');
    const code = (input?.value || '').trim().toUpperCase();

    if (!code) return;

    if (this.couponDatabase[code]) {
      const rule = this.couponDatabase[code];
      const disc = (this.currentOrder.originalPrice * rule.value) / 100;
      this.currentOrder.discount = disc;
      this.currentOrder.finalPrice = Math.max(0, this.currentOrder.originalPrice - disc);
      this.appliedCoupon = { code, ...rule };
      this.renderModal();
    } else {
      alert(`O cupom "${code}" não é válido para esta modalidade.`);
    }
  }

  startPixCountdown() {
    clearInterval(this.pixTimerInterval);
    this.pixTimerInterval = setInterval(() => {
      this.pixCountdownSeconds--;
      if (this.pixCountdownSeconds <= 0) {
        clearInterval(this.pixTimerInterval);
      }
      const el = document.getElementById('pixTimerDisplay');
      if (el) {
        const mins = Math.floor(this.pixCountdownSeconds / 60);
        const secs = this.pixCountdownSeconds % 60;
        el.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
    }, 1000);
  }

  processApprovedPayment(methodLabel) {
    clearInterval(this.pixTimerInterval);

    const ord = this.currentOrder;
    const nfseNumber = `NFSE-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const completedOrder = {
      orderId: ord.id,
      itemType: ord.itemType,
      itemId: ord.itemId,
      title: ord.title,
      price: ord.finalPrice,
      method: methodLabel,
      date: new Date().toLocaleDateString('pt-BR'),
      timestamp: new Date().toISOString(),
      nfse: nfseNumber,
      status: 'pago'
    };

    // Atualizar Estado da Aplicação
    State.recordOrder(completedOrder);

    if (ord.itemType === 'course') {
      State.unlockCourse(ord.itemId);
    } else if (ord.itemType === 'subscription') {
      State.activateSubscription(ord.itemId);
    } else if (ord.itemType === 'pack') {
      const slots = ord.itemId === 'pack_10' ? 10 : (ord.itemId === 'pack_50' ? 50 : 100);
      State.addCorporateSlots(slots);
    }

    this.renderSuccessReceipt(completedOrder);
  }

  renderSuccessReceipt(order) {
    const card = document.getElementById('checkoutCard');
    if (!card) return;

    card.innerHTML = `
      <div style="text-align: center; padding: 20px 10px;">
        <div style="display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 56px; background: rgba(22, 163, 74, 0.15); border: 2px solid #16a34a; border-radius: 50%; color: #16a34a; font-size: 1.8rem; margin-bottom: 16px;">
          ✓
        </div>

        <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin-bottom: 6px;">
          Pagamento Aprovado com Sucesso!
        </h2>
        <p style="font-size: 0.85rem; color: var(--text-secondary); max-width: 500px; margin: 0 auto 20px;">
          A transação foi confirmada via <strong>Gateway Asaas</strong> e a matrícula já está devidamente registrada no sistema educacional do Grupo BRASEG.
        </p>

        <!-- Fatura / Comprovante -->
        <div style="background: var(--bg-surface-2); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 16px; max-width: 550px; margin: 0 auto 24px; text-align: left;">
          <div style="display: flex; justify-content: space-between; font-size: 0.75rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px; margin-bottom: 8px;">
            <span>Identificador: <strong>${order.orderId}</strong></span>
            <span>Data: <strong>${order.date}</strong></span>
          </div>

          <div style="font-size: 0.82rem; color: var(--text-primary); margin-bottom: 4px;">
            Item: <strong>${order.title}</strong>
          </div>
          <div style="font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 8px;">
            Forma: ${order.method} • Valor Pago: <strong>R$ ${order.price.toFixed(2).replace('.', ',')}</strong>
          </div>

          <div style="background: rgba(0, 46, 90, 0.35); border: 1px solid var(--border-medium); padding: 10px; border-radius: var(--radius-xs); font-size: 0.72rem; color: #cbd5e1;">
            <strong>Nota Fiscal Eletrônica de Serviços (NFS-e):</strong><br>
            Nº ${order.nfse} • Prefeitura Municipal de Lençóis Paulista/SP<br>
            Prestador: ${BRASEG_INSTITUTIONAL.companyName} (CNPJ ${BRASEG_INSTITUTIONAL.cnpj})
          </div>
        </div>

        <!-- Ações Pós-Compra -->
        <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
          <button type="button" class="btn btn-outline" id="btnDownloadReceiptNfse">
            ⬇️ Baixar Espelho da NFS-e
          </button>
          
          <button type="button" class="btn btn-primary" id="btnProceedToCourse">
            ${order.itemType === 'course' ? 'Acessar Sala de Treinamento →' : 'Ir para o Catálogo / Painel →'}
          </button>
        </div>
      </div>
    `;

    document.getElementById('btnDownloadReceiptNfse')?.addEventListener('click', () => {
      this.downloadNfseFile(order);
    });

    document.getElementById('btnProceedToCourse')?.addEventListener('click', () => {
      this.closeModal();
      if (order.itemType === 'course' && this.onNavigateToCourse) {
        this.onNavigateToCourse(order.itemId);
      } else if (this.onNavigateToCatalog) {
        this.onNavigateToCatalog();
      }
    });
  }

  downloadNfseFile(order) {
    const textContent = `PREFEITURA MUNICIPAL DE LENÇÓIS PAULISTA - SP\nSECRETARIA DE FINANÇAS E TRIBUTAÇÃO\nNOTA FISCAL DE SERVIÇOS ELETRÔNICA - NFS-e\n\nNÚMERO DA NFS-e: ${order.nfse}\nDATA/HORA DE EMISSÃO: ${new Date().toLocaleString('pt-BR')}\nCÓDIGO DE VERIFICAÇÃO: BRASEG-LP-${order.orderId}\n\nPRESTADOR DE SERVIÇOS:\nRazão Social: ${BRASEG_INSTITUTIONAL.companyName}\nCNPJ: ${BRASEG_INSTITUTIONAL.cnpj}\nEndereço: ${BRASEG_INSTITUTIONAL.address}\n\nTOMADOR DE SERVIÇOS:\nNome/Razão: ${State.currentStudent.name}\nCPF/CNPJ: ${State.currentStudent.cpf}\nEmpresa Vinculada: ${State.currentStudent.company}\n\nDISCRIMINAÇÃO DOS SERVIÇOS:\nCódigo do Serviço: 08.02 - Instrução, treinamento, orientação pedagógica e avaliação em SST (NRs).\nDescrição: Treinamento Regulamentar EAD - ${order.title}\nValor Total dos Serviços: R$ ${order.price.toFixed(2).replace('.', ',')}\nBase de Cálculo ISSQN: R$ ${order.price.toFixed(2).replace('.', ',')}\nAlíquota: 2.00%\nValor do ISSQN: R$ ${(order.price * 0.02).toFixed(2).replace('.', ',')}\n\nConformidade com a NR-01 (Portaria MTP nº 6.730/2020) e eSocial S-2220/2240.`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NFSE_${order.nfse}_BRASEG.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  closeModal() {
    clearInterval(this.pixTimerInterval);
    const container = document.getElementById(this.containerId);
    if (container) container.innerHTML = '';
  }
}
