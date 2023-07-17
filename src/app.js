import express from "express";
import productRouter from "../routes/rutas_productos.js";
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", productRouter);

// Iniciar el servidor y escuchar en el puerto especificado
app.listen(PORT, () => {
  console.log("server is working");
});
