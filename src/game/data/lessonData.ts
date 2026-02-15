// School lesson content - organized by lesson ID

export interface LessonSlide {
  title: { he: string; en: string };
  content: { he: string; en: string };
  illustration?: string; // Future: reference to illustration asset
}

export const LESSONS: Record<number, LessonSlide[]> = {
  // Lesson 1: What are stocks?
  1: [
    {
      title: { he: 'מה זה מניה?', en: 'What is a Stock?' },
      content: {
        he: 'מניה היא חלק קטן מחברה.\nכשאתה קונה מניה, אתה נהיה שותף קטן בחברה!\nאם החברה מרוויחה - גם אתה מרוויח.',
        en: 'A stock is a small piece of a company.\nWhen you buy a stock, you become a small partner!\nIf the company profits - you profit too.',
      },
    },
    {
      title: { he: 'חברות ציבוריות', en: 'Public Companies' },
      content: {
        he: 'חברה ציבורית היא חברה שכל אחד יכול לקנות ממנה מניות בבורסה.\nחברות כמו טבע, בנק לאומי, ועוד - הן חברות ציבוריות.',
        en: 'A public company is one where anyone can buy its shares on the stock exchange.\nCompanies like Apple, Google - these are public companies.',
      },
    },
    {
      title: { he: 'למה מחיר מניה משתנה?', en: 'Why Do Stock Prices Change?' },
      content: {
        he: 'כשהרבה אנשים רוצים לקנות מניה - המחיר עולה.\nכשהרבה אנשים רוצים למכור - המחיר יורד.\nזה חוק ההיצע והביקוש!',
        en: 'When many people want to buy a stock - the price goes up.\nWhen many people want to sell - the price goes down.\nThis is the law of supply and demand!',
      },
    },
    {
      title: { he: 'הבורסה', en: 'The Stock Exchange' },
      content: {
        he: 'הבורסה היא שוק שבו קונים ומוכרים מניות.\nזה כמו שוק, אבל במקום ירקות - מוכרים חלקים בחברות!\nבישראל יש את הבורסה לניירות ערך בתל אביב.',
        en: 'The stock exchange is a market for buying and selling stocks.\nIt\'s like a market, but instead of vegetables - they sell parts of companies!\nIn Israel, there\'s the Tel Aviv Stock Exchange.',
      },
    },
  ],

  // Lesson 2: Percentages and stocks
  2: [
    {
      title: { he: 'אחוזים ומניות', en: 'Percentages & Stocks' },
      content: {
        he: 'אחוזים חשובים מאוד בעולם ההשקעות.\nכשמניה עולה ב-10%, זה אומר שהמחיר שלה גדל ב-10 חלקים מתוך 100.',
        en: 'Percentages are very important in investing.\nWhen a stock goes up 10%, it means its price grew by 10 parts out of 100.',
      },
    },
    {
      title: { he: 'הפתעה! 50% למעלה ≠ 50% למטה', en: 'Surprise! 50% Up ≠ 50% Down' },
      content: {
        he: 'אם מניה ב-100₪ עולה 50% = 150₪ ✓\nעכשיו 150₪ יורדת 50% = 75₪! 😱\nהפסדת 25₪! איך זה יכול להיות?',
        en: 'A stock at ₪100 goes up 50% = ₪150 ✓\nNow ₪150 drops 50% = ₪75! 😱\nYou lost ₪25! How is that possible?',
      },
    },
    {
      title: { he: 'הסבר', en: 'Explanation' },
      content: {
        he: 'הסיבה: 50% מ-150 זה 75, לא 50!\nה-50% חושב מהמספר החדש, לא מהמקורי.\nלכן ירידה דורשת עלייה גדולה יותר כדי לחזור.',
        en: 'The reason: 50% of 150 is 75, not 50!\nThe 50% is calculated from the new number, not the original.\nSo a drop requires a bigger rise to recover.',
      },
    },
    {
      title: { he: 'הכלל החשוב', en: 'The Important Rule' },
      content: {
        he: 'ירידה של 50% דורשת עלייה של 100% כדי לחזור!\nירידה של 20% דורשת עלייה של 25%.\nלכן - אל תיבהל כשהשוק יורד. סבלנות היא המפתח!',
        en: 'A 50% drop needs a 100% rise to recover!\nA 20% drop needs a 25% rise.\nSo - don\'t panic when the market drops. Patience is key!',
      },
    },
  ],

  // Lesson 3: Warren Buffett and compound interest
  3: [
    {
      title: { he: 'וורן באפט', en: 'Warren Buffett' },
      content: {
        he: 'וורן באפט הוא אחד המשקיעים הגדולים בהיסטוריה.\nהוא התחיל להשקיע כבר בגיל 11!\nהיום הוא אחד האנשים העשירים בעולם.',
        en: 'Warren Buffett is one of the greatest investors in history.\nHe started investing at age 11!\nToday he is one of the richest people in the world.',
      },
    },
    {
      title: { he: 'ריבית דריבית', en: 'Compound Interest' },
      content: {
        he: 'ריבית דריבית היא כמו כדור שלג:\nהכסף שלך מרוויח כסף ←\nהרווח מרוויח עוד רווח ←\nוככה זה גדל ויותר מהר!',
        en: 'Compound interest is like a snowball:\nYour money earns money ←\nThe earnings earn more earnings ←\nAnd it grows faster and faster!',
      },
    },
    {
      title: { he: 'דוגמה', en: 'Example' },
      content: {
        he: 'אם יש לך 1,000₪ ומרוויח 10% בשנה:\nאחרי שנה: 1,100₪\nאחרי שנתיים: 1,210₪\nאחרי 10 שנים: 2,594₪!\nאחרי 30 שנה: 17,449₪! 🤯',
        en: 'If you have ₪1,000 and earn 10% per year:\nAfter 1 year: ₪1,100\nAfter 2 years: ₪1,210\nAfter 10 years: ₪2,594!\nAfter 30 years: ₪17,449! 🤯',
      },
    },
    {
      title: { he: 'עצות באפט', en: 'Buffett\'s Tips' },
      content: {
        he: '1. "אל תשים את כל הביצים בסל אחד" - פזר השקעות\n2. "היה פחדן כשאחרים חמדנים" - אל תרוץ עם העדר\n3. "השקע לטווח ארוך" - סבלנות משתלמת\n4. "השקע רק במה שאתה מבין"',
        en: '1. "Don\'t put all eggs in one basket" - diversify\n2. "Be fearful when others are greedy" - don\'t follow the herd\n3. "Invest for the long term" - patience pays\n4. "Only invest in what you understand"',
      },
    },
  ],
};
