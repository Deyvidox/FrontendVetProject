import { z } from 'zod';

// Esquema de validación para los datos de una cita
export const appointmentSchema = z.object({
  // Validación del ID de la mascota
  // Acepta string o número, lo convierte a número y valida que sea un entero positivo
  mascota_id: z
    .union([z.string(), z.number()])
    .transform((v) => Number(v))
    .refine((v) => Number.isInteger(v) && v > 0, { message: 'Mascota requerida' }),

  // Validación del ID del veterinario
  // Acepta string o número, lo convierte a número y valida que sea un entero positivo
  veterinario_id: z
    .union([z.string(), z.number()])
    .transform((v) => Number(v))
    .refine((v) => Number.isInteger(v) && v > 0, { message: 'Veterinario requerido' }),

  // Validación de la fecha de la cita
  // Primero verifica que sea una fecha válida y luego que sea futura
  fecha_cita: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Fecha inválida' })
    .refine((val) => new Date(val) > new Date(), { message: 'No puedes agendar en el pasado' }),

  // Estado de la cita: Pendiente, Confirmada, Cancelada o Completada
  estado: z.enum(['Pendiente', 'Confirmada', 'Cancelada', 'Completada']),

  // Notas opcionales
  notas: z.string().optional(),

  // URL de evidencia opcional; puede ser vacía
  evidencia_url: z.string().url().optional().or(z.literal('')),
})
.superRefine((data, ctx) => {
  // Validación adicional: si el estado es 'Cancelada', las notas deben tener mínimo 5 caracteres
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
