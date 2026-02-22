import * as z from 'zod'

export const usernameSchema = z
  .string()
  .min(2, 'Must be at least 2 characters')
  .max(30, 'Must be at most 30 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers, and underscores only')
