import { renderAnimatedCard } from './animated';
export { renderAnimatedCard };
export declare class CardRendererService {
    compileCard(name: string, species: string, evolution: number, weapon?: string): Promise<Buffer>;
    compileAnimatedCard(name: string, species: string, evolution: number, weapon?: string, health?: number, energy?: number, hunger?: number): Promise<Buffer>;
}
