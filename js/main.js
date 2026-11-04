import { translations } from './translations.js';
import { getInitialDemoData, createDemoQueryBuilder } from './demo_data.js';
import { isFaceIdAvailable, isFaceIdEnrolled, registerFaceId, authenticateWithFaceId, removeFaceId } from './faceid.js';

// --- SUPABASE CONFIGURATION ---
// INSERISCI QUI LE TUE CHIAVI (Puoi trovarle in Project Settings -> API su Supabase)
const SUPABASE_URL = 'https://hcvktcdrgrsnmxqtvfeg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhjdmt0Y2RyZ3Jzbm14cXR2ZmVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NjkwNTYsImV4cCI6MjA5ODE0NTA1Nn0.Mj-xmxF6zTXxquVhVyPYkM45gb5R8sw_ftmKy7Oo7e0';

// Inizializza il client Supabase con intercettazione per la modalità Demo
const rawSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const supabase = {
    auth: rawSupabase.auth,
    from(table) {
        if (state.isDemo) {
            return createDemoQueryBuilder(() => state.demoData, table);
        }
        return rawSupabase.from(table);
    }
};

// Application State
const state = {
    isDemo: false,
    demoData: null,
    globalMode: 'expense', // 'expense' or 'investment'
    currentLanguage: localStorage.getItem('finance_app_lang') || 'it',
    views: {
        expense: 'home',
        investment: 'investment'
    },
    isMenuOpen: false,
    user: null,
    totalRemaining: 0,
    expenseViewMode: 'all', // 'all' or 'month'
    expenseSelectedMonth: '', // 'YYYY-MM'
    hideValues: false,
    listEditModes: {
        salary: false,
        various: false,
        expense: false,
        bonifico: false,
        investimento: false,
        movimento: false
    },
    editContext: {
        active: false,
        type: null,
        id: null
    },
    expenseSuggestions: []
};

// DOM Elements
const DOM = {
    appTitle: document.getElementById('app-title'),
    toggleModeBtn: document.getElementById('toggle-mode-btn'),
    menuBtn: document.getElementById('menu-btn'),
    closeMenuBtn: document.getElementById('close-menu-btn'),
    sideMenu: document.getElementById('side-menu'),
    menuOverlay: document.getElementById('menu-overlay'),
    homeContainer: document.getElementById('home-container'),
    expenseContainer: document.getElementById('expense-container'),
    statisticsContainer: document.getElementById('statistics-container'),
    investmentContainer: document.getElementById('investment-container'),
    salaryContainer: document.getElementById('salary-container'),
    variousContainer: document.getElementById('various-container'),
    
    // Modals & Forms
    addSalaryModal: document.getElementById('add-salary-modal'),
    closeSalaryModal: document.getElementById('close-salary-modal'),
    addSalaryForm: document.getElementById('add-salary-form'),
    addVariousModal: document.getElementById('add-various-modal'),
    closeVariousModal: document.getElementById('close-various-modal'),
    addVariousForm: document.getElementById('add-various-form'),
    addExpenseModal: document.getElementById('add-expense-modal'),
    closeExpenseModal: document.getElementById('close-expense-modal'),
    addExpenseForm: document.getElementById('add-expense-form'),
    btnAddExpense: document.getElementById('btn-add-expense'),
    btnAddExpensePage: document.getElementById('btn-add-expense-page'),
    
    // Investment Modals & Forms
    btnAddBonifico: document.getElementById('btn-add-bonifico'),
    btnAddBonificoPage: document.getElementById('btn-add-bonifico-page'),
    addBonificoModal: document.getElementById('add-bonifico-modal'),
    closeBonificoModal: document.getElementById('close-bonifico-modal'),
    addBonificoForm: document.getElementById('add-bonifico-form'),
    
    btnAddInvestimento: document.getElementById('btn-add-investimento'),
    btnAddInvestimentoPage: document.getElementById('btn-add-investimento-page'),
    addInvestimentoModal: document.getElementById('add-investimento-modal'),
    closeInvestimentoModal: document.getElementById('close-investimento-modal'),
    addInvestimentoForm: document.getElementById('add-investimento-form'),
    
    btnAddMovimento: document.getElementById('btn-add-movimento'),
    btnAddMovimentoPage: document.getElementById('btn-add-movimento-page'),
    addMovimentoModal: document.getElementById('add-movimento-modal'),
    closeMovimentoModal: document.getElementById('close-movimento-modal'),
    addMovimentoForm: document.getElementById('add-movimento-form'),

    expensesList: document.getElementById('expenses-list'),
    expensePageTotal: document.getElementById('expense-page-total'),
    expensePagePending: document.getElementById('expense-page-pending'),
    
    // Statistics Elements
    statRemainingValue: document.getElementById('stat-remaining-value'),
    statSpentValue: document.getElementById('stat-spent-value'),
    statSavedValue: document.getElementById('stat-saved-value'),
    statGrossValue: document.getElementById('stat-gross-value'),
    
    statReplyGrossValue: document.getElementById('stat-reply-gross-value'),
    statReplySpendableValue: document.getElementById('stat-reply-spendable-value'),
    statReplySavedValue: document.getElementById('stat-reply-saved-value'),
    
    statVariousGrossValue: document.getElementById('stat-various-gross-value'),
    statVariousSpendableValue: document.getElementById('stat-various-spendable-value'),
    statVariousSavedValue: document.getElementById('stat-various-saved-value'),
    
    // Investment Dashboard
    invStatBonifici: document.getElementById('inv-stat-bonifici'),
    invStatInvestimenti: document.getElementById('inv-stat-investimenti'),
    invStatSpese: document.getElementById('inv-stat-spese'),
    invStatSaldo: document.getElementById('inv-stat-saldo'),
    investmentHighlightedList: document.getElementById('investment-highlighted-list'),
    
    // Investment Lists
    investmentTransfersContainer: document.getElementById('investment-transfers-container'),
    investmentsContainer: document.getElementById('investments-container'),
    investmentMovementsContainer: document.getElementById('investment-movements-container'),
    investmentTransfersList: document.getElementById('investment-transfers-list'),
    investmentsList: document.getElementById('investments-list'),
    investmentMovementsList: document.getElementById('investment-movements-list'),
    
    // Menu Links
    navLinks: document.querySelectorAll('.nav-link'),

    loginScreen: document.getElementById('login-screen'),
    loginForm: document.getElementById('login-form'),
    loginError: document.getElementById('login-error'),
    logoutBtn: document.getElementById('logout-btn'),
    demoBtn: document.getElementById('demo-btn'),
    demoBadge: document.getElementById('demo-badge'),
    
    // Face ID Elements
    faceIdLoginBtn: document.getElementById('faceid-login-btn'),
    faceIdSetupModal: document.getElementById('faceid-setup-modal'),
    enableFaceIdBtn: document.getElementById('enable-faceid-btn'),
    skipFaceIdBtn: document.getElementById('skip-faceid-btn'),
    faceIdToggle: document.getElementById('faceid-toggle'),
    faceIdMenuItem: document.getElementById('faceid-menu-item'),
    securityAlertModal: document.getElementById('security-alert-modal'),
    dismissSecurityAlertBtn: document.getElementById('dismiss-security-alert-btn'),

    // Suggestions Elements
    expenseSuggestionsList: document.getElementById('expense-suggestions-list'),
    salarySuggestionsList: document.getElementById('salary-suggestions-list'),
    menuSuggestionsBtn: document.getElementById('menu-suggestions-btn'),
    suggestionsModal: document.getElementById('suggestions-modal'),
    closeSuggestionsModal: document.getElementById('close-suggestions-modal'),
    addSuggestionForm: document.getElementById('add-suggestion-form'),
    newSuggestionInput: document.getElementById('new-suggestion-input'),
    manageSuggestionsList: document.getElementById('manage-suggestions-list')
};

// Mode Config
const MODE_CONFIG = {
    home: {
        titleKey: 'view_home_title',
        container: DOM.homeContainer,
        group: 'expense'
    },
    expense: {
        titleKey: 'view_expense_title',
        container: DOM.expenseContainer,
        group: 'expense'
    },
    statistics: {
        titleKey: 'view_statistics_title',
        container: DOM.statisticsContainer,
        group: 'expense'
    },
    investment: {
        titleKey: 'view_investment_title',
        container: DOM.investmentContainer,
        group: 'investment'
    },
    salary: {
        titleKey: 'view_salary_title',
        container: DOM.salaryContainer,
        group: 'expense'
    },
    various: {
        titleKey: 'view_various_title',
        container: DOM.variousContainer,
        group: 'expense'
    },
    investmentTransfers: {
        titleKey: 'view_transfers_title',
        container: DOM.investmentTransfersContainer,
        group: 'investment'
    },
    investments: {
        titleKey: 'view_investments_title',
        container: DOM.investmentsContainer,
        group: 'investment'
    },
    investmentMovements: {
        titleKey: 'view_movements_title',
        container: DOM.investmentMovementsContainer,
        group: 'investment'
    }
};

// Global Mode Config (for top-right toggle)
const GLOBAL_MODE_CONFIG = {
    expense: {
        nextMode: 'investment',
        iconHTML: '<i class="ph ph-chart-line-up"></i>' // show chart to switch to investment
    },
    investment: {
        nextMode: 'expense',
        iconHTML: '<i class="ph ph-wallet"></i>' // show wallet to switch to expense
    }
};

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

function updateLastActivity() {
    if (state.user && !state.isDemo) {
        localStorage.setItem('last_activity', Date.now().toString());
    }
}

// Track user interactions to reset the inactivity timer
document.addEventListener('click', updateLastActivity);
document.addEventListener('touchstart', updateLastActivity);

// --- TRANSLATION UTILITIES ---
function t(key) {
    const lang = state.currentLanguage || 'it';
    if (translations[lang] && translations[lang][key] !== undefined) {
        return translations[lang][key];
    }
    if (translations['it'] && translations['it'][key] !== undefined) {
        return translations['it'][key];
    }
    return key;
}

function applyLanguage(lang) {
    if (lang !== 'it' && lang !== 'en') lang = 'it';
    state.currentLanguage = lang;
    document.documentElement.lang = lang;
    
    // Update language buttons active state in menu
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Translate all [data-i18n]
    document.querySelectorAll('[data-i18n]').forEach(el => {
        let key = el.getAttribute('data-i18n');
        if (state.isDemo) {
            if (key === 'section_reply_salary') key = 'section_demo_salary';
            else if (key === 'widget_reply_gross') key = 'widget_demo_salary_gross';
            else if (key === 'widget_reply_spendable') key = 'widget_demo_salary_spendable';
            else if (key === 'widget_reply_saved') key = 'widget_demo_salary_saved';
        }
        const text = t(key);
        if (text) el.innerHTML = text;
    });

    // Translate all [data-i18n-placeholder]
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const text = t(key);
        if (text) el.placeholder = text;
    });

    // Update Top App Title
    const currentViewKey = state.views[state.globalMode];
    const viewConfig = MODE_CONFIG[currentViewKey];
    if (viewConfig && DOM.appTitle) {
        DOM.appTitle.textContent = t(viewConfig.titleKey);
    }

    // Refresh dynamic lists if user is logged in
    if (state.user) {
        loadRecentAccreditations();
        loadSalaryCredits();
        loadVariousAccreditations();
        loadExpenses();
        loadInvestmentTransfers();
        loadInvestments();
        loadInvestmentMovements();
        loadInvestmentHighlights();
        renderExpenseSuggestionsChips();
        renderSalarySuggestionChip();
        renderManageSuggestionsList();
    }
}

function setLanguage(lang) {
    if (lang !== 'it' && lang !== 'en') lang = 'it';
    state.currentLanguage = lang;
    localStorage.setItem('finance_app_lang', lang);
    applyLanguage(lang);
}

// Initialize App
async function init() {
    setupEventListeners();
    applyLanguage(state.currentLanguage);
    await checkSession();
    updateUI();
    await updateFaceIdUI();
    
    // Set current month string (YYYY-MM) as default
    const now = new Date();
    const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    state.expenseSelectedMonth = currentMonthStr;
    const monthInput = document.getElementById('expense-month-input');
    if (monthInput) monthInput.value = currentMonthStr;
    
    // Load initial data if logged in
    if (state.user) {
        await loadRecentAccreditations();
        await loadSalaryCredits();
        await loadVariousAccreditations();
        await loadExpenses();
        await loadInvestmentTransfers();
        await loadInvestments();
        await loadInvestmentMovements();
        await calculateStatistics();
        await syncLedgerStatus();
        // If syncLedgerStatus handled anything, it will automatically update UI.
        await calculateInvestmentStatistics();
        await loadInvestmentHighlights();
        await loadExpenseSuggestions();
        checkAndShowSecurityAlert();
    } else {
        if (getLockoutRemainingMs() > 0) {
            startLockoutCountdown();
        }
    }
}

// Utility per prevenire XSS
function escapeHTML(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/[&<>'"]/g, function(tag) {
        const charsToReplace = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        };
        return charsToReplace[tag] || tag;
    });
}

// Helper for currency formatting with optional hiding
function formatCurrency(amount, prefix = '') {
    return `${prefix}€${parseFloat(amount).toFixed(2)}`;
}

// Update Privacy Mode visually
function applyPrivacyMode() {
    if (state.hideValues) {
        document.body.classList.add('amounts-hidden');
    } else {
        document.body.classList.remove('amounts-hidden');
    }
    
    // Sync toggles
    const loginToggle = document.getElementById('hide-amounts-toggle');
    const menuToggle = document.getElementById('privacy-toggle');
    if (loginToggle) loginToggle.checked = state.hideValues;
    if (menuToggle) menuToggle.checked = state.hideValues;
}

function hideSplashScreen() {
    const splash = document.getElementById('splash-screen');
    if (splash && splash.style.display !== 'none') {
        splash.style.opacity = '0';
        setTimeout(() => splash.style.display = 'none', 300);
    }
}

let pendingFaceIdEnrollment = null;

// --- SECURITY: 24h Lockout & Email Alert on Failed Attempts ---
const SECURITY_CONFIG = {
    ALERT_EMAIL: 'vito3136@gmail.com',
    MAX_FAILED_ATTEMPTS: 2,
    LOCKOUT_DURATION_MS: 24 * 60 * 60 * 1000, // 24 ore
    ATTEMPT_EXPIRY_MS: 60 * 60 * 1000 // 1 ora di validità per il singolo errore
};

function getFailedAttemptsCount() {
    const lastFailedAt = parseInt(localStorage.getItem('security_last_failed_at') || '0', 10);
    // Se è passata più di 1 ora dall'ultimo errore e non c'è un blocco attivo, azzera il conteggio
    if (lastFailedAt && (Date.now() - lastFailedAt > SECURITY_CONFIG.ATTEMPT_EXPIRY_MS) && getLockoutRemainingMs() === 0) {
        localStorage.removeItem('security_failed_attempts');
        localStorage.removeItem('security_last_failed_at');
        return 0;
    }
    return parseInt(localStorage.getItem('security_failed_attempts') || '0', 10);
}

let lockoutTimerInterval = null;

function getLockoutRemainingMs() {
    const lockoutUntil = parseInt(localStorage.getItem('security_lockout_until') || '0', 10);
    const remaining = lockoutUntil - Date.now();
    return remaining > 0 ? remaining : 0;
}

function formatRemainingTime(ms) {
    const totalSec = Math.ceil(ms / 1000);
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${seconds}s`;
}

function updateLockoutUI() {
    const remaining = getLockoutRemainingMs();
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitBtn = document.getElementById('submit-login');

    if (remaining > 0) {
        if (emailInput) emailInput.disabled = true;
        if (passwordInput) passwordInput.disabled = true;
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.5';
            submitBtn.style.cursor = 'not-allowed';
        }
        if (DOM.loginError) {
            const timeStr = formatRemainingTime(remaining);
            const msg = t('alert_security_locked').replace('{time}', timeStr);
            DOM.loginError.innerHTML = `<i class="ph ph-shield-warning" style="margin-right: 6px; font-size: 16px;"></i> ${msg}`;
            DOM.loginError.style.display = 'block';
        }
    } else {
        if (localStorage.getItem('security_lockout_until')) {
            localStorage.removeItem('security_lockout_until');
            localStorage.removeItem('security_failed_attempts');
            localStorage.removeItem('security_last_failed_at');
        }
        if (emailInput) emailInput.disabled = false;
        if (passwordInput) passwordInput.disabled = false;
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '';
            submitBtn.style.cursor = 'pointer';
        }
        if (lockoutTimerInterval) {
            clearInterval(lockoutTimerInterval);
            lockoutTimerInterval = null;
        }
    }
}

function startLockoutCountdown() {
    if (lockoutTimerInterval) clearInterval(lockoutTimerInterval);
    updateLockoutUI();
    lockoutTimerInterval = setInterval(updateLockoutUI, 1000);
}

function clearSecurityLockout() {
    localStorage.removeItem('security_failed_attempts');
    localStorage.removeItem('security_last_failed_at');
    localStorage.removeItem('security_lockout_until');
    if (lockoutTimerInterval) {
        clearInterval(lockoutTimerInterval);
        lockoutTimerInterval = null;
    }
    updateLockoutUI();
}

async function sendFailedLoginAlertEmail(attemptedEmail, failedCount, isLocked) {
    try {
        // 1. Invoca la Edge Function nativa di Supabase (che invia l'email tramite Resend API)
        const { data, error } = await rawSupabase.functions.invoke('security-alert', {
            body: {
                attemptedEmail: attemptedEmail || '',
                failedCount: failedCount,
                isLocked: isLocked,
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString()
            }
        });

        if (error) {
            console.warn("Supabase Edge Function alert notice:", error);
        } else {
            console.log("Supabase security alert sent via Resend:", data);
        }

        // 2. Registra anche nella tabella security_logs su Supabase (se creata)
        try {
            await rawSupabase.from('security_logs').insert([{
                attempted_email: attemptedEmail || '',
                failed_count: failedCount,
                is_locked: isLocked,
                user_agent: navigator.userAgent
            }]);
        } catch (dbErr) {
            console.warn("DB security log notice:", dbErr);
        }
    } catch (err) {
        console.warn("Could not dispatch security alert:", err);
    }
}

function checkAndShowSecurityAlert() {
    const alertDataStr = localStorage.getItem('security_last_alert');
    if (!alertDataStr) return;
    try {
        const alertData = JSON.parse(alertDataStr);
        const dateStr = new Date(alertData.timestamp).toLocaleString(state.currentLanguage === 'en' ? 'en-US' : 'it-IT');
        const descEl = document.getElementById('security-modal-desc');
        const safeEmail = escapeHTML(alertData.attemptedEmail || 'non specificata');
        if (descEl) {
            if (state.currentLanguage === 'en') {
                descEl.innerHTML = `Unauthorized sign-in attempt detected on <strong>${dateStr}</strong> (attempted email: <em>${safeEmail}</em>).<br><br>A security alert email was sent to <strong>${SECURITY_CONFIG.ALERT_EMAIL}</strong>.`;
            } else {
                descEl.innerHTML = `Rilevato tentativo di accesso non autorizzato il <strong>${dateStr}</strong> (email digitata: <em>${safeEmail}</em>).<br><br>È stata inviata un'email di allerta a <strong>${SECURITY_CONFIG.ALERT_EMAIL}</strong>.`;
            }
        }
        if (DOM.securityAlertModal) {
            DOM.securityAlertModal.classList.add('active');
        }
    } catch (e) {
        console.warn("Error displaying security alert:", e);
    }
}

async function updateFaceIdUI() {
    const isAvail = await isFaceIdAvailable();
    const isEnrolled = isFaceIdEnrolled();

    if (DOM.faceIdLoginBtn) {
        DOM.faceIdLoginBtn.style.display = (isAvail && isEnrolled) ? 'flex' : 'none';
    }

    if (DOM.faceIdMenuItem) {
        DOM.faceIdMenuItem.style.display = isAvail ? 'flex' : 'none';
    }

    if (DOM.faceIdToggle) {
        DOM.faceIdToggle.checked = isEnrolled;
    }
}

function showLoginScreen() {
    const remaining = getLockoutRemainingMs();
    if (remaining > 0) {
        startLockoutCountdown();
    } else {
        document.getElementById('email').removeAttribute('disabled');
        document.getElementById('password').removeAttribute('disabled');
    }
    DOM.loginScreen.classList.add('active');
    updateFaceIdUI();
}

function resetEditMode(type) {
    state.editContext = { active: false, type: null, id: null };
    if (type === 'salary') {
        document.getElementById('salary-modal-title').textContent = t('modal_add_salary_title');
        document.getElementById('salary-submit-btn').textContent = t('btn_save_credit');
        const form = document.getElementById('add-salary-form');
        if(form) form.reset();
    } else if (type === 'various') {
        document.getElementById('various-modal-title').textContent = t('modal_add_various_title');
        document.getElementById('various-submit-btn').textContent = t('btn_save_various');
        const form = document.getElementById('add-various-form');
        if(form) form.reset();
    } else if (type === 'expense') {
        document.getElementById('expense-modal-title').textContent = t('modal_add_expense_title');
        document.getElementById('expense-submit-btn').textContent = t('btn_save_expense');
        const form = document.getElementById('add-expense-form');
        if(form) form.reset();
        if (DOM.expenseSuggestionsList) {
            DOM.expenseSuggestionsList.querySelectorAll('.suggestion-chip').forEach(c => c.classList.remove('active'));
        }
    } else if (type === 'bonifico') {
        document.getElementById('bonifico-modal-title').textContent = t('modal_add_bonifico_title');
        document.getElementById('bonifico-submit-btn').textContent = t('btn_save_bonifico');
        const form = document.getElementById('add-bonifico-form');
        if(form) form.reset();
    } else if (type === 'investimento') {
        document.getElementById('investimento-modal-title').textContent = t('modal_add_investimento_title');
        document.getElementById('investimento-submit-btn').textContent = t('btn_save_investimento');
        const form = document.getElementById('add-investimento-form');
        if(form) form.reset();
    } else if (type === 'movimento') {
        document.getElementById('movimento-modal-title').textContent = t('modal_add_movimento_title');
        document.getElementById('movimento-submit-btn').textContent = t('btn_save_movimento');
        const form = document.getElementById('add-movimento-form');
        if(form) form.reset();
    }
}

// Check if user is already logged in and session hasn't expired
async function checkSession() {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (session) {
        const lastActivity = localStorage.getItem('last_activity');
        const now = Date.now();
        
        // If more than 30 minutes passed since last activity, auto-logout
        if (lastActivity && (now - parseInt(lastActivity, 10)) > INACTIVITY_TIMEOUT) {
            console.log("Session expired due to inactivity");
            await supabase.auth.signOut();
            state.user = null;
            state.hideValues = false;
            const toggleEl = document.getElementById('hide-amounts-toggle');
            if (toggleEl) toggleEl.checked = false;
            localStorage.removeItem('last_activity');
            showLoginScreen();
            hideSplashScreen();
            return;
        }

        // Session valid
        updateLastActivity();
        state.user = session.user;
        DOM.loginScreen.classList.remove('active');
        
        // Leggi il toggle per la sessione corrente
        const hideToggle = document.getElementById('hide-amounts-toggle');
        if (hideToggle) {
            state.hideValues = hideToggle.checked;
        }
        applyPrivacyMode();
    } else {
        // Show login screen
        state.hideValues = false;
        applyPrivacyMode();
        showLoginScreen();
    }
    
    // Hide splash screen after session check is done
    hideSplashScreen();
}

// Setup Event Listeners
function setupEventListeners() {
    // Mode Toggle (Top-right button)
    DOM.toggleModeBtn.addEventListener('click', () => {
        if (navigator.vibrate) navigator.vibrate(50);
        state.globalMode = GLOBAL_MODE_CONFIG[state.globalMode].nextMode;
        updateUI();
    });

    // Menu Toggle
    DOM.menuBtn.addEventListener('click', toggleMenu);
    DOM.closeMenuBtn.addEventListener('click', toggleMenu);
    DOM.menuOverlay.addEventListener('click', toggleMenu);

    // Privacy Toggle (Side Menu)
    const privacyToggle = document.getElementById('privacy-toggle');
    if (privacyToggle) {
        privacyToggle.addEventListener('change', (e) => {
            state.hideValues = e.target.checked;
            applyPrivacyMode();
        });
    }

    // Language Switcher (Side Menu)
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const selectedLang = btn.getAttribute('data-lang');
            if (selectedLang && selectedLang !== state.currentLanguage) {
                setLanguage(selectedLang);
                if (navigator.vibrate) navigator.vibrate(30);
            }
        });
    });

    // Face ID Toggle (Side Menu)
    if (DOM.faceIdToggle) {
        DOM.faceIdToggle.addEventListener('change', async (e) => {
            if (navigator.vibrate) navigator.vibrate(30);
            if (!e.target.checked) {
                removeFaceId();
                await updateFaceIdUI();
                alert(t('alert_faceid_disabled'));
            } else {
                const promptMsg = state.currentLanguage === 'en' 
                    ? 'Enter your current password to enable Face ID on this device:' 
                    : 'Inserisci la tua password attuale per attivare Face ID su questo dispositivo:';
                const pwd = prompt(promptMsg);
                if (pwd && state.user && state.user.email) {
                    try {
                        await registerFaceId(state.user.email, pwd);
                        await updateFaceIdUI();
                        alert(t('alert_faceid_enabled'));
                    } catch (err) {
                        console.error("Face ID toggle enable error:", err);
                        e.target.checked = false;
                        alert(t('alert_faceid_failed'));
                    }
                } else {
                    e.target.checked = false;
                }
            }
        });
    }

    // List Edit Mode Toggles
    const editToggles = document.querySelectorAll('.edit-list-toggle');
    editToggles.forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            const btn = e.target;
            const listType = btn.getAttribute('data-list');
            state.listEditModes[listType] = btn.checked;
            
            // Find the associated list container
            let listContainer;
            if (listType === 'salary') listContainer = document.getElementById('salary-credits-list');
            if (listType === 'various') listContainer = document.getElementById('various-accreditations-list');
            if (listType === 'expense') listContainer = document.getElementById('expenses-list');
            if (listType === 'bonifico') listContainer = document.getElementById('investment-transfers-list');
            if (listType === 'investimento') listContainer = document.getElementById('investments-list');
            if (listType === 'movimento') listContainer = document.getElementById('investment-movements-list');
            
            if (listContainer) {
                if (state.listEditModes[listType]) {
                    listContainer.classList.add('list-edit-mode');
                } else {
                    listContainer.classList.remove('list-edit-mode');
                }
            }
        });
    });

    // List item edit click delegation
    document.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.edit-icon-item');
        if (editBtn) {
            const listType = editBtn.getAttribute('data-type');
            const itemId = editBtn.getAttribute('data-id');
            const itemData = JSON.parse(decodeURIComponent(editBtn.getAttribute('data-json')));
            
            state.editContext = { active: true, type: listType, id: itemId };
            
            if (listType === 'salary') {
                document.getElementById('salary-modal-title').textContent = t('modal_edit_salary_title');
                document.getElementById('salary-submit-btn').textContent = t('btn_update_credit');
                document.getElementById('salary-amount').value = itemData.total_amount;
                document.getElementById('salary-spendable').value = itemData.spendable_amount;
                document.getElementById('salary-date').value = itemData.credit_date;
                document.getElementById('salary-desc').value = itemData.description || '';
                renderSalarySuggestionChip();
                
                const modal = document.getElementById('add-salary-modal');
                if (modal) modal.classList.add('active');
            } else if (listType === 'various') {
                document.getElementById('various-modal-title').textContent = t('modal_edit_various_title');
                document.getElementById('various-submit-btn').textContent = t('btn_update_various');
                document.getElementById('various-amount').value = itemData.total_amount;
                document.getElementById('various-spendable').value = itemData.spendable_amount;
                document.getElementById('various-date').value = itemData.credit_date;
                document.getElementById('various-desc').value = itemData.description || '';
                
                const modal = document.getElementById('add-various-modal');
                if (modal) modal.classList.add('active');
            } else if (listType === 'expense') {
                document.getElementById('expense-modal-title').textContent = t('modal_edit_expense_title');
                document.getElementById('expense-submit-btn').textContent = t('btn_update_expense');
                document.getElementById('expense-amount').value = itemData.amount;
                document.getElementById('expense-date').value = itemData.expense_date;
                document.getElementById('expense-desc').value = itemData.description || '';
                renderExpenseSuggestionsChips();
                
                if (DOM.addExpenseModal) DOM.addExpenseModal.classList.add('active');
            } else if (listType === 'bonifico') {
                document.getElementById('bonifico-modal-title').textContent = t('modal_edit_bonifico_title');
                document.getElementById('bonifico-submit-btn').textContent = t('btn_update_bonifico');
                document.getElementById('bonifico-amount').value = itemData.amount;
                document.getElementById('bonifico-date').value = itemData.date;
                
                const modal = document.getElementById('add-bonifico-modal');
                if (modal) modal.classList.add('active');
            } else if (listType === 'investimento') {
                document.getElementById('investimento-modal-title').textContent = t('modal_edit_investimento_title');
                document.getElementById('investimento-submit-btn').textContent = t('btn_update_investimento');
                document.getElementById('investimento-amount').value = itemData.amount;
                document.getElementById('investimento-date').value = itemData.date;
                document.getElementById('investimento-desc').value = itemData.description || '';
                
                const modal = document.getElementById('add-investimento-modal');
                if (modal) modal.classList.add('active');
            } else if (listType === 'movimento') {
                document.getElementById('movimento-modal-title').textContent = t('modal_edit_movimento_title');
                document.getElementById('movimento-submit-btn').textContent = t('btn_update_movimento');
                document.getElementById('movimento-amount').value = itemData.amount;
                document.getElementById('movimento-date').value = itemData.date;
                document.getElementById('movimento-desc').value = itemData.description || '';
                document.getElementById('movimento-highlighted').checked = itemData.is_highlighted || false;
                
                const modal = document.getElementById('add-movimento-modal');
                if (modal) modal.classList.add('active');
            }
        }

        const deleteBtn = e.target.closest('.delete-icon-item');
        if (deleteBtn) {
            const listType = deleteBtn.getAttribute('data-type');
            const itemId = deleteBtn.getAttribute('data-id');
            if (confirm(t('confirm_delete'))) {
                deleteItem(listType, itemId);
            }
        }
    });

    // List Item Delete Handler
    async function deleteItem(type, id) {
        if (!state.user) return;
        
        let table = '';
        if (type === 'salary') table = 'salary_credits';
        else if (type === 'various') table = 'various_accreditations';
        else if (type === 'expense') table = 'expenses';
        else if (type === 'bonifico') table = 'investment_transfers';
        else if (type === 'investimento') table = 'investments';
        else if (type === 'movimento') table = 'investment_movements';

        try {
            const { error } = await supabase.from(table).delete().eq('id', id);
            if (error) throw error;
            
            // Aggiorna lo stato globale ed UI
            if (['bonifico', 'investimento', 'movimento'].includes(type)) {
                await calculateInvestmentStatistics();
                loadInvestmentMovements();
                loadInvestmentHighlights();
            } else {
                await calculateStatistics();
                await syncLedgerStatus();
                loadSalaryCredits();
                loadRecentAccreditations();
                loadExpenses();
            }
        } catch (error) {
            console.error("Error deleting item:", error);
            alert(t('alert_delete_error') + error.message);
        }
    }

    // Nav Links (Side Menu)
    DOM.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const target = e.currentTarget.getAttribute('data-target');
            let newView = 'home';
            
            // Map container id to state view
            if (target === 'salary-container') newView = 'salary';
            else if (target === 'various-container') newView = 'various';
            else if (target === 'expense-container') newView = 'expense';
            else if (target === 'statistics-container') newView = 'statistics';
            else if (target === 'investment-container') newView = 'investment';
            else if (target === 'investment-transfers-container') newView = 'investmentTransfers';
            else if (target === 'investments-container') newView = 'investments';
            else if (target === 'investment-movements-container') newView = 'investmentMovements';
            else if (target === 'home-container') newView = 'home';
            
            if (state.views[state.globalMode] !== newView) {
                if (navigator.vibrate) navigator.vibrate(50);
                state.views[state.globalMode] = newView;
                updateUI();
            }
            toggleMenu(); // Close menu
        });
    });
    
    // Expenses View Toggle
    const toggleAll = document.getElementById('toggle-all-expenses');
    const toggleMonth = document.getElementById('toggle-month-expenses');
    const monthSelector = document.getElementById('month-selector-container');
    const monthInput = document.getElementById('expense-month-input');

    if (toggleAll && toggleMonth && monthSelector && monthInput) {
        toggleAll.addEventListener('click', () => {
            if (state.expenseViewMode === 'all') return;
            state.expenseViewMode = 'all';
            toggleAll.classList.add('active');
            toggleMonth.classList.remove('active');
            monthSelector.style.display = 'none';
            loadExpenses();
        });

        toggleMonth.addEventListener('click', () => {
            if (state.expenseViewMode === 'month') return;
            state.expenseViewMode = 'month';
            toggleMonth.classList.add('active');
            toggleAll.classList.remove('active');
            monthSelector.style.display = 'block';
            loadExpenses();
        });

        monthInput.addEventListener('change', (e) => {
            state.expenseSelectedMonth = e.target.value; // 'YYYY-MM'
            if (state.expenseViewMode === 'month') {
                loadExpenses();
            }
        });
    }
    
    // Logout / Exit Demo Logic
    if (DOM.logoutBtn) {
        DOM.logoutBtn.addEventListener('click', async () => {
            if (navigator.vibrate) navigator.vibrate(50);
            
            if (state.isDemo) {
                exitDemoMode();
                return;
            }

            // Chiudi il menu
            toggleMenu();
            
            // Esegui il sign out su Supabase
            await supabase.auth.signOut();
            
            // Pulisci lo stato e mostra la schermata di login
            state.user = null;
            state.hideValues = false;
            const toggleEl = document.getElementById('hide-amounts-toggle');
            if (toggleEl) toggleEl.checked = false;
            showLoginScreen();
        });
    }

    // Check session again when app comes to foreground
    document.addEventListener('visibilitychange', async () => {
        if (document.visibilityState === 'visible' && state.user && !state.isDemo) {
            await checkSession();
        }
    });

    // REAL Login Form Submit with Supabase
    DOM.loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Ensure demo mode is off for real login
        state.isDemo = false;
        state.demoData = null;
        if (DOM.demoBadge) DOM.demoBadge.style.display = 'none';
        applyLanguage(state.currentLanguage);

        if (getLockoutRemainingMs() > 0) {
            e.preventDefault();
            updateLockoutUI();
            return;
        }

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Close keyboard on mobile (Face ID / Autofill bug fix)
        // Eseguito leggermente in ritardo per non bloccare l'evento submit nativo di Safari
        setTimeout(() => {
            if (document.activeElement) {
                document.activeElement.blur();
            }
            document.getElementById('email').blur();
            document.getElementById('password').blur();
        }, 150);
        const submitBtn = document.getElementById('submit-login');

        // Reset previous errors
        DOM.loginError.style.display = 'none';

        // Loading state
        submitBtn.innerHTML = t('btn_signing_in');
        submitBtn.disabled = true;

        // Chiamata reale a Supabase per il login
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            // Login Fallito - Gestione sicurezza e blocco 24 ore con scadenza errore singolo a 1 ora
            const previousFailed = getFailedAttemptsCount();
            const currentFailed = previousFailed + 1;
            const now = Date.now();

            localStorage.setItem('security_failed_attempts', currentFailed.toString());
            localStorage.setItem('security_last_failed_at', now.toString());

            const isLocked = currentFailed >= SECURITY_CONFIG.MAX_FAILED_ATTEMPTS;
            if (isLocked) {
                const lockoutUntil = now + SECURITY_CONFIG.LOCKOUT_DURATION_MS;
                localStorage.setItem('security_lockout_until', lockoutUntil.toString());
            }

            // Salva record per avviso visivo al rientro
            const alertRecord = {
                timestamp: new Date().toISOString(),
                attemptedEmail: email,
                failedCount: currentFailed,
                isLocked: isLocked
            };
            localStorage.setItem('security_last_alert', JSON.stringify(alertRecord));

            // Invia email di allerta a vito3136@gmail.com
            sendFailedLoginAlertEmail(email, currentFailed, isLocked);

            if (isLocked) {
                startLockoutCountdown();
            } else {
                DOM.loginError.textContent = t('alert_security_attempt_warning');
                DOM.loginError.style.display = 'block';
                submitBtn.innerHTML = t('btn_signin');
                submitBtn.disabled = false;
            }
        } else {
            // Login Successo - Reset blocco sicurezza
            clearSecurityLockout();
            state.user = data.user;
            
            // Leggi il toggle per nascondere le cifre
            const hideToggle = document.getElementById('hide-amounts-toggle');
            if (hideToggle) {
                state.hideValues = hideToggle.checked;
                applyPrivacyMode();
            }
            
            updateLastActivity();
            DOM.loginScreen.classList.remove('active');
            submitBtn.innerHTML = t('btn_signin');
            submitBtn.disabled = false;
            
            // Reset scroll position to top
            window.scrollTo(0, 0);

            // Carica i dati iniziali
            await loadRecentAccreditations();
            await loadSalaryCredits();
            await loadVariousAccreditations();
            await loadExpenses();
            await loadInvestmentTransfers();
            await loadInvestments();
            await loadInvestmentMovements();
            await calculateStatistics();
            await calculateInvestmentStatistics();
            await loadInvestmentHighlights();
            await loadExpenseSuggestions();

            // Mostra avviso di sicurezza se ci sono stati tentativi non autorizzati
            checkAndShowSecurityAlert();

            // Proponi l'attivazione di Face ID se supportato e non ancora configurato
            try {
                const isAvail = await isFaceIdAvailable();
                const isEnrolled = isFaceIdEnrolled();
                const dismissed = sessionStorage.getItem('faceid_prompt_dismissed');

                if (isAvail && !isEnrolled && !dismissed && DOM.faceIdSetupModal) {
                    pendingFaceIdEnrollment = { email, password };
                    DOM.faceIdSetupModal.classList.add('active');
                }
            } catch (faceIdCheckErr) {
                console.warn("Face ID check warning:", faceIdCheckErr);
            }

            // Pulisci il campo password
            document.getElementById('password').value = '';
        }
    });

    // Face ID Direct Login Button Logic
    function resetFaceIdLoginBtn() {
        if (!DOM.faceIdLoginBtn) return;
        DOM.faceIdLoginBtn.disabled = false;
        DOM.faceIdLoginBtn.innerHTML = `
            <svg class="faceid-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="22" height="22">
                <path d="M7 3H5a2 2 0 0 0-2 2v2m0 10v2a2 2 0 0 0 2 2h2m10 0h2a2 2 0 0 0 2-2v-2m0-10V5a2 2 0 0 0-2-2h-2"/>
                <path d="M9 10h.01M15 10h.01"/>
                <path d="M10 14c.5 1 1.5 1.5 2 1.5s1.5-.5 2-1.5"/>
                <path d="M12 11v2"/>
            </svg>
            <span data-i18n="btn_signin_faceid">${t('btn_signin_faceid')}</span>
        `;
    }

    if (DOM.faceIdLoginBtn) {
        DOM.faceIdLoginBtn.addEventListener('click', async () => {
            if (navigator.vibrate) navigator.vibrate(50);
            DOM.loginError.style.display = 'none';

            DOM.faceIdLoginBtn.disabled = true;
            DOM.faceIdLoginBtn.innerHTML = `<i class="ph ph-spinner ph-spin"></i> ${t('btn_signing_in')}`;

            try {
                const creds = await authenticateWithFaceId();
                if (!creds || !creds.email || !creds.password) {
                    throw new Error("Credenziali biometriche non valide.");
                }

                // Ensure demo mode is off for real login
                state.isDemo = false;
                state.demoData = null;
                if (DOM.demoBadge) DOM.demoBadge.style.display = 'none';
                applyLanguage(state.currentLanguage);

                const { data, error } = await supabase.auth.signInWithPassword({
                    email: creds.email,
                    password: creds.password
                });

                if (error) {
                    DOM.loginError.textContent = error.message;
                    DOM.loginError.style.display = 'block';
                    resetFaceIdLoginBtn();
                    return;
                }

                // Login successo con Face ID - Reset eventuale blocco password
                clearSecurityLockout();
                state.user = data.user;
                const hideToggle = document.getElementById('hide-amounts-toggle');
                if (hideToggle) {
                    state.hideValues = hideToggle.checked;
                    applyPrivacyMode();
                }

                updateLastActivity();
                DOM.loginScreen.classList.remove('active');
                resetFaceIdLoginBtn();

                window.scrollTo(0, 0);

                await loadRecentAccreditations();
                await loadSalaryCredits();
                await loadVariousAccreditations();
                await loadExpenses();
                await loadInvestmentTransfers();
                await loadInvestments();
                await loadInvestmentMovements();
                await calculateStatistics();
                await calculateInvestmentStatistics();
                await loadInvestmentHighlights();
                await loadExpenseSuggestions();

                // Mostra avviso di sicurezza se ci sono stati tentativi non autorizzati
                checkAndShowSecurityAlert();

            } catch (err) {
                console.warn("Face ID login issue:", err);
                resetFaceIdLoginBtn();

                if (err && err.name !== 'NotAllowedError') {
                    DOM.loginError.textContent = t('alert_faceid_failed');
                    DOM.loginError.style.display = 'block';
                }
            }
        });
    }

    // Face ID Setup Modal Action Handlers
    if (DOM.enableFaceIdBtn) {
        DOM.enableFaceIdBtn.addEventListener('click', async () => {
            if (!pendingFaceIdEnrollment) return;
            try {
                DOM.enableFaceIdBtn.disabled = true;
                await registerFaceId(pendingFaceIdEnrollment.email, pendingFaceIdEnrollment.password);
                if (DOM.faceIdSetupModal) DOM.faceIdSetupModal.classList.remove('active');
                await updateFaceIdUI();
                alert(t('alert_faceid_enabled'));
            } catch (err) {
                console.error("Face ID enrollment error:", err);
                alert(t('alert_faceid_failed'));
            } finally {
                DOM.enableFaceIdBtn.disabled = false;
                pendingFaceIdEnrollment = null;
            }
        });
    }

    if (DOM.skipFaceIdBtn) {
        DOM.skipFaceIdBtn.addEventListener('click', () => {
            sessionStorage.setItem('faceid_prompt_dismissed', '1');
            if (DOM.faceIdSetupModal) DOM.faceIdSetupModal.classList.remove('active');
            pendingFaceIdEnrollment = null;
        });
    }

    if (DOM.dismissSecurityAlertBtn) {
        DOM.dismissSecurityAlertBtn.addEventListener('click', () => {
            localStorage.removeItem('security_last_alert');
            if (DOM.securityAlertModal) DOM.securityAlertModal.classList.remove('active');
        });
    }

    // Demo Mode Handlers
    async function enterDemoMode() {
        state.isDemo = true;
        state.demoData = getInitialDemoData();
        state.user = {
            id: 'demo-user-id',
            email: 'demo@ditrani.finance'
        };

        // Reset previous login errors & fields
        DOM.loginError.style.display = 'none';
        document.getElementById('password').value = '';

        // Read privacy toggle state
        const hideToggle = document.getElementById('hide-amounts-toggle');
        if (hideToggle) {
            state.hideValues = hideToggle.checked;
            applyPrivacyMode();
        }

        // Hide login screen
        DOM.loginScreen.classList.remove('active');

        // Show DEMO badge
        if (DOM.demoBadge) {
            DOM.demoBadge.style.display = 'inline-block';
        }

        // Apply translations for demo mode (e.g. generic salary labels)
        applyLanguage(state.currentLanguage);

        // Update logout button to "Esci dalla demo"
        if (DOM.logoutBtn) {
            const span = DOM.logoutBtn.querySelector('span');
            if (span) {
                span.setAttribute('data-i18n', 'menu_exit_demo');
                span.textContent = t('menu_exit_demo');
            }
        }

        // Reset view to Homepage
        state.globalMode = 'expense';
        state.views.expense = 'home';
        updateUI();

        window.scrollTo(0, 0);

        // Load all mock demo data
        await loadRecentAccreditations();
        await loadSalaryCredits();
        await loadVariousAccreditations();
        await loadExpenses();
        await loadInvestmentTransfers();
        await loadInvestments();
        await loadInvestmentMovements();
        await calculateStatistics();
        await syncLedgerStatus();
        await calculateInvestmentStatistics();
        await loadInvestmentHighlights();
        await loadExpenseSuggestions();
    }

    function exitDemoMode() {
        if (state.isMenuOpen) {
            toggleMenu();
        }

        state.isDemo = false;
        state.demoData = null;
        state.user = null;
        state.hideValues = false;

        // Restore normal translations (e.g. Reply salary labels)
        applyLanguage(state.currentLanguage);

        // Restore logout button label
        if (DOM.logoutBtn) {
            const span = DOM.logoutBtn.querySelector('span');
            if (span) {
                span.setAttribute('data-i18n', 'menu_logout');
                span.textContent = t('menu_logout');
            }
        }

        // Hide DEMO badge
        if (DOM.demoBadge) {
            DOM.demoBadge.style.display = 'none';
        }

        // Reset privacy toggle
        const toggleEl = document.getElementById('hide-amounts-toggle');
        if (toggleEl) toggleEl.checked = false;
        applyPrivacyMode();

        showLoginScreen();
    }

    // Demo Button Logic
    if (DOM.demoBtn) {
        DOM.demoBtn.addEventListener('click', async () => {
            if (navigator.vibrate) navigator.vibrate(50);
            await enterDemoMode();
        });
    }

    // Add Salary Modal Logic
    const btnAddSalary = document.getElementById('btn-add-salary');
    const btnAddSalaryPage = document.getElementById('btn-add-salary-page');
    const addSalaryModal = document.getElementById('add-salary-modal');
    const closeSalaryModal = document.getElementById('close-salary-modal');
    const addSalaryForm = document.getElementById('add-salary-form');

    if ((btnAddSalary || btnAddSalaryPage) && addSalaryModal && closeSalaryModal && addSalaryForm) {
        
        const openSalaryModal = () => {
            if (navigator.vibrate) navigator.vibrate(50);
            // Default date to today
            document.getElementById('salary-date').valueAsDate = new Date();
            renderSalarySuggestionChip();
            addSalaryModal.classList.add('active');
        };

        // Open modal from homepage button
        if (btnAddSalary) btnAddSalary.addEventListener('click', openSalaryModal);
        // Open modal from salary page button
        if (btnAddSalaryPage) btnAddSalaryPage.addEventListener('click', openSalaryModal);

        // Close modal
        closeSalaryModal.addEventListener('click', () => {
            addSalaryModal.classList.remove('active');
            resetEditMode('salary');
        });

        // Submit form
        addSalaryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const amount = parseFloat(document.getElementById('salary-amount').value);
            const spendable = parseFloat(document.getElementById('salary-spendable').value);
            const date = document.getElementById('salary-date').value;
            const description = document.getElementById('salary-desc').value;
            const submitBtn = addSalaryForm.querySelector('button[type="submit"]');

            if (amount <= 0) {
                alert(t('alert_amount_greater_zero'));
                return;
            }
            if (spendable > amount) {
                alert(t('alert_spendable_greater_total'));
                return;
            }

            // Loading state
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = t('btn_saving');
            submitBtn.disabled = true;

            // Insert or Update into Supabase
            let res;
            if (state.editContext.active && state.editContext.type === 'salary') {
                res = await supabase
                    .from('salary_credits')
                    .update({ 
                        total_amount: amount, 
                        spendable_amount: spendable, 
                        credit_date: date, 
                        description: description 
                    })
                    .eq('id', state.editContext.id);
            } else {
                res = await supabase
                    .from('salary_credits')
                    .insert([
                        { 
                            user_id: state.user.id,
                            total_amount: amount, 
                            spendable_amount: spendable, 
                            credit_date: date, 
                            description: description 
                        }
                    ]);
            }
            const { data, error } = res;

            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;

            if (error) {
                console.error("Error saving salary:", error);
                alert(t('alert_save_error') + error.message);
            } else {
                alert(state.editContext.active ? t('alert_salary_updated') : t('alert_salary_saved'));
                addSalaryModal.classList.remove('active');
                resetEditMode('salary');
                
                // Important: Calculate statistics first to update state.totalRemaining
                await calculateStatistics();
                // Then sync ledger if the budget allows or drops
                await syncLedgerStatus();
                
                // Finally reload UI elements to reflect new data
                loadRecentAccreditations(); 
                loadSalaryCredits(); 
                loadExpenses(); // in case expenses turned from grey to white
                calculateStatistics(); // final sync for UI
            }
        });
    }

    // Add Various Accreditation Modal Logic
    const btnAddVarious = document.getElementById('btn-add-various');
    const addVariousModal = document.getElementById('add-various-modal');
    const closeVariousModal = document.getElementById('close-various-modal');
    const addVariousForm = document.getElementById('add-various-form');

    if (btnAddVarious && addVariousModal && closeVariousModal && addVariousForm) {
        // Open modal
        btnAddVarious.addEventListener('click', () => {
            if (navigator.vibrate) navigator.vibrate(50);
            // Default date to today
            document.getElementById('various-date').valueAsDate = new Date();
            addVariousModal.classList.add('active');
        });

        // Close modal
        closeVariousModal.addEventListener('click', () => {
            addVariousModal.classList.remove('active');
            resetEditMode('various');
        });

        // Submit form
        addVariousForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const amount = parseFloat(document.getElementById('various-amount').value);
            const spendable = parseFloat(document.getElementById('various-spendable').value);
            const date = document.getElementById('various-date').value;
            const description = document.getElementById('various-desc').value;
            const submitBtn = addVariousForm.querySelector('button[type="submit"]');

            if (amount <= 0) {
                alert(t('alert_amount_greater_zero'));
                return;
            }
            if (spendable > amount) {
                alert(t('alert_spendable_greater_total'));
                return;
            }

            // Loading state
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = t('btn_saving');
            submitBtn.disabled = true;

            // Insert or Update into Supabase
            let res;
            if (state.editContext.active && state.editContext.type === 'various') {
                res = await supabase
                    .from('various_accreditations')
                    .update({ 
                        total_amount: amount, 
                        spendable_amount: spendable, 
                        credit_date: date, 
                        description: description 
                    })
                    .eq('id', state.editContext.id);
            } else {
                res = await supabase
                    .from('various_accreditations')
                    .insert([
                        { 
                            user_id: state.user.id,
                            total_amount: amount, 
                            spendable_amount: spendable, 
                            credit_date: date, 
                            description: description 
                        }
                    ]);
            }
            const { data, error } = res;

            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;

            if (error) {
                console.error("Error saving various accreditation:", error);
                alert(t('alert_save_error') + error.message);
            } else {
                alert(state.editContext.active ? t('alert_various_updated') : t('alert_various_saved'));
                addVariousModal.classList.remove('active');
                resetEditMode('various');
                
                // Calculate stats to get updated totalRemaining
                await calculateStatistics();
                // Process unhandled expenses
                await syncLedgerStatus();
                
                loadRecentAccreditations(); // Update list
                loadVariousAccreditations(); // Update dedicated list
                loadExpenses(); // refresh expenses
                calculateStatistics(); // final sync
            }
        });
    }

    // Add Expense Modal Logic
    if ((DOM.btnAddExpense || DOM.btnAddExpensePage) && DOM.addExpenseModal && DOM.closeExpenseModal && DOM.addExpenseForm) {
        const openExpenseModal = () => {
            if (navigator.vibrate) navigator.vibrate(50);
            document.getElementById('expense-date').valueAsDate = new Date();
            renderExpenseSuggestionsChips();
            DOM.addExpenseModal.classList.add('active');
        };

        if (DOM.btnAddExpense) DOM.btnAddExpense.addEventListener('click', openExpenseModal);
        if (DOM.btnAddExpensePage) DOM.btnAddExpensePage.addEventListener('click', openExpenseModal);

        DOM.closeExpenseModal.addEventListener('click', () => {
            DOM.addExpenseModal.classList.remove('active');
            resetEditMode('expense');
        });

        DOM.addExpenseForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const amount = parseFloat(document.getElementById('expense-amount').value);
            const date = document.getElementById('expense-date').value;
            const description = document.getElementById('expense-desc').value;
            const submitBtn = DOM.addExpenseForm.querySelector('button[type="submit"]');

            if (amount <= 0) {
                alert(t('alert_expense_amount_greater_zero'));
                return;
            }

            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = t('btn_saving');
            submitBtn.disabled = true;

            const isHandled = state.totalRemaining >= amount;

            let res;
            if (state.editContext.active && state.editContext.type === 'expense') {
                // Durante la modifica, per ora non ricalcoliamo is_handled (o potremmo farlo)
                res = await supabase
                    .from('expenses')
                    .update({ 
                        amount: amount, 
                        expense_date: date, 
                        description: description
                    })
                    .eq('id', state.editContext.id);
            } else {
                res = await supabase
                    .from('expenses')
                    .insert([
                        { 
                            user_id: state.user.id,
                            amount: amount, 
                            expense_date: date, 
                            description: description,
                            is_handled: isHandled
                        }
                    ]);
            }
            const { data, error } = res;

            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;

            if (error) {
                console.error("Error saving expense:", error);
                alert(t('alert_save_error') + error.message);
            } else {
                alert(state.editContext.active ? t('alert_expense_updated') : t('alert_expense_saved'));
                DOM.addExpenseModal.classList.remove('active');
                resetEditMode('expense');
                
                // Ricalcola se era un update che cambia gli importi
                if (state.editContext.active) {
                    await calculateStatistics();
                    await syncLedgerStatus();
                }
                
                loadExpenses(); // Update dedicated list
                calculateStatistics(); // Update total spent
            }
        });

        // Sync chip highlights when typing manually in description
        const expenseDescInput = document.getElementById('expense-desc');
        if (expenseDescInput) {
            expenseDescInput.addEventListener('input', () => {
                const val = expenseDescInput.value.trim().toLowerCase();
                if (DOM.expenseSuggestionsList) {
                    DOM.expenseSuggestionsList.querySelectorAll('.suggestion-chip').forEach(chip => {
                        if (chip.getAttribute('data-text').trim().toLowerCase() === val) {
                            chip.classList.add('active');
                        } else {
                            chip.classList.remove('active');
                        }
                    });
                }
            });
        }

        // Sync salary chip highlights and date changes
        const salaryDescInput = document.getElementById('salary-desc');
        if (salaryDescInput) {
            salaryDescInput.addEventListener('input', () => {
                const val = salaryDescInput.value.trim().toUpperCase();
                if (DOM.salarySuggestionsList) {
                    DOM.salarySuggestionsList.querySelectorAll('.suggestion-chip').forEach(chip => {
                        if (chip.getAttribute('data-text') === val) {
                            chip.classList.add('active');
                        } else {
                            chip.classList.remove('active');
                        }
                    });
                }
            });
        }

        const salaryDateInput = document.getElementById('salary-date');
        if (salaryDateInput) {
            salaryDateInput.addEventListener('change', () => {
                renderSalarySuggestionChip();
            });
        }
    }

    // Manage Suggestions Modal Logic
    if (DOM.menuSuggestionsBtn && DOM.suggestionsModal && DOM.closeSuggestionsModal) {
        DOM.menuSuggestionsBtn.addEventListener('click', () => {
            if (navigator.vibrate) navigator.vibrate(50);
            toggleMenu(); // close side menu
            renderManageSuggestionsList();
            DOM.suggestionsModal.classList.add('active');
        });

        DOM.closeSuggestionsModal.addEventListener('click', () => {
            DOM.suggestionsModal.classList.remove('active');
        });

        if (DOM.addSuggestionForm) {
            DOM.addSuggestionForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (DOM.newSuggestionInput) {
                    const text = DOM.newSuggestionInput.value;
                    await addExpenseSuggestion(text);
                    DOM.newSuggestionInput.value = '';
                }
            });
        }
    }
}

// Investment Modals Logic
function setupInvestmentModals() {
    // Bonifico
    if ((DOM.btnAddBonifico || DOM.btnAddBonificoPage) && DOM.addBonificoModal && DOM.closeBonificoModal && DOM.addBonificoForm) {
        const openBonifico = () => {
            if (navigator.vibrate) navigator.vibrate(50);
            document.getElementById('bonifico-date').valueAsDate = new Date();
            DOM.addBonificoModal.classList.add('active');
        };
        if (DOM.btnAddBonifico) DOM.btnAddBonifico.addEventListener('click', openBonifico);
        if (DOM.btnAddBonificoPage) DOM.btnAddBonificoPage.addEventListener('click', openBonifico);
        
        DOM.closeBonificoModal.addEventListener('click', () => {
            DOM.addBonificoModal.classList.remove('active');
            resetEditMode('bonifico');
        });
        
        DOM.addBonificoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const amount = parseFloat(document.getElementById('bonifico-amount').value);
            const date = document.getElementById('bonifico-date').value;
            const submitBtn = DOM.addBonificoForm.querySelector('button[type="submit"]');
            
            if (amount <= 0) {
                alert(t('alert_bonifico_amount_greater_zero'));
                return;
            }

            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = t('btn_saving');
            submitBtn.disabled = true;
            
            let res;
            if (state.editContext.active && state.editContext.type === 'bonifico') {
                res = await supabase.from('investment_transfers').update({
                    amount: amount,
                    date: date
                }).eq('id', state.editContext.id);
            } else {
                res = await supabase.from('investment_transfers').insert([{
                    user_id: state.user.id,
                    amount: amount,
                    date: date
                }]);
            }
            const { error } = res;
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            if (error) {
                console.error("Errore salvataggio bonifico:", error);
                alert(t('alert_save_error') + error.message);
            } else {
                alert(state.editContext.active ? t('alert_bonifico_updated') : t('alert_bonifico_saved'));
                DOM.addBonificoModal.classList.remove('active');
                resetEditMode('bonifico');
                calculateInvestmentStatistics();
                loadInvestmentTransfers();
            }
        });
    }

    // Investimento
    if ((DOM.btnAddInvestimento || DOM.btnAddInvestimentoPage) && DOM.addInvestimentoModal && DOM.closeInvestimentoModal && DOM.addInvestimentoForm) {
        const openInvestimento = () => {
            if (navigator.vibrate) navigator.vibrate(50);
            document.getElementById('investimento-date').valueAsDate = new Date();
            DOM.addInvestimentoModal.classList.add('active');
        };
        if (DOM.btnAddInvestimento) DOM.btnAddInvestimento.addEventListener('click', openInvestimento);
        if (DOM.btnAddInvestimentoPage) DOM.btnAddInvestimentoPage.addEventListener('click', openInvestimento);
        
        DOM.closeInvestimentoModal.addEventListener('click', () => {
            DOM.addInvestimentoModal.classList.remove('active');
            resetEditMode('investimento');
        });
        
        DOM.addInvestimentoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const amount = parseFloat(document.getElementById('investimento-amount').value);
            const date = document.getElementById('investimento-date').value;
            const desc = document.getElementById('investimento-desc').value;
            const submitBtn = DOM.addInvestimentoForm.querySelector('button[type="submit"]');
            
            if (amount <= 0) {
                alert(t('alert_investimento_amount_greater_zero'));
                return;
            }

            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = t('btn_saving');
            submitBtn.disabled = true;
            
            let res;
            if (state.editContext.active && state.editContext.type === 'investimento') {
                res = await supabase.from('investments').update({
                    amount: amount,
                    date: date,
                    description: desc
                }).eq('id', state.editContext.id);
            } else {
                res = await supabase.from('investments').insert([{
                    user_id: state.user.id,
                    amount: amount,
                    date: date,
                    description: desc
                }]);
            }
            const { error } = res;
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            if (error) {
                console.error("Errore salvataggio investimento:", error);
                alert(t('alert_save_error') + error.message);
            } else {
                alert(state.editContext.active ? t('alert_investimento_updated') : t('alert_investimento_saved'));
                DOM.addInvestimentoModal.classList.remove('active');
                resetEditMode('investimento');
                calculateInvestmentStatistics();
                loadInvestments();
            }
        });
    }

    // Movimento
    if ((DOM.btnAddMovimento || DOM.btnAddMovimentoPage) && DOM.addMovimentoModal && DOM.closeMovimentoModal && DOM.addMovimentoForm) {
        const openMovimento = () => {
            if (navigator.vibrate) navigator.vibrate(50);
            document.getElementById('movimento-date').valueAsDate = new Date();
            DOM.addMovimentoModal.classList.add('active');
        };
        if (DOM.btnAddMovimento) DOM.btnAddMovimento.addEventListener('click', openMovimento);
        if (DOM.btnAddMovimentoPage) DOM.btnAddMovimentoPage.addEventListener('click', openMovimento);
        
        DOM.closeMovimentoModal.addEventListener('click', () => {
            DOM.addMovimentoModal.classList.remove('active');
            resetEditMode('movimento');
        });
        
        DOM.addMovimentoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const amount = parseFloat(document.getElementById('movimento-amount').value);
            const date = document.getElementById('movimento-date').value;
            const desc = document.getElementById('movimento-desc').value;
            const highlighted = document.getElementById('movimento-highlighted').checked;
            const submitBtn = DOM.addMovimentoForm.querySelector('button[type="submit"]');
            
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = t('btn_saving');
            submitBtn.disabled = true;
            
            let res;
            if (state.editContext.active && state.editContext.type === 'movimento') {
                res = await supabase.from('investment_movements').update({
                    amount: amount,
                    date: date,
                    description: desc,
                    is_highlighted: highlighted
                }).eq('id', state.editContext.id);
            } else {
                res = await supabase.from('investment_movements').insert([{
                    user_id: state.user.id,
                    amount: amount,
                    date: date,
                    description: desc,
                    is_highlighted: highlighted
                }]);
            }
            const { error } = res;
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            if (error) {
                console.error("Errore salvataggio movimento:", error);
                alert(t('alert_save_error') + error.message);
            } else {
                alert(state.editContext.active ? t('alert_movimento_updated') : t('alert_movimento_saved'));
                DOM.addMovimentoModal.classList.remove('active');
                resetEditMode('movimento');
                calculateInvestmentStatistics();
                loadInvestmentMovements();
                loadInvestmentHighlights();
            }
        });
    }
}

// Toggle Side Menu
function toggleMenu() {
    state.isMenuOpen = !state.isMenuOpen;

    if (state.isMenuOpen) {
        DOM.sideMenu.classList.add('open');
        DOM.menuOverlay.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
        DOM.sideMenu.classList.remove('open');
        DOM.menuOverlay.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Timeout references for debouncing UI updates
let uiTimeout;
let containerTimeout;

// Update UI based on State
function updateUI() {
    const currentViewKey = state.views[state.globalMode];
    const viewConfig = MODE_CONFIG[currentViewKey];
    const globalConfig = GLOBAL_MODE_CONFIG[state.globalMode];

    // Clear previous timeouts to prevent overlapping animations
    if (uiTimeout) clearTimeout(uiTimeout);
    if (containerTimeout) clearTimeout(containerTimeout);

    // Update title immediately (prevents Safari ghosting bug)
    DOM.appTitle.textContent = t(viewConfig.titleKey);

    // Animate button change
    DOM.toggleModeBtn.style.transform = 'scale(0.8) rotate(180deg)';
    DOM.toggleModeBtn.style.opacity = '0';

    uiTimeout = setTimeout(() => {
        DOM.toggleModeBtn.innerHTML = globalConfig.iconHTML;
        DOM.toggleModeBtn.style.transform = 'scale(1) rotate(0deg)';
        DOM.toggleModeBtn.style.opacity = '1';
    }, 200);

    // Update Menu Groups visibility
    const isInvestment = state.globalMode === 'investment';
    document.getElementById('expense-menu-group').style.display = isInvestment ? 'none' : 'block';
    document.getElementById('investment-menu-group').style.display = isInvestment ? 'block' : 'none';

    // Update active class on nav links
    DOM.navLinks.forEach(link => {
        const target = link.getAttribute('data-target');
        if (target === viewConfig.container.id) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Hide all containers
    Object.values(MODE_CONFIG).forEach(c => {
        c.container.classList.remove('active');
    });

    // Small delay to allow the fade out before showing new one
    containerTimeout = setTimeout(() => {
        viewConfig.container.classList.add('active');
    }, 150);
}

// Format Date Utility
function formatDate(dateString) {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const locale = state.currentLanguage === 'en' ? 'en-GB' : 'it-IT';
    return new Date(dateString).toLocaleDateString(locale, options);
}

// Update Element Utility
function updateEl(id, value) {
    const el = document.getElementById(id);
    if (el) {
        el.innerHTML = formatCurrency(value);
    }
}

// Load Recent Accreditations
async function loadRecentAccreditations() {
    if (!state.user) return;
    
    const listContainer = document.getElementById('recent-accreditations-list');
    if (!listContainer) return;

    try {
        // Fetch Salary Credits
        const { data: salaryData, error: salaryError } = await supabase
            .from('salary_credits')
            .select('*')
            .order('credit_date', { ascending: false })
            .limit(10);
            
        if (salaryError) throw salaryError;

        // Fetch Various Accreditations
        const { data: variousData, error: variousError } = await supabase
            .from('various_accreditations')
            .select('*')
            .order('credit_date', { ascending: false })
            .limit(10);
            
        if (variousError) throw variousError;

        // Map and Combine
        const salaries = (salaryData || []).map(item => ({
            ...item,
            type: 'salary',
            title: escapeHTML(item.description) || t('label_salary_credit_fallback'),
            icon: 'ph-money'
        }));

        const various = (variousData || []).map(item => ({
            ...item,
            type: 'various',
            title: escapeHTML(item.description) || t('label_various_credit_fallback'),
            icon: 'ph-piggy-bank'
        }));

        let allAccreditations = [...salaries, ...various];
        
        // Sort descending by date, then by created_at
        allAccreditations.sort((a, b) => {
            const dateA = new Date(a.credit_date).getTime();
            const dateB = new Date(b.credit_date).getTime();
            if (dateA === dateB) {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }
            return dateB - dateA;
        });

        // Limit to 10 overall for recent
        allAccreditations = allAccreditations.slice(0, 10);

        if (allAccreditations.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state">
                    <i class="ph ph-clock-counter-clockwise"></i>
                    <p>${t('empty_recent')}</p>
                </div>
            `;
            return;
        }

        // Render items
        listContainer.innerHTML = allAccreditations.map(item => `
            <div class="transaction-item">
                <div class="transaction-left">
                    <div class="transaction-icon ${item.type}">
                        <i class="ph ${item.icon}"></i>
                    </div>
                    <div class="transaction-info">
                        <span class="transaction-title">${item.title}</span>
                        <span class="transaction-date">${formatDate(item.credit_date)}</span>
                    </div>
                </div>
                <div class="transaction-amount" style="text-align: right;">
                    <div style="font-weight: 600; color: #34c759;">${formatCurrency(item.total_amount, '+')}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${t('label_for_me')}${formatCurrency(item.spendable_amount)}</div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error("Error loading recent accreditations:", error);
        listContainer.innerHTML = `
            <div class="empty-state" style="color: #ff3b30; text-align: center;">
                <i class="ph ph-warning"></i>
                <p>${t('empty_failed_load')}${error.message || JSON.stringify(error)}</p>
            </div>
        `;
    }
}

// Load Salary Credits
async function loadSalaryCredits() {
    if (!state.user) return;
    
    const listContainer = document.getElementById('salary-credits-list');
    if (!listContainer) return;

    try {
        const { data, error } = await supabase
            .from('salary_credits')
            .select('*')
            .order('credit_date', { ascending: false });
            
        if (error) throw error;

        if (!data || data.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state">
                    <i class="ph ph-money"></i>
                    <p>${t('empty_salary')}</p>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = data.map(item => `
            <div class="transaction-item">
                <div class="transaction-left">
                    <div class="transaction-icon salary">
                        <i class="ph ph-money"></i>
                    </div>
                    <div class="transaction-info">
                        <span class="transaction-title">${escapeHTML(item.description) || t('label_salary_credit_fallback')}</span>
                        <span class="transaction-date">${formatDate(item.credit_date)}</span>
                    </div>
                </div>
                <div class="transaction-amount" style="text-align: right;">
                    <div style="font-weight: 600; color: #34c759;">${formatCurrency(item.total_amount, '+')}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${t('label_for_me')}${formatCurrency(item.spendable_amount)}</div>
                </div>
                <div class="edit-icon-item" data-id="${item.id}" data-type="salary" data-json="${encodeURIComponent(JSON.stringify(item))}">
                    <i class="ph ph-pencil-simple"></i>
                </div>
                <div class="delete-icon-item" data-id="${item.id}" data-type="salary" data-json="${encodeURIComponent(JSON.stringify(item))}">
                    <i class="ph ph-trash"></i>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error("Error loading salary credits:", error);
        listContainer.innerHTML = `
            <div class="empty-state" style="color: #ff3b30; text-align: center;">
                <i class="ph ph-warning"></i>
                <p>${t('empty_failed_load')}${error.message || JSON.stringify(error)}</p>
            </div>
        `;
    }
}

// Load Various Accreditations
async function loadVariousAccreditations() {
    if (!state.user) return;
    
    const listContainer = document.getElementById('various-accreditations-list');
    if (!listContainer) return;

    try {
        const { data, error } = await supabase
            .from('various_accreditations')
            .select('*')
            .order('credit_date', { ascending: false });
            
        if (error) throw error;

        if (!data || data.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state">
                    <i class="ph ph-piggy-bank"></i>
                    <p>${t('empty_various')}</p>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = data.map(item => `
            <div class="transaction-item">
                <div class="transaction-left">
                    <div class="transaction-icon various">
                        <i class="ph ph-piggy-bank"></i>
                    </div>
                    <div class="transaction-info">
                        <span class="transaction-title">${escapeHTML(item.description) || t('label_various_credit_fallback')}</span>
                        <span class="transaction-date">${formatDate(item.credit_date)}</span>
                    </div>
                </div>
                <div class="transaction-amount" style="text-align: right;">
                    <div style="font-weight: 600; color: #34c759;">${formatCurrency(item.total_amount, '+')}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${t('label_for_me')}${formatCurrency(item.spendable_amount)}</div>
                </div>
                <div class="edit-icon-item" data-id="${item.id}" data-type="various" data-json="${encodeURIComponent(JSON.stringify(item))}">
                    <i class="ph ph-pencil-simple"></i>
                </div>
                <div class="delete-icon-item" data-id="${item.id}" data-type="various" data-json="${encodeURIComponent(JSON.stringify(item))}">
                    <i class="ph ph-trash"></i>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error("Error loading various accreditations:", error);
        listContainer.innerHTML = `
            <div class="empty-state" style="color: #ff3b30; text-align: center;">
                <i class="ph ph-warning"></i>
                <p>${t('empty_failed_load')}${error.message || JSON.stringify(error)}</p>
            </div>
        `;
    }
}

// --- Expense Suggestions ---
const DEFAULT_SUGGESTIONS = [
    'Spesa alimentare',
    'Ristorante',
    'Benzina',
    'Bollette',
    'Svago',
    'Farmacia'
];

async function loadExpenseSuggestions() {
    if (state.isDemo) {
        state.expenseSuggestions = (state.demoData && state.demoData.expense_suggestions)
            ? [...state.demoData.expense_suggestions]
            : DEFAULT_SUGGESTIONS.map((text, idx) => ({ id: `demo-sug-${idx}`, text }));
        renderExpenseSuggestionsChips();
        return;
    }

    if (!state.user) {
        state.expenseSuggestions = [];
        renderExpenseSuggestionsChips();
        return;
    }

    const seededKey = `expense_suggestions_seeded_${state.user.id}`;
    const hasBeenSeeded = localStorage.getItem(seededKey) === 'true';

    try {
        const { data, error } = await supabase
            .from('expense_suggestions')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            console.warn("Could not load suggestions from Supabase (using local cache or defaults):", error.message);
            const cached = localStorage.getItem('expense_suggestions_cache');
            if (cached) {
                state.expenseSuggestions = JSON.parse(cached);
            } else if (!hasBeenSeeded) {
                state.expenseSuggestions = DEFAULT_SUGGESTIONS.map((text, idx) => ({
                    id: `local_sug_${idx}`,
                    text: text
                }));
            } else {
                state.expenseSuggestions = [];
            }
        } else if (!data || data.length === 0) {
            if (!hasBeenSeeded) {
                // First time setup for this user in DB: seed defaults
                localStorage.setItem(seededKey, 'true');
                const toInsert = DEFAULT_SUGGESTIONS.map(text => ({
                    user_id: state.user.id,
                    text: text
                }));
                const { data: inserted, error: insErr } = await supabase
                    .from('expense_suggestions')
                    .insert(toInsert)
                    .select();

                if (!insErr && inserted && inserted.length > 0) {
                    state.expenseSuggestions = inserted;
                } else {
                    state.expenseSuggestions = toInsert.map((item, idx) => ({ id: `default_${idx}`, ...item }));
                }
                localStorage.setItem('expense_suggestions_cache', JSON.stringify(state.expenseSuggestions));
            } else {
                // User intentionally deleted all suggestions, keep it empty
                state.expenseSuggestions = [];
                localStorage.setItem('expense_suggestions_cache', JSON.stringify([]));
            }
        } else {
            // Suggestions exist in DB, mark user as seeded so defaults won't re-seed if deleted
            localStorage.setItem(seededKey, 'true');
            state.expenseSuggestions = data;
            localStorage.setItem('expense_suggestions_cache', JSON.stringify(data));
        }
    } catch (e) {
        console.warn("Error fetching expense suggestions:", e);
        const cached = localStorage.getItem('expense_suggestions_cache');
        state.expenseSuggestions = cached ? JSON.parse(cached) : [];
    }

    renderExpenseSuggestionsChips();
}

function renderExpenseSuggestionsChips() {
    if (!DOM.expenseSuggestionsList) return;
    DOM.expenseSuggestionsList.innerHTML = '';

    const currentDesc = (document.getElementById('expense-desc')?.value || '').trim().toLowerCase();

    if (!state.expenseSuggestions || state.expenseSuggestions.length === 0) {
        DOM.expenseSuggestionsList.style.display = 'none';
        const wrapper = DOM.expenseSuggestionsList.closest('.suggestions-wrapper');
        if (wrapper) wrapper.style.display = 'none';
        return;
    }

    const wrapper = DOM.expenseSuggestionsList.closest('.suggestions-wrapper');
    if (wrapper) wrapper.style.display = 'block';
    DOM.expenseSuggestionsList.style.display = 'flex';

    state.expenseSuggestions.forEach(sug => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'suggestion-chip';
        chip.setAttribute('data-text', sug.text);
        chip.textContent = sug.text;

        if (sug.text.trim().toLowerCase() === currentDesc) {
            chip.classList.add('active');
        }

        chip.addEventListener('click', () => {
            if (navigator.vibrate) navigator.vibrate(25);
            const descInput = document.getElementById('expense-desc');
            if (descInput) {
                descInput.value = sug.text;
                descInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
            DOM.expenseSuggestionsList.querySelectorAll('.suggestion-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
        });

        DOM.expenseSuggestionsList.appendChild(chip);
    });
}

function renderSalarySuggestionChip() {
    if (!DOM.salarySuggestionsList) return;
    DOM.salarySuggestionsList.innerHTML = '';

    const dateVal = document.getElementById('salary-date')?.value;
    let targetDate = new Date();
    if (dateVal) {
        const [y, m, d] = dateVal.split('-').map(Number);
        if (y && m) targetDate = new Date(y, m - 1, d || 1);
    }

    const locale = state.currentLanguage === 'en' ? 'en-US' : 'it-IT';
    const monthName = targetDate.toLocaleDateString(locale, { month: 'long' }).toUpperCase();
    const currentDesc = (document.getElementById('salary-desc')?.value || '').trim().toUpperCase();

    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'suggestion-chip';
    chip.setAttribute('data-text', monthName);
    chip.textContent = monthName;

    if (currentDesc === monthName) {
        chip.classList.add('active');
    }

    chip.addEventListener('click', () => {
        if (navigator.vibrate) navigator.vibrate(25);
        const descInput = document.getElementById('salary-desc');
        if (descInput) {
            descInput.value = monthName;
            descInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        DOM.salarySuggestionsList.querySelectorAll('.suggestion-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
    });

    DOM.salarySuggestionsList.appendChild(chip);
}

function renderManageSuggestionsList() {
    if (!DOM.manageSuggestionsList) return;
    DOM.manageSuggestionsList.innerHTML = '';

    if (!state.expenseSuggestions || state.expenseSuggestions.length === 0) {
        DOM.manageSuggestionsList.innerHTML = `<p style="text-align: center; color: var(--text-secondary); font-size: 14px; padding: 20px 0;" data-i18n="no_suggestions">${t('no_suggestions')}</p>`;
        return;
    }

    state.expenseSuggestions.forEach(sug => {
        const item = document.createElement('div');
        item.className = 'suggestion-manage-item';
        item.innerHTML = `
            <span>${escapeHTML(sug.text)}</span>
            <button type="button" class="delete-suggestion-btn" data-id="${sug.id}" title="${t('confirm_delete')}">
                <i class="ph ph-trash"></i>
            </button>
        `;

        const delBtn = item.querySelector('.delete-suggestion-btn');
        if (delBtn) {
            delBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (confirm(t('confirm_delete_suggestion'))) {
                    await deleteExpenseSuggestion(sug.id);
                }
            });
        }

        DOM.manageSuggestionsList.appendChild(item);
    });
}

async function addExpenseSuggestion(text) {
    text = (text || '').trim();
    if (!text) return;

    // Check duplicate
    const exists = state.expenseSuggestions.some(s => s.text.toLowerCase() === text.toLowerCase());
    if (exists) {
        alert(t('alert_suggestion_exists'));
        return;
    }

    if (state.isDemo) {
        const newSug = {
            id: `demo-sug-${Date.now()}`,
            user_id: 'demo-user-id',
            text: text,
            created_at: new Date().toISOString()
        };
        if (!state.demoData.expense_suggestions) state.demoData.expense_suggestions = [];
        state.demoData.expense_suggestions.push(newSug);
        state.expenseSuggestions = state.demoData.expense_suggestions;
        renderManageSuggestionsList();
        renderExpenseSuggestionsChips();
        return;
    }

    if (state.user) {
        try {
            const { data, error } = await supabase
                .from('expense_suggestions')
                .insert([{ user_id: state.user.id, text }])
                .select();

            if (error) {
                console.warn("Could not insert suggestion to Supabase, saving locally:", error.message);
                state.expenseSuggestions.push({ id: `local_sug_${Date.now()}`, text });
            } else if (data && data.length > 0) {
                state.expenseSuggestions.push(data[0]);
            } else {
                state.expenseSuggestions.push({ id: `local_sug_${Date.now()}`, text });
            }
        } catch (e) {
            console.warn("Error inserting suggestion:", e);
            state.expenseSuggestions.push({ id: `local_sug_${Date.now()}`, text });
        }
        localStorage.setItem('expense_suggestions_cache', JSON.stringify(state.expenseSuggestions));
        renderManageSuggestionsList();
        renderExpenseSuggestionsChips();
    }
}

async function deleteExpenseSuggestion(id) {
    if (state.isDemo) {
        if (state.demoData && state.demoData.expense_suggestions) {
            state.demoData.expense_suggestions = state.demoData.expense_suggestions.filter(s => s.id !== id);
            state.expenseSuggestions = state.demoData.expense_suggestions;
        }
        renderManageSuggestionsList();
        renderExpenseSuggestionsChips();
        return;
    }

    if (state.user) {
        try {
            const { error } = await supabase
                .from('expense_suggestions')
                .delete()
                .eq('id', id);

            if (error) {
                console.warn("Could not delete from Supabase:", error.message);
            }
        } catch (e) {
            console.warn("Error deleting suggestion:", e);
        }
        state.expenseSuggestions = state.expenseSuggestions.filter(s => s.id !== id);
        localStorage.setItem('expense_suggestions_cache', JSON.stringify(state.expenseSuggestions));
        renderManageSuggestionsList();
        renderExpenseSuggestionsChips();
    }
}

// Load Expenses
async function loadExpenses() {
    if (!state.user) return;
    
    const listContainer = DOM.expensesList;
    if (!listContainer) return;

    try {
        const { data, error } = await supabase
            .from('expenses')
            .select('*')
            .order('expense_date', { ascending: false });
            
        if (error) throw error;

        if (!data || data.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state">
                    <i class="ph ph-shopping-cart"></i>
                    <p>${t('empty_expenses')}</p>
                </div>
            `;
            if (DOM.expensePageTotal) updateEl('expense-page-total', 0);
            if (DOM.expensePagePending) updateEl('expense-page-pending', 0);
            return;
        }

        let unhandled = data.filter(item => item.is_handled === false);
        let handled = data.filter(item => item.is_handled !== false);

        if (state.expenseViewMode === 'month' && state.expenseSelectedMonth) {
            handled = handled.filter(item => item.expense_date.startsWith(state.expenseSelectedMonth));
            unhandled = unhandled.filter(item => item.expense_date.startsWith(state.expenseSelectedMonth));
        }

        // Calcolo totali
        const totalHandled = handled.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
        const totalUnhandled = unhandled.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
        
        if (DOM.expensePageTotal) updateEl('expense-page-total', totalHandled);
        if (DOM.expensePagePending) updateEl('expense-page-pending', totalUnhandled);

        const renderItem = (item) => {
            const isUnhandled = item.is_handled === false;
            const iconBg = isUnhandled ? '#e5e5ea' : '#ff3b3020';
            const iconColor = isUnhandled ? '#8e8e93' : '#ff3b30';
            const textColor = isUnhandled ? '#8e8e93' : '#ff3b30';
            const extraLabel = isUnhandled ? ` <span style="font-size: 0.7rem; color: #8e8e93; font-weight: normal; margin-left: 4px;">${t('label_pending_badge')}</span>` : '';

            return `
            <div class="transaction-item" style="${isUnhandled ? 'opacity: 0.8;' : ''}">
                <div class="transaction-left">
                    <div class="transaction-icon expense" style="background-color: ${iconBg}; color: ${iconColor};">
                        <i class="ph ph-shopping-cart"></i>
                    </div>
                    <div class="transaction-info">
                        <span class="transaction-title" style="${isUnhandled ? 'color: #8e8e93;' : ''}">${escapeHTML(item.description) || t('label_expense_fallback')}${extraLabel}</span>
                        <span class="transaction-date">${formatDate(item.expense_date)}</span>
                    </div>
                </div>
                <div class="transaction-amount expense-amount-text" style="color: ${textColor};">
                    ${formatCurrency(item.amount, '-')}
                </div>
                <div class="edit-icon-item" data-id="${item.id}" data-type="expense" data-json="${encodeURIComponent(JSON.stringify(item))}">
                    <i class="ph ph-pencil-simple"></i>
                </div>
                <div class="delete-icon-item" data-id="${item.id}" data-type="expense" data-json="${encodeURIComponent(JSON.stringify(item))}">
                    <i class="ph ph-trash"></i>
                </div>
            </div>
            `;
        };

        let html = '';

        // 1. Sempre prima le non gestite
        if (unhandled.length > 0) {
            html += unhandled.map(renderItem).join('');
        }

        // 2. Poi le gestite (con divisori se siamo in modalita 'all')
        if (handled.length > 0) {
            if (state.expenseViewMode === 'all') {
                let currentMonth = '';
                handled.forEach(item => {
                    const itemMonth = item.expense_date.substring(0, 7); // YYYY-MM
                    if (itemMonth !== currentMonth) {
                        currentMonth = itemMonth;
                        const dateObj = new Date(item.expense_date);
                        const locale = state.currentLanguage === 'en' ? 'en-US' : 'it-IT';
                        const monthName = dateObj.toLocaleString(locale, { month: 'long', year: 'numeric' });
                        const capitalized = monthName.charAt(0).toUpperCase() + monthName.slice(1);
                        html += `<div class="month-divider">${capitalized}</div>`;
                    }
                    html += renderItem(item);
                });
            } else {
                // Selezionato un mese specifico, mostriamo solo la lista senza divisori (o con un solo divisore in cima)
                html += handled.map(renderItem).join('');
            }
        }

        if (html === '') {
            html = `
                <div class="empty-state">
                    <i class="ph ph-shopping-cart"></i>
                    <p>${t('empty_expenses')}</p>
                </div>
            `;
        }

        listContainer.innerHTML = html;

    } catch (error) {
        console.error("Error loading expenses:", error);
        listContainer.innerHTML = `
            <div class="empty-state" style="color: #ff3b30; text-align: center;">
                <i class="ph ph-warning"></i>
                <p>Failed to load data: ${error.message || JSON.stringify(error)}</p>
            </div>
        `;
    }
}

// Calculate Statistics
async function calculateStatistics() {
    if (!state.user) return;

    try {
        // Fetch Expenses
        // Fetch Expenses
        const { data: expenses, error: expError } = await supabase.from('expenses').select('amount, is_handled');
        if (expError) throw expError;

        // Fetch Salary (Reply)
        const { data: salaries, error: salError } = await supabase.from('salary_credits').select('total_amount, spendable_amount');
        if (salError) throw salError;

        // Fetch Various Accreditations
        const { data: various, error: varError } = await supabase.from('various_accreditations').select('total_amount, spendable_amount');
        if (varError) throw varError;

        // Sum Expenses (only handled)
        let totalExpenses = 0;
        if (expenses) {
            totalExpenses = expenses
                .filter(item => item.is_handled !== false)
                .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
        }
        
        // Sum Salary (Reply)
        let replyGross = 0, replySpendable = 0;
        if (salaries) {
            replyGross = salaries.reduce((sum, item) => sum + parseFloat(item.total_amount || 0), 0);
            replySpendable = salaries.reduce((sum, item) => sum + parseFloat(item.spendable_amount || 0), 0);
        }
        let replySaved = replyGross - replySpendable;

        // Sum Various Accreditations
        let variousGross = 0, variousSpendable = 0;
        if (various) {
            variousGross = various.reduce((sum, item) => sum + parseFloat(item.total_amount || 0), 0);
            variousSpendable = various.reduce((sum, item) => sum + parseFloat(item.spendable_amount || 0), 0);
        }
        let variousSaved = variousGross - variousSpendable;

        // Global Totals
        let totalGross = replyGross + variousGross;
        let totalSaved = replySaved + variousSaved;
        let totalRemaining = (replySpendable + variousSpendable) - totalExpenses;
        
        // Save to global state
        state.totalRemaining = totalRemaining;

        // Update Statistics Page Widgets
        updateEl('stat-spent-value', totalExpenses);
        updateEl('stat-remaining-value', totalRemaining);
        updateEl('stat-saved-value', totalSaved);
        updateEl('stat-gross-value', totalGross);

        updateEl('stat-reply-gross-value', replyGross);
        updateEl('stat-reply-spendable-value', replySpendable);
        updateEl('stat-reply-saved-value', replySaved);

        updateEl('stat-various-gross-value', variousGross);
        updateEl('stat-various-spendable-value', variousSpendable);
        updateEl('stat-various-saved-value', variousSaved);

        // Update Homepage Widgets
        updateEl('home-remaining-value', totalRemaining);
        updateEl('home-saved-value', totalSaved);

    } catch (error) {
        console.error("Error calculating statistics:", error);
    }
}

async function calculateInvestmentStatistics() {
    if (!state.user) return;
    try {
        const [bonificiRes, invRes, movRes] = await Promise.all([
            supabase.from('investment_transfers').select('amount'),
            supabase.from('investments').select('amount'),
            supabase.from('investment_movements').select('amount')
        ]);

        if (bonificiRes.error) throw bonificiRes.error;
        if (invRes.error) throw invRes.error;
        if (movRes.error) throw movRes.error;

        const sumBonifici = bonificiRes.data.reduce((sum, i) => sum + parseFloat(i.amount || 0), 0);
        const sumInvestimenti = invRes.data.reduce((sum, i) => sum + parseFloat(i.amount || 0), 0);
        const sumMovements = movRes.data.reduce((sum, i) => sum + parseFloat(i.amount || 0), 0);
        
        const speseUnicredit = -sumMovements;
        const saldo = sumBonifici - sumInvestimenti + sumMovements;

        if (DOM.invStatBonifici) updateEl('inv-stat-bonifici', sumBonifici);
        if (DOM.invStatInvestimenti) updateEl('inv-stat-investimenti', sumInvestimenti);
        if (DOM.invStatSpese) updateEl('inv-stat-spese', speseUnicredit);
        if (DOM.invStatSaldo) updateEl('inv-stat-saldo', saldo);
    } catch (error) {
        console.error("Error calculating investment statistics:", error);
    }
}

async function loadInvestmentHighlights() {
    if (!state.user || !DOM.investmentHighlightedList) return;
    try {
        const { data, error } = await supabase
            .from('investment_movements')
            .select('*')
            .eq('is_highlighted', true)
            .order('date', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            DOM.investmentHighlightedList.innerHTML = `
                <div class="empty-state">
                    <i class="ph ph-star"></i>
                    <p>${t('empty_highlighted')}</p>
                </div>
            `;
            return;
        }

        DOM.investmentHighlightedList.innerHTML = data.map(item => {
            const isPositive = parseFloat(item.amount) >= 0;
            const icon = isPositive ? 'ph-trend-up' : 'ph-trend-down';
            const iconClass = isPositive ? 'various' : '';
            const amountColor = isPositive ? '#34c759' : '#ff3b30';
            const prefix = isPositive ? '+' : '';
            const title = escapeHTML(item.description) || (isPositive ? t('label_credit_movement') : t('label_expense_movement'));
            
            return `
            <div class="transaction-item highlighted-movement">
                <div class="transaction-left">
                    <div class="transaction-icon ${iconClass}">
                        <i class="ph ${icon}"></i>
                    </div>
                    <div class="transaction-info">
                        <div class="transaction-title">${title}</div>
                        <div class="transaction-date">${formatDate(item.date)}</div>
                    </div>
                </div>
                <div class="transaction-amount" style="text-align: right;">
                    <div style="font-weight: 600; color: ${amountColor};">${formatCurrency(item.amount, prefix)}</div>
                </div>
            </div>
            `;
        }).join('');
    } catch (error) {
        console.error("Error loading highlighted movements:", error);
    }
}

// --- INVESTMENT FUNCTIONS ---

async function loadInvestmentTransfers() {
    if (!state.user || !DOM.investmentTransfersList) return;
    try {
        const { data, error } = await supabase
            .from('investment_transfers')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            DOM.investmentTransfersList.innerHTML = `
                <div class="empty-state">
                    <i class="ph ph-bank"></i>
                    <p>${t('empty_transfers')}</p>
                </div>
            `;
            return;
        }

        DOM.investmentTransfersList.innerHTML = data.map(item => `
            <div class="transaction-item">
                <div class="transaction-left">
                    <div class="transaction-icon various">
                        <i class="ph ph-bank"></i>
                    </div>
                    <div class="transaction-info">
                        <div class="transaction-title">${t('label_transfer_title')}</div>
                        <div class="transaction-date">${formatDate(item.date)}</div>
                    </div>
                </div>
                <div class="transaction-amount" style="text-align: right;">
                    <div style="font-weight: 600; color: #34c759;">${formatCurrency(item.amount, '+')}</div>
                </div>
                <div class="edit-icon-item" data-id="${item.id}" data-type="bonifico" data-json="${encodeURIComponent(JSON.stringify(item))}">
                    <i class="ph ph-pencil-simple"></i>
                </div>
                <div class="delete-icon-item" data-id="${item.id}" data-type="bonifico" data-json="${encodeURIComponent(JSON.stringify(item))}">
                    <i class="ph ph-trash"></i>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error("Error loading investment transfers:", error);
    }
}

async function loadInvestments() {
    if (!state.user || !DOM.investmentsList) return;
    try {
        const { data, error } = await supabase
            .from('investments')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            DOM.investmentsList.innerHTML = `
                <div class="empty-state">
                    <i class="ph ph-chart-line-up"></i>
                    <p>${t('empty_investments')}</p>
                </div>
            `;
            return;
        }

        DOM.investmentsList.innerHTML = data.map(item => `
            <div class="transaction-item">
                <div class="transaction-left">
                    <div class="transaction-icon" style="background-color: rgba(88, 86, 214, 0.1); color: #5856d6;">
                        <i class="ph ph-chart-pie-slice"></i>
                    </div>
                    <div class="transaction-info">
                        <div class="transaction-title">${escapeHTML(item.description)}</div>
                        <div class="transaction-date">${formatDate(item.date)}</div>
                    </div>
                </div>
                <div class="transaction-amount" style="text-align: right; color: var(--text-primary);">
                    <div style="font-weight: 600;">${formatCurrency(item.amount)}</div>
                </div>
                <div class="edit-icon-item" data-id="${item.id}" data-type="investimento" data-json="${encodeURIComponent(JSON.stringify(item))}">
                    <i class="ph ph-pencil-simple"></i>
                </div>
                <div class="delete-icon-item" data-id="${item.id}" data-type="investimento" data-json="${encodeURIComponent(JSON.stringify(item))}">
                    <i class="ph ph-trash"></i>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error("Error loading investments:", error);
    }
}

async function loadInvestmentMovements() {
    if (!state.user || !DOM.investmentMovementsList) return;
    try {
        const { data, error } = await supabase
            .from('investment_movements')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            DOM.investmentMovementsList.innerHTML = `
                <div class="empty-state">
                    <i class="ph ph-receipt"></i>
                    <p>${t('empty_movements')}</p>
                </div>
            `;
            return;
        }

        DOM.investmentMovementsList.innerHTML = data.map(item => {
            const isPositive = parseFloat(item.amount) >= 0;
            const icon = isPositive ? 'ph-trend-up' : 'ph-trend-down';
            const iconClass = isPositive ? 'various' : '';
            const amountColor = isPositive ? '#34c759' : '#ff3b30';
            const prefix = isPositive ? '+' : '';
            const title = escapeHTML(item.description) || (isPositive ? t('label_credit_movement') : t('label_expense_movement'));
            const isHighlighted = item.is_highlighted === true;
            const highlightClass = isHighlighted ? 'highlighted-movement' : '';

            return `
            <div class="transaction-item ${highlightClass}">
                <div class="transaction-left">
                    <div class="transaction-icon ${iconClass}">
                        <i class="ph ${icon}"></i>
                    </div>
                    <div class="transaction-info">
                        <div class="transaction-title">${title}</div>
                        <div class="transaction-date">${formatDate(item.date)}</div>
                    </div>
                </div>
                <div class="transaction-amount" style="text-align: right;">
                    <div style="font-weight: 600; color: ${amountColor};">${formatCurrency(item.amount, prefix)}</div>
                </div>
                <div class="edit-icon-item" data-id="${item.id}" data-type="movimento" data-json="${encodeURIComponent(JSON.stringify(item))}">
                    <i class="ph ph-pencil-simple"></i>
                </div>
                <div class="delete-icon-item" data-id="${item.id}" data-type="movimento" data-json="${encodeURIComponent(JSON.stringify(item))}">
                    <i class="ph ph-trash"></i>
                </div>
            </div>
            `;
        }).join('');

    } catch (error) {
        console.error("Error loading investment movements:", error);
    }
}

// Process Unhandled Expenses when new funds are added
async function syncLedgerStatus() {
    if (!state.user) return;

    try {
        // 1. Get all spendable money
        const { data: salaries, error: salErr } = await supabase.from('salary_credits').select('spendable_amount');
        if (salErr) throw salErr;
        
        const { data: various, error: varErr } = await supabase.from('various_accreditations').select('spendable_amount');
        if (varErr) throw varErr;
        
        const totalSpendable = 
            (salaries ? salaries.reduce((sum, item) => sum + parseFloat(item.spendable_amount || 0), 0) : 0) +
            (various ? various.reduce((sum, item) => sum + parseFloat(item.spendable_amount || 0), 0) : 0);

        // 2. Fetch all expenses ordered by date (oldest first)
        const { data: allExpenses, error: expErr } = await supabase
            .from('expenses')
            .select('id, amount, is_handled')
            .order('expense_date', { ascending: true })
            .order('created_at', { ascending: true }); // secondary sort

        if (expErr) throw expErr;

        let currentBudget = totalSpendable;
        let handledAny = false;
        
        if (allExpenses && allExpenses.length > 0) {
            for (const expense of allExpenses) {
                const expAmount = parseFloat(expense.amount);
                
                if (currentBudget >= expAmount) {
                    // Should be handled
                    if (!expense.is_handled) {
                        await supabase.from('expenses').update({ is_handled: true }).eq('id', expense.id);
                        handledAny = true;
                    }
                    currentBudget -= expAmount;
                } else {
                    // Cannot be handled
                    if (expense.is_handled) {
                        await supabase.from('expenses').update({ is_handled: false }).eq('id', expense.id);
                        handledAny = true;
                    }
                    // we don't decrement budget since it wasn't handled
                }
            }
        }
        
        // 3. Refresh UI
        if (handledAny) {
            await calculateStatistics();
            loadExpenses();
            loadRecentAccreditations();
        }
    } catch (error) {
        console.error("Error syncing ledger:", error);
    }
}

// Run app
document.addEventListener('DOMContentLoaded', () => {
    setupInvestmentModals();
    init();

    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(registration => {
                    console.log('SW registered');
                    registration.update();
                })
                .catch(err => console.log('SW registration failed:', err));
        });
    }
});
