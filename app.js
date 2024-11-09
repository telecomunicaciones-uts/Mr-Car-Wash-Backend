const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const dataPath = path.join(__dirname, "db", "data.json");

// Función para leer los datos
const readData = () => {
  try {
    const data = fs.readFileSync(dataPath, "utf-8");
    const parsedData = JSON.parse(data);

    // Asegurar que todas las propiedades existen
    parsedData.Clientes = parsedData.Clientes || [];
    parsedData.Vehiculos = parsedData.Vehiculos || [];
    parsedData.Tarifas_Parking = parsedData.Tarifas_Parking || [];
    parsedData.Servicios_Car_Wash = parsedData.Servicios_Car_Wash || [];
    parsedData.Vehiculo_Servicios = parsedData.Vehiculo_Servicios || [];
    parsedData.Facturas_Car_Wash = parsedData.Facturas_Car_Wash || [];
    parsedData.Tickets_Parking = parsedData.Tickets_Parking || [];
    parsedData.Facturas_Parking = parsedData.Facturas_Parking || [];

    return parsedData;
  } catch (err) {
    console.error("Error leyendo data.json:", err);
    return {
      Clientes: [],
      Vehiculos: [],
      Tarifas_Parking: [],
      Servicios_Car_Wash: [],
      Vehiculo_Servicios: [],
      Facturas_Car_Wash: [],
      Tickets_Parking: [],
      Facturas_Parking: []
    };
  }
};

// Función para escribir datos
const writeData = (data) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error escribiendo data.json:", err);
  }
};

// Obtener todos los clientes
app.get("/api/clientes", (req, res) => {
  const data = readData();
  res.json(data.Clientes || []);
});

// Obtener un cliente por Cedula
app.get("/api/clientes/:cedula", (req, res) => {
  const data = readData();
  const cedula = parseInt(req.params.cedula);
  const cliente = data.Clientes.find((c) => c.Cedula === cedula);
  if (cliente) {
    res.json(cliente);
  } else {
    res.status(404).json({ message: "Cliente no encontrado" });
  }
});

// Crear un nuevo cliente
app.post("/api/clientes", (req, res) => {
  const data = readData();
  const nuevoCliente = req.body;

  // Verificar si el cliente ya existe
  const exists = data.Clientes.some((c) => c.Cedula === nuevoCliente.Cedula);
  if (exists) {
    return res.status(400).json({ message: "Cliente ya existe" });
  }

  data.Clientes.push(nuevoCliente);
  writeData(data);
  res.status(201).json(nuevoCliente);
});

// Actualizar un cliente por Cedula
app.put("/api/clientes/:cedula", (req, res) => {
  const data = readData();
  const cedula = parseInt(req.params.cedula);
  const index = data.Clientes.findIndex((c) => c.Cedula === cedula);

  if (index !== -1) {
    data.Clientes[index] = { ...data.Clientes[index], ...req.body };
    writeData(data);
    res.json(data.Clientes[index]);
  } else {
    res.status(404).json({ message: "Cliente no encontrado" });
  }
});

// Eliminar un cliente por Cedula
app.delete("/api/clientes/:cedula", (req, res) => {
  const data = readData();
  const cedula = parseInt(req.params.cedula);
  const index = data.Clientes.findIndex((c) => c.Cedula === cedula);

  if (index !== -1) {
    const eliminado = data.Clientes.splice(index, 1);
    writeData(data);
    res.json(eliminado[0]);
  } else {
    res.status(404).json({ message: "Cliente no encontrado" });
  }
});

// Obtener todos los vehiculos
app.get("/api/vehiculos", (req, res) => {
  const data = readData();
  res.json(data.Vehiculos || []);
});

// Obtener un vehiculo por Placa
app.get("/api/vehiculos/:placa", (req, res) => {
  const data = readData();
  const placa = req.params.placa;
  const vehiculo = data.Vehiculos.find((v) => v.Placa === placa);
  if (vehiculo) {
    res.json(vehiculo);
  } else {
    res.status(404).json({ message: "Vehiculo no encontrado" });
  }
});

// Crear un nuevo vehiculo
app.post("/api/vehiculos", (req, res) => {
  const data = readData();
  const nuevoVehiculo = req.body;

  // Verificar si el vehiculo ya existe
  const exists = data.Vehiculos.some((v) => v.Placa === nuevoVehiculo.Placa);
  if (exists) {
    return res.status(400).json({ message: "Vehiculo ya existe" });
  }

  data.Vehiculos.push(nuevoVehiculo);
  writeData(data);
  res.status(201).json(nuevoVehiculo);
});

// Actualizar un vehiculo por Placa
app.put("/api/vehiculos/:placa", (req, res) => {
  const data = readData();
  const placa = req.params.placa;
  const index = data.Vehiculos.findIndex((v) => v.Placa === placa);

  if (index !== -1) {
    data.Vehiculos[index] = { ...data.Vehiculos[index], ...req.body };
    writeData(data);
    res.json(data.Vehiculos[index]);
  } else {
    res.status(404).json({ message: "Vehiculo no encontrado" });
  }
});

// Eliminar un vehiculo por Placa
app.delete("/api/vehiculos/:placa", (req, res) => {
  const data = readData();
  const placa = req.params.placa;
  const index = data.Vehiculos.findIndex((v) => v.Placa === placa);

  if (index !== -1) {
    const eliminado = data.Vehiculos.splice(index, 1);
    writeData(data);
    res.json(eliminado[0]);
  } else {
    res.status(404).json({ message: "Vehiculo no encontrado" });
  }
});

// Obtener todas las tarifas de parking
app.get("/api/tarifas_parking", (req, res) => {
  const data = readData();
  res.json(data.Tarifas_Parking || []);
});

// Obtener una tarifa por ID
app.get("/api/tarifas_parking/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const tarifa = data.Tarifas_Parking.find((t) => t.id === id);
  if (tarifa) {
    res.json(tarifa);
  } else {
    res.status(404).json({ message: "Tarifa no encontrada" });
  }
});

// Crear una nueva tarifa de parking
app.post("/api/tarifas_parking", (req, res) => {
  const data = readData();
  const nuevaTarifa = req.body;

  // Generar un nuevo ID
  const nuevoId =
    data.Tarifas_Parking.length > 0
      ? Math.max(...data.Tarifas_Parking.map((t) => t.id)) + 1
      : 1;
  nuevaTarifa.id = nuevoId;

  data.Tarifas_Parking.push(nuevaTarifa);
  writeData(data);
  res.status(201).json(nuevaTarifa);
});

// Actualizar una tarifa por ID
app.put("/api/tarifas_parking/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const index = data.Tarifas_Parking.findIndex((t) => t.id === id);

  if (index !== -1) {
    data.Tarifas_Parking[index] = {
      ...data.Tarifas_Parking[index],
      ...req.body
    };
    writeData(data);
    res.json(data.Tarifas_Parking[index]);
  } else {
    res.status(404).json({ message: "Tarifa no encontrada" });
  }
});

// Eliminar una tarifa por ID
app.delete("/api/tarifas_parking/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const index = data.Tarifas_Parking.findIndex((t) => t.id === id);

  if (index !== -1) {
    const eliminado = data.Tarifas_Parking.splice(index, 1);
    writeData(data);
    res.json(eliminado[0]);
  } else {
    res.status(404).json({ message: "Tarifa no encontrada" });
  }
});

// Obtener todos los servicios de Car Wash
app.get("/api/servicios_car_wash", (req, res) => {
  const data = readData();
  res.json(data.Servicios_Car_Wash || []);
});

// Obtener un servicio de Car Wash por ID
app.get("/api/servicios_car_wash/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const servicio = data.Servicios_Car_Wash.find((s) => s.id === id);
  if (servicio) {
    res.json(servicio);
  } else {
    res.status(404).json({ message: "Servicio no encontrado" });
  }
});

// Crear un nuevo servicio de Car Wash
app.post("/api/servicios_car_wash", (req, res) => {
  const data = readData();
  const nuevoServicio = req.body;

  // Generar un nuevo ID
  const nuevoId =
    data.Servicios_Car_Wash.length > 0
      ? Math.max(...data.Servicios_Car_Wash.map((s) => s.id)) + 1
      : 1;
  nuevoServicio.id = nuevoId;

  data.Servicios_Car_Wash.push(nuevoServicio);
  writeData(data);
  res.status(201).json(nuevoServicio);
});

// Actualizar un servicio de Car Wash por ID
app.put("/api/servicios_car_wash/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const index = data.Servicios_Car_Wash.findIndex((s) => s.id === id);

  if (index !== -1) {
    data.Servicios_Car_Wash[index] = {
      ...data.Servicios_Car_Wash[index],
      ...req.body
    };
    writeData(data);
    res.json(data.Servicios_Car_Wash[index]);
  } else {
    res.status(404).json({ message: "Servicio no encontrado" });
  }
});

// Eliminar un servicio de Car Wash por ID
app.delete("/api/servicios_car_wash/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const index = data.Servicios_Car_Wash.findIndex((s) => s.id === id);

  if (index !== -1) {
    const eliminado = data.Servicios_Car_Wash.splice(index, 1);
    writeData(data);
    res.json(eliminado[0]);
  } else {
    res.status(404).json({ message: "Servicio no encontrado" });
  }
});

// Obtener servicios realizados a un vehículo
app.get("/api/vehiculos/:placa/servicios", (req, res) => {
  const data = readData();
  const placa = req.params.placa;

  const serviciosRealizados = data.Vehiculo_Servicios.filter(
    (vs) => vs.Placa_Vehiculo === placa
  );

  res.json(serviciosRealizados);
});

// Asignar un servicio a un vehículo
app.post("/api/vehiculos/:placa/servicios", (req, res) => {
  const data = readData();
  const placa = req.params.placa;
  const nuevoRegistro = {
    ...req.body,
    Facturado: false
  };

  // Verificar si el vehículo existe
  const vehiculo = data.Vehiculos.find((v) => v.Placa === placa);
  if (!vehiculo) {
    return res.status(404).json({ message: "Vehículo no encontrado" });
  }

  // Generar un nuevo ID
  const nuevoId =
    data.Vehiculo_Servicios.length > 0
      ? Math.max(...data.Vehiculo_Servicios.map((vs) => vs.id)) + 1
      : 1;
  nuevoRegistro.id = nuevoId;
  nuevoRegistro.Placa_Vehiculo = placa;

  data.Vehiculo_Servicios.push(nuevoRegistro);
  writeData(data);
  res.status(201).json(nuevoRegistro);
});

// Generar una factura para un vehículo
app.post("/api/facturas_car_wash", (req, res) => {
  const data = readData();
  const { Cedula_Cliente, Placa_Vehiculo } = req.body;

  // Validar cliente
  const cliente = data.Clientes.find((c) => c.Cedula === Cedula_Cliente);
  if (!cliente) {
    return res.status(404).json({ message: "Cliente no encontrado" });
  }

  // Validar vehículo
  const vehiculo = data.Vehiculos.find((v) => v.Placa === Placa_Vehiculo);
  if (!vehiculo) {
    return res.status(404).json({ message: "Vehículo no encontrado" });
  }

  // Obtener los servicios no facturados realizados al vehículo
  const serviciosNoFacturados = data.Vehiculo_Servicios.filter(
    (vs) => vs.Placa_Vehiculo === Placa_Vehiculo && !vs.Facturado
  );

  if (serviciosNoFacturados.length === 0) {
    return res.status(400).json({
      message: "No hay servicios por facturar para este vehículo"
    });
  }

  // Obtener detalles de los servicios
  const serviciosDetalle = serviciosNoFacturados.map((vs) => {
    const servicio = data.Servicios_Car_Wash.find(
      (s) => s.id === vs.Servicio_id
    );
    return {
      Servicio_id: servicio.id,
      Nombre: servicio.Nombre,
      Tarifa: servicio.Tarifa
    };
  });

  // Calcular el total
  const total = serviciosDetalle.reduce((sum, s) => sum + s.Tarifa, 0);

  // Generar un nuevo ID para la factura
  const nuevoId =
    data.Facturas_Car_Wash.length > 0
      ? Math.max(...data.Facturas_Car_Wash.map((f) => f.id)) + 1
      : 1;

  const nuevaFactura = {
    id: nuevoId,
    Cedula_Cliente,
    Placa_Vehiculo,
    Servicios: serviciosDetalle,
    Total: total,
    Fecha_Factura: new Date().toISOString()
  };

  data.Facturas_Car_Wash.push(nuevaFactura);

  // Marcar los servicios como facturados
  serviciosNoFacturados.forEach((vs) => {
    vs.Facturado = true;
  });

  writeData(data);
  res.status(201).json(nuevaFactura);
});

// Obtener todas las facturas de Car Wash
app.get("/api/facturas_car_wash", (req, res) => {
  const data = readData();
  res.json(data.Facturas_Car_Wash || []);
});

// ===================== Tickets y Facturas de Parking =====================
// Generar un ticket de parking
app.post("/api/tickets_parking", (req, res) => {
  const data = readData();
  const nuevoTicket = req.body;

  // Generar un nuevo ID
  const nuevoId =
    data.Tickets_Parking.length > 0
      ? Math.max(...data.Tickets_Parking.map((t) => t.id)) + 1
      : 1;
  nuevoTicket.id = nuevoId;
  nuevoTicket.Hora_Entrada = new Date().toISOString();

  data.Tickets_Parking.push(nuevoTicket);
  writeData(data);
  res.status(201).json(nuevoTicket);
});

// Generar factura de parking
app.post("/api/facturas_parking", (req, res) => {
  const data = readData();
  const { Ticket_id, Tarifas_Parking_id } = req.body;

  const ticket = data.Tickets_Parking.find((t) => t.id === Ticket_id);
  const tarifa = data.Tarifas_Parking.find((t) => t.id === Tarifas_Parking_id);

  if (!ticket || !tarifa) {
    return res.status(404).json({ message: "Ticket o tarifa no encontrada" });
  }

  // Calcular el tiempo de permanencia
  const horaEntrada = new Date(ticket.Hora_Entrada);
  const horaSalida = new Date();
  const tiempoEnHoras = (horaSalida - horaEntrada) / (1000 * 60 * 60);

  // Calcular el total
  const total = tarifa.Hora * Math.ceil(tiempoEnHoras);

  // Generar un nuevo ID para la factura
  const nuevoId =
    data.Facturas_Parking.length > 0
      ? Math.max(...data.Facturas_Parking.map((f) => f.id)) + 1
      : 1;

  const nuevaFactura = {
    id: nuevoId,
    Ticket_id,
    Tarifas_Parking_id,
    Hora_Salida: horaSalida.toISOString(),
    Total: total,
    Fecha_Factura: horaSalida.toISOString()
  };

  data.Facturas_Parking.push(nuevaFactura);
  writeData(data);
  res.status(201).json(nuevaFactura);
});

// Obtener todas las facturas de parking
app.get("/api/facturas_parking", (req, res) => {
  const data = readData();
  res.json(data.Facturas_Parking || []);
});

app.get("/", (req, res) => {
  res.send("API de Mr CarWash & Parking");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
