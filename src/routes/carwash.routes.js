import { Router } from "express";
import { obtenerVehiculoPorPlaca, obtenerServiciosPorCategoria } from "../controllers/carwash.controller.js";

const router = Router();

// Ruta para obtener información de un vehículo por su placa
router.get("/carwash/vehiculo/:placa", obtenerVehiculoPorPlaca);

// Ruta para obtener servicios de lavado filtrados por categoría
router.get("/carwash/serviciosLavado/nivel/:categoria", obtenerServiciosPorCategoria);

export default router;