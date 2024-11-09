import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  ActivityIndicator,
  SectionList,
  Text,
  View,
  TouchableOpacity,
  Alert
} from "react-native";
import { HelloWave } from "@/components/HelloWave";
import { ThemedView } from "@/components/ThemedView";

interface Cliente {
  Cedula: number;
  Vehiculo_Placa: number;
  Nombre: string;
  Telefono: number;
  Direccion: string;
}

interface Vehiculo {
  Placa: number;
  Marca: string;
  Modelo: number;
  Color: string;
}

type SectionData = {
  title: string;
  data: Array<Cliente | Vehiculo>;
};

export default function HomeScreen() {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [clientesRes, vehiculosRes] = await Promise.all([
        fetch("https://mr-carwash-api.onrender.com/api/clientes"),
        fetch("https://mr-carwash-api.onrender.com/api/vehiculos")
      ]);

      if (!clientesRes.ok || !vehiculosRes.ok) {
        throw new Error("Error al obtener los datos");
      }

      const clientes: Cliente[] = await clientesRes.json();
      const vehiculos: Vehiculo[] = await vehiculosRes.json();

      setSections([
        { title: "Clientes", data: clientes },
        { title: "Vehiculos", data: vehiculos }
      ]);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderCliente = (cliente: Cliente) => (
    <ThemedView style={styles.itemContainer}>
      <Text style={styles.nombre}>{cliente.Nombre}</Text>
      <Text>Cédula: {cliente.Cedula}</Text>
      <Text>Placa Vehículo: {cliente.Vehiculo_Placa}</Text>
      <Text>Teléfono: {cliente.Telefono}</Text>
      <Text>Dirección: {cliente.Direccion}</Text>
      {/* Opcional: Botones para Editar/Eliminar */}
    </ThemedView>
  );

  const renderVehiculo = (vehiculo: Vehiculo) => (
    <ThemedView style={styles.itemContainer}>
      <Text style={styles.marca}>
        {vehiculo.Marca} - {vehiculo.Modelo}
      </Text>
      <Text>Placa: {vehiculo.Placa}</Text>
      <Text>Color: {vehiculo.Color}</Text>
      {/* Opcional: Botones para Editar/Eliminar */}
    </ThemedView>
  );

  const renderItem = ({
    item,
    section
  }: {
    item: Cliente | Vehiculo;
    section: SectionData;
  }) => {
    if (section.title === "Clientes") {
      return renderCliente(item as Cliente);
    } else if (section.title === "Vehiculos") {
      return renderVehiculo(item as Vehiculo);
    }
    return null;
  };

  const renderSectionHeader = ({ section }: { section: SectionData }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{section.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header con Imagen y Título */}
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/logo-car_wash.jpg")}
          style={styles.reactLogo}
          resizeMode="contain"
        />
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Mr CarWash & Parking</Text>
          <HelloWave />
        </View>
      </View>

      {/* Contenido Principal */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item, index) =>
            "Cedula" in item
              ? (item as Cliente).Cedula.toString()
              : (item as Vehiculo).Placa.toString()
          }
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  header: {
    backgroundColor: "#A1CEDC",
    paddingVertical: 20,
    alignItems: "center",
    position: "relative"
  },
  reactLogo: {
    height: 100,
    width: 100,
    position: "absolute",
    top: -50
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 60
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 10
  },
  loader: {
    marginTop: 20
  },
  errorText: {
    color: "red",
    padding: 16,
    textAlign: "center"
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16
  },
  sectionHeader: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 16,
    borderRadius: 8
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: "bold"
  },
  itemContainer: {
    backgroundColor: "#e0f7fa",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8
  },
  nombre: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4
  },
  marca: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4
  }
});
