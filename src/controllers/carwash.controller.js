// Simulamos datos de vehículos y servicios de lavado
const vehiculos = [
    { placa: "ABC123", modelo: "Toyota Corolla", estado: "En lavado", historial_servicios: ["Básico", "Premium"] },
    { placa: "XYZ789", modelo: "Honda Civic", estado: "Estacionado", historial_servicios: ["Básico"] },
    { placa: "GPZ328", modelo: "Onix", estado: "Estacionado", historial_servicios: ["Básico"] },
];

const serviciosLavado = [
    { id: 1, nombre: "Lavado básico", categoria: "basic", precio: 10 },
    { id: 2, nombre: "Lavado premium", categoria: "premium", precio: 20 },
];

// Obtener información detallada de un vehículo por placa
export const obtenerVehiculoPorPlaca = (req, res) => {
    const { placa } = req.params;
    console.log("Placa recibida:", placa);

    const vehiculo = vehiculos.find(v => v.placa === placa);
    if (!vehiculo) {
        return res.status(404).json({ message: "Vehículo no encontrado" });
    }

    res.json(vehiculo);
};

// Obtener servicios de lavado filtrados por categoría
export const obtenerServiciosPorCategoria = (req, res) => {
    const { categoria } = req.params;
    console.log("Categoría recibida:", categoria);

    const serviciosFiltrados = serviciosLavado.filter(s => s.categoria === categoria);
    if (serviciosFiltrados.length === 0) {
        return res.status(404).json({ message: "No se encontraron servicios en esta categoría" });
    }

    res.json(serviciosFiltrados);
};