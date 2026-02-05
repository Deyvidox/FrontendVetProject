import React, { useState, useMemo, useEffect } from "react";
import {
  CButton,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import AppointmentForm from "./AppointmentForm";
import AppointmentList from "./AppointmentList";
import AlertModal from "./AlertModal";

const AppointmentPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editAppointment, setEditAppointment] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Aquí irá la conexión a tu backend
        // Ejemplo: const res = await fetch('tu-backend-url/api/appointments');
        // setAppointments(await res.json());
        // Similar para mascotas, veterinarios, clientes
        
        setAppointments([]);
        setMascotas([]);
        setVeterinarios([]);
        setClientes([]);

      } catch (error) {
        console.error("Error al cargar datos:", error);
        setAlertMsg("Error al cargar datos desde el servidor.");
        setAlertType("error");
        setAlertOpen(true);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const idxMasc = useMemo(
    () => Object.fromEntries(mascotas.map((m) => [String(m.id), m])),
    [mascotas]
  );

  const idxVet = useMemo(
    () => Object.fromEntries(veterinarios.map((v) => [String(v.id), v])),
    [veterinarios]
  );

  const idxCli = useMemo(
    () => Object.fromEntries(clientes.map((c) => [String(c.id), c])),
    [clientes]
  );

  const appointmentsWithRelations = useMemo(() => {
    return appointments.map((a) => {
      const mascota = idxMasc[String(a.mascota_id)];
      const cliente = mascota ? idxCli[String(mascota.cliente_id)] : null;
      const veterinario = idxVet[String(a.veterinario_id)];

      return {
        ...a,
        mascota,
        cliente,
        veterinario,
        mascotaNombre: mascota?.nombre || 'Desconocida',
        clienteNombre: cliente?.nombre || 'Desconocido',
        veterinarioNombre: veterinario?.nombre || 'Desconocido'
      };
    });
  }, [appointments, idxMasc, idxVet, idxCli]);

  const handleSave = async (payload) => {
    setLoading(true);
    try {
      // Aquí irá la conexión a tu backend
      // Ejemplo: const response = await fetch('tu-backend-url/api/appointments', {
      //   method: editAppointment ? 'PUT' : 'POST',
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload)
      // });
      
      if (editAppointment) {
        setAlertMsg("Cita actualizada correctamente.");
      } else {
        setAlertMsg("Cita creada correctamente.");
      }

      setAlertType("success");
      setAlertOpen(true);
      setShowModal(false);
      setEditAppointment(null);

    } catch (error) {
      console.error("Error al guardar la cita:", error);
      setAlertMsg(error.message || "Error al guardar la cita.");
      setAlertType("error");
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("¿Estás seguro de eliminar esta cita?");
    
    if (!confirmed) return;

    setLoading(true);
    try {
      // Aquí irá la conexión a tu backend
      // Ejemplo: await fetch(`tu-backend-url/api/appointments/${id}`, { method: 'DELETE' });
      
      setAppointments(prev => prev.filter(a => a.id !== id));
      setAlertMsg("Cita eliminada correctamente.");
      setAlertType("success");
      setAlertOpen(true);
    } catch (error) {
      console.error("Error al eliminar la cita:", error);
      setAlertMsg(error.message || "Error al eliminar la cita.");
      setAlertType("error");
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      // Aquí irá la conexión a tu backend
      // Ejemplo: await fetch(`tu-backend-url/api/appointments/${id}`, {
      //   method: 'PATCH',
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ estado: newStatus })
      // });
      
      setAppointments(prev => 
        prev.map(a => a.id === id ? { ...a, estado: newStatus } : a)
      );
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      setAlertMsg("Error al actualizar el estado de la cita.");
      setAlertType("error");
      setAlertOpen(true);
    }
  };

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestión de Citas</h1>
        <CButton
          color="primary"
          onClick={() => {
            setEditAppointment(null);
            setShowModal(true);
          }}
          disabled={loading}
        >
          {loading ? "Cargando..." : "Agregar Cita"}
        </CButton>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando citas...</p>
        </div>
      ) : (
        <AppointmentList
          appointments={appointmentsWithRelations}
          onEdit={(appt) => {
            setEditAppointment(appt);
            setShowModal(true);
          }}
          onDelete={handleDelete}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      <CModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        alignment="center"
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>
            {editAppointment ? "Editar Cita" : "Crear Cita"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <AppointmentForm
            onSubmit={handleSave}
            mascotas={mascotas}
            veterinarios={veterinarios}
            appointments={appointments}
            initialValues={editAppointment || undefined}
            onClose={() => setShowModal(false)}
          />
        </CModalBody>
      </CModal>

      <AlertModal
        isOpen={alertOpen}
        message={alertMsg}
        type={alertType}
        onClose={() => setAlertOpen(false)}
      />
    </div>
  );
};

export default AppointmentPage;