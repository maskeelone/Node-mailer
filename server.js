const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// HTML form to test email sending
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Email Test</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #101820;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .box {
            background: #1a1f2b;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
            text-align: center;
          }
          input {
            padding: 10px;
            width: 250px;
            border: none;
            border-radius: 5px;
            margin: 10px 0;
          }
          button {
            background: #007bff;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
          }
          button:hover {
            background: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="box">
          <h2>Test Email Sender</h2>
          <form method="POST" action="/send">
            <input type="email" name="email" placeholder="Enter your email" required /><br/>
            <button type="submit">Send Test Email</button>
          </form>
        </div>
      </body>
    </html>
  `);
});

// POST route to send email
app.post("/send", async (req, res) => {
  const email = req.body.email;

  // Configure transporter
  const transporter = nodemailer.createTransport({
    service: "gmail", // or use custom SMTP host/port
    auth: {
      user: process.env.EMAIL_USER, // your Gmail address
      pass: process.env.EMAIL_PASS  // your Gmail app password
    }
  });

  try {
    await transporter.sendMail({
      from: `"Test Bot" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "✅ Render Email Test",
      html: `<h2>Your Render email test worked!</h2><p>This means your SMTP setup is correct.</p>`
    });

    res.send(`
      <html>
        <body style="background:#101820;color:#fff;text-align:center;font-family:Arial;padding-top:100px;">
          <h2>Email sent successfully to ${email} ✅</h2>
          <a href="/" style="color:#00aaff;">Send another</a>
        </body>
      </html>
    `);
  } catch (err) {
    console.error("Error sending email:", err);
    res.send(`
      <html>
        <body style="background:#101820;color:#ff4d4d;text-align:center;font-family:Arial;padding-top:100px;">
          <h2>❌ Failed to send email</h2>
          <p>${err.message}</p>
          <a href="/" style="color:#00aaff;">Try again</a>
        </body>
      </html>
    `);
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Email test server running on port ${PORT}`));
