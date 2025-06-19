"use strict";
// import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// interface AuthContextType {
//   isAuthenticated: boolean;
//   user: any | null;
//   token: string | null;
//   login: (token: string, userData: any) => void;
//   logout: () => void;
// }
// const AuthContext = createContext<AuthContextType | null>(null);
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
// interface AuthProviderProps {
//   children: ReactNode;
// }
// export const AuthProvider = ({ children }: AuthProviderProps) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState<any | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   useEffect(() => {
//     // Check for saved token and user data on initial load
//     const savedToken = localStorage.getItem('token');
//     const savedUser = localStorage.getItem('user');
//     if (savedToken && savedUser) {
//       setToken(savedToken);
//       setUser(JSON.parse(savedUser));
//       setIsAuthenticated(true);
//     }
//   }, []);
//   const login = (newToken: string, userData: any) => {
//     localStorage.setItem('token', newToken);
//     localStorage.setItem('user', JSON.stringify(userData));
//     setToken(newToken);
//     setUser(userData);
//     setIsAuthenticated(true);
//   };
//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setToken(null);
//     setUser(null);
//     setIsAuthenticated(false);
//   };
//   return (
//     <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
