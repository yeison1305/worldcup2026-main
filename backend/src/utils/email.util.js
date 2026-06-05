// src/utils/email.util.js
// Utilidad para enviar emails via SMTP (Gmail)
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { emailUser, emailPass, emailFrom } = require('../config/env');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
  }

  /**
   * Genera un token de reset (válido por 1 hora)
   */
  generateResetToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Envia email de reset de contraseña
   */
  async sendPasswordResetEmail(email, resetToken) {
    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: emailFrom,
      to: email,
      subject: '🔐 Reset Your Password - FIFA World Cup 2026',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f0b429; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #0d1117; margin: 0;">🏆 FIFA World Cup 2026</h1>
          </div>
          <div style="background: #161b22; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #ffffff; margin-top: 0;">Password Reset Request</h2>
            <p style="color: #9ca3af; font-size: 16px;">
              You requested a password reset for your account. Click the button below to reset your password.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: #f0b429; color: #0d1117; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">
              Or copy and paste this link in your browser:<br>
              <a href="${resetUrl}" style="color: #f0b429;">${resetUrl}</a>
            </p>
            <hr style="border: none; border-top: 1px solid #2a2f38; margin: 30px 0;">
            <p style="color: #6b7280; font-size: 12px;">
              This link expires in <strong>1 hour</strong>. If you didn't request this, please ignore this email.
            </p>
          </div>
        </div>
      `,
      text: `
FIFA World Cup 2026 - Password Reset

You requested a password reset. Click the link below to reset your password:
${resetUrl}

This link expires in 1 hour. If you didn't request this, please ignore this email.
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email de reset enviado a ${email}`);
      return true;
    } catch (error) {
      console.error('❌ Error enviando email:', error.message);
      return false;
    }
  }

  async sendMatchStartNotification(emails, matchInfo) {
    const mailOptions = {
      from: emailFrom,
      to: emailFrom,
      bcc: emails.join(', '),
      subject: `⚽ ${matchInfo.homeName} vs ${matchInfo.awayName} — ¡Partido en vivo!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f0b429; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #0d1117; margin: 0;">🏆 FIFA World Cup 2026</h1>
          </div>
          <div style="background: #161b22; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #ef4444; margin-top: 0;">🔴 Partido en vivo</h2>
            <div style="text-align: center; margin: 20px 0; padding: 20px; background: #1e293b; border-radius: 10px;">
              <p style="color: #ffffff; font-size: 20px; font-weight: bold; margin: 0;">
                ${matchInfo.homeName} vs ${matchInfo.awayName}
              </p>
              ${matchInfo.group ? `<p style="color: #94a3b8; font-size: 14px; margin: 8px 0 0 0;">Grupo ${matchInfo.group}${matchInfo.stadium ? ` · ${matchInfo.stadium}` : ''}</p>` : ''}
            </div>
            <p style="color: #9ca3af; font-size: 16px;">
              El partido acaba de comenzar. Entrá a la plataforma para ver el marcador en vivo, eventos minuto a minuto y la predicción del modelo IA.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:5173/live" style="background: #ef4444; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                🔴 Ver en vivo
              </a>
            </div>
            <hr style="border: none; border-top: 1px solid #2a2f38; margin: 30px 0;">
            <p style="color: #6b7280; font-size: 12px;">
              FIFA World Cup 2026 Predictor · Notificación automática de inicio de partido.
            </p>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Notificación de inicio enviada a ${emails.length} usuarios`);
      return true;
    } catch (error) {
      console.error('❌ Error enviando notificación:', error.message);
      return false;
    }
  }
}

module.exports = new EmailService();
