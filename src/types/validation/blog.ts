// Create: src/types/validation/blog.ts
import { z } from "zod";

export const createBlogSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().max(500).optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase with hyphens"
    ),
  featuredImage: z.string().url().optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
  metaDescription: z.string().max(160).optional(),
  metaKeywords: z.string().optional(),
  published: z.boolean().optional().default(false),
});

export const updateBlogSchema = createBlogSchema.partial();

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment must be less than 1000 characters"),
  parentId: z.number().optional().nullable(),
});

export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment must be less than 1000 characters"),
});

export const blogQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  category: z.string().optional(),
  tags: z.string().optional(),
  authorId: z.coerce.number().optional(),
  published: z.coerce.boolean().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "title", "likes"]).optional(),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type BlogQueryInput = z.infer<typeof blogQuerySchema>;