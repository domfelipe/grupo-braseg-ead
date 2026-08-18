/**
 * BRASEG EAD - Catálogo Oficial de Cursos e Treinamentos Regulamentares (NRs)
 * Grupo BRASEG Consultoria e Treinamentos - Lençóis Paulista / SP
 * Responsáveis Técnicos:
 * - Dr. Carlos Eduardo Menezes (Médico do Trabalho - CRM/SP 148.920 / RQE 72.104)
 * - Eng. Ricardo S. Albuquerque (Eng. de Segurança do Trabalho - CREA/SP 506.128.932-D)
 */

export const COURSES_DATA = [
  {
    id: "nr35",
    code: "NR-35",
    category: "industrial",
    categoryLabel: "Industrial & Construção",
    title: "NR-35: Trabalho em Altura",
    subtitle: "Capacitação Obrigatória para Atividades Acima de 2,00m",
    badge: "Mais Vendido • MTE",
    duration: "8 horas",
    validity: "2 anos (Reciclagem Bienal)",
    norm: "Portaria MTP nº 4.218 / Norma Regulamentadora nº 35",
    price: 89.90,
    originalPrice: 149.90,
    featured: true,
    rating: 4.9,
    studentsCount: 1420,
    color: "#002e5a",
    accentColor: "#3774c2",
    thumb: "assets/images/nr35.jpg",
    instructor: {
      name: "Eng. Ricardo S. Albuquerque",
      role: "Engenheiro de Segurança do Trabalho (CREA-SP 506.128.932-D)",
      company: "Grupo BRASEG Consultoria"
    },
    medicalEndorsement: {
      name: "Dr. Carlos Eduardo Menezes",
      role: "Médico Coordenador do PCMSO (CRM-SP 148.920)",
      notes: "Apto para atividades com risco de queda conforme ASO com EEG/ECG."
    },
    description: "Treinamento técnico-normativo focado no planejamento, organização e execução de trabalhos em altura. Aborda análise de risco (APR), seleção de pontos de ancoragem, cálculo de Zona Livre de Queda (ZLQ) e técnicas de resgate emergencial.",
    learningGoals: [
      "Compreender os limites legais e requisitos da NR-35 atualizada;",
      "Calcular o Fator de Queda (FQ) e a Zona Livre de Queda (ZLQ);",
      "Inspecionar rigorosamente cinturões paraquedistas, talabartes com absorvedor e trava-quedas;",
      "Elaborar e emitir Permissão de Trabalho (PT) e Análise Preliminar de Risco (APR)."
    ],
    modules: [
      {
        id: "m1",
        title: "Módulo 1: Requisitos Legais e Análise Preliminar de Risco (APR)",
        duration: "03:45",
        lessons: [
          {
            id: "l1_1",
            title: "1.1 Conceito Legal de Trabalho em Altura e Responsabilidades",
            duration: 180,
            videoSrc: "simulated",
            simulationType: "nr35_basics",
            checkpoints: [
              {
                time: 60,
                question: "A partir de qual altura acima do nível inferior a NR-35 considera o trabalho como 'Trabalho em Altura'?",
                options: [
                  "1,50 metros",
                  "2,00 metros onde haja risco de queda",
                  "2,50 metros somente se houver andaime",
                  "3,00 metros em qualquer circunstância"
                ],
                correctIndex: 1,
                explanation: "Conforme o item 35.1.2 da NR-35, considera-se trabalho em altura toda atividade executada acima de 2,00 m do nível inferior, onde haja risco de queda."
              }
            ],
            transcript: "Olá! Seja bem-vindo ao treinamento oficial de NR-35 do Grupo BRASEG. Neste módulo inicial, vamos compreender a legislação vigente, as responsabilidades do empregador e do trabalhador, e como estruturar uma Análise Preliminar de Risco eficiente para trabalhos acima de dois metros de altura.",
            keyPoints: [
              "Trabalho em altura: acima de 2,00m do nível inferior;",
              "Obrigatória a emissão de Permissão de Trabalho (PT);",
              "Exame de aptidão médica no ASO com avaliação para trabalho em altura."
            ]
          },
          {
            id: "l1_2",
            title: "1.2 Fator de Queda e Cálculo da Zona Livre de Queda (ZLQ)",
            duration: 220,
            videoSrc: "simulated",
            simulationType: "nr35_physics",
            checkpoints: [
              {
                time: 110,
                question: "O que representa um Fator de Queda igual a 2 (FQ = 2)?",
                options: [
                  "Ponto de ancoragem acima da cabeça do trabalhador",
                  "Ponto de ancoragem no mesmo nível dos pés do trabalhador (situação crítica)",
                  "Uso de dois talabartes simultâneos",
                  "Distância de frenagem reduzida a zero"
                ],
                correctIndex: 1,
                explanation: "O Fator de Queda 2 ocorre quando a ancoragem está no nível dos pés do trabalhador. A distância de queda é o dobro do comprimento do talabarte, gerando o maior impacto de choque."
              }
            ],
            transcript: "O Fator de Queda define a severidade do impacto mecânico sobre o corpo do trabalhador. Para evitar lesões graves, o ponto de ancoragem deve ser posicionado prioritariamente acima da cabeça (Fator de Queda 0). A Zona Livre de Queda (ZLQ) deve somar o comprimento do talabarte, abertura do absorvedor de energia, altura do trabalhador e distância de segurança.",
            keyPoints: [
              "FQ = 0 (Ideal - Ancoragem alta); FQ = 1 (Médio); FQ = 2 (Crítico - Evitar);",
              "Fórmula: ZLQ = Comprimento do Talabarte + Absorvedor Aberto + Altura do Trabalhador + 1 metro de margem;",
              "Nunca conectar talabarte sem absorvedor de energia em pontos rígidos."
            ]
          }
        ]
      },
      {
        id: "m2",
        title: "Módulo 2: EPIs, Linhas de Vida e Sistemas de Ancoragem",
        duration: "04:15",
        lessons: [
          {
            id: "l2_1",
            title: "2.1 Inspeção Diária de Cinturões e Conectores",
            duration: 200,
            videoSrc: "simulated",
            simulationType: "nr35_inspection",
            checkpoints: [
              {
                time: 90,
                question: "Qual elemento do cinturão paraquedista deve ser retirado de uso imediatamente se sofrer impacto de queda prévia?",
                options: [
                  "Apenas o mosquetão rosqueável",
                  "Todo o conjunto do cinturão e o talabarte com absorvedor deflagrado",
                  "Somente a fivela peitoral",
                  "Basta lavar a fita com água sanitária"
                ],
                correctIndex: 1,
                explanation: "Qualquer cinturão ou absorvedor de energia que tenha retido uma queda real sofre fadiga nas fibras e deve ser descartado e inutilizado imediatamente."
              }
            ],
            transcript: "A integridade dos Equipamentos de Proteção Individual é a última linha de defesa da vida do trabalhador. Antes de iniciar a jornada, faça a checagem tátil de costuras, corrosão em anéis D metálicos e verifique a integridade do absorvedor de impacto.",
            keyPoints: [
              "Checagem das costuras estruturais e fitas têxteis;",
              "Verificação de travas automáticas duplas em mosquetões;",
              "Rejeição de EPIs com deformação plástica ou cortes."
            ]
          }
        ]
      }
    ],
    examQuestions: [
      {
        id: "q1",
        question: "De acordo com a NR-35, a Análise de Risco (AR) deve considerar prioritariamente:",
        options: [
          "O isolamento e sinalização no entorno da área de trabalho e o risco de queda de materiais",
          "Apenas o custo dos equipamentos de resgate",
          "Somente a velocidade do vento em áreas internas fechadas",
          "A preferência do trabalhador pelo tipo de nó na corda"
        ],
        correctIndex: 0,
        explanation: "O item 35.4.5 determina que a AR considere o isolamento, sinalização, risco de queda de ferramentas e materiais e condições meteorológicas."
      },
      {
        id: "q2",
        question: "Qual o valor padrão de margem de segurança adicional a ser considerado no cálculo da ZLQ?",
        options: [
          "0,20 metros",
          "0,50 metros",
          "1,00 metro",
          "3,00 metros"
        ],
        correctIndex: 2,
        explanation: "As boas práticas e manuais técnicos de SST estabelecem no mínimo 1,00 metro de margem de segurança livre abaixo dos pés do trabalhador suspenso."
      },
      {
        id: "q3",
        question: "A Permissão de Trabalho (PT) para trabalho em altura deve ter validade limitada a:",
        options: [
          "30 dias corridos",
          "Duração da atividade, podendo ser revalidada caso as condições permaneçam inalteradas",
          "1 ano fiscal",
          "Não possui limite de validade"
        ],
        correctIndex: 1,
        explanation: "A PT é válida apenas para a duração da jornada ou tarefa especificada. Mudanças nas condições climáticas ou estruturais exigem nova avaliação."
      },
      {
        id: "q4",
        question: "Para o trabalho em altura ser liberado, o trabalhador deve possuir no ASO:",
        options: [
          "Aptidão clínica específica com avaliação de comorbidades que possam causar mal súbito (epilepsia, vertigem, arritmias)",
          "Apenas exame de acuidade visual simples",
          "Declaração verbal de que não tem medo de altura",
          "Apenas teste ergométrico a cada 5 anos"
        ],
        correctIndex: 0,
        explanation: "A NR-35 e o PCMSO exigem avaliação clínica criteriosa para identificar patologias causadoras de mal súbito ou perda de equilíbrio em altura."
      }
    ]
  },
  {
    id: "nr10",
    code: "NR-10",
    category: "industrial",
    categoryLabel: "Industrial & Elétrica",
    title: "NR-10: Segurança em Instalações Elétricas",
    subtitle: "Prevenção de Choques, Arco Elétrico e Sistema LOTO",
    badge: "Alta Voltagem",
    duration: "40 horas",
    validity: "2 anos",
    norm: "Portaria MTb nº 598 / Norma Regulamentadora nº 10",
    price: 139.90,
    originalPrice: 199.90,
    featured: true,
    rating: 4.95,
    studentsCount: 980,
    color: "#002e5a",
    accentColor: "#f4c602",
    thumb: "assets/images/nr10.jpg",
    instructor: {
      name: "Eng. Ricardo S. Albuquerque",
      role: "Engenheiro Eletricista e de Seg. do Trabalho (CREA-SP)",
      company: "Grupo BRASEG Consultoria"
    },
    medicalEndorsement: {
      name: "Dr. Carlos Eduardo Menezes",
      role: "Médico Coordenador do PCMSO (CRM-SP 148.920)",
      notes: "Protocolo de atendimento a queimaduras por arco elétrico e fibrilação ventricular."
    },
    description: "Capacitação completa para profissionais que interagem direta ou indiretamente em instalações elétricas e serviços com eletricidade. Foco nas 6 etapas de desenergização segura (LOTO), zonas de risco e EPIs com proteção contra arco voltaico.",
    learningGoals: [
      "Executar as 6 etapas da desenergização controlada (LOTO);",
      "Identificar Zonas Livre, Controlada e de Risco conforme NR-10;",
      "Selecionar vestimentas ATPV e EPIs dielétricos adequados;",
      "Aplicar manobras de emergência em casos de choque elétrico e queimaduras."
    ],
    modules: [
      {
        id: "m1",
        title: "Módulo 1: Riscos em Instalações Elétricas e Efeitos no Corpo Humano",
        duration: "04:10",
        lessons: [
          {
            id: "l1_1",
            title: "1.1 Fisiopatologia do Choque Elétrico e Arco Voltaico",
            duration: 210,
            videoSrc: "simulated",
            simulationType: "nr10_loto",
            checkpoints: [
              {
                time: 80,
                question: "Qual a consequência cardíaca mais grave provocada pela passagem de corrente alternada (60Hz) pelo tórax?",
                options: [
                  "Hipotensão passageira",
                  "Fibrilação ventricular",
                  "Bradicardia sinusal reversível espontaneamente",
                  "Espasmo muscular sem risco à vida"
                ],
                correctIndex: 1,
                explanation: "A passagem da corrente de 60Hz pelo músculo cardíaco no período vulnerável do ciclo pode induzir fibrilação ventricular instantânea, parando a circulação sanguínea."
              }
            ],
            transcript: "Bem-vindo ao treinamento de NR-10 do Grupo BRASEG. A eletricidade é uma forma de energia invisível que exige respeito absoluto. Uma corrente de apenas 50 miliamperes já é suficiente para causar fibrilação ventricular e morte súbita.",
            keyPoints: [
              "Fibrilação ventricular a partir de 30mA a 50mA;",
              "Calor do arco elétrico pode atingir até 20.000°C;",
              "Obrigatório o uso de vestimentas anti-chama com classificação ATPV."
            ]
          }
        ]
      },
      {
        id: "m2",
        title: "Módulo 2: Procedimentos de Desenergização Segura (Regra de Ouro)",
        duration: "05:00",
        lessons: [
          {
            id: "l2_1",
            title: "2.1 As 6 Etapas da Desenergização (NR-10.5.1)",
            duration: 240,
            videoSrc: "simulated",
            simulationType: "nr10_loto",
            checkpoints: [
              {
                time: 120,
                question: "Qual é a sequência correta das etapas de desenergização segundo o item 10.5.1 da NR-10?",
                options: [
                  "Seccionamento, impedimento de reenergização, constatação da ausência de tensão, aterramento temporário, proteção dos elementos energizados e sinalização",
                  "Apenas desligar o disjuntor principal e colocar uma fita zebrada",
                  "Aterramento antes do seccionamento da chave",
                  "Verificação com multímetro sem travamento físico"
                ],
                correctIndex: 0,
                explanation: "A NR-10 exige a ordem rigorosa: Seccionamento -> Bloqueio (LOTO) -> Teste de Ausência de Tensão -> Aterramento Temporário com equipotencialização -> Proteção -> Sinalização."
              }
            ],
            transcript: "A segurança em instalações desenergizadas depende da obediência estrita às 6 etapas. Somente após a constatação de ausência de tensão e instalação do aterramento temporário é que o circuito pode ser considerado seguro para intervenção.",
            keyPoints: [
              "Bloqueio com cadeado individual e etiqueta de identificação;",
              "Detector de tensão calibrado e testado antes e depois da medição;",
              "Aterramento rápido garante disparo da proteção se houver religamento acidental."
            ]
          }
        ]
      }
    ],
    examQuestions: [
      {
        id: "q1",
        question: "Segundo a NR-10, o que caracteriza uma 'Zona de Risco'?",
        options: [
          "Entorno de parte condutora energizada, não segregada, acessível inclusive acidentalmente",
          "Qualquer área da fábrica com piso molhado",
          "A sala de descanso dos eletricistas",
          "Área externa sem iluminação artificial"
        ],
        correctIndex: 0,
        explanation: "Zona de Risco é o espaço ao redor do ponto energizado onde a aproximação só é permitida a trabalhadores autorizados e com procedimentos específicos."
      },
      {
        id: "q2",
        question: "O Prontuário de Instalações Elétricas (PIE) é obrigatório para estabelecimentos com carga instalada superior a:",
        options: [
          "10 kW",
          "75 kW",
          "500 kW",
          "1000 kW"
        ],
        correctIndex: 1,
        explanation: "Conforme o item 10.2.4 da NR-10, estabelecimentos com carga instalada superior a 75 kW devem constituir e manter atualizado o PIE."
      }
    ]
  },
  {
    id: "nr33",
    code: "NR-33",
    category: "industrial",
    categoryLabel: "Industrial & Químico",
    title: "NR-33: Espaços Confinados",
    subtitle: "Vigia, Trabalhador Autorizado e Supervisor de Entrada",
    badge: "Atmosfera Crítica",
    duration: "16 horas",
    validity: "1 ano (Reciclagem Anual)",
    norm: "Portaria MTP nº 1.690 / Norma Regulamentadora nº 33",
    price: 119.90,
    originalPrice: 179.90,
    featured: false,
    rating: 4.88,
    studentsCount: 750,
    color: "#002e5a",
    accentColor: "#3774c2",
    thumb: "assets/images/nr33.jpg",
    instructor: {
      name: "Eng. Ricardo S. Albuquerque",
      role: "Especialista em Gestão de Espaços Confinados (CREA-SP)",
      company: "Grupo BRASEG Consultoria"
    },
    medicalEndorsement: {
      name: "Dr. Carlos Eduardo Menezes",
      role: "Médico do Trabalho (CRM-SP 148.920)",
      notes: "Avaliação para trabalho em ambientes hipóxicos ou enclausurados com teste espirométrico."
    },
    description: "Capacitação completa para reconhecimento, avaliação e controle dos riscos em espaços confinados. Abrange operação de detectores multigás (O2, LEL, CO, H2S), ventilação por insuflação/exaustão, emissão da PET e técnicas de resgate com tripé.",
    learningGoals: [
      "Operar detectores multigás e calibrar sensores (Bump Test);",
      "Definir e fiscalizar os limites seguros de O2 (19,5% a 23,0%);",
      "Preencher e assinar a Permissão de Entrada e Trabalho (PET);",
      "Executar as funções exclusivas do Vigia sem abandonar o posto."
    ],
    modules: [
      {
        id: "m1",
        title: "Módulo 1: Definição, Reconhecimento e Monitoramento Atmosférico",
        duration: "04:30",
        lessons: [
          {
            id: "l1_1",
            title: "1.1 Atmosferas Perigosas e Limites Críticos de Gases",
            duration: 210,
            videoSrc: "simulated",
            simulationType: "nr33_multigas",
            checkpoints: [
              {
                time: 90,
                question: "Qual a faixa de concentração de Oxigênio (O2) considerada segura para entrada em espaço confinado?",
                options: [
                  "10,0% a 15,0%",
                  "19,5% a 23,0%",
                  "25,0% a 30,0%",
                  "Qualquer nível desde que não haja fumaça"
                ],
                correctIndex: 1,
                explanation: "Abaixo de 19,5% ocorre asfixia e perda de consciência; acima de 23,0% há enriquecimento de oxigênio com risco extremo de combustão e explosão espontânea."
              }
            ],
            transcript: "Espaços confinados como silos, galerias, reatores e tanques não foram projetados para ocupação humana contínua. Antes de abrir a tampa de visita, o monitoramento dos 4 gases deve ser realizado em todos os estratos (topo, meio e fundo).",
            keyPoints: [
              "O2 seguro: 19,5% a 23,0%;",
              "LEL / Inflamabilidade: deve ser 0% (máximo permitido 10% com ventilação);",
              "CO tóxico limite 25 ppm / H2S tóxico limite 10 ppm (gás sulfídrico paralisador olfativo)."
            ]
          }
        ]
      }
    ],
    examQuestions: [
      {
        id: "q1",
        question: "Qual é a responsabilidade indelegável do Vigia em um espaço confinado?",
        options: [
          "Permanecer continuamente fora do espaço confinado junto à entrada, acompanhando os trabalhos e acionando o plano de emergência se necessário",
          "Entrar no tanque para ajudar o trabalhador a carregar ferramentas pesadas",
          "Fazer pausas periódicas e deixar a entrada sem vigia por até 30 minutos",
          "Assinar a PET no lugar do Supervisor de Entrada"
        ],
        correctIndex: 0,
        explanation: "O Vigia nunca pode adentrar o espaço confinado ou abandonar o posto, sendo responsável pela contagem e comunicação com os trabalhadores autorizados."
      }
    ]
  },
  {
    id: "nr12",
    code: "NR-12",
    category: "industrial",
    categoryLabel: "Industrial & Automação",
    title: "NR-12: Segurança em Máquinas e Equipamentos",
    subtitle: "Proteções Físicas, Cortinas de Luz e Paradas de Emergência",
    badge: "Segurança de Máquinas",
    duration: "16 horas",
    validity: "2 anos",
    norm: "Portaria SEPRT nº 916 / Norma Regulamentadora nº 12",
    price: 109.90,
    originalPrice: 159.90,
    featured: false,
    rating: 4.91,
    studentsCount: 620,
    color: "#002e5a",
    accentColor: "#3774c2",
    thumb: "assets/images/nr12.jpg",
    instructor: {
      name: "Eng. Ricardo S. Albuquerque",
      role: "Especialista em Automação e NR-12 (CREA-SP)",
      company: "Grupo BRASEG Consultoria"
    },
    medicalEndorsement: {
      name: "Dr. Carlos Eduardo Menezes",
      role: "Médico do Trabalho (CRM-SP 148.920)",
      notes: "Prevenção de amputações, esmagamentos e lesões por aprisionamento mecânico."
    },
    description: "Capacitação sobre medidas de proteção coletiva, dispositivos de intertravamento de segurança, cortinas de luz ópticas, botões tipo cogumelo de parada emergencial e procedimentos seguros de limpeza, manutenção e operação de maquinário industrial.",
    learningGoals: [
      "Identificar zonas de prensagem, corte, cisalhamento e enrolamento mecânico;",
      "Verificar o correto funcionamento de intertravamentos e chaves de segurança;",
      "Compreender a função das cortinas ópticas e relés de segurança;",
      "Realizar inspeção pré-operacional (checklist de partida segura)."
    ],
    modules: [
      {
        id: "m1",
        title: "Módulo 1: Princípios Gerais e Zonas de Perigo em Máquinas",
        duration: "04:00",
        lessons: [
          {
            id: "l1_1",
            title: "1.1 Proteções Fixas, Móveis e Sistemas de Intertravamento",
            duration: 200,
            videoSrc: "simulated",
            simulationType: "nr12_machines",
            checkpoints: [
              {
                time: 90,
                question: "O que deve acontecer ao abrir uma proteção móvel intertravada com chave de segurança?",
                options: [
                  "A máquina deve emitir apenas um aviso sonoro continuando em movimento",
                  "A máquina deve cessar imediatamente o movimento perigoso antes que o operador acesse a zona de risco",
                  "O operador deve apertar manualmente o disjuntor da parede",
                  "A rotação é acelerada para terminar a peça"
                ],
                correctIndex: 1,
                explanation: "Conforme o item 12.5 da NR-12, a abertura de proteção intertravada deve interromper instantaneamente as funções perigosas da máquina."
              }
            ],
            transcript: "Olá! A NR-12 visa garantir a integridade física dos operadores de máquinas e prensas. Proteções físicas e ópticas não podem ser burladas ou neutralizadas por nenhum operador. O botão de emergência deve ser acionado sempre que houver anormalidade operacional.",
            keyPoints: [
              "Proibido burlar fins de curso ou sensores ópticos;",
              "Botão de parada de emergência não pode ser usado como chave liga/desliga comum;",
              "Manutenção e limpeza somente com máquina desenergizada e bloqueada (LOTO)."
            ]
          }
        ]
      }
    ],
    examQuestions: [
      {
        id: "q1",
        question: "De acordo com a NR-12, quem é o responsável pela autorização e capacitação para operar máquinas industriais?",
        options: [
          "O empregador, mediante capacitação ministrada por profissional qualificado ou legalmente habilitado",
          "O próprio operador após 2 dias de observação informal",
          "O fornecedor das peças sem certificado formal",
          "Qualquer funcionário do turno noturno"
        ],
        correctIndex: 0,
        explanation: "A NR-12 estabelece que a operação de máquinas é restrita a trabalhadores capacitados, qualificados ou legalmente habilitados com registro formal."
      }
    ]
  },
  {
    id: "nr31",
    code: "NR-31",
    category: "agro",
    categoryLabel: "Agroflorestal & Canavieiro",
    title: "NR-31.7 & NR-31.12: Tratores e Máquinas Agrícolas",
    subtitle: "Operação Segura de Tratores, Colhedoras e Implementos Florestais",
    badge: "Destaque Regional BRASEG",
    duration: "24 horas",
    validity: "3 anos",
    norm: "Portaria SEPRT nº 22.677 / Norma Regulamentadora nº 31",
    price: 129.90,
    originalPrice: 189.90,
    featured: true,
    rating: 4.98,
    studentsCount: 1150,
    color: "#002e5a",
    accentColor: "#3774c2",
    thumb: "assets/images/nr31.jpg",
    instructor: {
      name: "Eng. Ricardo S. Albuquerque",
      role: "Especialista em Segurança Agroflorestal (CREA-SP)",
      company: "Grupo BRASEG Consultoria"
    },
    medicalEndorsement: {
      name: "Dr. Carlos Eduardo Menezes",
      role: "Médico do Trabalho (CRM-SP 148.920)",
      notes: "Prevenção de traumas em terrenos inclinados e vibração de corpo inteiro (VMB/VCI)."
    },
    description: "Treinamento especializado voltado para o agronegócio, setor canavieiro e indústrias de celulose (forte presença regional da BRASEG em Lençóis Paulista). Foco em proteção da Tomada de Potência (TDP), estrutura de proteção contra capotamento (EPCC/ROPS), e operação em declives.",
    learningGoals: [
      "Operar tratores equipados com EPCC (Estrutura de Proteção Contra Capotamento) e cinto;",
      "Inspecionar e manter o escudo protetor da Tomada de Potência (TDP) e eixo cardan;",
      "Calcular ângulos limites de inclinação para prevenir tombamentos laterais;",
      "Aplicar regras de trânsito em estradas vicinais e frentes de corte/plantio."
    ],
    modules: [
      {
        id: "m1",
        title: "Módulo 1: Segurança na Operação de Tratores e Eixo Cardan",
        duration: "04:30",
        lessons: [
          {
            id: "l1_1",
            title: "1.1 Proteção de TDP, Cardan e Prevenção de Enrolamento",
            duration: 210,
            videoSrc: "simulated",
            simulationType: "nr31_agro",
            checkpoints: [
              {
                time: 100,
                question: "Por que a capa protetora de rotação livre do eixo cardan da TDP agrícola é indispensável?",
                options: [
                  "Para melhorar o consumo de óleo diesel do trator",
                  "Para evitar que roupas ou membros do operador sejam agarrados e enrolados pela rotação de alta velocidade",
                  "Apenas para proteger contra poeira e chuva",
                  "Para diminuir o ruído do motor"
                ],
                correctIndex: 1,
                explanation: "O eixo cardan gira a 540 ou 1000 RPM com torque massivo. A falta de capa protetora íntegra é a causa mais comum de acidentes fatais por enrolamento mecânico no campo."
              }
            ],
            transcript: "Bem-vindo ao módulo de NR-31 da BRASEG. Em operações agrícolas e florestais, o trator é uma ferramenta indispensável, mas que exige extremo cuidado. Nunca trabalhe com eixo cardan desprotegido e sempre utilize o cinto de segurança junto com o arco EPCC contra capotamentos.",
            keyPoints: [
              "Capa protetora do cardan deve ter trava anti-giro de corrente;",
              "Obrigatoriedade do uso do cinto de segurança para manter o operador dentro da gaiola EPCC em caso de tombamento;",
              "Proibido transportar caronas em para-lamas ou implementos agrícolas."
            ]
          }
        ]
      }
    ],
    examQuestions: [
      {
        id: "q1",
        question: "Segundo a NR-31.12, o que é proibido durante o reabastecimento de máquinas e tratores no campo?",
        options: [
          "Fumar, utilizar chamas abertas e manter o motor do veículo em funcionamento",
          "Utilizar funil plástico apropriado",
          "Estacionar em solo nivelado",
          "Usar luvas de proteção contra hidrocarbonetos"
        ],
        correctIndex: 0,
        explanation: "O reabastecimento em campo exige motor desligado, aterramento quando aplicável e proibição total de fumo ou fontes de ignição num raio de segurança."
      }
    ]
  },
  {
    id: "nr20",
    code: "NR-20",
    category: "industrial",
    categoryLabel: "Industrial & Químico",
    title: "NR-20: Segurança com Inflamáveis e Combustíveis",
    subtitle: "Curso Básico / Intermediário - Classificação de Instalações e Tanques",
    badge: "Inflamáveis & Explosão",
    duration: "16 horas",
    validity: "2 anos",
    norm: "Portaria SEPRT nº 1.360 / Norma Regulamentadora nº 20",
    price: 119.90,
    originalPrice: 169.90,
    featured: false,
    rating: 4.87,
    studentsCount: 480,
    color: "#002e5a",
    accentColor: "#f4c602",
    thumb: "assets/images/nr20.jpg",
    instructor: {
      name: "Eng. Ricardo S. Albuquerque",
      role: "Especialista em Áreas Classificadas (CREA-SP)",
      company: "Grupo BRASEG Consultoria"
    },
    medicalEndorsement: {
      name: "Dr. Carlos Eduardo Menezes",
      role: "Médico do Trabalho (CRM-SP 148.920)",
      notes: "Monitoramento de exposição a vapores de hidrocarbonetos e benzeno."
    },
    description: "Treinamento obrigatório para colaboradores que adentram e laboram na área de manuseio, armazenamento ou transferência de líquidos inflamáveis e gases liquefeitos. Classificação de áreas Ex (Zona 0, 1 e 2) e combate a princípios de incêndio classe B.",
    learningGoals: [
      "Compreender ponto de fulgor, ponto de combustão e limites de explosividade (LEL/UEL);",
      "Controlar fontes de eletricidade estática e aterramento em descarregamento de tanques;",
      "Operar sistemas de contenção de vazamentos (bacias de contenção);",
      "Emitir Permissão de Trabalho a Quente em áreas com vapores inflamáveis."
    ],
    modules: [
      {
        id: "m1",
        title: "Módulo 1: Propriedades dos Inflamáveis e Controle de Ignição",
        duration: "03:45",
        lessons: [
          {
            id: "l1_1",
            title: "1.1 Ponto de Fulgor e Limites de Explosividade",
            duration: 180,
            videoSrc: "simulated",
            simulationType: "nr20_fuels",
            checkpoints: [
              {
                time: 80,
                question: "O que define um 'Líquido Inflamável' conforme a NR-20?",
                options: [
                  "Líquidos que possuem ponto de fulgor <= 60°C",
                  "Apenas líquidos que contenham corante vermelho",
                  "Líquidos com ponto de ebulição acima de 200°C",
                  "Qualquer óleo lubrificante de motor"
                ],
                correctIndex: 0,
                explanation: "A NR-20 define líquidos inflamáveis como aqueles que possuem ponto de fulgor menor ou igual a 60°C."
              }
            ],
            transcript: "Trabalhar com inflamáveis requer a eliminação do triângulo do fogo. A eletricidade estática gerada pelo fluxo de líquidos em mangueiras é uma das principais fontes invisíveis de ignição. Sempre conecte o cabo terra antes de iniciar o descarregamento.",
            keyPoints: [
              "Ponto de fulgor: menor temperatura em que o líquido libera vapores inflamáveis;",
              "Uso obrigatório de ferramentas anti-faísca (bronze/berílio);",
              "Equipotencialização de tanques de abastecimento."
            ]
          }
        ]
      }
    ],
    examQuestions: [
      {
        id: "q1",
        question: "Em caso de vazamento de líquido inflamável, qual a primeira ação prioritária?",
        options: [
          "Eliminar imediatamente todas as fontes de ignição na área e isolar o perímetro com sinalização",
          "Lavar o combustível com água pressurizada em direção à rede de esgoto pluvial",
          "Tentar tampar com as mãos desprotegidas",
          "Continuar os trabalhos se o cheiro for fraco"
        ],
        correctIndex: 0,
        explanation: "A prioridade imediata é cortar fontes elétricas, motores, fagulhas e isolar a área para evitar a ignição da nuvem de vapores."
      }
    ]
  },
  {
    id: "nr05",
    code: "NR-05",
    category: "geral",
    categoryLabel: "Segurança Geral & CIPA",
    title: "NR-05: CIPA e Prevenção de Assédio",
    subtitle: "Comissão Interna de Prevenção de Acidentes e Inclusão no Trabalho",
    badge: "Gestão CIPA • Lei 14.457",
    duration: "20 horas",
    validity: "1 ano",
    norm: "Portaria MTP nº 4.219 / Lei nº 14.457 / NR-05 Atualizada",
    price: 99.90,
    originalPrice: 149.90,
    featured: false,
    rating: 4.93,
    studentsCount: 890,
    color: "#002e5a",
    accentColor: "#647f9c",
    thumb: "assets/images/nr05.jpg",
    instructor: {
      name: "Eng. Ricardo S. Albuquerque",
      role: "Consultor de Gestão em SST (CREA-SP)",
      company: "Grupo BRASEG Consultoria"
    },
    medicalEndorsement: {
      name: "Dr. Carlos Eduardo Menezes",
      role: "Médico do Trabalho (CRM-SP 148.920)",
      notes: "Saúde mental ocupacional, prevenção ao estresse laboral e canal de denúncias éticas."
    },
    description: "Capacitação completa para cipeiros titulares e suplentes, e designados de CIPA. Inclui a nova atribuição legal de prevenção e combate ao assédio sexual e moral no ambiente corporativo, elaboração do Mapa de Riscos e organização da SIPAT.",
    learningGoals: [
      "Elaborar o Mapa de Riscos Ocupacionais conforme os grupos de riscos;",
      "Investigar acidentes de trabalho pelo método da árvore de causas;",
      "Implementar políticas ativas de prevenção e combate ao assédio moral e sexual;",
      "Realizar inspeções periódicas de segurança nos postos de trabalho."
    ],
    modules: [
      {
        id: "m1",
        title: "Módulo 1: Atribuições da CIPA e Mapeamento de Riscos",
        duration: "03:30",
        lessons: [
          {
            id: "l1_1",
            title: "1.1 Funcionamento da CIPA e Prevenção de Assédio",
            duration: 180,
            videoSrc: "simulated",
            simulationType: "nr05_cipa",
            checkpoints: [
              {
                time: 75,
                question: "Qual inovação legal foi incorporada obrigatoriamente à NR-05 pela Lei 14.457/2022?",
                options: [
                  "Apenas a alteração das cores do mapa de riscos",
                  "A inclusão de regras de prevenção e combate ao assédio sexual e outras formas de violência no trabalho",
                  "Obrigatoriedade de CIPA com apenas 1 membro em qualquer empresa",
                  "Extinção das reuniões mensais ordinárias"
                ],
                correctIndex: 1,
                explanation: "A Lei 14.457/2022 incluiu no escopo da CIPA a obrigatoriedade de combate ao assédio sexual e promoção de um ambiente de trabalho respeitoso e seguro para todos."
              }
            ],
            transcript: "Bem-vindo ao treinamento da CIPA do Grupo BRASEG. A CIPA é o elo direto entre trabalhadores e a direção da empresa na busca por um ambiente saudável, livre de acidentes e de qualquer forma de violência ou assédio.",
            keyPoints: [
              "Mapa de riscos: 5 grupos (Físico, Químico, Biológico, Ergonômico e Acidentes);",
              "Canal anônimo de denúncias e acolhimento ético;",
              "Reuniões ordinárias mensais com lavratura de ata."
            ]
          }
        ]
      }
    ],
    examQuestions: [
      {
        id: "q1",
        question: "Qual cor representa os Riscos Ergonômicos no tradicional Mapa de Riscos da CIPA?",
        options: [
          "Verde",
          "Vermelho",
          "Amarelo",
          "Marrom"
        ],
        correctIndex: 2,
        explanation: "Verde = Físico, Vermelho = Químico, Marrom = Biológico, Amarelo = Ergonômico e Azul = Acidentes."
      }
    ]
  },
  {
    id: "nr06",
    code: "NR-06",
    category: "geral",
    categoryLabel: "Segurança Geral",
    title: "NR-06: Equipamentos de Proteção Individual (EPI)",
    subtitle: "Uso Correto, Certificado de Aprovação (CA) e Higienização",
    badge: "Uso Essencial",
    duration: "4 horas",
    validity: "1 ano",
    norm: "Portaria MTP nº 2.175 / Norma Regulamentadora nº 06",
    price: 49.90,
    originalPrice: 79.90,
    featured: false,
    rating: 4.85,
    studentsCount: 1680,
    color: "#002e5a",
    accentColor: "#3774c2",
    thumb: "assets/images/nr06.jpg",
    instructor: {
      name: "Eng. Ricardo S. Albuquerque",
      role: "Engenheiro de Segurança do Trabalho (CREA-SP)",
      company: "Grupo BRASEG Consultoria"
    },
    medicalEndorsement: {
      name: "Dr. Carlos Eduardo Menezes",
      role: "Médico do Trabalho (CRM-SP 148.920)",
      notes: "Atenuação de ruído por protetor auditivo e proteção respiratória contra particulados."
    },
    description: "Orientações fundamentais sobre direitos e deveres do empregador e trabalhador quanto ao fornecimento gratuito, seleção adequada, guarda, conservação e obrigatoriedade de consulta do CA válido no portal do Ministério do Trabalho.",
    learningGoals: [
      "Identificar o Certificado de Aprovação (CA) gravado no EPI;",
      "Executar a higienização e armazenamento corretos;",
      "Reconhecer quando o EPI deve ser substituído imediatamente;",
      "Compreender a hierarquia de controle (EPC sobre EPI)."
    ],
    modules: [
      {
        id: "m1",
        title: "Módulo 1: Gestão, Seleção e Uso dos EPIs",
        duration: "03:00",
        lessons: [
          {
            id: "l1_1",
            title: "1.1 Responsabilidades e Validade do CA",
            duration: 150,
            videoSrc: "simulated",
            simulationType: "nr06_epi",
            checkpoints: [
              {
                time: 60,
                question: "Quem é responsável pelo fornecimento gratuito do EPI adequado ao risco da atividade?",
                options: [
                  "O próprio trabalhador através de desconto em folha",
                  "O empregador, que deve fornecer gratuitamente em perfeito estado de conservação",
                  "O sindicato da categoria",
                  "O fabricante de forma voluntária"
                ],
                correctIndex: 1,
                explanation: "O item 6.3 da NR-06 determina que a empresa é obrigada a fornecer aos empregados, gratuitamente, EPI adequado ao risco e com CA válido."
              }
            ],
            transcript: "O EPI é a barreira individual que protege sua saúde. Lembre-se: todo EPI comercializado no Brasil deve possuir o Certificado de Aprovação do MTE e ser utilizado exclusivamente para a finalidade a que se destina.",
            keyPoints: [
              "Fornecimento gratuito e registro em ficha de EPI;",
              "Obrigação do empregado de utilizar e comunicar qualquer alteração que o torne impróprio;",
              "O EPI só é adotado quando as medidas de proteção coletiva não forem suficientes."
            ]
          }
        ]
      }
    ],
    examQuestions: [
      {
        id: "q1",
        question: "O que indica o Certificado de Aprovação (CA) gravado no EPI?",
        options: [
          "Que o equipamento passou por testes em laboratórios credenciados e foi aprovado pelo MTE para proteção contra riscos específicos",
          "Apenas o preço de venda recomendado pelo fabricante",
          "Que o equipamento nunca sofrerá desgaste mecânico",
          "O número de série do funcionário que comprou"
        ],
        correctIndex: 0,
        explanation: "O CA atesta a conformidade técnica e eficácia de proteção do equipamento de acordo com as normas da ABNT/MTE."
      }
    ]
  },
  {
    id: "nr17",
    code: "NR-17",
    category: "geral",
    categoryLabel: "Saúde & Ergonomia",
    title: "NR-17: Ergonomia e Biomecânica Ocupacional",
    subtitle: "Prevenção de LER/DORT, Postura Correta e Conforto nos Postos",
    badge: "Saúde Biomecânica",
    duration: "8 horas",
    validity: "2 anos",
    norm: "Portaria MTP nº 423 / Norma Regulamentadora nº 17",
    price: 69.90,
    originalPrice: 109.90,
    featured: false,
    rating: 4.89,
    studentsCount: 540,
    color: "#002e5a",
    accentColor: "#3774c2",
    thumb: "assets/images/nr17.jpg",
    instructor: {
      name: "Dr. Carlos Eduardo Menezes",
      role: "Médico do Trabalho e Ergonomista (CRM-SP 148.920)",
      company: "Grupo BRASEG Consultoria"
    },
    medicalEndorsement: {
      name: "Dr. Carlos Eduardo Menezes",
      role: "Médico Coordenador do PCMSO (CRM-SP 148.920)",
      notes: "Redução de queixas osteomusculares e adequação da Análise Ergonômica do Trabalho (AET)."
    },
    description: "Capacitação sobre adaptação das condições de trabalho às características psicofisiológicas dos trabalhadores. Foco no levantamento manual de cargas, mobiliário ergonômico, iluminação, organização do trabalho e ginástica laboral compensatória.",
    learningGoals: [
      "Executar o levantamento manual de cargas com flexão de joelhos e coluna reta;",
      "Regular cadeiras, monitores e apoios de punho e pés em estações administrativas;",
      "Identificar sinais precoces de fadiga osteomuscular (LER/DORT);",
      "Compreender a metodologia da AEP (Avaliação Ergonômica Preliminar)."
    ],
    modules: [
      {
        id: "m1",
        title: "Módulo 1: Biomecânica da Coluna e Postos de Trabalho",
        duration: "03:30",
        lessons: [
          {
            id: "l1_1",
            title: "1.1 Levantamento de Cargas e Ajuste do Posto",
            duration: 180,
            videoSrc: "simulated",
            simulationType: "nr17_ergo",
            checkpoints: [
              {
                time: 80,
                question: "Ao levantar um peso do solo, qual é a técnica postural correta para proteger os discos intervertebrais lombares?",
                options: [
                  "Manter as pernas retas e curvar a coluna lombar para a frente",
                  "Flexionar os joelhos, manter a coluna alinhada e segurar a carga o mais próximo possível do corpo",
                  "Girar o tronco bruscamente enquanto sobe o peso",
                  "Levantar a carga acima dos ombros de uma só vez"
                ],
                correctIndex: 1,
                explanation: "Flexionar os joelhos transfere a força mecânica para os músculos fortes das coxas e glúteos, reduzindo a pressão de compressão sobre as vértebras L4-L5 e L5-S1."
              }
            ],
            transcript: "Olá! A ergonomia não é apenas sobre conforto, é sobre preservação da sua capacidade laboral ao longo de toda a vida. Pequenos ajustes na altura do monitor e pausas ativas para alongamento evitam dores crônicas na cervical e lombar.",
            keyPoints: [
              "Monitor na altura da linha dos olhos;",
              "Pés apoiados integralmente no chão ou em suporte;",
              "Carga sempre próxima ao centro de gravidade corporal."
            ]
          }
        ]
      }
    ],
    examQuestions: [
      {
        id: "q1",
        question: "Qual é o objetivo principal da NR-17?",
        options: [
          "Adaptar as condições de trabalho às características psicofisiológicas dos trabalhadores, de modo a proporcionar um máximo de conforto, segurança e desempenho eficiente",
          "Exigir apenas a compra de mesas caras sem análise prévia",
          "Proibir o trabalho em escritórios climatizados",
          "Eliminar todos os intervalos de descanso da jornada"
        ],
        correctIndex: 0,
        explanation: "O item 17.1 define claramente que as condições de trabalho devem se adaptar ao ser humano, prevenindo sobrecargas físicas e mentais."
      }
    ]
  },
  {
    id: "socorros",
    code: "SBV-MTE",
    category: "saude",
    categoryLabel: "Emergência & Primeiros Socorros",
    title: "Primeiros Socorros e Suporte Básico de Vida",
    subtitle: "RCP de Alta Qualidade, Desengasgo (Heimlich) e Uso do DEA",
    badge: "Salva Vidas • AHA",
    duration: "8 horas",
    validity: "1 ano",
    norm: "Portaria MTE / Diretrizes Internacionais AHA / NR-07",
    price: 79.90,
    originalPrice: 129.90,
    featured: true,
    rating: 4.96,
    studentsCount: 1340,
    color: "#002e5a",
    accentColor: "#3774c2",
    thumb: "assets/images/socorros.jpg",
    instructor: {
      name: "Dr. Carlos Eduardo Menezes",
      role: "Médico Especialista em Medicina de Emergência e Ocupacional (CRM-SP)",
      company: "Grupo BRASEG Consultoria"
    },
    medicalEndorsement: {
      name: "Dr. Carlos Eduardo Menezes",
      role: "Médico Coordenador do PCMSO (CRM-SP 148.920)",
      notes: "Protocolo de Cadeia de Sobrevivência com desfibrilação precoce (DEA)."
    },
    description: "Treinamento prático e teórico fundamental para socorristas e brigadistas corporativos. Protocolo da Cadeia de Sobrevivência da American Heart Association (AHA): reconhecimento da Parada Cardiorrespiratória (PCR), compressões torácicas eficazes, Desfibrilador Externo Automático (DEA), controle de hemorragias com torniquete e manobra de Heimlich.",
    learningGoals: [
      "Reconhecer uma Parada Cardiorrespiratória em menos de 10 segundos;",
      "Executar compressões torácicas contínuas a 100-120 bpm na profundidade de 5 a 6 cm;",
      "Instalar e seguir os comandos de voz do Desfibrilador Externo Automático (DEA);",
      "Desengasgar adultos e crianças com a Manobra de Heimlich."
    ],
    modules: [
      {
        id: "m1",
        title: "Módulo 1: Cadeia de Sobrevivência e Ressuscitação Cardiopulmonar (RCP)",
        duration: "04:00",
        lessons: [
          {
            id: "l1_1",
            title: "1.1 Avaliação de Responsividade e RCP com DEA",
            duration: 200,
            videoSrc: "simulated",
            simulationType: "socorros_cpr",
            checkpoints: [
              {
                time: 90,
                question: "Ao constatar vítima inconsciente que não responde e não respira (ou apenas tem gasping/agoniando), qual é a conduta imediata?",
                options: [
                  "Dar água com açúcar e esperar 10 minutos",
                  "Chamar o SAMU (192) / Brigada, solicitar o DEA e iniciar imediatamente compressões torácicas no centro do peito",
                  "Apenas sentar a vítima e erguer as pernas",
                  "Tentar colocá-la em um carro particular sem massagem"
                ],
                correctIndex: 1,
                explanation: "Tempo é músculo cardíaco e cérebro. Chamar socorro avançado (192/193), pedir o DEA e iniciar compressões imediatamente mantém a oxigenação cerebral."
              }
            ],
            transcript: "Seja bem-vindo ao curso de Primeiros Socorros da BRASEG. Em uma emergência, suas mãos são a bomba cardíaca que mantém a pessoa viva. Posicione as mãos entrelaçadas no centro do tórax e comprima forte e rápido, permitindo o retorno total do peito entre as compressões.",
            keyPoints: [
              "Frequência de compressão: 100 a 120 compressões por minuto (ritmo de Stayin' Alive);",
              "Profundidade de 5 cm a 6 cm em adultos no terço inferior do esterno;",
              "O DEA deve ser ligado assim que chegar, colando os eletrodos conforme as ilustrações."
            ]
          }
        ]
      }
    ],
    examQuestions: [
      {
        id: "q1",
        question: "Qual o procedimento correto ao ligar o Desfibrilador Externo Automático (DEA)?",
        options: [
          "Ouvir atentamente os comandos de voz do aparelho, colar os eletrodos adesivos no tórax seco da vítima e afastar todos durante a análise de ritmo e choque",
          "Pressionar o botão de choque imediatamente antes de colar as pás",
          "Continuar tocando na vítima enquanto o choque é disparado",
          "Usar o DEA somente em crianças menores de 1 ano"
        ],
        correctIndex: 0,
        explanation: "O DEA é inteligente e instrui passo a passo. É fundamental garantir que ninguém esteja tocando na vítima durante a análise do ritmo e no momento da descarga."
      }
    ]
  }
];

export const SUBSCRIPTION_PLANS = [
  {
    id: "pass_annual",
    name: "BRASEG Pass Anual",
    badge: "Melhor Custo-Benefício",
    price: 299.00,
    period: "ano",
    monthlyEquivalent: "R$ 24,90/mês",
    installments: "em até 12x de R$ 29,90",
    description: "Acesso ilimitado a todas as 10 NRs, reciclagens automáticas, simuladores em tempo real e emissão ilimitada de certificados oficiais com QR Code.",
    features: [
      "Acesso completo a todas as 10 Normas Regulamentadoras;",
      "Certificados com assinaturas digitais válidas no MTE;",
      "Simulações industriais interativas e telemetria;",
      "Plantão de dúvidas com Médico do Trabalho e Engenheiro SST;",
      "Emissão automática de Nota Fiscal (NFS-e Asaas);"
    ]
  },
  {
    id: "pass_monthly",
    name: "BRASEG Pass Mensal",
    badge: "Sem Fidelidade",
    price: 39.90,
    period: "mês",
    monthlyEquivalent: "R$ 39,90/mês",
    installments: "Cobrança recorrente no Cartão ou PIX",
    description: "Flexibilidade total para profissionais e autônomos realizarem seus cursos conforme a demanda imediata de trabalho.",
    features: [
      "Acesso a todos os cursos enquanto a assinatura estiver ativa;",
      "Certificados oficiais liberados após aprovação nas provas;",
      "Suporte técnico via WhatsApp e fórum.",
      "Cancele quando quiser sem multas."
    ]
  }
];

export const B2B_CORPORATE_PACKS = [
  {
    id: "pack_10",
    name: "Pacote Corporativo 10 Licenças",
    slots: 10,
    price: 490.00,
    slotPrice: 49.00,
    badge: "Pequenas Equipes",
    description: "Ideal para frentes de trabalho pontuais ou pequenas empresas prestadoras de serviço.",
    features: ["10 matrículas em qualquer NR;", "Gestão centralizada no Painel SESMT;", "Emissão de Fatura e Boleto CNPJ."]
  },
  {
    id: "pack_50",
    name: "Pacote Corporativo 50 Licenças",
    slots: 50,
    price: 1890.00,
    slotPrice: 37.80,
    badge: "Mais Escolhido por SESMTs",
    popular: true,
    description: "Perfeito para indústrias, usinas sucroalcooleiras e operações agroflorestais regionais.",
    features: ["50 matrículas flexíveis;", "Customização com logo da sua empresa nos certificados;", "Exportação eSocial S-2220/S-2240;", "Faturamento faturado via Asaas."]
  },
  {
    id: "pack_100",
    name: "Pacote Corporativo 100 Licenças",
    slots: 100,
    price: 3290.00,
    slotPrice: 32.90,
    badge: "Máxima Economia (35% OFF)",
    description: "Escala total para grandes plantas industriais e terceirizadas de grande porte.",
    features: ["100 matrículas sem validade de expiração;", "Co-marcação personalizada;", "Consultor dedicado BRASEG;", "Integração direta de ASOs e PCMSO."]
  }
];

export const INITIAL_EMPLOYEES = [
  {
    id: "emp_01",
    name: "Carlos Alberto Mendonça",
    cpf: "341.892.118-04",
    role: "Técnico de Manutenção Industrial",
    department: "Manutenção & Utilidades",
    company: "Indústrias Metalúrgicas Delta S/A",
    cnpj: "18.492.301/0001-92",
    avatar: "assets/images/doctor.jpg",
    courses: {
      nr35: { status: "in_progress", progress: 65 },
      nr10: { status: "pending", progress: 0 },
      nr33: { status: "pending", progress: 0 },
      nr12: { status: "pending", progress: 0 },
      nr06: { status: "completed", score: 95, certCode: "BRASEG-2026-NR06-1184", completedAt: "2026-08-01" },
      socorros: { status: "pending", progress: 0 }
    }
  },
  {
    id: "emp_02",
    name: "Mariana Duarte Silveira",
    cpf: "419.782.330-15",
    role: "Operadora de Trator & Colhedora Florestal",
    department: "Operações de Campo (Agro/Celulose)",
    company: "Indústrias Metalúrgicas Delta S/A",
    cnpj: "18.492.301/0001-92",
    avatar: "assets/images/nr31.jpg",
    courses: {
      nr31: { status: "completed", score: 92, certCode: "BRASEG-2026-NR31-4821", completedAt: "2026-08-10" },
      nr12: { status: "in_progress", progress: 50 },
      nr06: { status: "completed", score: 100, certCode: "BRASEG-2026-NR06-2219", completedAt: "2026-08-02" },
      nr05: { status: "pending", progress: 0 }
    }
  },
  {
    id: "emp_03",
    name: "Fernando Ribeiro dos Santos",
    cpf: "288.614.998-72",
    role: "Eletricista de Alta Tensão & Painéis",
    department: "Subestações & Elétrica",
    company: "Indústrias Metalúrgicas Delta S/A",
    cnpj: "18.492.301/0001-92",
    avatar: "assets/images/nr10.jpg",
    courses: {
      nr10: { status: "completed", score: 98, certCode: "BRASEG-2026-NR10-9941", completedAt: "2026-07-28" },
      nr35: { status: "completed", score: 90, certCode: "BRASEG-2026-NR35-7712", completedAt: "2026-07-30" },
      nr20: { status: "in_progress", progress: 40 },
      socorros: { status: "completed", score: 95, certCode: "BRASEG-2026-SBV-3104", completedAt: "2026-08-05" }
    }
  },
  {
    id: "emp_04",
    name: "Juliana Mendes Paiva",
    cpf: "512.441.789-20",
    role: "Supervisora de Operações Químicas & CIPA",
    department: "Controle Ambiental & Qualidade",
    company: "Indústrias Metalúrgicas Delta S/A",
    cnpj: "18.492.301/0001-92",
    avatar: "assets/images/nr05.jpg",
    courses: {
      nr05: { status: "completed", score: 100, certCode: "BRASEG-2026-NR05-5501", completedAt: "2026-08-12" },
      nr20: { status: "completed", score: 94, certCode: "BRASEG-2026-NR20-8819", completedAt: "2026-08-14" },
      nr33: { status: "in_progress", progress: 30 },
      nr17: { status: "completed", score: 90, certCode: "BRASEG-2026-NR17-6420", completedAt: "2026-08-03" }
    }
  }
];

export const BRASEG_INSTITUTIONAL = {
  companyName: "Grupo BRASEG Consultoria e Treinamentos",
  cnpj: "18.234.567/0001-89",
  city: "Lençóis Paulista - SP",
  address: "Av. Marechal Rondon, 850 - Centro - Lençóis Paulista/SP - CEP 18680-000",
  phone: "(14) 3283-2060",
  whatsapp: "(14) 99760-9595",
  whatsappLink: "https://api.whatsapp.com/send?phone=5514997609595&text=Ol%C3%A1%20Grupo%20BRASEG,%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20treinamentos%20e%20SST",
  email: "comercial@brasegconsultoria.com.br",
  site: "https://www.brasegconsultoria.com.br/",
  mission: "Nossa missão é trazer economia, segurança e bem estar para nossos clientes.",
  technicalDirectors: [
    {
      name: "Dr. Carlos Eduardo Menezes",
      credential: "Médico do Trabalho - CRM/SP 148.920 / RQE 72.104",
      role: "Responsável Técnico Médico / PCMSO"
    },
    {
      name: "Eng. Ricardo S. Albuquerque",
      credential: "Engenheiro de Seg. do Trabalho - CREA/SP 506.128.932-D",
      role: "Responsável Técnico Operacional / SST"
    }
  ],
  partners: [
    { name: "LDC (Louis Dreyfus Company)", logoText: "LDC.", sector: "Agroindustrial" },
    { name: "Frigol Alimentos", logoText: "FRIGOL", sector: "Frigorífico & Alimentos" },
    { name: "Dexco", logoText: "dexco", sector: "Painéis e Madeira" },
    { name: "Lwart Soluções Ambientais", logoText: "LWART", sector: "Celulose e Rerrefino" }
  ]
};
