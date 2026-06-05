// Patrón: Context — estado global de autenticación
import { createContext, useState, useContext } from 'react';
import authService from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    storeAuth(res.data);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await authService.register(name, email, password);
    storeAuth(res.data);
    return res.data;
  };

  const storeAuth = (data) => {
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('user',  JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const googleLogin = async (googleToken) => {
    const res = await authService.googleLogin(googleToken);
    storeAuth(res.data);
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);