import React, { useState, useEffect } from "react";
import { CButton, CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import AppointmentForm from "./AppointmentForm";
import AppointmentList from "./AppointmentList";
import { appointmentService } from "./appointmentService";
import AlertModal from "./AlertModal";

const AppointmentPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [clientsWithPets, setClientsWithPets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editAppointment, setEditAppointment] = useState(null);
  const [alert, setAlert] = useState({ open: false, msg: "", type: "success" });

  const loadData = async () => {
    try {
      const [appts, formData] = await Promise.all([
        appointmentService.getAll(),
        appointmentService.getFormData()
      ]);
      setAppointments(appts);
      setClientsWithPets(formData);
    } catch (error) {
      setAlert({ open: true, msg: "Error cargando datos", type: "error" });
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async (data) => {
    try {
      if (editAppointment) {
        await appointmentService.update(editAppointment.id, data);
      } else {
        await appointmentService.create(data);
      }
      setShowModal(false);
      loadData();
      setAlert({ open: true, msg: "Operación exitosa", type: "success" });
    } catch (e) {
      setAlert({ open: true, msg: "Error al guardar", type: "error" });
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await appointmentService.update(id, { status: newStatus });
      loadData();
      setAlert({ open: true, msg: "Estado actualizado", type: "success" });
    } catch (error) {
      setAlert({ open: true, msg: "Error al actualizar", type: "error" });
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-white fw-bold">📅 Listado de Citas</h3>
        <CButton color="primary" className="shadow rounded-pill px-4 fw-bold" onClick={() => { setEditAppointment(null); setShowModal(true); }}>
          Nueva Cita
        </CButton>
      </div>

      <AppointmentList 
        appointments={appointments} 
        onEdit={(appt) => { setEditAppointment(appt); setShowModal(true); }}
        onUpdateStatus={handleUpdateStatus}
        onDelete={async (id) => { 
            if(window.confirm("¿Desea eliminar esta cita?")) { 
                await appointmentService.delete(id); 
                loadData(); 
            } 
        }}
      />

      <CModal visible={showModal} onClose={() => setShowModal(false)} size="lg" backdrop="static">
        <CModalHeader className="bg-white text-dark border-0">
          <CModalTitle className="fw-bold">{editAppointment ? "📝 Editar Cita" : "📅 Nueva Cita"}</CModalTitle>
          <style>{`.btn-close { filter: invert(0) !important; opacity: 1 !important; }`}</style>
        </CModalHeader>
        <CModalBody className="p-0">
          <AppointmentForm onSubmit={handleSave} clientsData={clientsWithPets} initialValues={editAppointment} onClose={() => setShowModal(false)} />
        </CModalBody>
      </CModal>

      <AlertModal isOpen={alert.open} message={alert.msg} type={alert.type} onClose={() => setAlert({ ...alert, open: false })} />
    </div>
  );
};

export default AppointmentPage;