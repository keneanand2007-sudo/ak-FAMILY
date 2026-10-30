import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useDocumentsStore = create(
  persist(
    function (set, get) {
      return {
        documents: [],

        addDocument: function (doc) {
          set(function (state) {
            var newDoc = Object.assign(
              { id: 'DOC-' + Date.now(), uploadDate: new Date().toISOString().slice(0, 10), tags: [], attachments: [] },
              doc
            );
            return { documents: state.documents.concat([newDoc]) };
          });
        },

        updateDocument: function (id, updates) {
          set(function (state) {
            return {
              documents: state.documents.map(function (d) {
                return d.id === id ? Object.assign({}, d, updates) : d;
              }),
            };
          });
        },

        addAttachmentToDocument: function (id, attachment) {
          set(function (state) {
            return {
              documents: state.documents.map(function (d) {
                if (d.id !== id) return d;
                var existing = d.attachments || [];
                return Object.assign({}, d, { attachments: existing.concat([attachment]) });
              }),
            };
          });
        },

        removeAttachmentFromDocument: function (id, attachmentIndex) {
          set(function (state) {
            return {
              documents: state.documents.map(function (d) {
                if (d.id !== id) return d;
                var existing = d.attachments || [];
                return Object.assign({}, d, {
                  attachments: existing.filter(function (a, i) { return i !== attachmentIndex; }),
                });
              }),
            };
          });
        },

        removeDocument: function (id) {
          set(function (state) {
            return { documents: state.documents.filter(function (d) { return d.id !== id; }) };
          });
        },

        getExpiringSoon: function (days) {
          var limit = days || 60;
          var today = new Date();
          return get().documents.filter(function (d) {
            if (!d.expiryDate) return false;
            var expiry = new Date(d.expiryDate);
            var diffDays = Math.round((expiry - today) / (1000 * 60 * 60 * 24));
            return diffDays >= 0 && diffDays <= limit;
          });
        },
      };
    },
    { name: 'familyos-documents-storage' }
  )
);
