import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// EMAIL BEÁLLÍTÁS
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "luxurystay26@gmail.com",
    pass: "hoguqawcttcrxuaz" // <-- SZÓKÖZ NÉLKÜL!
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

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: "Hiba történt az üzenet küldésekor." });
    }
    res.json({ success: true, message: "Üzenet elküldve!" });
  });
});

// SZERVER INDÍTÁSA
app.listen(3000, () => console.log("Szerver fut a 3000-es porton"));
