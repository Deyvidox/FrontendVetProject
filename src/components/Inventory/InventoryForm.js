// InventoryForm.jsx
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CFormInput, CFormSelect, CFormTextarea, CButton, CFormLabel } from '@coreui/react'
import { inventorySchema } from './inventorySchema'
import AlertModal from './AlertModal'
import TagInput from './TagInput'
import '../../css/Inventory/inventory.css'

// Datos de Cloudinary (reemplaza <tu_cloud_name> y <tu_unsigned_preset>)
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/<tu_cloud_name>/image/upload'
const CLOUDINARY_UPLOAD_PRESET = '<tu_unsigned_preset>'

// Props:
// onSubmit: función que maneja guardar/editar producto
// initialValues: valores iniciales si se va a editar
const InventoryForm = ({ onSubmit, initialValues, onClose }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    getValues,
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
  })

  // Estado para modal de alertas
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMsg, setModalMsg] = useState('')
  const [modalType, setModalType] = useState('success')

  // Estado para tags dinámicos
  const [tags, setTags] = useState(initialValues?.tags || [])

  // Estado para loading de imagen
  const [uploading, setUploading] = useState(false)

  // Resetea el formulario si cambian los valores iniciales
  useEffect(() => {
    reset(initialValues)
    setTags(initialValues?.tags || [])
  }, [initialValues, reset])

  // Función para subir imagen a Cloudinary
  const handleUpload = async (file) => {
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

      const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: 'POST', body: formData })
      const json = await res.json()
      if (json.secure_url) {
        setValue('imagen_url', json.secure_url)
        setModalMsg('Imagen subida correctamente.')
        setModalType('success')
        setModalOpen(true)
      }
    } catch {
      setModalMsg('Error al subir la imagen.')
      setModalType('error')
      setModalOpen(true)
    } finally {
      setUploading(false)
    }
  }

  // Función que maneja submit del formulario
  const submitHandler = (data) => {
    data.tags = tags // agregamos los tags dinámicos
    onSubmit(data) // enviamos datos al componente padre
    setModalMsg('Producto guardado correctamente.')
    setModalType('success')
    setModalOpen(true)
    reset() // resetea formulario después de guardar
    setTags([]) // resetea tags
    if (onClose) onClose() // cierra modal si viene de uno
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      {/* Nombre del producto */}
      <CFormLabel>Nombre</CFormLabel>
      <CFormInput {...register('nombre')} />
      {errors.nombre && <p className="text-danger">{errors.nombre.message}</p>}

      {/* Tipo de producto */}
      <CFormLabel>Tipo</CFormLabel>
      <CFormSelect {...register('tipo')}>
        <option>Medicina</option>
        <option>Vacuna</option>
        <option>Accesorio</option>
        <option>Alimento</option>
        <option>Otro</option>
      </CFormSelect>

      {/* Cantidad */}
      <CFormLabel>Cantidad</CFormLabel>
      <CFormInput
        type="number"
        {...register('cantidad', { valueAsNumber: true })} // <-- CORRECCIÓN: convierte a número
      />
      {errors.cantidad && <p className="text-danger">{errors.cantidad.message}</p>}

      {/* Precio unitario */}
      <CFormLabel>Precio unitario</CFormLabel>
      <CFormInput
        type="number"
        step="0.01"
        {...register('precio_unitario', { valueAsNumber: true })} // <-- CORRECCIÓN: convierte a número
      />
      {errors.precio_unitario && <p className="text-danger">{errors.precio_unitario.message}</p>}

      {/* Estado del producto */}
      <CFormLabel>Estado</CFormLabel>
      <CFormSelect {...register('estado')}>
        <option>Disponible</option>
        <option>Agotado</option>
        <option>Descontinuado</option>
      </CFormSelect>

      {/* Instrucciones */}
      <CFormLabel>Instrucciones</CFormLabel>
      <CFormTextarea {...register('instrucciones')} />

      {/* Imagen */}
      <CFormLabel>Imagen</CFormLabel>
      <CFormInput
        type="file"
        onChange={(e) => handleUpload(e.target.files?.[0])}
      />
      {getValues('imagen_url') && (
        <img
          src={getValues('imagen_url')}
          alt="Preview"
          style={{ width: '100px', marginTop: '5px' }}
        />
      )}

      {/* Tags */}
      <CFormLabel>Tags</CFormLabel>
      <TagInput tags={tags} setTags={setTags} />

      {/* Botón de guardar */}
      <CButton type="submit" color="primary" className="mt-2" disabled={uploading}>
        {uploading ? 'Subiendo...' : 'Guardar Producto'}
      </CButton>

      {/* Modal de alertas */}
      <AlertModal
        isOpen={modalOpen}
        message={modalMsg}
        type={modalType}
        onClose={() => setModalOpen(false)}
      />
    </form>
  )
}

export default InventoryForm
