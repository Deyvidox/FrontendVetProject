import React, { useState, useEffect } from "react";
import { CButton, CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import AppointmentForm from "./AppointmentForm";
import AppointmentList from "./AppointmentList";
import AlertModal from "./AlertModal";
import { appointmentService } from "./appointmentService";

const AppointmentPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editAppointment, setEditAppointment] = useState(null);
  const [alert, setAlert] = useState({ open: false, msg: "", type: "success" });
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await appointmentService.getAll();
      setAppointments(data);
    } catch (error) {
      setAlert({ open: true, msg: "Error al cargar citas de la DB", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async (payload) => {
    try {
      if (editAppointment) {
        await appointmentService.update(editAppointment.id, payload);
        setAlert({ open: true, msg: "Cita actualizada en la base de datos", type: "success" });
      } else {
        await appointmentService.create(payload);
        setAlert({ open: true, msg: "Cita guardada exitosamente", type: "success" });
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      setAlert({ open: true, msg: typeof error === 'string' ? error : "Error de validación", type: "error" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Confirmas eliminar este registro real?")) return;
    try {
      await appointmentService.delete(id);
      loadData();
    } catch (error) {
      setAlert({ open: true, msg: "No se pudo eliminar", type: "error" });
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Calendario de Citas </h3>
        <CButton color="primary" onClick={() => { setEditAppointment(null); setShowModal(true); }}>
          Nueva Cita
        </CButton>
      </div>

      <AppointmentList 
        appointments={appointments} 
        onEdit={(appt) => {
          // Adaptamos los nombres de la DB para el formulario (Zod)
          setEditAppointment({
            id: appt.id,
            mascota_id: appt.pet_id || appt.id_mascota, // Depende de tu SELECT SQL
            estado: appt.estado || appt.status,
            notas: appt.notas || appt.notes
          });
          setShowModal(true);
        }}
        onDelete={handleDelete}
        onUpdateStatus={async (id, status) => {
          try {
            await appointmentService.update(id, { estado: status });
            loadData();
          } catch (e) { setAlert({ open: true, msg: "Error al cambiar estado", type: "error" }); }
        }}
      />

      <CModal visible={showModal} onClose={() => setShowModal(false)} size="lg">
        <CModalHeader><CModalTitle>{editAppointment ? "Editar Cita" : "Nueva Cita"}</CModalTitle></CModalHeader>
        <CModalBody>
          <AppointmentForm 
            onSubmit={handleSave} 
            initialValues={editAppointment || {}} 
            onClose={() => setShowModal(false)} 
          />
        </CModalBody>
      </CModal>

      <AlertModal 
        isOpen={alert.open} 
        message={alert.msg} 
        type={alert.type} 
        onClose={() => setAlert({ ...alert, open: false })} 
      />
    </div>
  );
};

export default AppointmentPage;