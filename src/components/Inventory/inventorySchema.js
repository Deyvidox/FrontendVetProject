import { z } from 'zod';

export const inventorySchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  type: z.enum(['Medicine', 'Vaccine', 'Accessory', 'Food', 'Other'], {
    errorMap: () => ({ message: "Seleccione una categoría válida" })
  }),
  instructions: z.string().optional().nullable(),
  quantity: z.coerce.number().min(0, 'La cantidad no puede ser negativa'),
  unit_price: z.coerce.number().min(0, 'El precio no puede ser negativo'),
  status: z.enum(['Available', 'Out of Stock', 'Discontinued'], {
    errorMap: () => ({ message: "Seleccione un estado válido" })
  }),
});