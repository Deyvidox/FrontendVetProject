// AppointmentSchema.js
import { z } from 'zod';

// Esquema de validación para los datos de una cita (igual al que enviaste)
export const appointmentSchema = z.object({
  mascota_id: z
    .union([z.string(), z.number()])
    .transform((v) => Number(v))
    .refine((v) => Number.isInteger(v) && v > 0, { message: 'Mascota requerida' }),

  veterinario_id: z
    .union([z.string(), z.number()])
    .transform((v) => Number(v))
    .refine((v) => Number.isInteger(v) && v > 0, { message: 'Veterinario requerido' }),

  fecha_cita: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Fecha inválida' })
    .refine((val) => new Date(val) > new Date(), { message: 'No puedes agendar en el pasado' }),

  estado: z.enum(['Pendiente', 'Confirmada', 'Cancelada', 'Completada']),

  notas: z.string().optional(),

  evidencia_url: z.string().url().optional().or(z.literal('')),
})
.superRefine((data, ctx) => {
  if (data.estado === 'Cancelada') {
    const notas = (data.notas || '').trim();
    if (notas.length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['notas'],
        message: 'Notas requeridas si cancelas (mínimo 5 caracteres).',
      });
    }
  }
});

// Exportar un objeto con valores por defecto que usaremos en el formulario
export const defaultAppointmentValues = {
  mascota_id: '',
  veterinario_id: '',
  fecha_cita: '',
  estado: 'Pendiente',
  notas: '',
  evidencia_url: '',
};
