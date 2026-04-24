// src/components/GoogleButton.jsx
// Botón de Google Sign-In usando Google Identity Services
import { useEffect, useRef, useCallback } from 'react';

const GOOGLE_CLIENT_ID = '902002138002-lgdc8dugc5fllai43bhb15lpakl0a60d.apps.googleusercontent.com';

export default function GoogleButton({ onSuccess, onError }) {
  const isInitialized = useRef(false);
  const containerRef = useRef(null);

  const handleSuccess = useCallback((response) => {
    if (response.credential) {
      onSuccess(response.credential);
    } else {
      onError('No se recibió credential de Google');
    }
  }, [onSuccess, onError]);

  useEffect(() => {
    if (isInitialized.current) return;

    const initializeGoogleSignIn = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleSuccess,
          auto_select: false,
          login_uri: 'http://localhost:5173',
          use_fedcm_for_prompt: false,
        });

        window.google.accounts.id.renderButton(
          containerRef.current,
          {
            theme: 'outline',
            size: 'large',
            shape: 'rectangular',
            width: 350,
            text: 'continue_with',
            logo_alignment: 'left',
          }
        );

        isInitialized.current = true;
      }
    };

    if (window.google?.accounts?.id) {
      initializeGoogleSignIn();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => initializeGoogleSignIn();
    script.onerror = () => onError('Error al cargar Google Sign-In');
    
    document.head.appendChild(script);

    return () => {};
  }, [handleSuccess, onError]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '12px 0'
      }} 
    />
  );
}
