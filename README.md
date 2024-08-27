# Mr CarWash & Parking

![Logo](https://github.com/user-attachments/assets/c7ccd829-0e98-4c36-9944-556a00669ab0)

_**Mr CarWash & Parking** It is a mobile application designed to facilitate the management of parking lots and car wash services. This application allows administrators to optimize the control of their facilities, manage the occupancy of spaces, and coordinate vehicle cleaning services, all from an efficient platform.._

## Database relationship 🔩

The system is structured to handle various aspects of the business, from customer and vehicle information to the management of parking rates and car wash services. Additionally, it includes the handling of invoices generated for both parking and car wash services, as well as the issuance and tracking of parking entry tickets.

![Screenshot_Base de datos](https://github.com/user-attachments/assets/f2ffc5c1-b01c-417f-a782-ef34d5e66f86)

### Description of the Tables:

1. **Clientes (Customers):**
   - The "Clientes" table stores personal information for each customer, uniquely identified by the "Cedula" field, which acts as the primary key. This table also includes details such as the customer's name, phone number, and address. A relationship is established with the "Vehiculo" table through the "Vehiculo_Placa" field, which is a foreign key.

2. **Vehiculo (Vehicle):**
   - The "Vehiculo" table is dedicated to storing information about vehicles associated with customers. Each vehicle is uniquely identified by its "Placa" (License Plate), which serves as the primary key. Other fields include the vehicle's brand, model, and color. This table is related to the "Clientes" table to link each vehicle with its respective owner.

3. **Car Wash:**
   - The "Car Wash" table defines the car wash services offered. Each service has a unique identifier "id" as the primary key, along with a description of the service in the "Servicio" field and the corresponding cost in the "Tarifa" field.

4. **Tarifas Parking (Parking Rates):**
   - The "Tarifas Parking" table details the rates applicable to parking usage. The primary key is the "id" field. Additional fields specify the type of vehicle the rate applies to, the hourly rate, and the cost for additional fractions of time.

5. **Ticket:**
   - The "Ticket" table records each entry into the parking lot. A unique identifier "id" serves as the primary key, and the table includes the "Clientes_Cedula" field, which is a foreign key linking the ticket to the corresponding customer. Additionally, the entry time and date of the vehicle into the parking lot are recorded in the "Hora_Entrada" field.

6. **Factura_Parking (Parking Invoice):**
   - The "Factura_Parking" table stores invoices generated for parking usage. Each invoice is identified by "id_Factura," which is the primary key. The "Ticket_id" and "Tarifas_Parking_id" fields are foreign keys that link the invoice to the corresponding ticket and the rate applied. The vehicle's exit time and the invoice issue date are also recorded.

7. **Factura_Car Wash (Car Wash Invoice):**
   - Finally, the "Factura_Car Wash" table is used to record invoices for car wash services. Each invoice has an "id" as the primary key. The "Car_Wash_id" and "Clientes_Cedula" fields are foreign keys that link the invoice to the specific car wash service and the corresponding customer. The invoice issue date and time are also included in the "Fecha" field.

### Relationships between the Tables:

The tables are interconnected through relationships defined by foreign keys:
- **Clientes and Vehiculo:** A relationship exists that links each customer to one or more vehicles through the "Vehiculo_Placa" key.
- **Factura_Car Wash and Car Wash/Clientes:** Car wash invoices are related to both specific services and customers via the "Car_Wash_id" and "Clientes_Cedula" foreign keys.
- **Factura_Parking and Ticket/Tarifas Parking:** Parking invoices are connected to issued tickets and applied rates through "Ticket_id" and "Tarifas_Parking_id."
- **Ticket and Clientes:** Parking tickets are linked to the customers who issued them via the "Clientes_Cedula" foreign key.

Overall, this database model provides a robust structure for efficiently managing the operations of a parking and car wash system, allowing for detailed tracking of customer interactions with the services offered.


## Autores ✒️

* **Omar Camacho** - [omgicaqui](https://github.com/omgicaqui)
* **Juan José Campos** - [jujucamon](https://github.com/jujocamon)
* **Sorel Carrillo** - [sorel07](https://github.com/sorel07)
* **Edgar Duarte** - [edgardr04](https://github.com/edgardr04)



## Expresiones de Gratitud 🎁

* Comparte este proyecto con otros colegas y amigos que puedan beneficiarse de él 📢
* Agradecemos cualquier feedback o sugerencia para mejorar Mr CarWash & Parking 🙌
* Si deseas contribuir al desarrollo continuo, no dudes en contactarnos.
* ¡Gracias por apoyar nuestro trabajo y ayudarnos a mejorar la experiencia de gestión de estacionamientos y servicios de lavado de autos! 🚗🅿️
