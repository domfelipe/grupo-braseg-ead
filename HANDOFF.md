# 📋 PROMPT DE HANDOFF PARA OUTRA LLM / DESENVOLVEDOR
**Projeto:** Grupo BRASEG EAD — Plataforma de Capacitação em Segurança do Trabalho (NRs)  
**ID da Sessão Original (Antigravity):** `1f4ec55f-189c-4e1a-ba33-af5b1e856985`  
**Repositório GitHub:** [https://github.com/domfelipe/grupo-braseg-ead](https://github.com/domfelipe/grupo-braseg-ead)  
**Ambiente Local:** `http://localhost:8080/` (Servidor: `python3 -m http.server 8080`)

---

## 🎯 1. Visão Geral do Projeto e Contexto do Cliente

O projeto é a plataforma oficial de **EAD e Treinamentos Regulamentares (Normas Regulamentadoras - NRs)** para o **Grupo BRASEG Consultoria e Treinamentos** (Sede em Lençóis Paulista / SP).

### 🏛️ Diretrizes Institucionais e Jurídicas:
- **Amparo Legal:** Portaria MTP nº 6.730/2020 (Anexo II da NR-01) com validade jurídica em 100% do território nacional.
- **eSocial:** Conformidade total com os eventos **S-2220** (Monitoramento da Saúde do Trabalhador / ASO) e **S-2240** (Condições Ambientais do Trabalho / Agentes Nocivos).
- **Responsáveis Técnicos Homologados:**
  - **Coordenação Médica (PCMSO):** Dr. Carlos Eduardo Menezes (Médico do Trabalho — CRM-SP 148.920 / RQE 72.104).
  - **Engenharia de Segurança (SST/PGR):** Eng. Ricardo S. Albuquerque (Engenheiro de Segurança do Trabalho — CREA-SP 506.128.932-D).
- **Substituição de Gateway de Pagamento:** O cliente utilizava Conta Azul e enfrentava fricção. Foi substituído pelo **Checkout Transparente Asaas** (PIX D+0 com webhook instantâneo, Cartão até 12x, Boleto Bancário D+0 e emissão automática de NFS-e Municipal).

---

## 💎 2. Padrão Visual e Identidade (Design System)

- **Estética:** *Liquid Glass* (estilo Apple, Linear e Vercel Enterprise).
- **Efeitos Visuais:**
  - Desfoque e saturação profunda: `backdrop-filter: blur(24px) saturate(190%)`.
  - Superfícies translúcidas com reflexo especular (`--glass-specular: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 100%)`).
  - Canvas de iluminação ambiental com esferas gradientes flutuantes (`ambient-glow-wrapper`).
  - Micro-interações com física de mola (`transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1)`).
- **Cores Principais:**
  - Azul Corporativo Marinha: `#002e5a`
  - Azul Elétrico (Ação): `#2563eb` / `#38bdf8`
  - Ouro Técnico (Matte Gold): `#d4a307` / `#facc15`
  - Verde Sucesso (eSocial / PIX): `#10b981` / `#34d399`
  - Superfícies Escuras: `#060b17`, `#0c1322`, `#111b30`
- **Iconografia:** 100% vetores SVG inline de traço fino (`stroke-width: 1.8`, padrão Lucide / SF Pro). **Zero emojis infantis no layout.**
- **Tipografia:** Google Fonts (`Plus Jakarta Sans`, `Inter`, `JetBrains Mono`).

---

## 🏗️ 3. Arquitetura da Solução & Telas

A aplicação é uma **SPA (Single Page Application)** construída em **Vanilla JavaScript modular (ES6)** e **Vanilla CSS** (sem Tailwind ou dependências pesadas de build), organizada em duas camadas principais:

### 🌟 Camada 1: Landing Page Pública de Alta Conversão (`viewLanding`)
1. **Header Sticky Liquid Glass:**
   - Logotipo oficial com divisor e badge de homologação MTE.
   - Navegação por âncoras suaves: *Início, Normas (NRs), Diferenciais, Planos Individuais, Simulador de Certificado, FAQ*.
   - Alternador de Modo Escuro / Claro.
   - Botões de acesso: *Entrar (Gera Modal Clerk)* e *Acessar Plataforma*.
2. **Hero Section Liquid Glass com Split Layout:**
   - Badge regulamentar pulsante (Portaria 6.730/2020 & eSocial).
   - Título editorial em texto gradiente.
   - Strip de métricas de conformidade (*10 NRs, CRM/CREA, QR Code, Asaas D+0*).
   - **Live Interactive App Mockup:** Janela estilo macOS com simulação da NR-35 ao vivo, telemetria industrial, botão de play interativo, scrubber e micro-chips flutuantes com animação contínua.
3. **Faixa de Credibilidade & Prova Social:** 4 cards frosted (+25.000 capacitados, 10 NRs, 100% validade jurídica, PIX D+0).
4. **Vitrine Interativa de NRs:** Grid de cards com filtros por categoria (Altura, Eletricidade, CIPA, Máquinas, Agro), ementa, preço e botões para prévia e matrícula.
5. **Diferenciais Bento Grid:** 4 blocos destacando segurança jurídica, assinaturas médicas/engenharia com QR Code, checkout Asaas e sala de aula com provas.
6. **Planos Individuais (Substituindo Planos Corporativos):**
   - **Plano Individual Anual Ilimitado (Destaque / 40% OFF):** 12x de R$ 29,90 ou R$ 299/ano.
   - **Plano Individual Mensal Flex:** R$ 49,90/mês.
   - **Treinamento Individual Avulso:** A partir de R$ 79,90 único.
7. **Simulador Interativo de Certificado em Tempo Real:** O visitante digita seu nome, seleciona a NR e vê o certificado com QR Code, carimbo e assinaturas sendo gerado ao vivo na tela.
8. **Como Funciona (3 Etapas)** e **FAQ em Glass Accordion**.
9. **Banner Final de Conversão** e **Footer Institucional Completo**.

---

### 🔐 Camada 2: Autenticação Moderna via Clerk (`js/clerkAuth.js`)
- Modal com efeito *backdrop blur* de alta densidade e escala suave.
- Suporte a **Continuar com Google**, **Gov.br / Certificado Digital** e **E-mail / Senha**.
- Abas dinâmicas de **Entrar (Sign In)** e **Criar Conta (Sign Up)**.
- **Acesso Rápido para Demonstração (1 Clique):**
  - *Carlos Alberto Mendonça* (Técnico em Manutenção / Aluno)
  - *Dr. Carlos Eduardo Menezes* (Médico Coordenador PCMSO)
  - *Eng. Ricardo S. Albuquerque* (Engenheiro de Segurança SST)
- **Clerk User Button no Header:** Avatar com status online, nome e menu dropdown suspenso (*Sala de Capacitação, Catálogo de NRs, Meus Certificados, Painel do Aluno, Sign Out*).
- **Proteção de Rotas:** Redirecionamento inteligente ao tentar acessar áreas restritas.

---

### 🎓 Camada 3: Plataforma EAD & LMS Interno
- **Catálogo de Cursos (`viewCatalog`):** Busca instantânea por termo, filtros e cards com barra de progresso individual.
- **Sala de Aula / Video Player (`viewPlayer`):** Player com simulação gráfica, telemetria de ângulo e ancoragem, anotações sincronizadas no tempo do vídeo, resumo normativo, download de modelos de APR/POP em DOCX/PDF e fórum com instrutores.
- **Engine de Provas (`viewExam`):** Avaliação regulamentar com 4 questões técnicas, cronômetro, telemetria e nota mínima de 70% para aprovação.
- **Gerador de Certificado Homologado (`viewCertificate`):** Certificado vetorial de alta definição com código alfanumérico único, QR Code funcional para auditoria pública e assinaturas digitais do CRM e CREA.
- **Painel do Aluno & Gestão SESMT (`viewDashboard`):** Matriz de treinamentos, gestão de exames ocupacionais ASO (Admissional, Periódico, Retorno), co-branding corporativo, extrato financeiro com NFS-e Asaas e exportador de lotes XML para eSocial S-2220/S-2240.
- **Institucional BRASEG (`viewDocs`):** Dados de contato, credenciais do corpo técnico e links diretos para o WhatsApp do SESMT.

---

## 📂 4. Mapa de Arquivos do Repositório

```text
medicina-trabalho-ead/
├── index.html              # HTML5 Semântico com Landing Page + Plataforma LMS + Modais
├── index.css               # Design System Liquid Glass, tokens CSS, ambient glow e animações
├── js/
│   ├── app.js              # SPA Router, gerenciador de views, bindings da landing e simulador
│   ├── clerkAuth.js        # Motor de autenticação estilo Clerk, modais, demo accounts e sessão
│   ├── coursesData.js      # Catálogo das 10 NRs, dados institucionais BRASEG e Planos Individuais
│   ├── state.js            # Gerenciador de estado centralizado e persistência via LocalStorage
│   ├── videoPlayer.js      # Player interativo com simulação gráfica e telemetria industrial
│   ├── examEngine.js       # Motor de avaliação e provas regulamentares com nota de corte
│   ├── certificate.js      # Renderizador vetorial de certificado com QR Code e assinaturas
│   ├── dashboard.js        # Painel do aluno, ASOs NR-07, co-marcação e exportador eSocial XML
│   └── checkoutEngine.js   # Motor de checkout transparente Asaas (PIX, Cartão 12x, Boleto, NFS-e)
├── assets/images/          # Logotipo oficial BRASEG, fotos do corpo técnico e thumbs das NRs
├── .gitignore              # Regras de exclusão Git
└── HANDOFF.md              # Este documento de transição e handoff
```

---

## 💻 5. Como Executar e Testar Localmente

1. **Clonar o Repositório:**
   ```bash
   git clone https://github.com/domfelipe/grupo-braseg-ead.git
   cd grupo-braseg-ead
   ```
2. **Iniciar Servidor Local:**
   ```bash
   python3 -m http.server 8080
   # ou
   npx serve .
   ```
3. **Acessar no Navegador:**
   Abra `http://localhost:8080/`.

---

## 🚀 6. Próximos Passos Sugeridos para a Próxima LLM / Desenvolvedor

1. **Backend Real do Asaas:** Integrar as chamadas de API reais aos endpoints `POST /v3/payments` e webhooks do Asaas (`https://api.asaas.com/v3/`).
2. **Clerk SDK em Produção:** Se desejar autenticação em produção real, adicionar a biblioteca oficial `@clerk/clerk-js` com as Publishable Keys da BRASEG.
3. **Player de Vídeo com HLS / Cloudflare Stream:** Substituir a engine de simulação gráfica por streaming de vídeo real em HLS / MP4 hospedado em CDN segura.
4. **Exportação de PDF via Servidor:** Adicionar biblioteca como `jsPDF` ou endpoint backend com Puppeteer para download automático de PDF de alta densidade (300 DPI) para impressão gráfica do certificado.
