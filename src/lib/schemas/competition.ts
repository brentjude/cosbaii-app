import { z } from "zod";

export const createCompetitionSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(200, "Name must be less than 200 characters"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .nullable()
    .optional(),
  eventDate: z
    .string()
    .refine((date) => !isNaN(new Date(date).getTime()), "Event date must be a valid date"),
  location: z
    .string()
    .max(200, "Location must be less than 200 characters")
    .nullable()
    .optional(),
  organizer: z
    .string()
    .max(200, "Organizer must be less than 200 characters")
    .nullable()
    .optional(),
  competitionType: z.enum(["GENERAL", "ARMOR", "CLOTH", "SINGING"]),
  rivalryType: z.enum(["SOLO", "DUO", "GROUP"]),
  level: z.enum(["BARANGAY", "LOCAL", "REGIONAL", "NATIONAL", "WORLDWIDE"]),
  logoUrl: z.string().url().nullable().optional(),
  eventUrl: z.string().url().nullable().optional(),
  facebookUrl: z.string().url().nullable().optional(),
  instagramUrl: z.string().url().nullable().optional(),
  referenceLinks: z.string().nullable().optional(),
});

export const updateCompetitionSchema = createCompetitionSchema.partial();

// Export types
export type CreateCompetitionData = z.infer<typeof createCompetitionSchema>;
export type UpdateCompetitionData = z.infer<typeof updateCompetitionSchema>;