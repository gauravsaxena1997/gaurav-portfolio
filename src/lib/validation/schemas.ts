import { z } from 'zod';
import {
    EMAIL_REGEX,
    MAX_MESSAGE_LENGTH,
    MIN_MESSAGE_LENGTH,
    MAX_NAME_LENGTH,
    MIN_NAME_LENGTH,
    MAX_SUBJECT_LENGTH
} from './constants';

export const contactFormSchema = z.object({
    name: z.string()
        .min(MIN_NAME_LENGTH, { message: `Name must be at least ${MIN_NAME_LENGTH} characters` })
        .max(MAX_NAME_LENGTH, { message: `Name cannot exceed ${MAX_NAME_LENGTH} characters` })
        .trim(),

    email: z.string()
        .email({ message: 'Invalid email address' })
        .regex(EMAIL_REGEX, { message: 'Invalid email format' })
        .trim()
        .toLowerCase(),

    subject: z.string()
        .max(MAX_SUBJECT_LENGTH, { message: `Subject cannot exceed ${MAX_SUBJECT_LENGTH} characters` })
        .optional()
        .or(z.literal('')),

    message: z.string()
        .min(MIN_MESSAGE_LENGTH, { message: `Message must be at least ${MIN_MESSAGE_LENGTH} characters` })
        .max(MAX_MESSAGE_LENGTH, { message: `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters` })
        .trim(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
