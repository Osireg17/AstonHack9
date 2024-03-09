import { z } from "zod";

export const createChaptersSchema = z.object({
    title: z.string().min(1, "Title is required"),
    units: z.array(z.string().min(1, "Unit cannot be empty")),
    educationLevel: z.enum(["gcse", "alevel", "undergraduate"]),
});