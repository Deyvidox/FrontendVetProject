import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentSchema, defaultAppointmentValues } from "./AppointmentSchema";
import { 
  CButton, CFormSelect, CFormTextarea, CFormLabel, 
  CRow, CCol, CForm, CFormInput 
} from "@coreui/react";

const AppointmentForm = ({ onSubmit, clientsData = [], initialValues, onClose }) => {
  const [selectedOwnerId, setSelectedOwnerId] = useState("");
  const [filteredPets, setFilteredPets] = useState([]);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: initialValues || defaultAppointmentValues,
  });

  const owners = Array.from(new Set(clientsData.map(i => i.owner_id)))
    .map(id => clientsData.find(i => i.owner_id === id))
    .filter(Boolean);

  useEffect(() => {
    if (selectedOwnerId) {
      const pets = clientsData.filter(i => Number(i.owner_id) === Number(selectedOwnerId));
      setFilteredPets(pets);
    } else {
      setFilteredPets([]);
    }
  }, [selectedOwnerId, clientsData]);

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
      const relation = clientsData.find(i => Number(i.pet_id) === Number(initialValues.pet_id));
      if (relation) setSelectedOwnerId(relation.owner_id);
    } else {
      reset(defaultAppointmentValues);
      setSelectedOwnerId("");
    }
  }, [initialValues, reset, clientsData]);

  return (
    <CForm onSubmit={handleSubmit(onSubmit)} className="p-4" style={{ backgroundColor: '#f9f9fb' }}>
      <CRow className="g-3">
        <CCol md={6}>
          <CFormLabel className="fw-bold text-dark small text-uppercase">Dueño / Propietario</CFormLabel>
          <CFormSelect 
            className="shadow-sm border-0 p-2 text-dark bg-white"
            value={selectedOwnerId} 
            onChange={(e) => { setSelectedOwnerId(e.target.value); setValue("pet_id", ""); }}
          >
            <option value="">-- Seleccionar Dueño --</option>
            {owners.map(o => (
              <option key={o.owner_id} value={o.owner_id}>{o.owner_name}</option>
            ))}
          </CFormSelect>
        </CCol>

        <CCol md={6}>
          <CFormLabel className="fw-bold text-dark small text-uppercase">Mascota (Paciente)</CFormLabel>
          <CFormSelect 
            className={`shadow-sm border-0 p-2 text-dark bg-white ${errors.pet_id ? 'is-invalid' : ''}`}
            {...register("pet_id")}
            disabled={!selectedOwnerId}
          >
            <option value="">-- {selectedOwnerId ? "Seleccione Mascota" : "Primero elija un dueño"} --</option>
            {filteredPets.map(p => (
              <option key={p.pet_id} value={p.pet_id}>{p.pet_name} — {p.breed}</option>
            ))}
          </CFormSelect>
        </CCol>

        <CCol md={6}>
          <CFormLabel className="fw-bold text-dark small text-uppercase">Fecha de la Cita</CFormLabel>
          <CFormInput type="date" className="shadow-sm border-0 p-2" {...register("appointment_date")} />
        </CCol>

        <CCol md={6}>
          <CFormLabel className="fw-bold text-dark small text-uppercase">Hora de la Cita</CFormLabel>
          <CFormInput type="time" className="shadow-sm border-0 p-2" {...register("appointment_time")} />
        </CCol>

        <CCol md={6}>
          <CFormLabel className="fw-bold text-dark small text-uppercase">Tipo de Servicio</CFormLabel>
          <CFormSelect className="shadow-sm border-0 p-2" {...register("service_type")}>
            <option value="Consulta General">🩺 Consulta General</option>
            <option value="Vacunación">💉 Vacunación</option>
            <option value="Cirugía">✂️ Cirugía</option>
            <option value="Peluquería">🚿 Peluquería</option>
          </CFormSelect>
        </CCol>

        <CCol md={6}>
          <CFormLabel className="fw-bold text-dark small text-uppercase">Estado Inicial</CFormLabel>
          <CFormSelect className="shadow-sm border-0 p-2" {...register("status")}>
            <option value="Pending">🟡 Pendiente</option>
            <option value="Scheduled">🔵 Programada</option>
          </CFormSelect>
        </CCol>

        <CCol md={12}>
          <CFormLabel className="fw-bold text-dark small text-uppercase">Observaciones</CFormLabel>
          <CFormTextarea className="shadow-sm border-0 p-2" rows={3} {...register("notes")} />
        </CCol>
      </CRow>

      <div className="d-flex gap-2 justify-content-end mt-4 pt-3 border-top">
        <CButton color="link" className="text-decoration-none text-muted fw-bold" onClick={onClose}>Cancelar</CButton>
        <CButton color="primary" type="submit" className="px-5 py-2 shadow fw-bold rounded-pill">
          {initialValues ? "Guardar Cambios" : "Confirmar Cita"}
        </CButton>
      </div>
    </CForm>
  );
};

export default AppointmentForm;