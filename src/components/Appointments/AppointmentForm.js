// AppointmentForm.jsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AlertModal from './AlertModal';
import { appointmentSchema, defaultAppointmentValues } from './AppointmentSchema';
import '../../css/Inventory/inventory.css';

// Configuración de Cloudinary (si la usarás después)
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/<tu_cloud_name>/image/upload';
const CLOUDINARY_UPLOAD_PRESET = '<tu_unsigned_preset>';

// Props:
// onSubmit(payload) -> llama al padre para crear/editar
// mascotas, veterinarios -> listas para los selects (mock o reales)
// appointments -> lista actual (para evitar doble booking)
// initialValues -> si viene edición
// onClose() -> cerrar modal si viene de una modal contenedora
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

  const estadoValue = watch('estado');
  const fechaValue = watch('fecha_cita');
  const vetValue = watch('veterinario_id');

  const isDoubleBooked = () => {
    if (!vetValue || !fechaValue) return false;
    const targetTime = new Date(fechaValue).getTime();
    return appointments.some(
      (a) => a.veterinario_id === Number(vetValue) && new Date(a.fecha_cita).getTime() === targetTime
    );
  };

  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalType, setModalType] = React.useState('success');
  const [modalMsg, setModalMsg] = React.useState('');

  const submitHandler = (data) => {
    // doble booking
    if (isDoubleBooked()) {
      setModalType('error');
      setModalMsg('El veterinario ya tiene una cita en ese horario.');
      setModalOpen(true);
      return;
    }

    const payload = {
      ...data,
      mascota_id: Number(data.mascota_id),
      veterinario_id: Number(data.veterinario_id),
      // si el usuario ya envío ISO, lo aceptamos; si viene datetime-local, lo convertimos
      fecha_cita: new Date(data.fecha_cita).toISOString(),
    };

    onSubmit(payload);

    setModalType('success');
    setModalMsg('Cita registrada correctamente.');
    setModalOpen(true);

    // reset del formulario y cierre si procede (igual que InventoryForm)
    reset(defaultAppointmentValues);
    if (onClose) onClose();
  };

  const handleCloudinaryUpload = async (file) => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: 'POST', body: formData });
      const json = await res.json();

      if (json.secure_url) {
        setValue('evidencia_url', json.secure_url);
        setModalType('success');
        setModalMsg('Imagen subida correctamente.');
        setModalOpen(true);
      } else {
        throw new Error('Respuesta inválida');
      }
    } catch (e) {
      setModalType('error');
      setModalMsg('Error al subir la imagen. Verifica tu configuración de Cloudinary.');
      setModalOpen(true);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="appointment-form">
      <div className="auth-header">
        <h1>Crear/Editar Cita</h1>
        <p>Completa los datos para agendar tu cita.</p>
      </div>

      {/* Mascota */}
      <label>Mascota</label>
      <select {...register('mascota_id')}>
        <option value="">Selecciona una mascota</option>
        {mascotas.map((m) => (
          <option key={m.id} value={m.id}>{m.nombre}</option>
        ))}
      </select>
      {errors.mascota_id && <span className="text-danger">{errors.mascota_id.message}</span>}

      {/* Veterinario */}
      <label>Veterinario</label>
      <select {...register('veterinario_id')}>
        <option value="">Selecciona un veterinario</option>
        {veterinarios.map((v) => (
          <option key={v.id} value={v.id}>{v.nombre}</option>
        ))}
      </select>
      {errors.veterinario_id && <span className="text-danger">{errors.veterinario_id.message}</span>}

      {/* Fecha y hora */}
      <label>Fecha y hora de la cita</label>
      <input type="datetime-local" {...register('fecha_cita')} />
      {errors.fecha_cita && <span className="text-danger">{errors.fecha_cita.message}</span>}

      {/* Estado */}
      <label>Estado</label>
      <select {...register('estado')}>
        <option value="Pendiente">Pendiente</option>
        <option value="Confirmada">Confirmada</option>
        <option value="Cancelada">Cancelada</option>
        <option value="Completada">Completada</option>
      </select>

      {/* Notas */}
      <label>Notas</label>
      <textarea
        {...register('notas')}
        placeholder={estadoValue === 'Cancelada' ? 'Explica el motivo de la cancelación' : 'Notas de la cita'}
      />
      {errors.notas && <span className="text-danger">{errors.notas.message}</span>}

      {/* Evidencia */}
      <label>Evidencia (imagen)</label>
      <div className="upload-row">
        <input type="url" placeholder="URL de la imagen (opcional)" {...register('evidencia_url')} />
        <input type="file" accept="image/*" onChange={(e) => handleCloudinaryUpload(e.target.files?.[0])} />
      </div>

      {isDoubleBooked() && (
        <span className="text-danger">Conflicto: el veterinario ya tiene una cita en ese horario.</span>
      )}

      <button type="submit" className="btn">Guardar Cita</button>

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
