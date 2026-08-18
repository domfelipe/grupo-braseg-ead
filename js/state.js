/**
 * Gerenciador de Estado Global & Persistência Local (LocalStorage)
 * Grupo BRASEG Consultoria e Treinamentos - Lençóis Paulista / SP
 */

import { COURSES_DATA, INITIAL_EMPLOYEES } from './coursesData.js';

export const State = {
  theme: 'dark', // 'dark' | 'light'
  activeView: 'landing', // 'landing' | 'catalog' | 'player' | 'exam' | 'certificate' | 'dashboard' | 'docs' | 'membership'
  activeCourseId: 'nr35',
  activeLessonId: 'l1_1',
  activeCategory: 'all',
  customCompanyLogo: null, // Base64 string ou null
  corporateSlots: 15,
  subscriptions: [], // ['pass_annual', etc]
  unlockedCourses: ['nr35', 'nr10', 'nr31', 'nr06'], // cursos já liberados inicialmente
  auth: {
    isAuthenticated: false,
    user: null,
    token: null
  },
  orders: [
    {
      orderId: 'PED-ASAAS-89412',
      invoiceNumber: 'NFSE-2026-441829',
      date: '10/08/2026',
      time: '14:23:10',
      itemType: 'pack',
      itemId: 'pack_50',
      itemName: 'Pacote Corporativo 50 Licenças',
      itemCode: 'PACK-50',
      amount: 1890.00,
      originalAmount: 1890.00,
      discount: 0,
      coupon: null,
      paymentMethod: 'PIX Instantâneo Asaas',
      buyerName: 'Indústrias Metalúrgicas Delta S/A',
      buyerCpf: '18.492.301/0001-92',
      buyerCompany: 'Indústrias Metalúrgicas Delta S/A',
      buyerCnpj: '18.492.301/0001-92',
      status: 'PAGO_CONFIRMADO'
    }
  ],

  currentStudent: {
    id: "emp_01",
    name: "Carlos Alberto Mendonça",
    cpf: "341.892.118-04",
    role: "Técnico de Manutenção Industrial",
    department: "Manutenção & Utilidades",
    company: "Indústrias Metalúrgicas Delta S/A",
    cnpj: "18.492.301/0001-92"
  },

  employees: [],
  userProgress: {},
  notes: [],
  forumQuestions: [],
  asoRequests: [],

  init() {
    this.load();
    if (!this.employees || this.employees.length === 0) {
      this.employees = JSON.parse(JSON.stringify(INITIAL_EMPLOYEES));
    }
    if (!this.asoRequests || this.asoRequests.length === 0) {
      this.asoRequests = [
        {
          id: 'aso_01',
          employeeName: 'Mariana Duarte Silveira',
          cpf: '419.782.330-15',
          type: 'Periódico Anual',
          role: 'Operadora de Trator & Colhedora',
          status: 'Agendado na Clínica BRASEG',
          date: '22/08/2026',
          risks: 'Ruído, Vibração VCI, Poeiras Vegetais'
        },
        {
          id: 'aso_02',
          employeeName: 'Carlos Alberto Mendonça',
          cpf: '341.892.118-04',
          type: 'Retorno ao Trabalho',
          role: 'Técnico de Manutenção',
          status: 'Concluído (Apto NR-35/NR-10)',
          date: '05/08/2026',
          risks: 'Trabalho em Altura, Eletricidade'
        }
      ];
    }
    this.save();
  },

  load() {
    try {
      const data = localStorage.getItem('medtrab_ead_state_v3');
      if (data) {
        const parsed = JSON.parse(data);
        Object.assign(this, parsed);
      }
    } catch (e) {
      console.warn('Erro ao carregar estado local:', e);
    }
  },

  save() {
    try {
      const toSave = {
        theme: this.theme,
        activeView: this.activeView,
        activeCourseId: this.activeCourseId,
        activeLessonId: this.activeLessonId,
        activeCategory: this.activeCategory,
        customCompanyLogo: this.customCompanyLogo,
        corporateSlots: this.corporateSlots,
        subscriptions: this.subscriptions,
        unlockedCourses: this.unlockedCourses,
        auth: this.auth,
        orders: this.orders,
        currentStudent: this.currentStudent,
        employees: this.employees,
        userProgress: this.userProgress,
        notes: this.notes,
        forumQuestions: this.forumQuestions,
        asoRequests: this.asoRequests
      };
      localStorage.setItem('medtrab_ead_state_v3', JSON.stringify(toSave));
    } catch (e) {
      console.warn('Erro ao salvar estado:', e);
    }
  },

  isAuthenticated() {
    return !!(this.auth && this.auth.isAuthenticated && this.auth.user);
  },

  login(user) {
    this.auth = {
      isAuthenticated: true,
      user: user,
      token: 'clerk_session_tok_' + Math.random().toString(36).substring(2)
    };
    this.save();
  },

  logout() {
    this.auth = {
      isAuthenticated: false,
      user: null,
      token: null
    };
    this.save();
  },

  setTheme(theme) {
    this.theme = theme;
    this.save();
  },

  setCategory(cat) {
    this.activeCategory = cat;
    this.save();
  },

  setCompanyLogo(base64) {
    this.customCompanyLogo = base64;
    this.save();
  },

  isCourseUnlocked(courseId) {
    if (this.subscriptions && this.subscriptions.length > 0) return true; // Se tem BRASEG Pass, tudo liberado
    return this.unlockedCourses.includes(courseId);
  },

  unlockCourse(courseId) {
    if (!this.unlockedCourses.includes(courseId)) {
      this.unlockedCourses.push(courseId);
      this.save();
    }
  },

  activateSubscription(planId) {
    if (!this.subscriptions.includes(planId)) {
      this.subscriptions.push(planId);
      this.save();
    }
  },

  addCorporateSlots(count) {
    this.corporateSlots = (this.corporateSlots || 0) + count;
    this.save();
  },

  recordOrder(order) {
    if (!this.orders) this.orders = [];
    this.orders.unshift(order);
    this.save();
  },

  getCourse(courseId) {
    return COURSES_DATA.find(c => c.id === courseId) || COURSES_DATA[0];
  },

  getCourseProgress(courseId) {
    const studentId = this.currentStudent.id;
    const key = `${studentId}_${courseId}`;
    const p = this.userProgress[key] || {
      completedLessons: [],
      quizScores: {},
      isPassed: false,
      score: 0,
      certificateCode: null,
      completedAt: null
    };

    const course = this.getCourse(courseId);
    let totalLessons = 0;
    course.modules.forEach(m => totalLessons += m.lessons.length);

    const completedCount = p.completedLessons.length;
    const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    return {
      ...p,
      completedCount,
      totalCount: totalLessons,
      percent: Math.min(100, percent)
    };
  },

  markLessonCompleted(courseId, lessonId) {
    const studentId = this.currentStudent.id;
    const key = `${studentId}_${courseId}`;
    if (!this.userProgress[key]) {
      this.userProgress[key] = {
        completedLessons: [],
        quizScores: {},
        isPassed: false,
        score: 0,
        certificateCode: null,
        completedAt: null
      };
    }

    if (!this.userProgress[key].completedLessons.includes(lessonId)) {
      this.userProgress[key].completedLessons.push(lessonId);
      this.save();
    }
  },

  isLessonCompleted(courseId, lessonId) {
    const prog = this.getCourseProgress(courseId);
    return prog.completedLessons.includes(lessonId);
  },

  saveExamSuccess(courseId, scorePercent) {
    const studentId = this.currentStudent.id;
    const key = `${studentId}_${courseId}`;
    const course = this.getCourse(courseId);
    const certCode = `BRASEG-2026-${course.code.replace(/[^A-Z0-9]/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    if (!this.userProgress[key]) {
      this.userProgress[key] = { completedLessons: [], quizScores: {} };
    }

    this.userProgress[key].isPassed = true;
    this.userProgress[key].score = scorePercent;
    this.userProgress[key].certificateCode = certCode;
    this.userProgress[key].completedAt = new Date().toLocaleDateString('pt-BR');

    // Atualizar na lista do funcionário também
    const emp = this.employees.find(e => e.id === studentId);
    if (emp) {
      if (!emp.courses) emp.courses = {};
      emp.courses[courseId] = {
        status: 'completed',
        score: scorePercent,
        certCode: certCode,
        completedAt: new Date().toLocaleDateString('pt-BR')
      };
    }

    this.save();
    return certCode;
  },

  addNote(courseId, lessonId, timeSeconds, timeFormatted, text) {
    const note = {
      id: 'note_' + Date.now(),
      courseId,
      lessonId,
      timestamp: timeSeconds,
      timeFormatted,
      text,
      createdAt: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR').slice(0, 5)
    };
    this.notes.unshift(note);
    this.save();
    return note;
  },

  deleteNote(noteId) {
    this.notes = this.notes.filter(n => n.id !== noteId);
    this.save();
  },

  addForumQuestion(courseId, text) {
    const q = {
      id: 'q_' + Date.now(),
      courseId,
      author: this.currentStudent.name,
      role: this.currentStudent.role,
      date: 'Agora mesmo',
      text,
      answer: 'Olá! A equipe técnica médica e de engenharia do Grupo BRASEG analisou sua dúvida. Lembre-se sempre de cumprir a análise preliminar de risco (APR) e seguir o POP da sua empresa. Se houver divergência de campo, acione o SESMT local.',
      answeredBy: 'Equipe Técnica Grupo BRASEG (Dr. Carlos Eduardo / Eng. Ricardo)'
    };
    this.forumQuestions.unshift(q);
    this.save();
    return q;
  },

  addAsoRequest(requestData) {
    const req = {
      id: 'aso_' + Date.now(),
      date: new Date().toLocaleDateString('pt-BR'),
      status: 'Aguardando Agendamento na Clínica BRASEG',
      ...requestData
    };
    this.asoRequests.unshift(req);
    this.save();
    return req;
  },

  switchStudent(studentId) {
    const found = this.employees.find(e => e.id === studentId);
    if (found) {
      this.currentStudent = {
        id: found.id,
        name: found.name,
        cpf: found.cpf,
        role: found.role,
        department: found.department,
        company: found.company,
        cnpj: found.cnpj
      };
      this.save();
    }
  },

  addEmployee(empData) {
    const newEmp = {
      id: 'emp_' + Date.now(),
      courses: {},
      ...empData
    };
    this.employees.push(newEmp);
    this.save();
    return newEmp;
  }
};
