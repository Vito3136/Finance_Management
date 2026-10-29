export const translations = {
    it: {
        // App / Meta
        app_title: "Finance Management",
        author: "Sviluppato da Vito Ditrani",

        // Login
        label_email: "Email",
        label_password: "Password",
        label_hide_amounts: "Oscura gli importi",
        btn_signin: "Accedi",
        btn_signing_in: '<i class="ph ph-spinner ph-spin"></i> Accesso in corso...',
        demo_text: "App progettata per dispositivi mobili.<br>Non sei Vito Ditrani? Puoi provare la demo.",
        btn_demo: "Prova versione demo",
        demo_modal_title: "Avviso",
        demo_modal_text: "La versione demo non è ancora disponibile.",
        btn_close: "Chiudi",

        // Navigation Titles (Top Bar)
        view_home_title: "Gestione Spese",
        view_expense_title: "Cronologia Spese",
        view_statistics_title: "Statistiche",
        view_investment_title: "Gestione Portafoglio",
        view_salary_title: "Stipendi",
        view_various_title: "Accrediti Vari",
        view_transfers_title: "Bonifici in Entrata",
        view_investments_title: "I Miei Investimenti",
        view_movements_title: "Spese e Movimenti",

        // Side Menu
        menu_header: "Menu",
        menu_home: "Homepage",
        menu_salary: "Stipendi",
        menu_various: "Accrediti vari",
        menu_expenses: "Spese",
        menu_statistics: "Statistiche",
        menu_transfers: "Bonifici",
        menu_investments: "Investimenti",
        menu_movements: "Spese e Movimenti",
        menu_language: "Lingua",
        menu_hide_values: "Nascondi Cifre",
        menu_logout: "Logout",
        menu_exit_demo: "Esci dalla demo",
        demo_badge: "DEMO",

        // Action Buttons
        btn_add_salary_action: "+ Aggiungi stipendio",
        btn_add_expense_action: "+ Aggiungi spesa",
        btn_add_various_action: "+ Aggiungi accredito vario",
        btn_add_bonifico_action: '<i class="ph ph-bank"></i> Aggiungi Bonifico',
        btn_add_investimento_action: '<i class="ph ph-chart-pie-slice"></i> Aggiungi Investimento',
        btn_add_movimento_action: '<i class="ph ph-receipt"></i> Aggiungi Movimento',

        // Widgets Labels
        widget_remaining: "RIMANENTI DA SPENDERE",
        widget_saved: "RISPARMIATI TOTALE",
        widget_spent_total: "TOTALE SPESI",
        widget_gross_total: "LORDO TOTALE",
        widget_expenses_total: "TOTALE SPESE",
        widget_expenses_pending: "SPESE IN ATTESA",
        widget_reply_gross: "LORDO STIPENDIO REPLY",
        widget_reply_spendable: "TOTALE PER ME STIPENDIO REPLY",
        widget_reply_saved: "RISPARMIATI STIPENDIO REPLY",
        widget_demo_salary_gross: "LORDO STIPENDIO",
        widget_demo_salary_spendable: "TOTALE PER ME STIPENDIO",
        widget_demo_salary_saved: "RISPARMIATI STIPENDIO",
        widget_various_gross: "LORDO ACCREDITI VARI",
        widget_various_spendable: "TOTALE PER ME ACCREDITI VARI",
        widget_various_saved: "ACCREDITI VARI RISPARMIATI",
        widget_inv_transfers: "TOTALE BONIFICI INVIATI",
        widget_inv_debits: "TOTALE ADDEBITI INVESTIMENTI",
        widget_inv_spese: "TOTALE SPESE UNICREDIT",
        widget_inv_saldo: "SALDO DISPONIBILE ATTUALE",

        // Section Titles
        section_recent_accreditations: "Accrediti recenti",
        section_salary_history: "Cronologia Stipendi",
        section_various_history: "Accrediti Vari",
        section_expenses_history: "Cronologia Spese",
        section_statistics: "Statistiche",
        section_global_totals: '<i class="ph ph-globe" style="color: var(--primary-color);"></i> Totali Generali',
        section_reply_salary: '<i class="ph ph-briefcase" style="color: #FF9500;"></i> Stipendio Reply',
        section_demo_salary: '<i class="ph ph-briefcase" style="color: #FF9500;"></i> Stipendio',
        section_various_accreditations: '<i class="ph ph-gift" style="color: #AF52DE;"></i> Accrediti Vari',
        section_portfolio_summary: '<i class="ph ph-chart-line-up" style="color: var(--accent-investment);"></i> Riepilogo Portafoglio',
        section_highlighted_movements: "Movimenti In Evidenza",
        section_incoming_transfers: "Bonifici in Entrata",
        section_my_investments: "I Miei Investimenti",
        section_expenses_movements: "Spese e Movimenti",

        // Filters / View Toggles
        filter_all: "Tutte",
        filter_by_month: "Per Mese",

        // Modals: Add / Edit Titles & Buttons & Labels
        // Salary
        modal_add_salary_title: "Aggiungi Stipendio",
        modal_edit_salary_title: "Modifica Stipendio",
        label_total_amount: "Importo Totale (€)",
        label_spendable_amount: "Importo Spendibile (€)",
        hint_salary_spendable: "Importo che puoi spendere da questo stipendio",
        label_date: "Data",
        label_description_opt: "Descrizione (Opzionale)",
        placeholder_salary_desc: "es. Stipendio Ottobre",
        btn_save_credit: "Salva Stipendio",
        btn_update_credit: "Aggiorna Stipendio",

        // Various
        modal_add_various_title: "Aggiungi Accredito Vario",
        modal_edit_various_title: "Modifica Accredito Vario",
        hint_various_spendable: "Importo che puoi spendere da questo accredito",
        placeholder_various_desc: "es. Rimborso o Regalo",
        btn_save_various: "Salva Accredito",
        btn_update_various: "Aggiorna Accredito",

        // Expense
        modal_add_expense_title: "Aggiungi Spesa",
        modal_edit_expense_title: "Modifica Spesa",
        label_amount: "Importo (€)",
        label_description: "Descrizione",
        btn_save_expense: "Salva Spesa",
        btn_update_expense: "Aggiorna Spesa",

        // Bonifico
        modal_add_bonifico_title: "Aggiungi Bonifico",
        modal_edit_bonifico_title: "Modifica Bonifico",
        label_cifra: "Cifra (€)",
        btn_save_bonifico: "Salva Bonifico",
        btn_update_bonifico: "Aggiorna Bonifico",

        // Investimento
        modal_add_investimento_title: "Aggiungi Investimento",
        modal_edit_investimento_title: "Modifica Investimento",
        btn_save_investimento: "Salva Investimento",
        btn_update_investimento: "Aggiorna Investimento",

        // Movimento
        modal_add_movimento_title: "Aggiungi Movimento",
        modal_edit_movimento_title: "Modifica Movimento",
        label_movimento_amount: "Cifra (€) (Usa - per le spese)",
        placeholder_movimento_amount: "es. 10.50 o -2.99",
        label_highlight: "Metti in evidenza",
        btn_save_movimento: "Salva Movimento",
        btn_update_movimento: "Aggiorna Movimento",

        // Empty states
        empty_recent: "Nessun accredito recente",
        empty_salary: "Nessuno stipendio presente",
        empty_various: "Nessun accredito vario presente",
        empty_expenses: "Nessuna spesa presente",
        empty_highlighted: "Nessun movimento in evidenza",
        empty_transfers: "Nessun bonifico",
        empty_investments: "Nessun investimento",
        empty_movements: "Nessun movimento",
        empty_failed_load: "Impossibile caricare i dati: ",

        // Item labels & Badges
        label_for_me: "Per me: ",
        label_pending_badge: "(In attesa)",
        label_salary_credit_fallback: "Accredito Stipendio",
        label_various_credit_fallback: "Accredito Vario",
        label_expense_fallback: "Spesa",
        label_transfer_title: "Bonifico in entrata",
        label_credit_movement: "Accredito",
        label_expense_movement: "Spesa/Commissione",

        // Saving state in buttons
        btn_saving: '<i class="ph ph-spinner ph-spin"></i> Salvataggio...',

        // Alerts & Confirmations
        confirm_delete: "Sei sicuro di voler eliminare questa voce? L'operazione non è reversibile.",
        alert_delete_error: "Errore durante l'eliminazione: ",
        alert_amount_greater_zero: "L'importo deve essere maggiore di zero!",
        alert_spendable_greater_total: "La quota spendibile non può superare l'importo totale!",
        alert_save_error: "Errore durante il salvataggio: ",
        alert_salary_saved: "Stipendio salvato con successo!",
        alert_salary_updated: "Stipendio aggiornato con successo!",
        alert_various_saved: "Accredito vario salvato con successo!",
        alert_various_updated: "Accredito vario aggiornato con successo!",
        alert_expense_amount_greater_zero: "L'importo della spesa deve essere maggiore di zero!",
        alert_expense_saved: "Spesa salvata con successo!",
        alert_expense_updated: "Spesa aggiornata con successo!",
        alert_bonifico_amount_greater_zero: "L'importo del bonifico deve essere maggiore di zero!",
        alert_bonifico_saved: "Bonifico salvato con successo!",
        alert_bonifico_updated: "Bonifico aggiornato con successo!",
        alert_investimento_amount_greater_zero: "L'importo dell'investimento deve essere maggiore di zero!",
        alert_investimento_saved: "Investimento salvato con successo!",
        alert_investimento_updated: "Investimento aggiornato con successo!",
        alert_movimento_saved: "Movimento salvato con successo!",
        alert_movimento_updated: "Movimento aggiornato con successo!"
    },
    en: {
        // App / Meta
        app_title: "Finance Management",
        author: "Developed by Vito Ditrani",

        // Login
        label_email: "Email",
        label_password: "Password",
        label_hide_amounts: "Hide amounts",
        btn_signin: "Sign In",
        btn_signing_in: '<i class="ph ph-spinner ph-spin"></i> Signing in...',
        demo_text: "App designed for mobile experience.<br>Not Vito Ditrani? You can try a demo.",
        btn_demo: "Try Demo Version",
        demo_modal_title: "Notice",
        demo_modal_text: "Demo version is not yet available.",
        btn_close: "Close",

        // Navigation Titles (Top Bar)
        view_home_title: "Expense Management",
        view_expense_title: "Expenses History",
        view_statistics_title: "Statistics",
        view_investment_title: "Investment Management",
        view_salary_title: "Salary Credits",
        view_various_title: "Various Accreditations",
        view_transfers_title: "Incoming Transfers",
        view_investments_title: "My Investments",
        view_movements_title: "Expenses & Movements",

        // Side Menu
        menu_header: "Menu",
        menu_home: "Homepage",
        menu_salary: "Salary credits",
        menu_various: "Various accreditations",
        menu_expenses: "Expenses",
        menu_statistics: "Statistics",
        menu_transfers: "Transfers",
        menu_investments: "Investments",
        menu_movements: "Expenses & Movements",
        menu_language: "Language",
        menu_hide_values: "Hide Amounts",
        menu_logout: "Logout",
        menu_exit_demo: "Exit demo",
        demo_badge: "DEMO",

        // Action Buttons
        btn_add_salary_action: "+ Add salary credit",
        btn_add_expense_action: "+ Add expense",
        btn_add_various_action: "+ Add various accreditation",
        btn_add_bonifico_action: '<i class="ph ph-bank"></i> Add Transfer',
        btn_add_investimento_action: '<i class="ph ph-chart-pie-slice"></i> Add Investment',
        btn_add_movimento_action: '<i class="ph ph-receipt"></i> Add Movement',

        // Widgets Labels
        widget_remaining: "REMAINING TO SPEND",
        widget_saved: "TOTAL SAVED",
        widget_spent_total: "TOTAL SPENT",
        widget_gross_total: "TOTAL GROSS",
        widget_expenses_total: "TOTAL EXPENSES",
        widget_expenses_pending: "PENDING EXPENSES",
        widget_reply_gross: "REPLY SALARY GROSS",
        widget_reply_spendable: "TOTAL FOR ME REPLY SALARY",
        widget_reply_saved: "SAVED REPLY SALARY",
        widget_demo_salary_gross: "SALARY GROSS",
        widget_demo_salary_spendable: "TOTAL FOR ME SALARY",
        widget_demo_salary_saved: "SAVED SALARY",
        widget_various_gross: "VARIOUS ACCREDITATIONS GROSS",
        widget_various_spendable: "TOTAL FOR ME VARIOUS ACCREDITATIONS",
        widget_various_saved: "SAVED VARIOUS ACCREDITATIONS",
        widget_inv_transfers: "TOTAL TRANSFERS SENT",
        widget_inv_debits: "TOTAL INVESTMENT DEBITS",
        widget_inv_spese: "TOTAL UNICREDIT EXPENSES",
        widget_inv_saldo: "CURRENT AVAILABLE BALANCE",

        // Section Titles
        section_recent_accreditations: "Recent accreditations",
        section_salary_history: "Salary Credits History",
        section_various_history: "Various Accreditations",
        section_expenses_history: "Expenses History",
        section_statistics: "Statistics",
        section_global_totals: '<i class="ph ph-globe" style="color: var(--primary-color);"></i> Global Totals',
        section_reply_salary: '<i class="ph ph-briefcase" style="color: #FF9500;"></i> Reply Salary',
        section_demo_salary: '<i class="ph ph-briefcase" style="color: #FF9500;"></i> Salary',
        section_various_accreditations: '<i class="ph ph-gift" style="color: #AF52DE;"></i> Various Accreditations',
        section_portfolio_summary: '<i class="ph ph-chart-line-up" style="color: var(--accent-investment);"></i> Portfolio Summary',
        section_highlighted_movements: "Highlighted Movements",
        section_incoming_transfers: "Incoming Transfers",
        section_my_investments: "My Investments",
        section_expenses_movements: "Expenses and Movements",

        // Filters / View Toggles
        filter_all: "All",
        filter_by_month: "By Month",

        // Modals: Add / Edit Titles & Buttons & Labels
        // Salary
        modal_add_salary_title: "Add Salary Credit",
        modal_edit_salary_title: "Edit Salary Credit",
        label_total_amount: "Total Amount (€)",
        label_spendable_amount: "Spendable Amount (€)",
        hint_salary_spendable: "Amount you can spend from this salary",
        label_date: "Date",
        label_description_opt: "Description (Optional)",
        placeholder_salary_desc: "e.g. October Salary",
        btn_save_credit: "Save Credit",
        btn_update_credit: "Update Credit",

        // Various
        modal_add_various_title: "Add Various Accreditation",
        modal_edit_various_title: "Edit Various Accreditation",
        hint_various_spendable: "Amount you can spend from this accreditation",
        placeholder_various_desc: "e.g. Refund or Gift",
        btn_save_various: "Save Credit",
        btn_update_various: "Update Credit",

        // Expense
        modal_add_expense_title: "Add Expense",
        modal_edit_expense_title: "Edit Expense",
        label_amount: "Amount (€)",
        label_description: "Description",
        btn_save_expense: "Save Expense",
        btn_update_expense: "Update Expense",

        // Bonifico
        modal_add_bonifico_title: "Add Transfer",
        modal_edit_bonifico_title: "Edit Transfer",
        label_cifra: "Amount (€)",
        btn_save_bonifico: "Save Transfer",
        btn_update_bonifico: "Update Transfer",

        // Investimento
        modal_add_investimento_title: "Add Investment",
        modal_edit_investimento_title: "Edit Investment",
        btn_save_investimento: "Save Investment",
        btn_update_investimento: "Update Investment",

        // Movimento
        modal_add_movimento_title: "Add Movement",
        modal_edit_movimento_title: "Edit Movement",
        label_movimento_amount: "Amount (€) (Use - for expenses)",
        placeholder_movimento_amount: "e.g. 10.50 or -2.99",
        label_highlight: "Highlight",
        btn_save_movimento: "Save Movement",
        btn_update_movimento: "Update Movement",

        // Empty states
        empty_recent: "No recent accreditations",
        empty_salary: "No salary credits yet",
        empty_various: "No various accreditations yet",
        empty_expenses: "No expenses yet",
        empty_highlighted: "No highlighted movements",
        empty_transfers: "No transfers",
        empty_investments: "No investments",
        empty_movements: "No movements",
        empty_failed_load: "Failed to load data: ",

        // Item labels & Badges
        label_for_me: "Me: ",
        label_pending_badge: "(Pending)",
        label_salary_credit_fallback: "Salary Credit",
        label_various_credit_fallback: "Various Accreditation",
        label_expense_fallback: "Expense",
        label_transfer_title: "Incoming transfer",
        label_credit_movement: "Credit",
        label_expense_movement: "Expense/Fee",

        // Saving state in buttons
        btn_saving: '<i class="ph ph-spinner ph-spin"></i> Saving...',

        // Alerts & Confirmations
        confirm_delete: "Are you sure you want to delete this item? This operation cannot be undone.",
        alert_delete_error: "Error during deletion: ",
        alert_amount_greater_zero: "Amount must be greater than zero!",
        alert_spendable_greater_total: "Spendable amount cannot be greater than the total amount!",
        alert_save_error: "Error saving data: ",
        alert_salary_saved: "Salary credit saved successfully!",
        alert_salary_updated: "Salary credit updated successfully!",
        alert_various_saved: "Various accreditation saved successfully!",
        alert_various_updated: "Various accreditation updated successfully!",
        alert_expense_amount_greater_zero: "Expense amount must be greater than zero!",
        alert_expense_saved: "Expense saved successfully!",
        alert_expense_updated: "Expense updated successfully!",
        alert_bonifico_amount_greater_zero: "Transfer amount must be greater than zero!",
        alert_bonifico_saved: "Transfer saved successfully!",
        alert_bonifico_updated: "Transfer updated successfully!",
        alert_investimento_amount_greater_zero: "Investment amount must be greater than zero!",
        alert_investimento_saved: "Investment saved successfully!",
        alert_investimento_updated: "Investment updated successfully!",
        alert_movimento_saved: "Movement saved successfully!",
        alert_movimento_updated: "Movement updated successfully!"
    }
};
