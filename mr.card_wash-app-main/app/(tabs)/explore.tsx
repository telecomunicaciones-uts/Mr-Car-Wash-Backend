import { ThemedView } from "@/components/ThemedView";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Modal,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

interface TarifaParking {
  id: number;
  Tipo_Vehiculo: string;
  Hora: number;
  Fraccion: number;
}

interface CarWash {
  id: number;
  Servicio: string;
  Tarifa: number;
}

type SectionData = {
  title: string;
  data: Array<TarifaParking | CarWash>;
};

export default function ExploreScreen() {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para modales y formularios
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentEntity, setCurrentEntity] = useState<string | null>(null); // "TarifaParking" o "CarWash"
  const [formData, setFormData] = useState<Partial<TarifaParking | CarWash>>(
    {}
  );

  const fetchData = async () => {
    try {
      const [tarifasRes, carWashRes] = await Promise.all([
        fetch("https://mr-carwash-api.onrender.com/api/tarifas-parking"),
        fetch("https://mr-carwash-api.onrender.com/api/car-wash")
      ]);

      if (!tarifasRes.ok || !carWashRes.ok) {
        throw new Error("Error al obtener los datos");
      }

      const tarifas: TarifaParking[] = await tarifasRes.json();
      const carWash: CarWash[] = await carWashRes.json();

      setSections([
        { title: "Tarifas de Parking", data: tarifas },
        { title: "Servicios de Car Wash", data: carWash }
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

  // Funciones CRUD
  const handleAdd = (entity: string) => {
    setCurrentEntity(entity);
    setFormData({});
    setModalVisible(true);
  };

  const handleEdit = (entity: string, item: TarifaParking | CarWash) => {
    setCurrentEntity(entity);
    setFormData(item);
    setModalVisible(true);
  };

  const handleDelete = (entity: string, id: number) => {
    Alert.alert(
      "Confirmar Eliminación",
      `¿Estás seguro de que deseas eliminar este ${entity}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const endpoint =
                entity === "TarifaParking"
                  ? `https://mr-carwash-api.onrender.com/api/tarifas-parking/${id}`
                  : `https://mr-carwash-api.onrender.com/api/car-wash/${id}`;
              const response = await fetch(endpoint, {
                method: "DELETE"
              });

              if (!response.ok) {
                throw new Error(`Error al eliminar el ${entity}`);
              }

              // Refrescar datos
              fetchData();
            } catch (err: any) {
              Alert.alert("Error", err.message || "Error desconocido");
            }
          }
        }
      ]
    );
  };

  const handleSubmit = async () => {
    if (!currentEntity) return;

    try {
      let response;
      let endpoint;
      let method;
      let body;

      if (currentEntity === "TarifaParking") {
        endpoint = formData?.id
          ? `https://mr-carwash-api.onrender.com/api/tarifas-parking/${formData.id}`
          : `https://mr-carwash-api.onrender.com/api/tarifas-parking`;
        method = formData?.id ? "PUT" : "POST";
        body = JSON.stringify(formData);
      } else if (currentEntity === "CarWash") {
        endpoint = formData?.id
          ? `https://mr-carwash-api.onrender.com/api/car-wash/${formData.id}`
          : `https://mr-carwash-api.onrender.com/api/car-wash`;
        method = formData?.id ? "PUT" : "POST";
        body = JSON.stringify(formData);
      } else {
        throw new Error("Entidad desconocida");
      }

      response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json"
        },
        body: body
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error en la solicitud");
      }

      // Cerrar modal y refrescar datos
      setModalVisible(false);
      fetchData();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Error desconocido");
    }
  };

  const renderTarifa = (tarifa: TarifaParking) => (
    <ThemedView style={styles.itemContainer}>
      <Text style={styles.titulo}>{tarifa.Tipo_Vehiculo}</Text>
      <Text>Tarifa por Hora: ${tarifa.Hora}</Text>
      <Text>Fracción: {tarifa.Fraccion} horas</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEdit("TarifaParking", tarifa)}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete("TarifaParking", tarifa.id)}
        >
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );

  const renderCarWash = (servicio: CarWash) => (
    <ThemedView style={styles.itemContainer}>
      <Text style={styles.titulo}>{servicio.Servicio}</Text>
      <Text>Tarifa: ${servicio.Tarifa}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEdit("CarWash", servicio)}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete("CarWash", servicio.id)}
        >
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );

  const renderItem = ({
    item,
    section
  }: {
    item: TarifaParking | CarWash;
    section: SectionData;
  }) => {
    if (section.title === "Tarifas de Parking") {
      return renderTarifa(item as TarifaParking);
    } else if (section.title === "Servicios de Car Wash") {
      return renderCarWash(item as CarWash);
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
      {/* Header con Icono y Título */}
      <View style={styles.header}>
        <Ionicons name="car-sport" size={100} color="#fff" />
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Servicios</Text>
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
            "id" in item ? item.id.toString() : index.toString()
          }
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* Botón para Agregar TarifaParking y CarWash */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAdd("TarifaParking")}
        >
          <Text style={styles.buttonText}>Agregar Tarifa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAdd("CarWash")}
        >
          <Text style={styles.buttonText}>Agregar Servicio</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para Crear/Editar */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {formData &&
                ("Tipo_Vehiculo" in formData
                  ? "Editar Tarifa"
                  : "Editar Servicio")}
              {currentEntity === "TarifaParking" &&
                !("Tipo_Vehiculo" in formData) &&
                "Agregar Tarifa"}
              {currentEntity === "CarWash" &&
                !("Servicio" in formData) &&
                "Agregar Servicio"}
            </Text>
            {/* Formulario Dinámico */}
            {currentEntity === "TarifaParking" ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Tipo de Vehículo"
                  value={(formData as TarifaParking)?.Tipo_Vehiculo || ""}
                  onChangeText={(text) =>
                    setFormData({ ...formData, Tipo_Vehiculo: text })
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Tarifa por Hora"
                  keyboardType="numeric"
                  value={"Hora" in formData && formData.Hora ? formData.Hora.toString() : ""}
                  onChangeText={(text) =>
                    setFormData({ ...formData, Hora: parseFloat(text) })
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Fracción (horas)"
                  keyboardType="numeric"
                  value={(formData as TarifaParking)?.Fraccion ? (formData as TarifaParking).Fraccion.toString() : ""}
                  onChangeText={(text) =>
                    setFormData({ ...formData, Fraccion: parseFloat(text) })
                  }
                />
              </>
            ) : currentEntity === "CarWash" ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Servicio"
                  value={(formData as CarWash)?.Servicio || ""}
                  onChangeText={(text) =>
                    setFormData({ ...formData, Servicio: text })
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Tarifa"
                  keyboardType="numeric"
                  value={(formData as Partial<CarWash>)?.Tarifa?.toString() || ""}
                  onChangeText={(text) =>
                    setFormData({ ...formData, Tarifa: parseFloat(text) })
                  }
                />
              </>
            ) : null}

            <View style={styles.modalButtonContainer}>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} />
              <Button title="Guardar" onPress={handleSubmit} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  header: {
    backgroundColor: "#D0D0D0",
    paddingVertical: 20,
    alignItems: "center",
    paddingBottom: 40 // Ajuste para que el contenido no se corte
  },
  titleContainer: {
    marginTop: 10
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff"
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
    backgroundColor: "#ffe0b2",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333"
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 8
  },
  editButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 4,
    marginRight: 8
  },
  deleteButton: {
    backgroundColor: "#F44336",
    padding: 8,
    borderRadius: 4
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  },
  addButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16
  },
  addButton: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
    width: "45%",
    alignItems: "center"
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginVertical: 6
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16
  }
});
