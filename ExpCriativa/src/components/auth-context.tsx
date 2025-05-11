// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  userEmail: string | null;
  login: (token: string, email: string) => void;
  logout: () => void;
  getJwtToken: (email: string, password: string) => Promise<string>,
  parseJwt(token: string) : {
      sub: string;
      jti: string;
      exp: number;
      iss: string;
      aud: string;
    };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Function to check if token is expired
  const isTokenExpired = (token: string): boolean => {
    try {
      const payload = parseJwt(token);
      const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds
      return payload.exp < currentTime;
    } catch (error) {
      return true; // If there's any error parsing, assume token is expired
    }
  };

  // Function to parse JWT token
  const parseJwt = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload) as {
      sub: string; jti: string; exp: number;
      iss: string; aud: string;
    };
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken');
      const storedEmail = localStorage.getItem('userEmail');
      
      if (token && !isTokenExpired(token) && storedEmail) {
        setIsAuthenticated(true);
        setUserEmail(storedEmail);
      } else {
        // Token is expired or missing - clean up
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserEmail(null);
      }
      setLoading(false);
    };

    checkAuth();

    // Set up an interval to periodically check token expiration
    const checkInterval = setInterval(() => {
      const token = localStorage.getItem('accessToken');
      if (token && isTokenExpired(token)) {
        logout();
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkInterval);
  }, []);

  const login = (token: string, email: string) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('userEmail', email);
    setIsAuthenticated(true);
    setUserEmail(email);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserEmail(null);
  };

  async function getJwtToken (email: string, password: string) {
    try {
      const res = await fetch("https://localhost:7142/api/Auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!res.ok) {
        const errorText =
          (await res.text()) || `GET token failed with status ${res.status}`;
        throw new Error(errorText);
      }

      const { token } = await res.json() as { token: string };
      return token;  
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error("Unknown error when getting JWT token.");
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, userEmail, login, logout, getJwtToken, parseJwt }}>
      {children}
    </AuthContext.Provider>
  );
};