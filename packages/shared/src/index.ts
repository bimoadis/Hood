import { z } from 'zod';

export const CompanionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  name: z.string(),
  species: z.string(),
  personality: z.string(),
  evolutionLvl: z.number().default(1),
  level: z.number().default(1),
  xp: z.number().default(0),
  mood: z.string().default('Happy'),
  energy: z.number().default(100),
  health: z.number().default(100),
  hunger: z.number().default(0),
  happiness: z.number().default(50),
  strength: z.number().default(10),
  intelligence: z.number().default(10),
  luck: z.number().default(10),
  friendship: z.number().default(0),
});

export type Companion = z.infer<typeof CompanionSchema>;

export * from './roles';
