// DEMO: Seed demo demands into Firestore
import { collection, addDoc } from 'firebase/firestore';
export async function seedDemoDemands(db: any) {
  const demoDemands = [
    {
      title: 'Wheat Purchase',
      description: 'Looking to buy high-quality wheat from local farmers.',
      quantity: 1000,
      rate: 22.50, // Price in INR per kg
      crop: 'Wheat',
      company: 'AgroCorp',
      created_at: new Date().toISOString(),
    },
    {
      title: 'Organic Rice Needed',
      description: 'Need organic rice for export. Immediate requirement.',
      quantity: 500,
      rate: 45.00,
      crop: 'Rice',
      company: 'GreenFoods Ltd.',
      created_at: new Date().toISOString(),
    },
    {
      title: 'Maize Bulk Order',
      description: 'Bulk maize order for animal feed production.',
      quantity: 2000,
      rate: 18.25,
      crop: 'Maize',
      company: 'FeedMasters',
      created_at: new Date().toISOString(),
    },
  ];
  for (const demand of demoDemands) {
    await addDoc(collection(db, 'demands'), demand);
  }
}
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
