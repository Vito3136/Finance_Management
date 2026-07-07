// --- SUPABASE CONFIGURATION ---
// INSERISCI QUI LE TUE CHIAVI (Puoi trovarle in Project Settings -> API su Supabase)
const SUPABASE_URL = 'https://hcvktcdrgrsnmxqtvfeg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhjdmt0Y2RyZ3Jzbm14cXR2ZmVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NjkwNTYsImV4cCI6MjA5ODE0NTA1Nn0.Mj-xmxF6zTXxquVhVyPYkM45gb5R8sw_ftmKy7Oo7e0';

// Inizializza il client Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Application State
const state = {
    mode: 'expense', // 'expense' or 'investment'
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
    expenseContainer: document.getElementById('expense-container'),
    investmentContainer: document.getElementById('investment-container'),

    // Login Elements
    loginScreen: document.getElementById('login-screen'),
    loginForm: document.getElementById('login-form'),
    loginError: document.getElementById('login-error'),
    logoutBtn: document.getElementById('logout-btn')
};

// Mode Config
const MODE_CONFIG = {
    expense: {
        title: 'Expense management',
        nextMode: 'investment',
        iconHTML: '<i class="ph ph-chart-line-up"></i>',
        activeContainer: DOM.expenseContainer,
        inactiveContainer: DOM.investmentContainer
    },
    investment: {
        title: 'Investment management',
        nextMode: 'expense',
        iconHTML: '<i class="ph ph-wallet"></i>',
        activeContainer: DOM.investmentContainer,
        inactiveContainer: DOM.expenseContainer
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

    // Switch containers
    config.inactiveContainer.classList.remove('active');

    // Small delay to allow the fade out of the old container before showing new one
    containerTimeout = setTimeout(() => {
        config.activeContainer.classList.add('active');
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
