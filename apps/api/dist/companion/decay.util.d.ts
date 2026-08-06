import { Companion } from '@prisma/client';
export interface VitalsUpdate {
    hunger: number;
    energy: number;
    health: number;
    mood: string;
    description: string;
    lastTickedAt: Date;
}
export declare function calculateDecay(companion: Companion, now?: Date): VitalsUpdate | null;
