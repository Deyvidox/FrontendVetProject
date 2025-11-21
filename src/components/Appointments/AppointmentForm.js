import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form'; // Hook para manejo de formularios
import { zodResolver } from '@hookform/resolvers/zod'; // Para validar con zod
import AlertModal from './AlertModal'; // Modal para mostrar alertas
import { appointmentSchema } from './AppointmentSchema'; // Esquema de validación
import '../../css/appointment/appointmentsPage.css'; // Estilos de la página

// Configuración de Cloudinary para subir imágenes (si se usa upload real)
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/<tu_cloud_name>/image/upload';
const CLOUDINARY_UPLOAD_PRESET = '<tu_unsigned_preset>';

// Componente del formulario de citas
const AppointmentForm = ({
  onSubmit,           // Función para enviar los datos al padre
  mascotas = [],      // Lista de mascotas disponibles
  veterinarios = [],  // Lista de veterinarios disponibles
  appointments = [],  // Lista de citas actuales (para validar conflictos)
  initialValues = {   // Valores iniciales (nuevo o edición)
    mascota_id: '',
    veterinario_id: '',
    fecha_cita: '',
    estado: 'Pendiente',
    notas: '',
    evidencia_url: '',
  }
}) => {
  // Hook principal de react-hook-form
  const {
    register,         // Registra inputs
    handleSubmit,     // Función que maneja submit con validación
    formState: { errors }, // Errores de validación
    watch,            // Observar cambios de valores
    setValue,         // Para actualizar valores manualmente
    reset,            // Resetea valores del formulario
  } = useForm({
    resolver: zodResolver(appointmentSchema), // Valida usando zod
    defaultValues: initialValues,             // Inicializa el formulario
  });

  // Cuando cambian los valores iniciales, resetea el formulario
  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  // Observamos valores para condicionales
  const estadoValue = watch('estado');       // Estado actual del formulario
  const fechaValue = watch('fecha_cita');    // Fecha seleccionada
  const vetValue = watch('veterinario_id');  // Vet seleccionado

  // Validación extra: prevenir doble booking (mismo vet y misma hora exacta)
  const isDoubleBooked = () => {
    if (!vetValue || !fechaValue) return false;
    const targetTime = new Date(fechaValue).getTime();
    return appointments.some(a => a.veterinario_id === Number(vetValue) && new Date(a.fecha_cita).getTime() === targetTime);
  };

  // Estados para mostrar modal de alerta
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalType, setModalType] = React.useState('success'); // success / error
  const [modalMsg, setModalMsg] = React.useState('');           // Mensaje a mostrar

  // Función que se ejecuta al enviar el formulario
  const submitHandler = (data) => {
    // Si hay doble booking, mostrar error
    if (isDoubleBooked()) {
      setModalType('error');
      setModalMsg('El veterinario ya tiene una cita en ese horario.');
      setModalOpen(true);
      return;
    }

    // Normalizar tipos antes de enviar
    const payload = {
      ...data,
      mascota_id: Number(data.mascota_id),
      veterinario_id: Number(data.veterinario_id),
      fecha_cita: new Date(data.fecha_cita).toISOString(), // Formato ISO
    };

    // Llamamos al padre con los datos
    onSubmit(payload);

    // Mostrar modal de éxito
    setModalType('success');
    setModalMsg('Cita registrada correctamente.');
    setModalOpen(true);
  };

  // Función para subir imágenes a Cloudinary
  const handleCloudinaryUpload = async (file) => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: 'POST', body: formData });
      const json = await res.json();

      if (json.secure_url) {
        setValue('evidencia_url', json.secure_url); // Guardar URL en el formulario
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
    // Formulario principal
    <form onSubmit={handleSubmit(submitHandler)} className="appointment-form">
      <div className="auth-header">
        <h1>Crear/Editar Cita</h1>
        <p>Completa los datos para agendar tu cita.</p>
      </div>

      {/* Selector de mascota */}
      <label>Mascota</label>
      <select {...register('mascota_id')}>
        <option value="">Selecciona una mascota</option>
        {mascotas.map((m) => (
          <option key={m.id} value={m.id}>{m.nombre}</option>
        ))}
      </select>
      {errors.mascota_id && <span className="text-danger">{errors.mascota_id.message}</span>}

      {/* Selector de veterinario */}
      <label>Veterinario</label>
      <select {...register('veterinario_id')}>
        <option value="">Selecciona un veterinario</option>
        {veterinarios.map((v) => (
          <option key={v.id} value={v.id}>{v.nombre}</option>
        ))}
      </select>
      {errors.veterinario_id && <span className="text-danger">{errors.veterinario_id.message}</span>}

      {/* Fecha y hora de la cita */}
      <label>Fecha y hora de la cita</label>
      <input type="datetime-local" {...register('fecha_cita')} />
      {errors.fecha_cita && <span className="text-danger">{errors.fecha_cita.message}</span>}

      {/* Estado de la cita */}
      <label>Estado</label>
      <select {...register('estado')}>
        <option value="Pendiente">Pendiente</option>
        <option value="Confirmada">Confirmada</option>
        <option value="Cancelada">Cancelada</option>
        <option value="Completada">Completada</option>
      </select>

      {/* Notas de la cita */}
      <label>Notas</label>
      <textarea {...register('notas')} placeholder={estadoValue === 'Cancelada' ? 'Explica el motivo de la cancelación' : 'Notas de la cita'} />
      {errors.notas && <span className="text-danger">{errors.notas.message}</span>}

      {/* Evidencia (URL o archivo) */}
      <label>Evidencia (imagen)</label>
      <div className="upload-row">
        <input type="url" placeholder="URL de la imagen (opcional)" {...register('evidencia_url')} />
        <input type="file" accept="image/*" onChange={(e) => handleCloudinaryUpload(e.target.files?.[0])} />
      </div>

      {/* Mensaje de conflicto si hay doble booking */}
      {isDoubleBooked() && (
        <span className="text-danger">Conflicto: el veterinario ya tiene una cita en ese horario.</span>
      )}

      {/* Botón principal */}
      <button type="submit" className="btn">Guardar Cita</button>

      {/* Modal para mostrar alertas */}
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
