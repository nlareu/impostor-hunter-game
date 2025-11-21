export enum GameStage {
  SETUP = 'SETUP',
  FETCHING = 'FETCHING',
  PASS_DEVICE = 'PASS_DEVICE',
  REVEAL_ROLE = 'REVEAL_ROLE',
  GAME_START = 'GAME_START',
  ERROR = 'ERROR'
}

export interface WordData {
  word: string;
  category: string;
}

export interface Player {
  id: number;
  isImpostor: boolean;
  hasSeenRole: boolean;
}

export interface GameState {
  stage: GameStage;
  playerCount: number;
  players: Player[];
  currentPlayerIndex: number;
  secretWord: WordData | null;
  error: string | null;
}