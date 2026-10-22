import { BiodataData } from '../types/biodata';
import { defaultEmptyBiodata, sampleHinduBiodata } from '../data/initialBiodata';

const STORAGE_KEY = 'biodatacraft_client_data_v1';
const TEMPLATE_PREF_KEY = 'biodatacraft_selected_template';

/**
 * Storage Service strictly upholds Core Principle 4 & 5:
 * "No customer biodata stored permanently on servers.
 * Biodata remains 100% client-side in the visitor's local browser."
 */
export const storageService = {
  saveLocalDraft: (data: BiodataData): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(TEMPLATE_PREF_KEY, data.templateId);
    } catch {
      // Ignore quota errors if user has strict storage limits
    }
  },

  loadLocalDraft: (): BiodataData => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...defaultEmptyBiodata,
          ...parsed,
          sectionsVisible: {
            ...defaultEmptyBiodata.sectionsVisible,
            ...(parsed.sectionsVisible || {})
          }
        };
      }
    } catch {
      // Fallback
    }
    // Return sample Hindu biodata for quick demonstration if empty
    return sampleHinduBiodata;
  },

  setSelectedTemplate: (templateId: string): void => {
    try {
      localStorage.setItem(TEMPLATE_PREF_KEY, templateId);
      const draft = storageService.loadLocalDraft();
      draft.templateId = templateId as any;
      storageService.saveLocalDraft(draft);
    } catch {
      // Ignore
    }
  },

  getSelectedTemplate: (): string | null => {
    try {
      return localStorage.getItem(TEMPLATE_PREF_KEY);
    } catch {
      return null;
    }
  },

  clearDraft: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  },

  exportBackupJson: (data: BiodataData): void => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Biodata_${(data.fullName || 'Draft').replace(/[^a-zA-Z0-9]/g, '_')}_Backup.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importBackupJson: (file: File): Promise<BiodataData> => {
    return new Promise((resolve, reject) => {
      // 1. File size enforcement: Limit to 2MB to prevent browser memory exhaustion (DoS)
      const MAX_BACKUP_SIZE = 2 * 1024 * 1024;
      if (file.size > MAX_BACKUP_SIZE) {
        return reject(
          new Error(`Backup file is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed size is 2MB.`)
        );
      }

      // 2. File extension validation
      if (!file.name.toLowerCase().endsWith('.json') && file.type && !file.type.includes('json')) {
        return reject(new Error('Invalid file type. Please upload a valid .json backup file.'));
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          if (!content || !content.trim()) {
            return reject(new Error('Backup file is empty.'));
          }

          // Safe parse with prototype pollution prevention
          const parsed = JSON.parse(content, (key, value) => {
            if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
              return undefined;
            }
            return value;
          });

          if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            // Strip any top-level prototype pollution properties if remaining
            const clean: Record<string, any> = {};
            for (const [k, v] of Object.entries(parsed)) {
              if (k !== '__proto__' && k !== 'constructor' && k !== 'prototype') {
                clean[k] = v;
              }
            }

            resolve({
              ...defaultEmptyBiodata,
              ...clean,
              sectionsVisible: {
                ...defaultEmptyBiodata.sectionsVisible,
                ...(clean.sectionsVisible || {})
              }
            });
          } else {
            reject(new Error('Invalid backup file format: Root structure must be a JSON object.'));
          }
        } catch {
          reject(new Error('Could not parse JSON file. Please ensure the file contains valid JSON.'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read backup file.'));
      reader.readAsText(file);
    });
  }
};
