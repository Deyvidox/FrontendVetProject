import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AlertModal from "./AlertModal";
import {
  appointmentSchema,
  defaultAppointmentValues,
} from "./AppointmentSchema";
import "../../css/Inventory/inventory.css";

const AppointmentForm = ({
  onSubmit,
  mascotas = [],
  veterinarios = [],
  appointments = [],
  initialValues = defaultAppointmentValues,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const estadoValue = watch("estado");
  const fechaValue = watch("fecha_cita");
  const vetValue = watch("veterinario_id");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("success");
  const [modalMsg, setModalMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const isDoubleBooked = () => {
    if (!vetValue || !fechaValue) return false;

    const targetTime = new Date(fechaValue).getTime();

    return appointments.some(
      (a) =>
        a.veterinario_id === Number(vetValue) &&
        new Date(a.fecha_cita).getTime() === targetTime
    );
  };

  const submitHandler = async (data) => {
    if (isDoubleBooked()) {
      setModalType("error");
      setModalMsg("El veterinario ya tiene una cita en ese horario.");
      setModalOpen(true);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...data,
        mascota_id: Number(data.mascota_id),
        veterinario_id: Number(data.veterinario_id),
        fecha_cita: new Date(data.fecha_cita).toISOString(),
      };

      await onSubmit(payload);

      setModalType("success");
      setModalMsg("Cita registrada correctamente.");
      setModalOpen(true);

      reset(defaultAppointmentValues);

      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      setModalType("error");
      setModalMsg(error.message || "Error al guardar la cita.");
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloudinaryUpload = async (file) => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "tu_upload_preset");

      const res = await fetch("https://api.cloudinary.com/v1_1/tu_cloud_name/image/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (json.secure_url) {
        setValue("evidencia_url", json.secure_url);
        setModalType("success");
        setModalMsg("Imagen subida correctamente.");
        setModalOpen(true);
      } else {
        throw new Error("Respuesta inválida de Cloudinary.");
      }
    } catch (error) {
      setModalType("error");
      setModalMsg("Error al subir la imagen.");
      setModalOpen(true);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="appointment-form">
      <div className="auth-header">
        <h1>{initialValues.id ? "Editar Cita" : "Crear Cita"}</h1>
        <p>Completa los datos para agendar tu cita.</p>
      </div>

      <label>Mascota</label>
      <select {...register("mascota_id")} disabled={loading}>
        <option value="">Selecciona una mascota</option>
        {mascotas.map((m) => (
          <option key={m.id} value={m.id}>
            {m.nombre}
          </option>
        ))}
      </select>
      {errors.mascota_id && (
        <span className="text-danger">{errors.mascota_id.message}</span>
      )}

      <label>Veterinario</label>
      <select {...register("veterinario_id")} disabled={loading}>
        <option value="">Selecciona un veterinario</option>
        {veterinarios.map((v) => (
          <option key={v.id} value={v.id}>
            {v.nombre}
          </option>
        ))}
      </select>
      {errors.veterinario_id && (
        <span className="text-danger">{errors.veterinario_id.message}</span>
      )}

      <label>Fecha y hora de la cita</label>
      <input 
        type="datetime-local" 
        {...register("fecha_cita")} 
        disabled={loading}
      />
      {errors.fecha_cita && (
        <span className="text-danger">{errors.fecha_cita.message}</span>
      )}

      <label>Estado</label>
      <select {...register("estado")} disabled={loading}>
        <option value="Pendiente">Pendiente</option>
        <option value="Confirmada">Confirmada</option>
        <option value="Cancelada">Cancelada</option>
        <option value="Completada">Completada</option>
      </select>

      <label>Notas</label>
      <textarea
        {...register("notas")}
        placeholder={
          estadoValue === "Cancelada"
            ? "Explica el motivo de la cancelación"
            : "Notas de la cita"
        }
        disabled={loading}
      />
      {errors.notas && (
        <span className="text-danger">{errors.notas.message}</span>
      )}

      <label>Evidencia (imagen)</label>
      <div className="upload-row">
        <input
          type="url"
          placeholder="URL de la imagen (opcional)"
          {...register("evidencia_url")}
          disabled={loading}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleCloudinaryUpload(e.target.files?.[0])}
          disabled={loading}
        />
      </div>

      {isDoubleBooked() && (
        <span className="text-danger">
          Conflicto: el veterinario ya tiene una cita en ese horario.
        </span>
      )}

      <button type="submit" className="btn" disabled={loading}>
        {loading ? "Guardando..." : "Guardar cita"}
      </button>

      <AlertModal
        isOpen={modalOpen}
        message={modalMsg}
        onClose={() => setModalOpen(false)}
        type={modalType}
      />
    </form>
  );
};

export default AppointmentForm;