import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculateFinanceTotals } from './utils/financeCalculations';

export const useFinanceStore = create(
  persist(
    function (set, get) {
      return {
        income: [],
        expenses: [],
        budget: { total: 0, categories: {} },
        assets: [],
        liabilities: [],
        goals: [],

        addIncome: function (item) {
          set(function (state) {
            return { income: state.income.concat([{ id: 'INC-' + Date.now(), ...item }]) };
          });
        },
        removeIncome: function (id) {
          set(function (state) {
            return { income: state.income.filter(function (i) { return i.id !== id; }) };
          });
        },

        addExpense: function (item) {
          set(function (state) {
            return { expenses: state.expenses.concat([{ id: 'EXP-' + Date.now(), ...item }]) };
          });
        },
        removeExpense: function (id) {
          set(function (state) {
            return { expenses: state.expenses.filter(function (e) { return e.id !== id; }) };
          });
        },

        setBudget: function (total, categories) {
          set({ budget: { total: total, categories: categories } });
        },

        addAsset: function (item) {
          set(function (state) {
            return { assets: state.assets.concat([{ id: 'AST-' + Date.now(), ...item }]) };
          });
        },
        removeAsset: function (id) {
          set(function (state) {
            return { assets: state.assets.filter(function (a) { return a.id !== id; }) };
          });
        },

        addLiability: function (item) {
          set(function (state) {
            return { liabilities: state.liabilities.concat([{ id: 'LIA-' + Date.now(), ...item }]) };
          });
        },
        removeLiability: function (id) {
          set(function (state) {
            return { liabilities: state.liabilities.filter(function (l) { return l.id !== id; }) };
          });
        },

        addGoal: function (item) {
          set(function (state) {
            return { goals: state.goals.concat([{ id: 'GOAL-' + Date.now(), ...item }]) };
          });
        },
        removeGoal: function (id) {
          set(function (state) {
            return { goals: state.goals.filter(function (g) { return g.id !== id; }) };
          });
        },

        getTotals: function () {
          var state = get();
          return calculateFinanceTotals(state.income, state.expenses, state.assets, state.liabilities);
        },
      };
    },
    { name: 'familyos-finance-storage' }
  )
);
