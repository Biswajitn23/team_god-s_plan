import { Dashboard } from "./Dashboard";


const Index = ({ language, farmer, onLogout }: { language: string, farmer: any, onLogout: () => void }) => {
  return <Dashboard language={language} farmer={farmer} onLogout={onLogout} />;
};

export default Index;
