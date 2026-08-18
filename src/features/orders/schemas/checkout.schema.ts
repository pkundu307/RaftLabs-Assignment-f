import { z } from "zod";

export const checkoutSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  address: z.string().trim().min(1, "Address is required"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s()-]{7,20}$/, "Enter a valid phone number"),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
