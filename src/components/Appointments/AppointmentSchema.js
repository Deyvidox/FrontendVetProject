import { z } from 'zod';

export const appointmentSchema = z.object({
  pet_id: z
    .union([z.string(), z.number()])
    .transform((v) => Number(v))
    .refine((v) => v > 0, { message: 'Mascota es requerida' }),
  
  status: z.enum(['Pending', 'Scheduled', 'Completed', 'Cancelled']),
  
  appointment_date: z.string().min(1, "La fecha es requerida"),
  
  appointment_time: z.string().min(1, "La hora es requerida"),
  
  service_type: z.string().min(1, "El tipo de servicio es requerido"),
  
  notes: z.string().max(1000, "Máximo 1000 caracteres").optional().or(z.literal('')),
});

export const defaultAppointmentValues = {
  pet_id: '',
  status: 'Pending',
  appointment_date: new Date().toISOString().split('T')[0],
  appointment_time: '08:00',
  service_type: 'Consulta General',
  notes: '',
};