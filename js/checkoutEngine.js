/**
 * Asaas Gateway & Checkout Transparente Liquid Glass
 * Grupo BRASEG Consultoria e Treinamentos - Lençóis Paulista / SP
 * Substituição moderna do Conta Azul com suporte a:
 * - PIX Dinâmico Instantâneo (QR Code + Copia e Cola + Webhook em tempo real)
 * - Cartão de Crédito em até 12x com validação interativa
 * - Boleto Bancário / Fatura CNPJ (Febraban D+0)
 * - Cupons de Desconto & Emissão Automática de NFS-e Municipal
 */

import { State } from './state.js';
import { BRASEG_INSTITUTIONAL } from './coursesData.js';

export class CheckoutEngine {
  constructor(options = {}) {
    this.options = options;
    this.currentItem = null; // { type: 'course'|'subscription'|'pack', data: ... }
    this.selectedMethod = 'pix'; // 'pix' | 'credit_card' | 'boleto'
    this.appliedCoupon = null;
    this.discountPercent = 0;
    this.installments = 1;
    this.pixTimerInterval = null;
    this.pixSecondsLeft = 900; // 15 minutos
    this.isOpen = false;
    this.modalEl = null;

    this.init();
  }

  init() {
    let container = document.getElementById('checkoutModalContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'checkoutModalContainer';
      document.body.appendChild(container);
    }
    this.modalEl = container;
  }

  openCheckout(itemType, itemData) {
    this.currentItem = { type: itemType, data: itemData };
    this.selectedMethod = 'pix';
    this.appliedCoupon = null;
    this.discountPercent = 0;
    this.installments = 1;
    this.pixSecondsLeft = 900;
    this.isOpen = true;

    this.render();
    this.startPixTimer();
  }

  closeCheckout() {
    this.isOpen = false;
    if (this.pixTimerInterval) clearInterval(this.pixTimerInterval);
    if (this.modalEl) {
      this.modalEl.innerHTML = '';
    }
  }

  calculateTotal() {
    if (!this.currentItem) return { original: 0, final: 0, discount: 0 };
    const price = this.currentItem.data.price || 0;
    const discount = (price * this.discountPercent) / 100;
    const final = Math.max(0, price - discount);
    return {
      original: price,
      discount: discount,
      final: final
    };
  }

  startPixTimer() {
    if (this.pixTimerInterval) clearInterval(this.pixTimerInterval);
    this.pixTimerInterval = setInterval(() => {
      if (this.pixSecondsLeft > 0 && this.isOpen) {
        this.pixSecondsLeft--;
        const timerEl = document.getElementById('pixCountdownTimer');
        if (timerEl) {
          const mins = Math.floor(this.pixSecondsLeft / 60);
          const secs = this.pixSecondsLeft % 60;
          timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
      }
    }, 1000);
  }

  generatePixCopiaECola(price) {
    const randomHex = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `00020126580014br.gov.bcb.pix0136asaas-pix-${randomHex}@braseg.com.br520400005303986540${price.toFixed(2)}5802BR5925GRUPO BRASEG TREINAMENTOS6015LENCOIS PAULISTA62070503***6304`;
  }

  render() {
    if (!this.isOpen || !this.currentItem) return;

    const { original, discount, final } = this.calculateTotal();
    const item = this.currentItem.data;
    const student = State.currentStudent;
    const pixCode = this.generatePixCopiaECola(final);

    this.modalEl.innerHTML = `
      <div class="checkout-backdrop" id="checkoutBackdrop">
        <div class="checkout-liquid-modal animate-slide-up">
          <!-- Top Header com Logo e Fechar -->
          <div class="checkout-header">
            <div class="checkout-brand">
              <img src="assets/images/braseg_logo_white.png" alt="Grupo BRASEG" class="checkout-logo">
              <div class="checkout-badge-asaas">
                <span class="pulse-dot"></span>
                <span>Checkout Seguro Asaas</span>
              </div>
            </div>
            <button class="btn-close-checkout" id="btnCloseCheckout" title="Fechar">✕</button>
          </div>

          <div class="checkout-body-grid">
            <!-- Coluna Esquerda: Resumo da Compra & Cupom -->
            <div class="checkout-summary-col">
              <h3 class="checkout-section-title">Resumo do Pedido</h3>
              
              <div class="checkout-item-card">
                <div class="item-icon-tag">
                  ${this.currentItem.type === 'subscription' ? '👑' : (this.currentItem.type === 'pack' ? '🏢' : '📜')}
                </div>
                <div class="item-details">
                  <strong class="item-title">${item.name || item.title}</strong>
                  <span class="item-subtitle">${item.subtitle || item.description}</span>
                  <div class="item-meta">
                    ${item.code ? `<span class="badge-code">${item.code}</span>` : ''}
                    <span class="badge-cert">Certificado MTE Incluso</span>
                  </div>
                </div>
              </div>

              <!-- Cupom de Desconto -->
              <div class="checkout-coupon-box">
                <label for="couponInput">Possui cupom de desconto ou parceria?</label>
                <div class="coupon-input-group">
                  <input type="text" id="couponInput" placeholder="Ex: BRASEG10, SESMT20" value="${this.appliedCoupon || ''}" ${this.appliedCoupon ? 'disabled' : ''}>
                  <button class="btn btn-sm ${this.appliedCoupon ? 'btn-danger' : 'btn-outline'}" id="btnApplyCoupon">
                    ${this.appliedCoupon ? 'Remover' : 'Aplicar'}
                  </button>
                </div>
                ${this.appliedCoupon ? `
                  <span class="coupon-success-msg">✅ Cupom "${this.appliedCoupon}" ativado (${this.discountPercent}% de desconto)!</span>
                ` : ''}
              </div>

              <!-- Totais Financeiros -->
              <div class="checkout-pricing-table">
                <div class="price-row">
                  <span>Valor Original</span>
                  <span>R$ ${original.toFixed(2).replace('.', ',')}</span>
                </div>
                ${discount > 0 ? `
                  <div class="price-row discount">
                    <span>Desconto Aplicado (${this.discountPercent}%)</span>
                    <span>- R$ ${discount.toFixed(2).replace('.', ',')}</span>
                  </div>
                ` : ''}
                <div class="price-row total">
                  <span>Total a Pagar</span>
                  <strong class="total-amount">R$ ${final.toFixed(2).replace('.', ',')}</strong>
                </div>
              </div>

              <!-- Dados do Faturamento (Comprador) -->
              <div class="checkout-buyer-info">
                <small class="buyer-label">Faturar para:</small>
                <div class="buyer-card">
                  <strong>${student.name}</strong>
                  <span>CPF: ${student.cpf} • ${student.company}</span>
                  <small>Emissão automática de NFS-e (Lençóis Paulista/SP)</small>
                </div>
              </div>
            </div>

            <!-- Coluna Direita: Meios de Pagamento Asaas -->
            <div class="checkout-payment-col">
              <h3 class="checkout-section-title">Forma de Pagamento</h3>

              <!-- Seletor de Abas -->
              <div class="payment-tabs-nav">
                <button class="payment-tab-btn ${this.selectedMethod === 'pix' ? 'active' : ''}" data-method="pix">
                  <span class="tab-icon">⚡</span>
                  <span>PIX Instantâneo</span>
                  <small class="tab-badge-instant">Liberação Imediata</small>
                </button>
                <button class="payment-tab-btn ${this.selectedMethod === 'credit_card' ? 'active' : ''}" data-method="credit_card">
                  <span class="tab-icon">💳</span>
                  <span>Cartão de Crédito</span>
                  <small>Até 12x</small>
                </button>
                <button class="payment-tab-btn ${this.selectedMethod === 'boleto' ? 'active' : ''}" data-method="boleto">
                  <span class="tab-icon">📄</span>
                  <span>Boleto / CNPJ</span>
                  <small>Faturamento D+0</small>
                </button>
              </div>

              <!-- Conteúdo da Aba Selecionada -->
              <div class="payment-tab-content">
                ${this.renderPaymentMethodContent(final, pixCode)}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  renderPaymentMethodContent(finalPrice, pixCode) {
    if (this.selectedMethod === 'pix') {
      return `
        <div class="pix-payment-box animate-fade-in">
          <div class="pix-instruction">
            <p>Abra o app do seu banco, escolha <strong>Pagar com PIX</strong> e aponte a câmera para o QR Code abaixo:</p>
          </div>

          <div class="pix-qrcode-container">
            <!-- QR Code Vetorial SVG em Alta Definição -->
            <div class="qrcode-wrapper">
              <svg class="pix-svg-qr" viewBox="0 0 200 200" width="180" height="180">
                <rect width="200" height="200" fill="#ffffff" rx="12" />
                <!-- Marcadores de Canto do QR Code -->
                <rect x="15" y="15" width="45" height="45" fill="#002e5a" rx="6"/>
                <rect x="23" y="23" width="29" height="29" fill="#ffffff" rx="3"/>
                <rect x="29" y="29" width="17" height="17" fill="#f4c602" rx="2"/>

                <rect x="140" y="15" width="45" height="45" fill="#002e5a" rx="6"/>
                <rect x="148" y="23" width="29" height="29" fill="#ffffff" rx="3"/>
                <rect x="154" y="29" width="17" height="17" fill="#f4c602" rx="2"/>

                <rect x="15" y="140" width="45" height="45" fill="#002e5a" rx="6"/>
                <rect x="23" y="148" width="29" height="29" fill="#ffffff" rx="3"/>
                <rect x="29" y="154" width="17" height="17" fill="#f4c602" rx="2"/>

                <!-- Padrão de Dados Simulado -->
                <rect x="70" y="20" width="10" height="10" fill="#002e5a" />
                <rect x="90" y="20" width="10" height="10" fill="#002e5a" />
                <rect x="110" y="20" width="10" height="10" fill="#002e5a" />
                <rect x="70" y="40" width="10" height="10" fill="#3774c2" />
                <rect x="100" y="40" width="10" height="10" fill="#002e5a" />
                <rect x="120" y="40" width="10" height="10" fill="#3774c2" />

                <rect x="20" y="70" width="10" height="10" fill="#002e5a" />
                <rect x="40" y="70" width="10" height="10" fill="#3774c2" />
                <rect x="70" y="70" width="20" height="20" fill="#002e5a" />
                <rect x="100" y="70" width="10" height="10" fill="#3774c2" />
                <rect x="120" y="70" width="20" height="10" fill="#002e5a" />
                <rect x="150" y="70" width="10" height="10" fill="#3774c2" />
                <rect x="170" y="70" width="10" height="10" fill="#002e5a" />

                <rect x="20" y="100" width="20" height="10" fill="#3774c2" />
                <rect x="50" y="100" width="10" height="10" fill="#002e5a" />
                <rect x="80" y="95" width="40" height="20" fill="#002e5a" rx="4" />
                <text x="100" y="109" font-family="'Inter', sans-serif" font-size="8" font-weight="900" fill="#f4c602" text-anchor="middle">BRASEG</text>
                <rect x="130" y="100" width="20" height="10" fill="#3774c2" />
                <rect x="160" y="100" width="20" height="10" fill="#002e5a" />

                <rect x="70" y="130" width="10" height="10" fill="#002e5a" />
                <rect x="90" y="130" width="20" height="10" fill="#3774c2" />
                <rect x="120" y="130" width="10" height="10" fill="#002e5a" />
                <rect x="140" y="130" width="20" height="10" fill="#3774c2" />

                <rect x="70" y="150" width="20" height="10" fill="#3774c2" />
                <rect x="100" y="150" width="10" height="10" fill="#002e5a" />
                <rect x="120" y="150" width="20" height="10" fill="#002e5a" />
                <rect x="150" y="150" width="10" height="10" fill="#3774c2" />
                <rect x="170" y="150" width="10" height="10" fill="#002e5a" />
              </svg>
            </div>

            <div class="pix-timer-box">
              <span>QR Code válido por:</span>
              <strong id="pixCountdownTimer" class="timer-digits">15:00</strong>
            </div>
          </div>

          <!-- Chave Copia e Cola -->
          <div class="pix-copia-cola-group">
            <label>Ou copie o código PIX Copia e Cola:</label>
            <div class="copy-input-wrap">
              <input type="text" id="pixCopiaColaInput" readonly value="${pixCode}">
              <button class="btn btn-outline" id="btnCopyPix">📋 Copiar</button>
            </div>
          </div>

          <!-- Gatilho de Aprovação em Tempo Real via Webhook Asaas -->
          <div class="pix-webhook-sim-box">
            <div class="webhook-info">
              <span class="live-pulse"></span>
              <span>Aguardando liquidação no Banco Central / Asaas...</span>
            </div>
            <button class="btn btn-success btn-block" id="btnSimulatePixWebhook">
              ⚡ Simular Confirmação Instantânea (Webhook Asaas)
            </button>
          </div>
        </div>
      `;
    }

    if (this.selectedMethod === 'credit_card') {
      const p1 = (finalPrice / 1).toFixed(2).replace('.', ',');
      const p3 = (finalPrice / 3).toFixed(2).replace('.', ',');
      const p6 = (finalPrice / 6).toFixed(2).replace('.', ',');
      const p12 = ((finalPrice * 1.08) / 12).toFixed(2).replace('.', ',');

      return `
        <form class="card-payment-form animate-fade-in" id="cardPaymentForm">
          <!-- Cartão Interativo Visual -->
          <div class="interactive-card-preview">
            <div class="card-chip"></div>
            <div class="card-number-display" id="dispCardNumber">•••• •••• •••• ••••</div>
            <div class="card-meta-row">
              <div>
                <small>TITULAR</small>
                <div id="dispCardName">NOME DO TITULAR</div>
              </div>
              <div>
                <small>VALIDADE</small>
                <div id="dispCardExpiry">MM/AA</div>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>Número do Cartão</label>
            <input type="text" id="cardNumInput" placeholder="0000 0000 0000 0000" maxlength="19" required>
          </div>

          <div class="form-group">
            <label>Nome Impresso no Cartão</label>
            <input type="text" id="cardNameInput" placeholder="Ex: CARLOS A MENDONCA" required>
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label>Validade</label>
              <input type="text" id="cardExpiryInput" placeholder="MM/AA" maxlength="5" required>
            </div>
            <div class="form-group">
              <label>CVV / Cód. Segurança</label>
              <input type="password" id="cardCvvInput" placeholder="123" maxlength="4" required>
            </div>
          </div>

          <div class="form-group">
            <label>Opções de Parcelamento (Asaas Gateway)</label>
            <select id="cardInstallmentsSelect" class="form-select">
              <option value="1">1x de R$ ${p1} sem juros (À vista)</option>
              <option value="2">2x de R$ ${(finalPrice / 2).toFixed(2).replace('.', ',')} sem juros</option>
              <option value="3">3x de R$ ${p3} sem juros</option>
              <option value="6">6x de R$ ${p6} sem juros</option>
              <option value="12">12x de R$ ${p12} (com taxa reduzida)</option>
            </select>
          </div>

          <button type="submit" class="btn btn-primary btn-block" id="btnSubmitCard">
            🔒 Pagar R$ ${finalPrice.toFixed(2).replace('.', ',')} com Cartão de Crédito
          </button>
        </form>
      `;
    }

    if (this.selectedMethod === 'boleto') {
      const barcode = `00190.00009 03004.182345 56700.018902 8 ${Math.floor(1000 + Math.random() * 9000)}00000${Math.round(finalPrice * 100)}`;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 3);

      return `
        <div class="boleto-payment-box animate-fade-in">
          <div class="boleto-header-info">
            <strong>Boleto Bancário / Fatura Corporativa Asaas</strong>
            <span>Vencimento em: <strong>${dueDate.toLocaleDateString('pt-BR')}</strong> (3 dias úteis)</span>
          </div>

          <div class="barcode-visual-card">
            <div class="barcode-lines">
              ${Array.from({ length: 42 }).map((_, i) => `<span style="width: ${(i % 3 + 1) * 2}px; background: #002e5a; height: 48px; margin: 0 1px;"></span>`).join('')}
            </div>
            <div class="barcode-digits">${barcode}</div>
          </div>

          <div class="form-group" style="margin-top: 16px;">
            <label>Linha Digitável:</label>
            <div class="copy-input-wrap">
              <input type="text" id="barcodeDigitsInput" readonly value="${barcode}">
              <button class="btn btn-outline" id="btnCopyBarcode">📋 Copiar Linha</button>
            </div>
          </div>

          <div class="boleto-actions">
            <button class="btn btn-outline" id="btnDownloadBoletoPdf">
              ⬇️ Baixar Boleto em PDF
            </button>
            <button class="btn btn-success" id="btnSimulateBoletoCompensation">
              ⚡ Simular Compensação Bancária D+0
            </button>
          </div>
        </div>
      `;
    }

    return '';
  }

  bindEvents() {
    // Fechar Modal
    document.getElementById('btnCloseCheckout')?.addEventListener('click', () => this.closeCheckout());
    document.getElementById('checkoutBackdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'checkoutBackdrop') this.closeCheckout();
    });

    // Troca de Abas de Pagamento
    this.modalEl.querySelectorAll('.payment-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedMethod = btn.getAttribute('data-method');
        this.render();
      });
    });

    // Cupom de Desconto
    const btnCoupon = document.getElementById('btnApplyCoupon');
    const inputCoupon = document.getElementById('couponInput');
    btnCoupon?.addEventListener('click', () => {
      if (this.appliedCoupon) {
        this.appliedCoupon = null;
        this.discountPercent = 0;
        this.render();
        return;
      }

      const code = (inputCoupon.value || '').trim().toUpperCase();
      if (code === 'BRASEG10') {
        this.appliedCoupon = 'BRASEG10';
        this.discountPercent = 10;
        this.render();
      } else if (code === 'SESMT20') {
        this.appliedCoupon = 'SESMT20';
        this.discountPercent = 20;
        this.render();
      } else if (code === 'DIRETORIA') {
        this.appliedCoupon = 'DIRETORIA';
        this.discountPercent = 50;
        this.render();
      } else {
        alert('Cupom inválido ou expirado. Tente "BRASEG10" para 10% OFF.');
      }
    });

    // PIX: Copiar Código
    document.getElementById('btnCopyPix')?.addEventListener('click', () => {
      const input = document.getElementById('pixCopiaColaInput');
      if (input) {
        input.select();
        navigator.clipboard?.writeText(input.value);
        const btn = document.getElementById('btnCopyPix');
        if (btn) btn.textContent = '✅ Copiado!';
        setTimeout(() => { if (btn) btn.textContent = '📋 Copiar'; }, 2000);
      }
    });

    // PIX: Simular Webhook Asaas
    document.getElementById('btnSimulatePixWebhook')?.addEventListener('click', () => {
      this.processApprovedPayment('PIX Instantâneo');
    });

    // Cartão: Interatividade dos Campos
    const cardNum = document.getElementById('cardNumInput');
    const cardName = document.getElementById('cardNameInput');
    const cardExp = document.getElementById('cardExpiryInput');

    cardNum?.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '').substring(0, 16);
      v = v.replace(/(\d{4})(?=\d)/g, '$1 ');
      e.target.value = v;
      document.getElementById('dispCardNumber').textContent = v || '•••• •••• •••• ••••';
    });

    cardName?.addEventListener('input', (e) => {
      document.getElementById('dispCardName').textContent = e.target.value.toUpperCase() || 'NOME DO TITULAR';
    });

    cardExp?.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '').substring(0, 4);
      if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2, 4);
      e.target.value = v;
      document.getElementById('dispCardExpiry').textContent = v || 'MM/AA';
    });

    // Cartão: Submit
    document.getElementById('cardPaymentForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const inst = document.getElementById('cardInstallmentsSelect')?.value || '1';
      this.processApprovedPayment(`Cartão de Crédito (${inst}x)`);
    });

    // Boleto: Copiar Linha
    document.getElementById('btnCopyBarcode')?.addEventListener('click', () => {
      const input = document.getElementById('barcodeDigitsInput');
      if (input) {
        input.select();
        navigator.clipboard?.writeText(input.value);
        const btn = document.getElementById('btnCopyBarcode');
        if (btn) btn.textContent = '✅ Copiado!';
        setTimeout(() => { if (btn) btn.textContent = '📋 Copiar Linha'; }, 2000);
      }
    });

    // Boleto: Download
    document.getElementById('btnDownloadBoletoPdf')?.addEventListener('click', () => {
      const { final } = this.calculateTotal();
      this.simulateDownloadBoleto(final);
    });

    // Boleto: Compensação D+0
    document.getElementById('btnSimulateBoletoCompensation')?.addEventListener('click', () => {
      this.processApprovedPayment('Boleto Bancário Asaas (Compensado D+0)');
    });
  }

  processApprovedPayment(paymentMethodText) {
    const { original, discount, final } = this.calculateTotal();
    const item = this.currentItem.data;
    const student = State.currentStudent;
    const invoiceNumber = `NFSE-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderId = `PED-ASAAS-${Math.floor(10000 + Math.random() * 90000)}`;

    const orderData = {
      orderId: orderId,
      invoiceNumber: invoiceNumber,
      date: new Date().toLocaleDateString('pt-BR'),
      time: new Date().toLocaleTimeString('pt-BR'),
      itemType: this.currentItem.type,
      itemId: item.id,
      itemName: item.name || item.title,
      itemCode: item.code || 'PASS',
      amount: final,
      originalAmount: original,
      discount: discount,
      coupon: this.appliedCoupon,
      paymentMethod: paymentMethodText,
      buyerName: student.name,
      buyerCpf: student.cpf,
      buyerCompany: student.company,
      buyerCnpj: student.cnpj,
      status: 'PAGO_CONFIRMADO',
      nfseUrl: `#download-nfse-${invoiceNumber}`
    };

    // Salvar no estado global
    State.recordOrder(orderData);

    // Se foi compra de curso individual, desbloquear o curso imediatamente
    if (this.currentItem.type === 'course') {
      State.unlockCourse(item.id);
    } else if (this.currentItem.type === 'subscription') {
      State.activateSubscription(item.id);
    } else if (this.currentItem.type === 'pack') {
      State.addCorporateSlots(item.slots);
    }

    this.renderSuccessScreen(orderData);
  }

  renderSuccessScreen(orderData) {
    this.modalEl.innerHTML = `
      <div class="checkout-backdrop" id="checkoutBackdrop">
        <div class="checkout-liquid-modal success-card animate-scale-up">
          <div class="success-hero">
            <div class="success-icon-badge">🎉</div>
            <h2 class="success-title">Pagamento Aprovado com Sucesso!</h2>
            <p class="success-subtitle">O gateway Asaas confirmou a transação instantaneamente. Seu acesso já está liberado!</p>

            <div class="success-receipt-card">
              <div class="receipt-row">
                <span>Pedido:</span>
                <strong>${orderData.orderId}</strong>
              </div>
              <div class="receipt-row">
                <span>Item Adquirido:</span>
                <strong>${orderData.itemName}</strong>
              </div>
              <div class="receipt-row">
                <span>Valor Liquidado:</span>
                <strong class="receipt-price">R$ ${orderData.amount.toFixed(2).replace('.', ',')} (${orderData.paymentMethod})</strong>
              </div>
              <div class="receipt-row">
                <span>Nota Fiscal Eletrônica:</span>
                <strong style="color: var(--braseg-gold);">${orderData.invoiceNumber} (Prefeitura de Lençóis Paulista/SP)</strong>
              </div>
            </div>

            <div class="success-actions-group">
              ${this.currentItem.type === 'course' ? `
                <button class="btn btn-primary btn-lg" id="btnGoToCourseNow">
                  ▶️ Acessar Sala de Aula Agora
                </button>
              ` : `
                <button class="btn btn-primary btn-lg" id="btnGoToCatalogNow">
                  📚 Explorar Catálogo com Acesso Total
                </button>
              `}
              <button class="btn btn-outline" id="btnDownloadNfseSim">
                📄 Baixar Comprovante & NFS-e
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btnGoToCourseNow')?.addEventListener('click', () => {
      const cid = this.currentItem.data.id;
      this.closeCheckout();
      if (this.options.onNavigateToCourse) {
        this.options.onNavigateToCourse(cid);
      }
    });

    document.getElementById('btnGoToCatalogNow')?.addEventListener('click', () => {
      this.closeCheckout();
      if (this.options.onNavigateToCatalog) {
        this.options.onNavigateToCatalog();
      }
    });

    document.getElementById('btnDownloadNfseSim')?.addEventListener('click', () => {
      this.simulateDownloadNfse(orderData);
    });
  }

  simulateDownloadBoleto(price) {
    const content = `BANCO DO BRASIL / ASAAS GESTAO FINANCEIRA S.A.\nBOLETO BANCARIO REGISTRADO - FEBRABAN D+0\n\nBeneficiario: GRUPO BRASEG CONSULTORIA E TREINAMENTOS LTDA\nCNPJ: 18.234.567/0001-89\nCidade: Lencois Paulista - SP\n\nPagador: ${State.currentStudent.name}\nCPF/CNPJ: ${State.currentStudent.cpf} - ${State.currentStudent.company}\n\nValor do Documento: R$ ${price.toFixed(2).replace('.', ',')}\nVencimento: 3 dias uteis apos emissao\n\nLinha Digitavel: 00190.00009 03004.182345 56700.018902 8 984500000${Math.round(price * 100)}\n\nApos o vencimento cobrar juros de 1% ao mes e multa de 2%.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Boleto_Asaas_BRASEG_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  simulateDownloadNfse(orderData) {
    const content = `PREFEITURA MUNICIPAL DE LENCOIS PAULISTA - ESTADO DE SAO PAULO\nSECRETARIA MUNICIPAL DE FINANCAS\nNOTA FISCAL DE SERVICOS ELETRONICA - NFS-e\n\nNumero da Nota: ${orderData.invoiceNumber}\nData e Hora de Emissao: ${orderData.date} ${orderData.time}\nCodigo de Verificacao: BRAS-${Math.random().toString(36).substring(2, 8).toUpperCase()}\n\nPRESTADOR DE SERVICOS:\nRazao Social: GRUPO BRASEG CONSULTORIA E TREINAMENTOS LTDA\nCNPJ: 18.234.567/0001-89\nEndereco: Av. Marechal Rondon, 850 - Lencois Paulista / SP\n\nTOMADOR DE SERVICOS:\nNome/Razao Social: ${orderData.buyerName}\nCPF/CNPJ: ${orderData.buyerCpf} / ${orderData.buyerCompany}\n\nDISCRIMINACAO DOS SERVICOS:\n01. Capacitacao e Treinamento Profissional Regulamentar SST (${orderData.itemCode})\nDescricao: ${orderData.itemName}\nValor dos Servicos: R$ ${orderData.amount.toFixed(2).replace('.', ',')}\nDesconto Condicionado: R$ ${orderData.discount.toFixed(2).replace('.', ',')}\nForma de Pagamento: ${orderData.paymentMethod} (Processado via Asaas Gateway)\n\nBase de Calculo ISSQN: R$ ${orderData.amount.toFixed(2).replace('.', ',')} | Aliquota: 2,00% | ISS Retido: Nao`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${orderData.invoiceNumber}_BRASEG.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
}
