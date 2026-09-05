import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ViewCollection from "./pages/view/[batch_id]";
import Login from "./pages/Login";
import { useState, useEffect, useCallback } from "react";
import { getUserByPhone } from "./context/AuthContext";
import SplashScreen from "./components/SplashScreen";
import LanguageSelection from "./components/LanguageSelection";
import { LanguageProvider } from "./context/LanguageContext";
import { useTranslation } from "./context/useTranslation";
import { ThemeProvider } from './context/ThemeContext';
import { useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { TTSProvider } from './context/TTSContext';

const queryClient = new QueryClient();

const AppContent = () => {
  const { language } = useTranslation();
  const { theme } = useTheme();
  const location = useLocation();
  const [splashFinished, setSplashFinished] = useState(false);
  const [languageSelected, setLanguageSelected] = useState(false);
  const [farmer, setFarmer] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          // Always check Firestore for this user (by phone)
          const dbUser = await getUserByPhone(parsed.phone);
          if (dbUser && dbUser.id === parsed.id) {
            setFarmer(dbUser);
            setLanguageSelected(true);
          } else {
            // Not found in Firestore, clear session
            setFarmer(null);
            setLanguageSelected(false);
            localStorage.removeItem('currentUser');
          }
        } catch (e) {
          console.error("Failed to restore session", e);
          setFarmer(null);
          setLanguageSelected(false);
          localStorage.removeItem('currentUser');
        }
      }
    };
    checkUser();
  }, []);

  const handleSplashFinished = useCallback(() => setSplashFinished(true), []);
  const handleLanguageSelect = useCallback(() => setLanguageSelected(true), []);
  
  const handleLogin = async (farmerObj: any) => {
    // Only allow login if user exists in Firestore
    const dbUser = await getUserByPhone(farmerObj.phone);
    if (dbUser && dbUser.id === farmerObj.id) {
      setFarmer(dbUser);
      localStorage.setItem('currentUser', JSON.stringify(dbUser));
    } else {
      setFarmer(null);
      localStorage.removeItem('currentUser');
      setLanguageSelected(false);
    }
  };
  
  const handleLogout = () => {
    setFarmer(null);
    setLanguageSelected(false);
    setSplashFinished(false);
    localStorage.removeItem('currentUser');
  };

  const isPublicView = location.pathname.startsWith('/view/');

  if (isPublicView) {
    return (
      <Routes>
        <Route path="/view/:batch_id" element={<ViewCollection />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  if (!splashFinished) {
    return <SplashScreen onFinished={handleSplashFinished} />;
  }

  if (!languageSelected) {
    return <LanguageSelection onLanguageSelect={handleLanguageSelect} />;
  }
  
  if (!farmer) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Index language={language} farmer={farmer} onLogout={handleLogout} />} />
      <Route path="/view/:batch_id" element={<ViewCollection />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider>
              <TTSProvider>
                <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                  <Toaster />
                  <Sonner />
                  <AppContent />
                </BrowserRouter>
              </TTSProvider>
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
