require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración del transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port:  process.env.SMTP_PORT,
  secure: true,      // false = NO SSL/TLS en handshake inicial
  requireTLS: false,   // exige STARTTLS antes de enviar cualquier dato
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
  // ,tls: {
  //   // opcional: ajustar versión mínima de TLS o aceptar certificados
  //   minVersion: 'TLSv1.2',
  //   // rejectUnauthorized: true
  // }
});

// Endpoint para enviar correo
app.post('/api/v1/mail/send', async (req, res) => {
  const { subject, text, html } = req.body;
  if (!subject || (!text && !html)) {
    return res
      .status(400)
      .json({ error: 'Parámetros faltantes. Asegúrate de enviar “to”, “subject” y “text” o “html”.' });
  }

  try {

    let toAddress = process.env.TO_ADDRESS;

    const info = await transporter.sendMail({
      from: `"Test" <${process.env.SMTP_USER}>`,
      to: toAddress,
      subject,
      text,
      html
    });
    return res.json({ messageId: info.messageId });
  } catch (err) {
    console.error('Error enviando correo:', err);
    return res
      .status(500)
      .json({ error: 'Error interno al enviar correo', details: err.message });
  }
});

// Levanta el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API corriendo en http://localhost:${PORT}`);
});
