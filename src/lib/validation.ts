import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name"),
    studentId: z.string().trim().min(3, "Enter your student ID"),
    email: z.string().trim().email("Enter a valid email address"),
    phone: z.string().trim().optional().or(z.literal("")),
    program: z.string().trim().optional().or(z.literal("")),
    level: z.string().trim().optional().or(z.literal("")),
    hasGhanaCard: z.boolean().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const requestSchema = z.object({
  type: z.enum(["QUERY", "SUGGESTION", "REQUEST"]),
  subject: z.string().trim().min(3, "Enter a subject"),
  message: z.string().trim().min(10, "Please provide more detail (10+ characters)"),
});

export const profileUpdateSchema = z.object({
  fullName: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().optional().or(z.literal("")),
  program: z.string().trim().optional().or(z.literal("")),
  level: z.string().trim().optional().or(z.literal("")),
  hasGhanaCard: z.boolean().optional(),
});
