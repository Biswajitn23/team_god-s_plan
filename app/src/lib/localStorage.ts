// Local storage utilities for collections without Supabase

export interface CollectionRecord {
  id?: string;
  species: string;
  scientific_name: string;
  method: string;
  quantity: number;
  location: string;
  notes: string;
  photos: string[];
  batch_id: string;
  created_at?: string;
  status?: 'verified' | 'pending' | 'rejected';
}

const COLLECTIONS_KEY = 'collections_data';

export const saveCollection = (collection: CollectionRecord): CollectionRecord => {
  const collections = getCollections();
  
  const newCollection = {
    ...collection,
    id: collection.id || `COL-${Date.now()}`,
    created_at: collection.created_at || new Date().toISOString(),
    status: collection.status || 'pending'
  };
  
  collections.push(newCollection);
  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
  
  return newCollection;
};

export const getCollections = (): CollectionRecord[] => {
  const stored = localStorage.getItem(COLLECTIONS_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const getCollectionByBatchId = (batchId: string): CollectionRecord | null => {
  const collections = getCollections();
  return collections.find(c => c.batch_id === batchId) || null;
};

export const updateCollection = (batchId: string, updates: Partial<CollectionRecord>): CollectionRecord | null => {
  const collections = getCollections();
  const index = collections.findIndex(c => c.batch_id === batchId);
  
  if (index === -1) return null;
  
  collections[index] = { ...collections[index], ...updates };
  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
  
  return collections[index];
};

export const deleteCollection = (batchId: string): boolean => {
  const collections = getCollections();
  const filtered = collections.filter(c => c.batch_id !== batchId);
  
  if (filtered.length === collections.length) return false;
  
  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(filtered));
  return true;
};

export const demoCollections: any[] = [
  {
    id: 'DEMO-001',
    batch_id: 'COL-20241115-0001',
    species: 'Ashwagandha',
    scientific_name: 'Withania somnifera',
    method: 'root',
    quantity: 15.5,
    location: '28.6139, 77.2090',
    notes: 'High quality roots, organic farm',
    photos: [],
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'verified',
    current_stage: 4,
    farmer_name: 'Dr. Ramesh Kumar'
  },
  {
    id: 'DEMO-002',
    batch_id: 'COL-20241116-0002',
    species: 'Turmeric',
    scientific_name: 'Curcuma longa',
    method: 'root',
    quantity: 22.3,
    location: '28.7041, 77.1025',
    notes: 'Fresh harvest',
    photos: [],
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'verified',
    current_stage: 3,
    farmer_name: 'Savitri Devi'
  },
  {
    id: 'DEMO-003',
    batch_id: 'COL-20241117-0003',
    species: 'Holy Basil',
    scientific_name: 'Ocimum tenuiflorum',
    method: 'leaf',
    quantity: 8.7,
    location: '28.5355, 77.3910',
    notes: 'Seasonal collection',
    photos: [],
    created_at: new Date().toISOString(),
    status: 'pending',
    current_stage: 1,
    farmer_name: 'Arjun Singh'
  }
];

// Initialize with demo data if empty
export const initializeDemoData = () => {
  const existing = getCollections();
  if (existing.length === 0) {
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(demoCollections));
  }
};
