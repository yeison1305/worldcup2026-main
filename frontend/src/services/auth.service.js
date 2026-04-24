// Patrón: Facade — simplifica las llamadas HTTP al backend
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const register = async (name, email, password) => {
  const response = await api.post('/register', { name, email, password });
  return response.data;
};

const login = async (email, password) => {
  const response = await api.post('/login', { email, password });
  return response.data;
};

const googleLogin = async (googleToken) => {
  const response = await api.post('/google', { googleToken });
  return response.data;
};

const forgotPassword = async (email) => {
  const response = await api.post('/forgot-password', { email });
  return response.data;
};

const resetPassword = async (token, newPassword) => {
  const response = await api.post('/reset-password', { token, newPassword });
  return response.data;
};

export default { register, login, googleLogin, forgotPassword, resetPassword };
