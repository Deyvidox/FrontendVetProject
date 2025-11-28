import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CFormInput, CFormSelect, CFormTextarea, CButton, CFormLabel } from '@coreui/react';
import { inventorySchema } from './inventorySchema';
import AlertModal from './AlertModal';
import TagInput from './TagInput';
import '../../css/Inventory/inventory.css';

// Cloudinary
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/<tu_cloud_name>/image/upload';
const CLOUDINARY_UPLOAD_PRESET = '<tu_unsigned_preset>';

const InventoryForm = ({ onSubmit, initialValues, onClose }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(inventorySchema),
    defaultValues: initialValues || {
      nombre: '',
      tipo: 'Medicina',
      instrucciones: '',
      cantidad: 0,
      precio_unitario: 0,
      estado: 'Disponible',
      tags: [],
      imagen_url: '',
    },
  });

  const [tags, setTags] = useState(initialValues?.tags || []);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState('');
  const [modalType, setModalType] = useState('success');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    reset(initialValues);
    setTags(initialValues?.tags || []);
  }, [initialValues, reset]);

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: 'POST', body: formData });
      const json = await res.json();
      if (json.secure_url) {
        setValue('imagen_url', json.secure_url);
        setModalMsg('Imagen subida correctamente.');
        setModalType('success');
        setModalOpen(true);
      }
    } catch (err) {
      console.error('Error al subir imagen', err);
      setModalMsg('Error al subir la imagen.');
      setModalType('error');
      setModalOpen(true);
    } finally {
      setUploading(false);
    }
  };

  const submitHandler = (data) => {
    data.tags = tags; // Asegurar tags
    onSubmit({
      nombre: data.nombre || '',
      tipo: data.tipo || 'Otro',
      cantidad: data.cantidad || 0,
      precio_unitario: data.precio_unitario || 0,
      estado: data.estado || 'Disponible',
      instrucciones: data.instrucciones || '',
      tags: data.tags || [],
      imagen_url: data.imagen_url || '',
    });
    setModalMsg('Producto guardado correctamente.');
    setModalType('success');
    setModalOpen(true);
    reset();
    setTags([]);
    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <CFormLabel>Nombre</CFormLabel>
      <CFormInput {...register('nombre')} />
      {errors.nombre && <p className="text-danger">{errors.nombre.message}</p>}

      <CFormLabel>Tipo</CFormLabel>
      <CFormSelect {...register('tipo')}>
        <option>Medicina</option>
        <option>Vacuna</option>
        <option>Accesorio</option>
        <option>Alimento</option>
        <option>Otro</option>
      </CFormSelect>

      <CFormLabel>Cantidad</CFormLabel>
      <CFormInput type="number" {...register('cantidad', { valueAsNumber: true })} />
      {errors.cantidad && <p className="text-danger">{errors.cantidad.message}</p>}

      <CFormLabel>Precio unitario</CFormLabel>
      <CFormInput type="number" step="0.01" {...register('precio_unitario', { valueAsNumber: true })} />
      {errors.precio_unitario && <p className="text-danger">{errors.precio_unitario.message}</p>}

      <CFormLabel>Estado</CFormLabel>
      <CFormSelect {...register('estado')}>
        <option>Disponible</option>
        <option>Agotado</option>
        <option>Descontinuado</option>
      </CFormSelect>

      <CFormLabel>Instrucciones</CFormLabel>
      <CFormTextarea {...register('instrucciones')} />

      <CFormLabel>Imagen</CFormLabel>
      <CFormInput type="file" onChange={(e) => handleUpload(e.target.files?.[0])} />
      {getValues('imagen_url') && (
        <img src={getValues('imagen_url')} alt="Preview" style={{ width: '100px', marginTop: '5px' }} />
      )}

      <CFormLabel>Tags</CFormLabel>
      <TagInput tags={tags} setTags={setTags} />

      <CButton type="submit" color="primary" className="mt-2" disabled={uploading}>
        {uploading ? 'Subiendo...' : 'Guardar Producto'}
      </CButton>

      <AlertModal
        isOpen={modalOpen}
        message={modalMsg}
        type={modalType}
        onClose={() => setModalOpen(false)}
      />
    </form>
  );
};

export default InventoryForm;
