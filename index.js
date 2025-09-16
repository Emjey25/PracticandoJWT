import express from "express";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config(); // 👈 Cargar variables del .env

const app = express();
app.use(bodyParser.json());

const SECRET_KEY = process.env.JWT_SECRET; //ahora viene del .env
const PORT = process.env.PORT || 3000;

// login ->  generador de un token
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "maria" && password === "1234") {
    const payload = { user: username };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });

    return res.json({ token });
  }

  res.status(401).json({ error: "Credenciales inválidas" });
});

// 🟡 Middleware -> verificar token
function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ error: "Token requerido" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido o expirado" });
    }
    req.user = decoded;
    next();
  });
}

// Ruta protegida -> perfil
app.get("/perfil", verificarToken, (req, res) => {
  res.json({
    mensaje: "Acceso concedido 🚀",
    user: req.user,
  });
});

app.listen(PORT, () => console.log(`✅ Servidor en http://localhost:${PORT}`));
