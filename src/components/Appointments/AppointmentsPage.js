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

const API = "http://localhost:3001";

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

  // ---------------------------------------------------------
  // CARGAR DATOS DESDE EL BACKEND
  // ---------------------------------------------------------
  useEffect(() => {
    const loadData = async () => {
      try {
        const [resAppt, resMasc, resVet, resCli] = await Promise.all([
          fetch(`${API}/appointments`),
          fetch(`${API}/mascotas`),
          fetch(`${API}/veterinarios`),
          fetch(`${API}/clientes`),
        ]);

        setAppointments(await resAppt.json());
        setMascotas(await resMasc.json());
        setVeterinarios(await resVet.json());
        setClientes(await resCli.json());
      } catch (error) {
        setAlertMsg("Error al cargar datos desde el servidor.");
        setAlertType("error");
        setAlertOpen(true);
      }
    };

    loadData();
  }, []);

  // ---------------------------------------------------------
  // ÍNDICES PARA MEJORAR ACCESO A RELACIONES
  // ---------------------------------------------------------
  const idxMasc = useMemo(
    () =>
      Object.fromEntries(
        mascotas.map((m) => [Number(m.id), m])
      ),
    [mascotas]
  );

  const idxVet = useMemo(
    () =>
      Object.fromEntries(
        veterinarios.map((v) => [Number(v.id), v])
      ),
    [veterinarios]
  );

  const idxCli = useMemo(
    () =>
      Object.fromEntries(
        clientes.map((c) => [Number(c.id), c])
      ),
    [clientes]
  );

  // ---------------------------------------------------------
  // CONECTAR CADA CITA CON SU MASCOTA, CLIENTE Y VETERINARIO
  // ---------------------------------------------------------
  const appointmentsWithRelations = useMemo(() => {
    return appointments.map((a) => {
      const mascota = idxMasc[a.mascota_id];
      const cliente = mascota ? idxCli[mascota.cliente_id] : null;

      return {
        ...a,
        mascota,
        vet: idxVet[a.veterinario_id],
        cliente,
      };
    });
  }, [appointments, idxMasc, idxVet, idxCli]);

  // ---------------------------------------------------------
  // GUARDAR CITA (POST / PUT)
  // ---------------------------------------------------------
  const handleSave = async (payload) => {
    try {
      if (editAppointment) {
        await fetch(`${API}/appointments/${editAppointment.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        setAlertMsg("Cita actualizada.");
      } else {
        await fetch(`${API}/appointments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        setAlertMsg("Cita creada.");
      }

      setAlertType("success");
      setAlertOpen(true);

      // Cerrar modal
      setShowModal(false);
      setEditAppointment(null);

      // Recargar citas
      const res = await fetch(`${API}/appointments`);
      setAppointments(await res.json());
    } catch (error) {
      setAlertMsg("Error al guardar la cita.");
      setAlertType("error");
      setAlertOpen(true);
    }
  };

  // ---------------------------------------------------------
  // ELIMINAR CITA
  // ---------------------------------------------------------
  const handleDelete = async (id) => {
    const confirmed = window.confirm("¿Eliminar cita?");

    if (!confirmed) return;

    try {
      await fetch(`${API}/appointments/${id}`, {
        method: "DELETE",
      });

      setAppointments((prev) => prev.filter((a) => a.id !== id));

      setAlertMsg("Cita eliminada.");
      setAlertType("success");
      setAlertOpen(true);
    } catch (error) {
      setAlertMsg("Error al eliminar la cita.");
      setAlertType("error");
      setAlertOpen(true);
    }
  };

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------
  return (
    <div className="container mt-3">
      <CButton
        color="primary"
        onClick={() => {
          setEditAppointment(null);
          setShowModal(true);
        }}
      >
        Agregar Cita
      </CButton>

      <AppointmentList
        appointments={appointmentsWithRelations}
        onEdit={(appt) => {
          setEditAppointment(appt);
          setShowModal(true);
        }}
        onDelete={handleDelete}
        onUpdateStatus={() => {}}
      />

      <CModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        alignment="center"
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
