import { useState, useEffect } from "react";
import { AuthScreen } from "./components/AuthScreen.js"; 
import { DiaryWorkspace } from "./components/DiaryWorkspace.js"; 

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <div className="size-full bg-background">
      {!isAuthenticated ? (
        <AuthScreen onLogin={handleLogin} />
      ) : (
        <div className="relative size-full">
          <button 
            onClick={handleLogout} 
            className="absolute top-4 right-4 z-50 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
          >
            Выйти
          </button>
          <DiaryWorkspace />
        </div>
      )}
    </div>
  );
}