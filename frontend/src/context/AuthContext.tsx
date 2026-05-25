import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/router';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'student';
  avatar_url?: string;
  created_at?: string;
  mock_attempts: {
    id: string;
    score: number | null;
    completed_at: string;
    mock_tests: {
      title: string;
      mock_questions: {
        marks: number;
      }[];
    } | null;
  }[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => Promise<'admin' | 'student'>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      // CORRECTED API CALL: Pass the storedToken as the second argument
      api.get('/auth/profile', storedToken)
        .then(setUser)
        .catch(() => {
          // This block runs if the token is invalid or expired
          localStorage.removeItem('authToken');
          setToken(null);
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
    // The empty dependency array means this runs only once on initial component mount
  }, []);

  const login = async (newToken: string) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    const profile = await api.get('/auth/profile', newToken);
    setUser(profile);
    return profile.role;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
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