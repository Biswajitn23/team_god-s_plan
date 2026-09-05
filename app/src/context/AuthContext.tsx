import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, setDoc, doc, getDoc } from 'firebase/firestore';

interface User {
  id: string;
  name: string;
  phone: string;
  aadhar_or_coop_id: string;
  gps: string;
  type: 'farmer' | 'collector';
  created_at: string;
  certificationStatus?: string;
  complianceScore?: number;
}


interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // On mount, do not load user from localStorage. User state will be lost on refresh unless session is managed elsewhere (e.g., Firebase Auth).

  const login = (userData: User) => {
    setUser(userData);
    // No localStorage persistence
  };

  const logout = () => {
    setUser(null);
    // No localStorage removal
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper functions for user management in Firebase Firestore
export const saveUserToStorage = async (user: User) => {
  try {
    console.log("Synchronizing with Firestore...", user.id);
    // 1. Persist to Firestore using Website Schema
    const websiteData = {
      id: user.id,
      fullName: user.name,
      mobile: user.phone,
      aadharId: user.aadhar_or_coop_id,
      location: user.gps,
      farmerType: user.type,
      createdAt: user.created_at,
      certificationStatus: user.certificationStatus || "Pending Verification",
      complianceScore: user.complianceScore || 100
    };
    // Use the user.id (FARM-...) as the document ID
    await setDoc(doc(db, 'farmers', user.id), websiteData);
    console.log("Success: Farmer data synced with Firebase ID:", user.id);
  } catch (error) {
    console.error("Firebase Sync Critical Error:", error);
    // No local fallback
  }
};

// getUsersFromStorage removed: no localStorage fallback

export const getUserByPhone = async (phone: string): Promise<User | null> => {
  try {
    // 1. Check Cloud Firestore with query (since IDs might be auto-generated)
    console.log("Searching Cloud for mobile:", phone);
    const farmersRef = collection(db, 'farmers');
    // We check both 'mobile' (website field) and 'phone' (mobile app field)
    const q = query(farmersRef, where('mobile', '==', phone));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const data = querySnapshot.docs[0].data();
      console.log("Found farmer in cloud:", data);
      return {
        id: data.id || querySnapshot.docs[0].id,
        name: data.fullName || data.name || '',
        phone: data.mobile || data.phone || phone,
        aadhar_or_coop_id: data.aadharId || data.aadhar_or_coop_id || '',
        gps: data.location || data.gps || '',
        type: data.farmerType || data.type || 'farmer',
        created_at: data.createdAt || data.created_at || new Date().toISOString(),
        certificationStatus: data.certificationStatus || 'Pending Verification',
        complianceScore: data.complianceScore ?? 100
      } as User;
    }

    // Secondary check for 'phone' field
    const q2 = query(farmersRef, where('phone', '==', phone));
    const querySnapshot2 = await getDocs(q2);
    if (!querySnapshot2.empty) {
      const data = querySnapshot2.docs[0].data();
      return {
        id: data.id || querySnapshot2.docs[0].id,
        name: data.name || data.fullName || '',
        phone: data.phone || data.mobile || phone,
        aadhar_or_coop_id: data.aadhar_or_coop_id || data.aadharId || '',
        gps: data.gps || data.location || '',
        type: data.type || data.farmerType || 'farmer',
        created_at: data.created_at || data.createdAt || new Date().toISOString(),
        certificationStatus: data.certificationStatus || 'Pending Verification',
        complianceScore: data.complianceScore ?? 100
      } as User;

    }

  } catch (error) {
    console.error("Firebase Fetch Error:", error);
  }

  // No localStorage fallback. Only return user from Firestore or null.
  return null;
};
