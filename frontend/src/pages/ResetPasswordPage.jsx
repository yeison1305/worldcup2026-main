import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import authService from '../services/auth.service';
import styles from './AuthPage.module.css';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError('Token de recuperación no válido');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener mínimo 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      setSuccess(true);
      // Redirigir al login después de 3 segundos
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className={styles.bg}>
        <div className={styles.card}>
          <div className={styles.logo}>🔒</div>
          <h1 className={styles.title}>Link Inválido</h1>
          <p className={styles.subtitle}>Este enlace de recuperación no es válido o expiró.</p>
          <Link to="/login" className={styles.btnPrimary} style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
            Volver al Login
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className={styles.bg}>
        <div className={styles.card}>
          <div className={styles.logo}>✅</div>
          <h1 className={styles.title}>¡Contraseña Actualizada!</h1>
          <p className={styles.subtitle}>Ya podés iniciar sesión con tu nueva contraseña.</p>
          <p style={{ color: '#9ca3af', fontSize: '13px' }}>Redirigiendo al login...</p>
          <Link to="/login" className={styles.btnPrimary} style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
            Ir al Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.bg}>
      <div className={styles.card}>
        <div className={styles.logo}>🔐</div>
        <h1 className={styles.title}>Nueva Contraseña</h1>
        <p className={styles.subtitle}>Ingresá tu nueva contraseña</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.field}>
            <label className={styles.label}>Nueva Contraseña</label>
            <div className={styles.inputWrap}>
              <span className={styles.icon}>🔒</span>
              <input
                className={styles.input}
                type={showPass ? 'text' : 'password'}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.eye}
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Confirmar Contraseña</label>
            <div className={styles.inputWrap}>
              <span className={styles.icon}>🔒</span>
              <input
                className={styles.input}
                type={showPass ? 'text' : 'password'}
                placeholder="Repetí la contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button className={styles.btnPrimary} type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Contraseña'}
          </button>
        </form>

        <Link to="/login" className={styles.forgotBtn} style={{ marginTop: '12px' }}>
          Volver al Login
        </Link>
      </div>
      <p className={styles.copy}>© 2026 FIFA World Cup Predictor - V.1.0.0</p>
    </div>
  );
}
