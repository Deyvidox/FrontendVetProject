// inventorySchema.js
import { z } from 'zod';

// Esquema de validación para inventario
export const inventorySchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  tipo: z.enum(['Medicina', 'Vacuna', 'Accesorio', 'Alimento', 'Otro']),
  instrucciones: z.string().optional(),
  cantidad: z
    .number({ invalid_type_error: 'La cantidad debe ser un número' })
    .min(0, 'La cantidad no puede ser negativa'),
  precio_unitario: z
    .number({ invalid_type_error: 'El precio debe ser un número' })
    .min(0, 'El precio no puede ser negativo'),
  estado: z.enum(['Disponible', 'Agotado', 'Descontinuado']),
  tags: z.array(z.string()).optional(),
  // Permite URL válida o cadena vacía
  imagen_url: z.string().url({ message: 'Debe ser una URL válida' }).or(z.literal('')).optional(),
});
