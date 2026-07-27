import { z } from 'zod';

export const clientSchema = z.object({
  client_code: z.string().min(1, 'Client code is required'),
  client_name: z.string().min(1, 'Client name is required'),
  client_type: z.enum(['Individual', 'Company']),
  company_name: z.string().optional(),
  mobile: z.string().min(1, 'Mobile number is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  gst_number: z.string().optional(),
  status: z.enum(['Lead', 'Quotation', 'Running', 'Completed']).default('Lead'),
  remarks: z.string().optional(),
});

export const clientUpdateSchema = clientSchema.extend({
  id: z.number().optional(),
});
