// --- SUPABASE CONFIGURATION ---
// INSERISCI QUI LE TUE CHIAVI (Puoi trovarle in Project Settings -> API su Supabase)
const SUPABASE_URL = 'https://hcvktcdrgrsnmxqtvfeg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhjdmt0Y2RyZ3Jzbm14cXR2ZmVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NjkwNTYsImV4cCI6MjA5ODE0NTA1Nn0.Mj-xmxF6zTXxquVhVyPYkM45gb5R8sw_ftmKy7Oo7e0';

// Inizializza il client Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Application State
const state = {
    mode: 'home', // Initial mode
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
        nextMode: 'investment',
        iconHTML: '<i class="ph ph-chart-line-up"></i>',
        container: DOM.homeContainer
    },
    expense: {
        title: 'Expenses History',
        nextMode: 'home',
        iconHTML: '<i class="ph ph-house"></i>',
        container: DOM.expenseContainer
    },
    investment: {
        title: 'Investment management',
        nextMode: 'home',
        iconHTML: '<i class="ph ph-wallet"></i>',
        container: DOM.investmentContainer
    },
    salary: {
        title: 'Salary credits',
        nextMode: 'home', 
        iconHTML: '<i class="ph ph-house"></i>',
        container: DOM.salaryContainer
    },
    various: {
        title: 'Various accreditations',
        nextMode: 'home',
        iconHTML: '<i class="ph ph-house"></i>',
        container: DOM.variousContainer
    }
};

// Initialize App
async function init() {
    setupEventListeners();
    await checkSession();
    updateUI();
}

// Check if user is already logged in
async function checkSession() {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (session) {
        // User is already logged in
        state.user = session.user;
        DOM.loginScreen.classList.remove('active');
    } else {
        // Show login screen
        DOM.loginScreen.classList.add('active');
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Mode Toggle
    DOM.toggleModeBtn.addEventListener('click', () => {
        if (navigator.vibrate) navigator.vibrate(50);
        state.mode = MODE_CONFIG[state.mode].nextMode;
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
            let newMode = 'home';
            
            // Map container id to state mode
            if (target === 'salary-container') newMode = 'salary';
            else if (target === 'various-container') newMode = 'various';
            else if (target === 'expense-container') newMode = 'expense';
            else if (target === 'investment-container') newMode = 'investment';
            else if (target === 'home-container') newMode = 'home';
            
            if (state.mode !== newMode) {
                if (navigator.vibrate) navigator.vibrate(50);
                state.mode = newMode;
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

    // REAL Login Form Submit with Supabase
    DOM.loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
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
            DOM.loginScreen.classList.remove('active');
            submitBtn.innerHTML = 'Sign In';
            submitBtn.disabled = false;

            // Pulisci i campi
            document.getElementById('password').value = '';
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
    const addSalaryModal = document.getElementById('add-salary-modal');
    const closeSalaryModal = document.getElementById('close-salary-modal');
    const addSalaryForm = document.getElementById('add-salary-form');

    if (btnAddSalary && addSalaryModal && closeSalaryModal && addSalaryForm) {
        // Open modal
        btnAddSalary.addEventListener('click', () => {
            if (navigator.vibrate) navigator.vibrate(50);
            // Default date to today
            document.getElementById('salary-date').valueAsDate = new Date();
            addSalaryModal.classList.add('active');
        });

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
                // TODO: Update the UI counters here later
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
    const config = MODE_CONFIG[state.mode];

    // Clear previous timeouts to prevent overlapping animations
    if (uiTimeout) clearTimeout(uiTimeout);
    if (containerTimeout) clearTimeout(containerTimeout);

    // Animate title change
    DOM.appTitle.style.opacity = '0';
    DOM.toggleModeBtn.style.transform = 'scale(0.8) rotate(180deg)';
    DOM.toggleModeBtn.style.opacity = '0';

    uiTimeout = setTimeout(() => {
        DOM.appTitle.textContent = config.title;
        DOM.appTitle.style.opacity = '1';

        DOM.toggleModeBtn.innerHTML = config.iconHTML;
        DOM.toggleModeBtn.style.transform = 'scale(1) rotate(0deg)';
        DOM.toggleModeBtn.style.opacity = '1';
    }, 200);

    // Hide all containers
    Object.values(MODE_CONFIG).forEach(c => {
        c.container.classList.remove('active');
    });

    // Small delay to allow the fade out before showing new one
    containerTimeout = setTimeout(() => {
        config.container.classList.add('active');
    }, 150);
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
