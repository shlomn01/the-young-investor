import type { StockName } from '../../config/constants';

// Predetermined price trajectories for each trading round
// These are educational - designed to teach specific lessons, not random

export interface StockRoundData {
  available: StockName[];
  canSell: boolean;
  prices: Record<string, number[]>;
  news: Record<string, { he: string; en: string }>;
}

export const STOCK_ROUNDS: Record<number, StockRoundData> = {
  // Round 1: Introduction to buying stocks
  // Solar goes up steadily (good first buy), Koogle is volatile
  1: {
    available: ['solar', 'koogle'],
    canSell: false,
    prices: {
      solar: [100, 102, 105, 108, 110, 112, 115, 118, 120, 125, 128, 130],
      koogle: [50, 48, 52, 55, 53, 58, 55, 60, 62, 58, 65, 63],
    },
    news: {
      solar: {
        he: 'חברת סולאר מדווחת על עלייה של 20% במכירות הפאנלים הסולאריים ברבעון האחרון. המומחים צופים המשך צמיחה.',
        en: 'Solar Inc. reports a 20% increase in solar panel sales last quarter. Experts predict continued growth.',
      },
      koogle: {
        he: 'קוגל משיקה מנוע חיפוש חדש. התוצאות הראשוניות מעורבות - חלק מהמשתמשים מרוצים, אחרים פחות.',
        en: 'Koogle launches a new search engine. Initial results are mixed - some users happy, others less so.',
      },
    },
  },

  // Round 2: Learning to sell + diversification
  // Solar continues up, Koogle recovers, Sesla is a lesson in volatility
  2: {
    available: ['solar', 'koogle', 'sesla'],
    canSell: true,
    prices: {
      solar: [130, 128, 135, 140, 138, 145, 148, 150, 155, 152, 158, 160],
      koogle: [63, 60, 58, 65, 70, 68, 75, 78, 80, 82, 85, 88],
      sesla: [75, 80, 85, 78, 72, 68, 75, 82, 88, 90, 95, 92],
    },
    news: {
      solar: {
        he: 'סולאר חתמה על עסקה גדולה עם ממשלת ישראל להתקנת פאנלים סולאריים על גגות בתי ספר.',
        en: 'Solar signed a major deal with the Israeli government to install solar panels on school rooftops.',
      },
      koogle: {
        he: 'קוגל רוכשת חברת סטארט-אפ בתחום הבינה המלאכותית. ההשקעה צפויה להניב פירות בעתיד.',
        en: 'Koogle acquires an AI startup. The investment is expected to bear fruit in the future.',
      },
      sesla: {
        he: 'ססלה, חברת הרכב החשמלי, חוותה ירידות חדות אחרי ריקול של דגם פופולרי. האם תתאושש?',
        en: 'Sesla, the electric car company, experienced sharp drops after a recall of a popular model. Will it recover?',
      },
    },
  },

  // Round 3: Full trading with all 4 stocks + limit orders concept
  // Mixed results - teaches that not everything goes up
  3: {
    available: ['solar', 'koogle', 'sesla', 'lemon'],
    canSell: true,
    prices: {
      solar: [160, 165, 170, 168, 175, 180, 178, 185, 190, 188, 195, 200],
      koogle: [88, 90, 95, 92, 98, 100, 105, 102, 108, 110, 105, 112],
      sesla: [92, 95, 98, 100, 105, 102, 108, 112, 108, 115, 118, 120],
      lemon: [200, 195, 190, 185, 192, 198, 205, 210, 215, 220, 225, 230],
    },
    news: {
      solar: {
        he: 'סולאר מכריזה על טכנולוגיה חדשנית שמגדילה את יעילות הפאנלים ב-30%. המניה ממשיכה לטפס!',
        en: 'Solar announces innovative technology that increases panel efficiency by 30%. Stock continues climbing!',
      },
      koogle: {
        he: 'קוגל מציגה תוצאות רבעון חזקות. ההכנסות מפרסום עלו ב-15%.',
        en: 'Koogle posts strong quarterly results. Ad revenue up 15%.',
      },
      sesla: {
        he: 'ססלה משיקה דגם חדש וזול יותר. ההזמנות המוקדמות מפתיעות לטובה.',
        en: 'Sesla launches a new, more affordable model. Pre-orders are surprisingly strong.',
      },
      lemon: {
        he: 'חברת לימון, יצרנית הסמארטפונים, חוותה ירידה במכירות. אבל השקת מוצר חדש בדרך!',
        en: 'Lemon, the smartphone maker, saw a sales dip. But a new product launch is coming!',
      },
    },
  },
};
