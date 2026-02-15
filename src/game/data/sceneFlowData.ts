// Scene transition graph - defines the complete game flow
// Each entry maps a scene key to its next destinations based on conditions

export interface SceneTransition {
  target: string;
  data?: Record<string, unknown>;
  condition?: string; // Condition key checked against game state
}

export interface SceneFlowNode {
  key: string;
  displayName: { he: string; en: string };
  next: SceneTransition[];
  back?: SceneTransition;
}

// The complete game flow sequence
export const GAME_FLOW: SceneFlowNode[] = [
  {
    key: 'Street-0',
    displayName: { he: 'רחוב 0 - הבית', en: 'Street 0 - Home' },
    next: [
      { target: 'LivingRoom', data: { variant: 1 } },
      { target: 'Street', data: { streetIndex: 1 } },
    ],
  },
  {
    key: 'Street-1',
    displayName: { he: 'רחוב 1 - בית ספר', en: 'Street 1 - School' },
    next: [
      { target: 'School', data: { lessonId: 1 } },
      { target: 'Street', data: { streetIndex: 2 } },
    ],
    back: { target: 'Street', data: { streetIndex: 0 } },
  },
  {
    key: 'Street-2',
    displayName: { he: 'רחוב 2 - בנק', en: 'Street 2 - Bank' },
    next: [
      { target: 'Bank', data: { variant: 1 } },
      { target: 'Street', data: { streetIndex: 3 } },
    ],
    back: { target: 'Street', data: { streetIndex: 1 } },
  },
  {
    key: 'Street-3',
    displayName: { he: 'רחוב 3 - ספרייה', en: 'Street 3 - Library' },
    next: [
      { target: 'Library', data: { variant: 1 } },
      { target: 'Street', data: { streetIndex: 4 } },
    ],
    back: { target: 'Street', data: { streetIndex: 2 } },
  },
  {
    key: 'Street-4',
    displayName: { he: 'רחוב 4 - בורסה 1', en: 'Street 4 - Exchange 1' },
    next: [
      { target: 'Trade', data: { round: 1 } },
      { target: 'Street', data: { streetIndex: 5 } },
    ],
    back: { target: 'Street', data: { streetIndex: 3 } },
  },
  {
    key: 'Street-5',
    displayName: { he: 'רחוב 5 - בית ספר 2', en: 'Street 5 - School 2' },
    next: [
      { target: 'School', data: { lessonId: 2 } },
      { target: 'Street', data: { streetIndex: 6 } },
    ],
    back: { target: 'Street', data: { streetIndex: 4 } },
  },
  {
    key: 'Street-6',
    displayName: { he: 'רחוב 6 - ספרייה + בורסה 2', en: 'Street 6 - Library + Exchange 2' },
    next: [
      { target: 'Library', data: { variant: 2 } },
      { target: 'Trade', data: { round: 2 } },
      { target: 'Street', data: { streetIndex: 7 } },
    ],
    back: { target: 'Street', data: { streetIndex: 5 } },
  },
  {
    key: 'Street-7',
    displayName: { he: 'רחוב 7 - מלון', en: 'Street 7 - Hotel' },
    next: [
      { target: 'Hotel' },
      { target: 'Street', data: { streetIndex: 8 } },
    ],
    back: { target: 'Street', data: { streetIndex: 6 } },
  },
  {
    key: 'Street-8',
    displayName: { he: 'רחוב 8 - בר מצווה + חנות + בורסה 3', en: 'Street 8 - Bar Mitzvah + Shop + Exchange 3' },
    next: [
      { target: 'BarMitzvah' },
      { target: 'ComputerShop' },
      { target: 'Trade', data: { round: 3 } },
    ],
    back: { target: 'Street', data: { streetIndex: 7 } },
  },
];

// Linear progression order for guided gameplay
export const LINEAR_FLOW = [
  { scene: 'Street', data: { streetIndex: 0 } },
  { scene: 'LivingRoom', data: { variant: 1 } },
  { scene: 'Street', data: { streetIndex: 1 } },
  { scene: 'School', data: { lessonId: 1 } },
  { scene: 'Street', data: { streetIndex: 2 } },
  { scene: 'Bank', data: { variant: 1 } },
  { scene: 'Street', data: { streetIndex: 3 } },
  { scene: 'Library', data: { variant: 1 } },
  { scene: 'Street', data: { streetIndex: 4 } },
  { scene: 'Trade', data: { round: 1 } },
  { scene: 'Waiting', data: { round: 1 } },
  { scene: 'Street', data: { streetIndex: 5 } },
  { scene: 'School', data: { lessonId: 2 } },
  { scene: 'PercentsGame' },
  { scene: 'Street', data: { streetIndex: 6 } },
  { scene: 'Library', data: { variant: 2 } },
  { scene: 'Trade', data: { round: 2 } },
  { scene: 'Waiting', data: { round: 2 } },
  { scene: 'Street', data: { streetIndex: 7 } },
  { scene: 'Hotel' },
  { scene: 'HotelRoom' },
  { scene: 'Guru' },
  { scene: 'School', data: { lessonId: 3 } },
  { scene: 'StockQuizGame' },
  { scene: 'Street', data: { streetIndex: 8 } },
  { scene: 'BarMitzvah' },
  { scene: 'ComputerShop' },
  { scene: 'Trade', data: { round: 3 } },
  { scene: 'AsteroidsGame' },
  { scene: 'Instructions', data: { gameId: 'tradingSim' } },
  { scene: 'TradingSimGame' },
  { scene: 'Credits' },
];
