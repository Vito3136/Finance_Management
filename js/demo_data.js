/**
 * Demo Data and In-Memory Query Builder for Finance Management App
 * Provides realistic mock data and query handling for Demo mode with zero Supabase DB persistence.
 */

export function getInitialDemoData() {
    const now = new Date();
    const currYear = now.getFullYear();
    const currMonth = String(now.getMonth() + 1).padStart(2, '0');

    const prevDate = new Date(currYear, now.getMonth() - 1, 1);
    const prevYear = prevDate.getFullYear();
    const prevMonth = String(prevDate.getMonth() + 1).padStart(2, '0');

    return {
        salary_credits: [
            {
                id: 'demo-sal-1',
                user_id: 'demo-user-id',
                total_amount: 2450.00,
                spendable_amount: 1600.00,
                credit_date: `${currYear}-${currMonth}-27`,
                description: 'Stipendio',
                created_at: new Date(currYear, now.getMonth(), 27, 8, 30, 0).toISOString()
            },
            {
                id: 'demo-sal-2',
                user_id: 'demo-user-id',
                total_amount: 2450.00,
                spendable_amount: 1600.00,
                credit_date: `${prevYear}-${prevMonth}-27`,
                description: 'Stipendio',
                created_at: new Date(prevYear, prevDate.getMonth(), 27, 8, 30, 0).toISOString()
            }
        ],
        various_accreditations: [
            {
                id: 'demo-var-1',
                user_id: 'demo-user-id',
                total_amount: 200.00,
                spendable_amount: 200.00,
                credit_date: `${currYear}-${currMonth}-15`,
                description: 'Rimborso spese trasferta',
                created_at: new Date(currYear, now.getMonth(), 15, 14, 0, 0).toISOString()
            },
            {
                id: 'demo-var-2',
                user_id: 'demo-user-id',
                total_amount: 150.00,
                spendable_amount: 100.00,
                credit_date: `${prevYear}-${prevMonth}-20`,
                description: 'Regalo compleanno',
                created_at: new Date(prevYear, prevDate.getMonth(), 20, 10, 15, 0).toISOString()
            }
        ],
        expenses: [
            // Previous month expenses
            {
                id: 'demo-exp-1',
                user_id: 'demo-user-id',
                amount: 120.50,
                expense_date: `${prevYear}-${prevMonth}-05`,
                description: 'Spesa supermercato',
                is_handled: true,
                created_at: new Date(prevYear, prevDate.getMonth(), 5, 18, 45, 0).toISOString()
            },
            {
                id: 'demo-exp-2',
                user_id: 'demo-user-id',
                amount: 45.00,
                expense_date: `${prevYear}-${prevMonth}-15`,
                description: 'Cena pizzeria',
                is_handled: true,
                created_at: new Date(prevYear, prevDate.getMonth(), 15, 21, 10, 0).toISOString()
            },
            {
                id: 'demo-exp-3',
                user_id: 'demo-user-id',
                amount: 89.90,
                expense_date: `${prevYear}-${prevMonth}-22`,
                description: 'Abbonamento treno',
                is_handled: true,
                created_at: new Date(prevYear, prevDate.getMonth(), 22, 9, 0, 0).toISOString()
            },
            // Current month expenses
            {
                id: 'demo-exp-4',
                user_id: 'demo-user-id',
                amount: 145.20,
                expense_date: `${currYear}-${currMonth}-04`,
                description: 'Spesa Esselunga',
                is_handled: true,
                created_at: new Date(currYear, now.getMonth(), 4, 17, 30, 0).toISOString()
            },
            {
                id: 'demo-exp-5',
                user_id: 'demo-user-id',
                amount: 65.00,
                expense_date: `${currYear}-${currMonth}-12`,
                description: 'Rifornimento carburante',
                is_handled: true,
                created_at: new Date(currYear, now.getMonth(), 12, 11, 20, 0).toISOString()
            },
            {
                id: 'demo-exp-6',
                user_id: 'demo-user-id',
                amount: 220.00,
                expense_date: `${currYear}-${currMonth}-18`,
                description: 'Polizza assicurativa',
                is_handled: true,
                created_at: new Date(currYear, now.getMonth(), 18, 16, 0, 0).toISOString()
            },
            {
                id: 'demo-exp-7',
                user_id: 'demo-user-id',
                amount: 58.50,
                expense_date: `${currYear}-${currMonth}-24`,
                description: 'Scarpe sportive',
                is_handled: true,
                created_at: new Date(currYear, now.getMonth(), 24, 15, 45, 0).toISOString()
            },
            // Unhandled pending expense
            {
                id: 'demo-exp-8',
                user_id: 'demo-user-id',
                amount: 4000.00,
                expense_date: `${currYear}-${currMonth}-26`,
                description: 'MacBook Pro 16" M3 Max',
                is_handled: false,
                created_at: new Date(currYear, now.getMonth(), 26, 12, 0, 0).toISOString()
            }
        ],
        investment_transfers: [
            {
                id: 'demo-trf-1',
                user_id: 'demo-user-id',
                amount: 500.00,
                date: `${prevYear}-${prevMonth}-10`,
                created_at: new Date(prevYear, prevDate.getMonth(), 10, 10, 0, 0).toISOString()
            },
            {
                id: 'demo-trf-2',
                user_id: 'demo-user-id',
                amount: 500.00,
                date: `${currYear}-${currMonth}-08`,
                created_at: new Date(currYear, now.getMonth(), 8, 10, 0, 0).toISOString()
            }
        ],
        investments: [
            {
                id: 'demo-inv-1',
                user_id: 'demo-user-id',
                amount: 400.00,
                date: `${prevYear}-${prevMonth}-12`,
                description: 'iShares Core MSCI World ETF',
                created_at: new Date(prevYear, prevDate.getMonth(), 12, 15, 30, 0).toISOString()
            },
            {
                id: 'demo-inv-2',
                user_id: 'demo-user-id',
                amount: 400.00,
                date: `${currYear}-${currMonth}-10`,
                description: 'Vanguard S&P 500 UCITS ETF',
                created_at: new Date(currYear, now.getMonth(), 10, 15, 30, 0).toISOString()
            }
        ],
        investment_movements: [
            {
                id: 'demo-mov-1',
                user_id: 'demo-user-id',
                amount: -2.50,
                date: `${prevYear}-${prevMonth}-15`,
                description: 'Commissione acquisto ETF',
                is_highlighted: false,
                created_at: new Date(prevYear, prevDate.getMonth(), 15, 11, 0, 0).toISOString()
            },
            {
                id: 'demo-mov-2',
                user_id: 'demo-user-id',
                amount: 16.40,
                date: `${prevYear}-${prevMonth}-28`,
                description: 'Dividendo quarterly ETF World',
                is_highlighted: true,
                created_at: new Date(prevYear, prevDate.getMonth(), 28, 9, 30, 0).toISOString()
            },
            {
                id: 'demo-mov-3',
                user_id: 'demo-user-id',
                amount: -2.50,
                date: `${currYear}-${currMonth}-12`,
                description: 'Commissione acquisto titoli',
                is_highlighted: false,
                created_at: new Date(currYear, now.getMonth(), 12, 14, 0, 0).toISOString()
            },
            {
                id: 'demo-mov-4',
                user_id: 'demo-user-id',
                amount: 28.75,
                date: `${currYear}-${currMonth}-20`,
                description: 'Interessi conto remunerato',
                is_highlighted: true,
                created_at: new Date(currYear, now.getMonth(), 20, 10, 0, 0).toISOString()
            }
        ]
    };
}

export function createDemoQueryBuilder(getStore, table) {
    const store = getStore();
    if (!store[table]) {
        store[table] = [];
    }

    let operation = 'select'; // 'select', 'insert', 'update', 'delete'
    let insertPayload = null;
    let updatePayload = null;
    const filters = [];
    const orderClauses = [];
    let limitCount = null;

    const builder = {
        select(fields = '*') {
            operation = 'select';
            return builder;
        },
        insert(rows) {
            operation = 'insert';
            insertPayload = Array.isArray(rows) ? rows : [rows];
            return builder;
        },
        update(data) {
            operation = 'update';
            updatePayload = data;
            return builder;
        },
        delete() {
            operation = 'delete';
            return builder;
        },
        eq(field, value) {
            filters.push({ field, value });
            return builder;
        },
        order(field, { ascending = true } = {}) {
            orderClauses.push({ field, ascending });
            return builder;
        },
        limit(count) {
            limitCount = count;
            return builder;
        },
        then(onFulfilled, onRejected) {
            try {
                const items = store[table];

                if (operation === 'insert') {
                    const inserted = (insertPayload || []).map(row => {
                        const newRow = {
                            id: row.id || `demo_${table}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
                            created_at: row.created_at || new Date().toISOString(),
                            ...row
                        };
                        items.push(newRow);
                        return { ...newRow };
                    });
                    return Promise.resolve({ data: inserted, error: null }).then(onFulfilled, onRejected);
                }

                if (operation === 'update') {
                    const updated = [];
                    items.forEach(item => {
                        const matches = filters.every(f => item[f.field] === f.value || item[f.field] == f.value);
                        if (matches) {
                            Object.assign(item, updatePayload);
                            updated.push({ ...item });
                        }
                    });
                    return Promise.resolve({ data: updated, error: null }).then(onFulfilled, onRejected);
                }

                if (operation === 'delete') {
                    const deleted = [];
                    for (let i = items.length - 1; i >= 0; i--) {
                        const item = items[i];
                        const matches = filters.every(f => item[f.field] === f.value || item[f.field] == f.value);
                        if (matches) {
                            deleted.push(item);
                            items.splice(i, 1);
                        }
                    }
                    return Promise.resolve({ data: deleted, error: null }).then(onFulfilled, onRejected);
                }

                // Default: SELECT
                let result = items.filter(item => {
                    return filters.every(f => {
                        return item[f.field] === f.value || item[f.field] == f.value;
                    });
                });

                result = result.map(i => ({ ...i }));

                if (orderClauses.length > 0) {
                    result.sort((a, b) => {
                        for (const { field, ascending } of orderClauses) {
                            const valA = a[field];
                            const valB = b[field];

                            if (typeof valA === 'string' && (field.includes('date') || field.includes('_at'))) {
                                const timeA = new Date(valA).getTime();
                                const timeB = new Date(valB).getTime();
                                if (!isNaN(timeA) && !isNaN(timeB) && timeA !== timeB) {
                                    return ascending ? timeA - timeB : timeB - timeA;
                                }
                            }

                            if (valA < valB) return ascending ? -1 : 1;
                            if (valA > valB) return ascending ? 1 : -1;
                        }
                        return 0;
                    });
                }

                if (typeof limitCount === 'number') {
                    result = result.slice(0, limitCount);
                }

                return Promise.resolve({ data: result, error: null }).then(onFulfilled, onRejected);
            } catch (err) {
                return Promise.resolve({ data: null, error: err }).then(onFulfilled, onRejected);
            }
        }
    };

    return builder;
}
