import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'student';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Mock users for demo
const MOCK_USERS = [
  { id: 1, email: 'admin@university.edu', password: 'admin123', name: 'Admin User', role: 'admin' as const },
  { id: 2, email: 'student@university.edu', password: 'student123', name: 'Student User', role: 'student' as const }
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // Simulating API call
        return new Promise((resolve) => {
          setTimeout(() => {
            const user = MOCK_USERS.find(
              (u) => u.email === email && u.password === password
            );

            if (user) {
              const { password, ...userWithoutPassword } = user;
              set({ 
                user: userWithoutPassword, 
                isAuthenticated: true 
              });
              resolve(true);
            } else {
              resolve(false);
            }
          }, 800);
        });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);