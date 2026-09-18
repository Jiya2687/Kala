import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabasePublishableKey =
  import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env?.VITE_SUPABASE_ANON_KEY ||
  import.meta.env?.VITE_SUPABASE_KEY;

const DEFAULT_CATEGORIES = [
  { id: 'cat-textiles', name: 'Textiles & Weaving' },
  { id: 'cat-pottery', name: 'Pottery & Ceramics' },
  { id: 'cat-jewelry', name: 'Jewelry' },
  { id: 'cat-woodwork', name: 'Woodwork' },
  { id: 'cat-metalwork', name: 'Metalwork' },
  { id: 'cat-decor', name: 'Home Decor' },
  { id: 'cat-art', name: 'Paintings & Art' },
];

function createMockSupabaseClient() {
  const inMemoryTables: Record<string, any[]> = {
    categories: [...DEFAULT_CATEGORIES],
    products: [],
  };

  return {
    from: (tableName: string) => {
      if (!inMemoryTables[tableName]) {
        inMemoryTables[tableName] = [];
      }
      let currentRecords = [...inMemoryTables[tableName]];

      const queryBuilder: any = {
        select: (_columns?: string) => queryBuilder,
        eq: (field: string, val: any) => {
          currentRecords = currentRecords.filter((rec: any) => rec[field] === val);
          return queryBuilder;
        },
        insert: (data: any | any[]) => {
          const items = Array.isArray(data) ? data : [data];
          const newEntries = items.map((item) => ({
            id: item.id || `mock_${tableName}_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
            ...item,
            created_at: new Date().toISOString(),
          }));
          inMemoryTables[tableName].push(...newEntries);
          currentRecords = newEntries;
          return queryBuilder;
        },
        maybeSingle: async () => {
          return { data: currentRecords[0] || null, error: null };
        },
        single: async () => {
          return { data: currentRecords[0] || null, error: null };
        },
        then: (resolve: (val: any) => any, reject?: (err: any) => any) => {
          return Promise.resolve({ data: currentRecords, error: null }).then(resolve, reject);
        },
      };

      return queryBuilder;
    },
  };
}

let clientInstance: SupabaseClient | any;

if (
  supabaseUrl &&
  supabasePublishableKey &&
  typeof supabaseUrl === 'string' &&
  supabaseUrl.startsWith('http')
) {
  try {
    clientInstance = createClient(supabaseUrl, supabasePublishableKey);
  } catch (err) {
    console.warn('[AI Studio] Supabase client initialization failed, falling back to mock:', err);
    clientInstance = createMockSupabaseClient();
  }
} else {
  clientInstance = createMockSupabaseClient();
}

export const supabase = clientInstance;
