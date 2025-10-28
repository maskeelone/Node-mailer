const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Show a test form when visiting in browser
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Email Test</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            background: #f8f9ff; 
            display: flex; 
            flex-direction: column;
            align-items: center; 
            justify-content: center; 
            height: 100vh; 
            color: #333;
          }
          form {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          input {
            margin: 10px 0; 
            padding: 10px; 
            width: 250px; 
            border: 1px solid #ccc; 
            border-radius: 4px;
          }
          button {
            background: #007bff; 
            color: white; 
            padding: 10px 15px; 
            border: none; 
            border-radius: 4px;
            cursor: pointer;
          }
          button:hover {
            background: #0056b3;
          }
        </style>
      </head>
      <body>
        <h2>📧 Email Test</h2>
        <form action="/send" method="post">
          <input type="email" name="to" placeholder="Recipient Email" required /><br/>
          <button type="submit">Send Test Email</button>
        </form>
      </body>
    </html>
  `);
});

// POST route to send email
app.post('/send', async (req, res) => {
  const { to } = req.body;

  if (!to) {
    return res.status(400).send('Missing recipient email');
  }

  // create transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // your Gmail
      pass: process.env.EMAIL_PASS  // your App Password
    }
  });

  const mailOptions = {
    from: `"Nexora Test" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Nodemailer Test from Render',
    html: `
      <div style="font-family: Arial; padding: 20px; background: #f4f4f4;">
        <h2 style="color: #007bff;">✅ Email Test Successful</h2>
        <p>This message was sent from your Render deployment using Nodemailer!</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send(`<h3>Email successfully sent to ${to}!</h3><a href="/">Send another</a>`);
  } catch (error) {
    console.error('❌ Error sending email:', error);
    res.status(500).send('Error sending email: ' + error.message);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Email test server running on port ${PORT}`);
});
