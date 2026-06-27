// Application State
const state = {
    mode: 'expense', // 'expense' or 'investment'
    isMenuOpen: false
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
    investmentContainer: document.getElementById('investment-container')
};

// Mode Config
const MODE_CONFIG = {
    expense: {
        title: 'Expense management',
        nextMode: 'investment',
        iconHTML: '<i class="ph ph-chart-line-up"></i>', // Icon to switch to investment
        activeContainer: DOM.expenseContainer,
        inactiveContainer: DOM.investmentContainer
    },
    investment: {
        title: 'Investment management',
        nextMode: 'expense',
        iconHTML: '<i class="ph ph-wallet"></i>', // Icon to switch to expense
        activeContainer: DOM.investmentContainer,
        inactiveContainer: DOM.expenseContainer
    }
};

// Initialize App
function init() {
    setupEventListeners();
    updateUI();
}

// Setup Event Listeners
function setupEventListeners() {
    // Mode Toggle
    DOM.toggleModeBtn.addEventListener('click', () => {
        // Add a tiny vibration on supported devices
        if (navigator.vibrate) navigator.vibrate(50);
        
        state.mode = MODE_CONFIG[state.mode].nextMode;
        updateUI();
    });

    // Menu Toggle
    DOM.menuBtn.addEventListener('click', toggleMenu);
    DOM.closeMenuBtn.addEventListener('click', toggleMenu);
    DOM.menuOverlay.addEventListener('click', toggleMenu);
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

// Update UI based on State
function updateUI() {
    const config = MODE_CONFIG[state.mode];
    
    // Animate title change
    DOM.appTitle.style.opacity = '0';
    DOM.toggleModeBtn.style.transform = 'scale(0.8) rotate(180deg)';
    DOM.toggleModeBtn.style.opacity = '0';
    
    setTimeout(() => {
        DOM.appTitle.textContent = config.title;
        DOM.appTitle.style.opacity = '1';
        
        DOM.toggleModeBtn.innerHTML = config.iconHTML;
        DOM.toggleModeBtn.style.transform = 'scale(1) rotate(0deg)';
        DOM.toggleModeBtn.style.opacity = '1';
    }, 200);

    // Switch containers
    config.inactiveContainer.classList.remove('active');
    
    // Small delay to allow the fade out of the old container before showing new one
    setTimeout(() => {
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
