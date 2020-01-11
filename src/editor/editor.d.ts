import { ZeldaGame } from '@/ZeldaGame';
import { Screen } from '@/Screen';

export interface EditorState {
    game: ZeldaGame;
    currentScreen: Screen;
    currentScreenRow: number;
    currentScreenCol: number;
    lastModified: number;
}
