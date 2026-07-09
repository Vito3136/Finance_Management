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
    user: null
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
    investmentContainer: document.getElementById('investment-container'),
    salaryContainer: document.getElementById('salary-container'),
    variousContainer: document.getElementById('various-container'),
    
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
    }
};

// Global Mode Config (for top-right toggle)
const GLOBAL_MODE_CONFIG = {
    expense: {
        nextMode: 'investment',
        iconHTML: '<i class="ph ph-wallet"></i>' // show wallet to switch to investment
    },
    investment: {
        nextMode: 'expense',
        iconHTML: '<i class="ph ph-chart-line-up"></i>' // show chart to switch to expense
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
    
    // Load initial data if logged in
    if (state.user) {
        await loadRecentAccreditations();
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
            localStorage.removeItem('last_activity');
            DOM.loginScreen.classList.add('active');
            return;
        }

        // Session valid
        updateLastActivity();
        state.user = session.user;
        DOM.loginScreen.classList.remove('active');
    } else {
        // Show login screen
        DOM.loginScreen.classList.add('active');
    }
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

    // Nav Links (Side Menu)
    DOM.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const target = e.currentTarget.getAttribute('data-target');
            let newView = 'home';
            
            // Map container id to state view
            if (target === 'salary-container') newView = 'salary';
            else if (target === 'various-container') newView = 'various';
            else if (target === 'expense-container') newView = 'expense';
            else if (target === 'investment-container') newView = 'investment';
            else if (target === 'home-container') newView = 'home';
            
            if (state.views[state.globalMode] !== newView) {
                if (navigator.vibrate) navigator.vibrate(50);
                state.views[state.globalMode] = newView;
                updateUI();
            }
            toggleMenu(); // Close menu
        });
    });
    
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
            DOM.loginScreen.classList.add('active');
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
            updateLastActivity();
            DOM.loginScreen.classList.remove('active');
            submitBtn.innerHTML = 'Sign In';
            submitBtn.disabled = false;

            // Pulisci i campi
            document.getElementById('password').value = '';
            
            // Carica i dati iniziali
            await loadRecentAccreditations();
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
            addSalaryForm.reset();
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

            // Insert into Supabase
            const { data, error } = await supabase
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

            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;

            if (error) {
                console.error("Error saving salary:", error);
                alert("Error saving data: " + error.message);
            } else {
                alert("Salary credit saved successfully!");
                addSalaryModal.classList.remove('active');
                addSalaryForm.reset();
                loadRecentAccreditations(); // Update list
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
            addVariousForm.reset();
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

            // Insert into Supabase
            const { data, error } = await supabase
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

            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;

            if (error) {
                console.error("Error saving various accreditation:", error);
                alert("Error saving data: " + error.message);
            } else {
                alert("Various accreditation saved successfully!");
                addVariousModal.classList.remove('active');
                addVariousForm.reset();
                loadRecentAccreditations(); // Update list
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
                <div class="transaction-amount">
                    +€${parseFloat(item.total_amount).toFixed(2)}
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

// Run app
document.addEventListener('DOMContentLoaded', () => {
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
