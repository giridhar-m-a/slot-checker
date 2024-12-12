import * as z from "zod";

const dateRangeSchema = z
  .object({
    start: z.date({
      message: "Start date is required.",
    }),
    end: z.date({
      message: "end date is required",
    }),
  })
  .refine((dateRange) => dateRange.start < dateRange.end, {
    message: "End date must be after start date.",
    path: ["end"],
  })
  .refine((dateRange) => dateRange.start > new Date(), {
    message: "Start date must be in the future.",
    path: ["start"],
  });

export const AvailabilityFormSchema = z.object({
  participants: z
    .array(z.coerce.number().min(0))
    .min(1, "At least one participant is required."),
  date_range: dateRangeSchema,
});

export type AvailabilityFormInput = z.infer<typeof AvailabilityFormSchema>;
