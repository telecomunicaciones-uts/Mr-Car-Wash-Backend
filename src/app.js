import express from "express";
import carwashRoutes from "./routes/carwash.routes.js"; // Importa las nuevas rutas
import cors from "cors";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use('/api', carwashRoutes);  // Registra las nuevas rutas

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
    console.log("Petición a ruta no encontrada...");
    res.status(404).json({ message: "Endpoint no encontrada" });
});

export default app;