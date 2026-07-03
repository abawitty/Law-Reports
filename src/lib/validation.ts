import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().trim().email("Enter a valid email address"),
    surname: z.string().trim().min(1, "Enter your surname"),
    firstName: z.string().trim().min(1, "Enter your first name"),
    dateOfBirth: z.string().trim().min(1, "Enter your date of birth"),
    sex: z.enum(["Male", "Female"], { message: "Select your sex" }),
    occupation: z.string().trim().min(1, "Enter your occupation"),
    faculty: z.string().trim().min(1, "Enter your faculty"),
    program: z.string().trim().min(1, "Enter your programme"),
    level: z.string().trim().min(1, "Select your level"),
    studentId: z.string().trim().min(3, "Enter your student ID"),
    constituency: z.string().trim().min(1, "Enter your constituency of residence"),
    hasVotersId: z.enum(["Yes", "No"], { message: "Select an option" }),
    phone: z.string().trim().min(1, "Enter your phone number"),
    whatsapp: z.string().trim().min(1, "Enter your WhatsApp number"),
    signature: z.string().trim().min(1, "Enter your initials"),
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

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export const completeProfileSchema = z.object({
  surname: z.string().trim().min(1, "Enter your surname"),
  firstName: z.string().trim().min(1, "Enter your first name"),
  dateOfBirth: z.string().trim().min(1, "Enter your date of birth"),
  sex: z.enum(["Male", "Female"], { message: "Select your sex" }),
  occupation: z.string().trim().min(1, "Enter your occupation"),
  faculty: z.string().trim().min(1, "Enter your faculty"),
  program: z.string().trim().min(1, "Enter your programme"),
  level: z.string().trim().min(1, "Select your level"),
  constituency: z.string().trim().min(1, "Enter your constituency of residence"),
  hasVotersId: z.enum(["Yes", "No"], { message: "Select an option" }),
  phone: z.string().trim().min(1, "Enter your phone number"),
  whatsapp: z.string().trim().min(1, "Enter your WhatsApp number"),
  signature: z.string().trim().min(1, "Enter your initials"),
});

export const profileUpdateSchema = z.object({
  fullName: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().optional().or(z.literal("")),
  program: z.string().trim().optional().or(z.literal("")),
  level: z.string().trim().optional().or(z.literal("")),
  hasGhanaCard: z.boolean().optional(),
});
