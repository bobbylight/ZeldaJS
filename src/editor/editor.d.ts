import { ZeldaGame } from '@/ZeldaGame';
import { Screen } from '@/Screen';

export interface EditorState {
    game: ZeldaGame;
    currentScreen: Screen | null;
    currentScreenRow: number;
    currentScreenCol: number;
    lastModified: number;
}
