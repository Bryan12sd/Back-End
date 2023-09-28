const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000; // Puedes cambiar el puerto según tus preferencias

// Middleware para el manejo de JSON en las solicitudes
app.use(express.json());

// Ruta para el inicio de sesión
app.post("/login", (req, res) => {
  const { email, password, phone } = req.body;

  // Leer el archivo JSON
  fs.readFile("database.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo JSON", err);
      return res.status(500).json({ error: "Error de servidor" });
    }

    try {
      const users = JSON.parse(data);

      // Buscar el usuario por email
      const user = users.find((u) => u.email === email);

      if (!user) {
        return res.status(401).json({ error: "Usuario no encontrado" });
      }

      // Verificar la contraseña
      if (user.password === password && user.phone === phone) {
        return res.json({
          message: "Inicio de sesión exitoso",
          name: user.name,
        });
      } else if (user.password !== password) {
        return res.status(401).json({ error: "Password incorrecto" });
      } else if (user.phone !== phone) {
        return res.status(401).json({ error: "Telefono incorrecto" });
      }
    } catch (err) {
      console.error("Error al analizar el archivo JSON", err);
      return res.status(500).json({ error: "Error de servidor" });
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
