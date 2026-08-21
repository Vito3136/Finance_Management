// --- SUPABASE CONFIGURATION ---
// INSERISCI QUI LE TUE CHIAVI (Puoi trovarle in Project Settings -> API su Supabase)
const SUPABASE_URL = 'https://hcvktcdrgrsnmxqtvfeg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhjdmt0Y2RyZ3Jzbm14cXR2ZmVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NjkwNTYsImV4cCI6MjA5ODE0NTA1Nn0.Mj-xmxF6zTXxquVhVyPYkM45gb5R8sw_ftmKy7Oo7e0';

// Inizializza il client Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Application State
const state = {
    globalMode: 'expense', // 'expense' or 'investment'
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
        expense: false
    },
    editContext: {
        active: false,
        type: null,
        id: null
    }
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

    // Login Elements
    loginScreen: document.getElementById('login-screen'),
    loginForm: document.getElementById('login-form'),
    loginError: document.getElementById('login-error'),
    logoutBtn: document.getElementById('logout-btn')
};

// Mode Config
const MODE_CONFIG = {
    home: {
        title: 'Finance Management',
        container: DOM.homeContainer,
        group: 'expense'
    },
    expense: {
        title: 'Expenses History',
        container: DOM.expenseContainer,
        group: 'expense'
    },
    statistics: {
        title: 'Statistics',
        container: DOM.statisticsContainer,
        group: 'expense'
    },
    investment: {
        title: 'Investment management',
        container: DOM.investmentContainer,
        group: 'investment'
    },
    salary: {
        title: 'Salary credits',
        container: DOM.salaryContainer,
        group: 'expense'
    },
    various: {
        title: 'Various accreditations',
        container: DOM.variousContainer,
        group: 'expense'
    },
    investmentTransfers: {
        title: 'Bonifici in Entrata',
        container: DOM.investmentTransfersContainer,
        group: 'investment'
    },
    investments: {
        title: 'I Miei Investimenti',
        container: DOM.investmentsContainer,
        group: 'investment'
    },
    investmentMovements: {
        title: 'Spese e Movimenti',
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
    if (state.user) {
        localStorage.setItem('last_activity', Date.now().toString());
    }
}

// Track user interactions to reset the inactivity timer
document.addEventListener('click', updateLastActivity);
document.addEventListener('touchstart', updateLastActivity);

// Initialize App
async function init() {
    setupEventListeners();
    await checkSession();
    updateUI();
    
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
        await calculateInvestmentStatistics();
        await loadInvestmentHighlights();
    }
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

function showLoginScreen() {
    document.getElementById('email').removeAttribute('disabled');
    document.getElementById('password').removeAttribute('disabled');
    DOM.loginScreen.classList.add('active');
}

function resetEditMode(type) {
    state.editContext = { active: false, type: null, id: null };
    if (type === 'salary') {
        document.getElementById('salary-modal-title').textContent = 'Add Salary Credit';
        document.getElementById('salary-submit-btn').textContent = 'Save Credit';
        const form = document.getElementById('add-salary-form');
        if(form) form.reset();
    } else if (type === 'various') {
        document.getElementById('various-modal-title').textContent = 'Add Various Accreditation';
        document.getElementById('various-submit-btn').textContent = 'Save Credit';
        const form = document.getElementById('add-various-form');
        if(form) form.reset();
    } else if (type === 'expense') {
        document.getElementById('expense-modal-title').textContent = 'Add Expense';
        document.getElementById('expense-submit-btn').textContent = 'Save Expense';
        const form = document.getElementById('add-expense-form');
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
            const itemData = JSON.parse(editBtn.getAttribute('data-json'));
            
            state.editContext = { active: true, type: listType, id: itemId };
            
            if (listType === 'salary') {
                document.getElementById('salary-modal-title').textContent = 'Edit Salary Credit';
                document.getElementById('salary-submit-btn').textContent = 'Update Credit';
                document.getElementById('salary-amount').value = itemData.total_amount;
                document.getElementById('salary-spendable').value = itemData.spendable_amount;
                document.getElementById('salary-date').value = itemData.credit_date;
                document.getElementById('salary-desc').value = itemData.description || '';
                
                const modal = document.getElementById('add-salary-modal');
                if (modal) modal.classList.add('active');
            } else if (listType === 'various') {
                document.getElementById('various-modal-title').textContent = 'Edit Various Accreditation';
                document.getElementById('various-submit-btn').textContent = 'Update Credit';
                document.getElementById('various-amount').value = itemData.total_amount;
                document.getElementById('various-spendable').value = itemData.spendable_amount;
                document.getElementById('various-date').value = itemData.credit_date;
                document.getElementById('various-desc').value = itemData.description || '';
                
                const modal = document.getElementById('add-various-modal');
                if (modal) modal.classList.add('active');
            } else if (listType === 'expense') {
                document.getElementById('expense-modal-title').textContent = 'Edit Expense';
                document.getElementById('expense-submit-btn').textContent = 'Update Expense';
                document.getElementById('expense-amount').value = itemData.amount;
                document.getElementById('expense-date').value = itemData.expense_date;
                document.getElementById('expense-desc').value = itemData.description || '';
                
                if (DOM.addExpenseModal) DOM.addExpenseModal.classList.add('active');
            }
        }
    });

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
    
    // Logout Logic
    if (DOM.logoutBtn) {
        DOM.logoutBtn.addEventListener('click', async () => {
            if (navigator.vibrate) navigator.vibrate(50);
            
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
        if (document.visibilityState === 'visible' && state.user) {
            await checkSession();
        }
    });

    // REAL Login Form Submit with Supabase
    DOM.loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

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
        submitBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Signing in...';
        submitBtn.disabled = true;

        // Chiamata reale a Supabase per il login
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            // Login Fallito
            DOM.loginError.textContent = error.message;
            DOM.loginError.style.display = 'block';
            submitBtn.innerHTML = 'Sign In';
            submitBtn.disabled = false;
        } else {
            // Login Successo
            state.user = data.user;
            
            // Leggi il toggle per nascondere le cifre
            const hideToggle = document.getElementById('hide-amounts-toggle');
            if (hideToggle) {
                state.hideValues = hideToggle.checked;
                applyPrivacyMode();
            }
            
            updateLastActivity();
            DOM.loginScreen.classList.remove('active');
            submitBtn.innerHTML = 'Sign In';
            submitBtn.disabled = false;
            
            // Reset scroll position to top
            window.scrollTo(0, 0);

            // Pulisci i campi
            document.getElementById('password').value = '';
            
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
        }
    });

    // Demo Button Logic
    const demoBtn = document.getElementById('demo-btn');
    const demoModal = document.getElementById('demo-modal');
    const closeDemoModal = document.getElementById('close-demo-modal');
    
    if (demoBtn && demoModal && closeDemoModal) {
        demoBtn.addEventListener('click', () => {
            if (navigator.vibrate) navigator.vibrate(50);
            demoModal.classList.add('active');
        });
        
        closeDemoModal.addEventListener('click', () => {
            demoModal.classList.remove('active');
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

            if (spendable > amount) {
                alert("Spendable amount cannot be greater than the total amount!");
                return;
            }

            // Loading state
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Saving...';
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
                alert("Error saving data: " + error.message);
            } else {
                alert(state.editContext.active ? "Salary credit updated successfully!" : "Salary credit saved successfully!");
                addSalaryModal.classList.remove('active');
                resetEditMode('salary');
                
                // Important: Calculate statistics first to update state.totalRemaining
                await calculateStatistics();
                // Then process unhandled expenses if the budget allows
                await processUnhandledExpenses();
                
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

            if (spendable > amount) {
                alert("Spendable amount cannot be greater than the total amount!");
                return;
            }

            // Loading state
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Saving...';
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
                alert("Error saving data: " + error.message);
            } else {
                alert(state.editContext.active ? "Various accreditation updated successfully!" : "Various accreditation saved successfully!");
                addVariousModal.classList.remove('active');
                resetEditMode('various');
                
                // Calculate stats to get updated totalRemaining
                await calculateStatistics();
                // Process unhandled expenses
                await processUnhandledExpenses();
                
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

            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Saving...';
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
                alert("Error saving data: " + error.message);
            } else {
                alert(state.editContext.active ? "Expense updated successfully!" : "Expense saved successfully!");
                DOM.addExpenseModal.classList.remove('active');
                resetEditMode('expense');
                
                // Ricalcola se era un update che cambia gli importi
                if (state.editContext.active) {
                    await calculateStatistics();
                    await processUnhandledExpenses();
                }
                
                loadExpenses(); // Update dedicated list
                calculateStatistics(); // Update total spent
            }
        });
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
            DOM.addBonificoForm.reset();
        });
        
        DOM.addBonificoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const amount = parseFloat(document.getElementById('bonifico-amount').value);
            const date = document.getElementById('bonifico-date').value;
            const submitBtn = DOM.addBonificoForm.querySelector('button[type="submit"]');
            
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Salvataggio...';
            submitBtn.disabled = true;
            
            const { error } = await supabase.from('investment_transfers').insert([{
                user_id: state.user.id,
                amount: amount,
                date: date
            }]);
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            if (error) {
                console.error("Errore salvataggio bonifico:", error);
                alert("Errore salvataggio: " + error.message);
            } else {
                DOM.addBonificoModal.classList.remove('active');
                DOM.addBonificoForm.reset();
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
            DOM.addInvestimentoForm.reset();
        });
        
        DOM.addInvestimentoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const amount = parseFloat(document.getElementById('investimento-amount').value);
            const date = document.getElementById('investimento-date').value;
            const desc = document.getElementById('investimento-desc').value;
            const submitBtn = DOM.addInvestimentoForm.querySelector('button[type="submit"]');
            
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Salvataggio...';
            submitBtn.disabled = true;
            
            const { error } = await supabase.from('investments').insert([{
                user_id: state.user.id,
                amount: amount,
                date: date,
                description: desc
            }]);
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            if (error) {
                console.error("Errore salvataggio investimento:", error);
                alert("Errore salvataggio: " + error.message);
            } else {
                DOM.addInvestimentoModal.classList.remove('active');
                DOM.addInvestimentoForm.reset();
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
            DOM.addMovimentoForm.reset();
        });
        
        DOM.addMovimentoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const amount = parseFloat(document.getElementById('movimento-amount').value);
            const date = document.getElementById('movimento-date').value;
            const desc = document.getElementById('movimento-desc').value;
            const highlighted = document.getElementById('movimento-highlighted').checked;
            const submitBtn = DOM.addMovimentoForm.querySelector('button[type="submit"]');
            
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Salvataggio...';
            submitBtn.disabled = true;
            
            const { error } = await supabase.from('investment_movements').insert([{
                user_id: state.user.id,
                amount: amount,
                date: date,
                description: desc,
                is_highlighted: highlighted
            }]);
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            if (error) {
                console.error("Errore salvataggio movimento:", error);
                alert("Errore salvataggio: " + error.message);
            } else {
                DOM.addMovimentoModal.classList.remove('active');
                DOM.addMovimentoForm.reset();
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
    DOM.appTitle.textContent = viewConfig.title;

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
    return new Date(dateString).toLocaleDateString('en-GB', options);
}

// Update Element Utility
function updateEl(id, value) {
    const el = document.getElementById(id);
    if (el) {
        if (state.hideValues) {
            el.innerHTML = '***';
        } else {
            el.innerHTML = formatCurrency(value);
        }
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
            title: item.description || 'Salary Credit',
            icon: 'ph-money'
        }));

        const various = (variousData || []).map(item => ({
            ...item,
            type: 'various',
            title: item.description || 'Various Accreditation',
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
                    <p>No recent accreditations</p>
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
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">Me: ${formatCurrency(item.spendable_amount)}</div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error("Error loading recent accreditations:", error);
        listContainer.innerHTML = `
            <div class="empty-state" style="color: #ff3b30; text-align: center;">
                <i class="ph ph-warning"></i>
                <p>Failed to load data: ${error.message || JSON.stringify(error)}</p>
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
                    <p>No salary credits yet</p>
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
                        <span class="transaction-title">${item.description || 'Salary Credit'}</span>
                        <span class="transaction-date">${formatDate(item.credit_date)}</span>
                    </div>
                </div>
                <div class="transaction-amount" style="text-align: right;">
                    <div style="font-weight: 600; color: #34c759;">${formatCurrency(item.total_amount, '+')}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">Me: ${formatCurrency(item.spendable_amount)}</div>
                </div>
                <div class="edit-icon-item" data-id="${item.id}" data-type="salary" data-json='${JSON.stringify(item).replace(/'/g, "&apos;")}'>
                    <i class="ph ph-pencil-simple"></i>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error("Error loading salary credits:", error);
        listContainer.innerHTML = `
            <div class="empty-state" style="color: #ff3b30; text-align: center;">
                <i class="ph ph-warning"></i>
                <p>Failed to load data: ${error.message || JSON.stringify(error)}</p>
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
                    <p>No various accreditations yet</p>
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
                        <span class="transaction-title">${item.description || 'Various Accreditation'}</span>
                        <span class="transaction-date">${formatDate(item.credit_date)}</span>
                    </div>
                </div>
                <div class="transaction-amount" style="text-align: right;">
                    <div style="font-weight: 600; color: #34c759;">${formatCurrency(item.total_amount, '+')}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">Me: ${formatCurrency(item.spendable_amount)}</div>
                </div>
                <div class="edit-icon-item" data-id="${item.id}" data-type="various" data-json='${JSON.stringify(item).replace(/'/g, "&apos;")}'>
                    <i class="ph ph-pencil-simple"></i>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error("Error loading various accreditations:", error);
        listContainer.innerHTML = `
            <div class="empty-state" style="color: #ff3b30; text-align: center;">
                <i class="ph ph-warning"></i>
                <p>Failed to load data: ${error.message || JSON.stringify(error)}</p>
            </div>
        `;
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
                    <p>No expenses yet</p>
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
            const extraLabel = isUnhandled ? ' <span style="font-size: 0.7rem; color: #8e8e93; font-weight: normal; margin-left: 4px;">(In attesa)</span>' : '';

            return `
            <div class="transaction-item" style="${isUnhandled ? 'opacity: 0.8;' : ''}">
                <div class="transaction-left">
                    <div class="transaction-icon expense" style="background-color: ${iconBg}; color: ${iconColor};">
                        <i class="ph ph-shopping-cart"></i>
                    </div>
                    <div class="transaction-info">
                        <span class="transaction-title" style="${isUnhandled ? 'color: #8e8e93;' : ''}">${item.description || 'Expense'}${extraLabel}</span>
                        <span class="transaction-date">${formatDate(item.expense_date)}</span>
                    </div>
                </div>
                <div class="transaction-amount expense-amount-text" style="color: ${textColor};">
                    ${formatCurrency(item.amount, '-')}
                </div>
                <div class="edit-icon-item" data-id="${item.id}" data-type="expense" data-json='${JSON.stringify(item).replace(/'/g, "&apos;")}'>
                    <i class="ph ph-pencil-simple"></i>
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
                        const monthName = dateObj.toLocaleString('it-IT', { month: 'long', year: 'numeric' });
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
                    <p>No expenses to show</p>
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
                    <p>Nessun movimento in evidenza</p>
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
            const title = item.description || (isPositive ? 'Accredito' : 'Spesa/Commissione');
            
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
                    <p>Nessun bonifico</p>
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
                        <div class="transaction-title">Bonifico in entrata</div>
                        <div class="transaction-date">${formatDate(item.date)}</div>
                    </div>
                </div>
                <div class="transaction-amount" style="text-align: right;">
                    <div style="font-weight: 600; color: #34c759;">${formatCurrency(item.amount, '+')}</div>
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
                    <p>Nessun investimento</p>
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
                        <div class="transaction-title">${item.description}</div>
                        <div class="transaction-date">${formatDate(item.date)}</div>
                    </div>
                </div>
                <div class="transaction-amount" style="text-align: right; color: var(--text-primary);">
                    <div style="font-weight: 600;">${formatCurrency(item.amount)}</div>
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
                    <p>Nessun movimento</p>
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
            const title = item.description || (isPositive ? 'Accredito' : 'Spesa/Commissione');
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
            </div>
            `;
        }).join('');

    } catch (error) {
        console.error("Error loading investment movements:", error);
    }
}

// Process Unhandled Expenses when new funds are added
async function processUnhandledExpenses() {
    if (!state.user) return;

    try {
        // Fetch all unhandled expenses sorted by oldest first
        const { data: unhandled, error: fetchErr } = await supabase
            .from('expenses')
            .select('id, amount')
            .eq('is_handled', false)
            .order('created_at', { ascending: true });

        if (fetchErr) throw fetchErr;
        
        if (!unhandled || unhandled.length === 0) return; // No unhandled expenses

        let currentRemaining = state.totalRemaining;
        
        for (const expense of unhandled) {
            const expAmount = parseFloat(expense.amount);
            
            // If the budget can cover this oldest expense
            if (currentRemaining >= expAmount) {
                // Update DB
                const { error: updateErr } = await supabase
                    .from('expenses')
                    .update({ is_handled: true })
                    .eq('id', expense.id);
                
                if (updateErr) throw updateErr;
                
                // Decrement our running total to check the next one
                currentRemaining -= expAmount;
            } else {
                // If we can't afford this one, we break, because we process chronologically
                break;
            }
        }
    } catch (error) {
        console.error("Error processing unhandled expenses:", error);
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
                .then(registration => console.log('SW registered'))
                .catch(err => console.log('SW registration failed:', err));
        });
    }
});
