'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🎭 MOCK USERS DATABASE (Temporary - No Backend Needed)
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@waterworks.com',
    password: 'admin123',
    username: 'admin',
    full_name: 'Admin User',
    phone: '+63 912 345 6789',
    address: '123 Water St, Manila',
    role_id: '1',
    purok: null,
    meter_number: null,
    role: { name: 'Admin' },
  },
  {
    id: '2',
    email: 'staff@waterworks.com',
    password: 'staff123',
    username: 'staff',
    full_name: 'Staff Member',
    phone: '+63 912 345 6790',
    address: '456 Flow Ave, Quezon City',
    role_id: '2',
    purok: null,
    meter_number: null,
    role: { name: 'Reader' },
  },
  {
    id: '3',
    email: 'john@gmail.com',
    password: 'consumer123',
    username: 'john_doe',
    full_name: 'John Dela Cruz',
    phone: '+63 912 345 6791',
    address: '789 River Road, Makati',
    role_id: '3',
    purok: 1,
    meter_number: 'M001',
    role: { name: 'Consumer' },
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session on mount
    const storedToken = localStorage.getItem('mock_token');
    const storedUser = localStorage.getItem('mock_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Find user in mock database
    const foundUser = MOCK_USERS.find(
      u => u.email === email && u.password === password
    );

    if (!foundUser) {
      throw new Error('Invalid email or password');
    }

    // Create mock token
    const mockToken = `mock_token_${Date.now()}_${foundUser.id}`;
    
    // Remove password from user object
    const { password: _, ...userWithoutPassword } = foundUser;
    
    // Store in localStorage
    localStorage.setItem('mock_token', mockToken);
    localStorage.setItem('mock_user', JSON.stringify(userWithoutPassword));
    
    setToken(mockToken);
    setUser(userWithoutPassword);
    
    router.push('/dashboard');
  };

  const signup = async (data: any) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check if email already exists
    const existingUser = MOCK_USERS.find(u => u.email === data.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Create new user
    const newUserId = (MOCK_USERS.length + 1).toString();
    const newUser = {
      id: newUserId,
      email: data.email,
      username: data.username || data.email.split('@')[0],
      full_name: data.full_name || data.name,
      phone: data.phone || null,
      address: data.address || null,
      role_id: '3', // Default to consumer
      purok: null,
      meter_number: null,
      role: { name: 'Consumer' },
    };

    // Add to mock database (in real app, this would be server-side)
    MOCK_USERS.push({ ...newUser, password: data.password });

    // Create mock token
    const mockToken = `mock_token_${Date.now()}_${newUser.id}`;

    // Store in localStorage
    localStorage.setItem('mock_token', mockToken);
    localStorage.setItem('mock_user', JSON.stringify(newUser));

    setToken(mockToken);
    setUser(newUser);

    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('mock_token');
    localStorage.removeItem('mock_user');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// 'use client';

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { User } from '@/types';
// import { authAPI } from '@/lib/api';
// import { useRouter } from 'next/navigation';

// interface AuthContextType {
//   user: User | null;
//   token: string | null;
//   login: (email: string, password: string) => Promise<void>;
//   signup: (data: any) => Promise<void>;
//   logout: () => void;
//   isLoading: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     // Check for existing token on mount
//     const storedToken = localStorage.getItem('token');
//     const storedUser = localStorage.getItem('user');
    
//     if (storedToken && storedUser) {
//       setToken(storedToken);
//       setUser(JSON.parse(storedUser));
//     }
//     setIsLoading(false);
//   }, []);

//   const login = async (email: string, password: string) => {
//     const response = await authAPI.login(email, password);
//     const { token, user } = response.data;
    
//     localStorage.setItem('token', token);
//     localStorage.setItem('user', JSON.stringify(user));
    
//     setToken(token);
//     setUser(user);
    
//     router.push('/dashboard');
//   };

//   const signup = async (data: any) => {
//     const response = await authAPI.signup(data);
//     const { token, user } = response.data;
    
//     localStorage.setItem('token', token);
//     localStorage.setItem('user', JSON.stringify(user));
    
//     setToken(token);
//     setUser(user);
    
//     router.push('/dashboard');
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setToken(null);
//     setUser(null);
//     router.push('/login');
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, login, signup, logout, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }