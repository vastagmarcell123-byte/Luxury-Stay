import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(process.cwd())));

// EMAIL BEÁLLÍTÁS
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "luxurystay26@gmail.com",
    pass: "hoguqawcttcrxuaz"
  }
});

// FOGADJA A FOGALÁST
app.post("/foglalas", async (req, res) => {
  const { name, email, arrival, departure, guests, pack, total } = req.body;

  const message = `
Új foglalás érkezett!

Név: ${name}
Email: ${email}
Csomag: ${pack}
Vendégek: ${guests}
Érkezés: ${arrival}
Távozás: ${departure}
Végösszeg: ${total} Ft
  `;

  await transporter.sendMail({
    from: "Luxury Stay <luxurystay26@gmail.com>",
    to: "vastagmarcell123@gmail.com",
    subject: "Új foglalás érkezett!",
    text: message
  });

  res.json({ status: "ok" });
});

// KAPCSOLAT ÜZENET
app.post("/kapcsolat", (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: "luxurystay26@gmail.com",
    to: "vastagmarcell123@gmail.com",
    subject: `Új üzenet érkezett a kapcsolat űrlapról`,
    text: `
Név: ${name}
Email: ${email}

Üzenet:
${message}
    `
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: "Hiba történt az üzenet küldésekor." });
    }
    res.json({ success: true, message: "Üzenet elküldve!" });
  });
});

// FŐOLDAL KISZOLGÁLÁSA
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "index.html"));
});

// SZERVER INDÍTÁSA
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Szerver fut a ${PORT}-es porton`));
