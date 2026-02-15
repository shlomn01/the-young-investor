// Quiz questions for mini-games
// Based on original GDevelop game data

export interface QuizQuestion {
  question: { he: string; en: string };
  optionA: { he: string; en: string };
  optionB: { he: string; en: string };
  correctIsB: boolean; // true = B is correct, false = A is correct
  feedbackCorrect: { he: string; en: string };
  feedbackWrong: { he: string; en: string };
}

// Original Game1-percents quiz (6 questions about percentage math)
export const PERCENT_QUESTIONS: QuizQuestion[] = [
  {
    question: {
      he: 'המניות בשווי 100$, פגע במניה שעשתה את השינוי הגדול ביותר',
      en: 'Stocks worth $100 - hit the stock that made the biggest change',
    },
    optionA: { he: 'ירידה של 20%', en: 'Down 20%' },
    optionB: { he: 'עלייה של 24%', en: 'Up 24%' },
    correctIsB: true,
    feedbackCorrect: { he: 'יפה, 24$>20$', en: 'Nice, $24>$20' },
    feedbackWrong: { he: 'לא מדוייק, 20$<24$', en: 'Not accurate, $20<$24' },
  },
  {
    question: {
      he: 'ירידה של 20%, פגע במניה שעשתה את השינוי הגדול ביותר',
      en: 'A 20% drop - hit the stock that made the biggest change',
    },
    optionA: { he: 'מנייה של 100$', en: 'Stock worth $100' },
    optionB: { he: 'מנייה של 120$', en: 'Stock worth $120' },
    correctIsB: true,
    feedbackCorrect: { he: 'יפה, 24$>20$', en: 'Nice, $24>$20' },
    feedbackWrong: { he: 'לא מדוייק, 20$<24$', en: 'Not accurate, $20<$24' },
  },
  {
    question: {
      he: 'מניה שירדה ב80% ואז ירדה בעוד 50% ירדה בסה"כ',
      en: 'A stock that dropped 80% then dropped another 50% dropped in total',
    },
    optionA: { he: 'ב90%', en: 'By 90%' },
    optionB: { he: 'ב130%', en: 'By 130%' },
    correctIsB: false,
    feedbackCorrect: { he: 'יפה, ירידה מקסימלית היא 100%', en: 'Nice, maximum drop is 100%' },
    feedbackWrong: { he: 'טעות, ירידה מקסימלית היא 100%', en: 'Wrong, maximum drop is 100%' },
  },
  {
    question: {
      he: 'מניה יכולה לרדת ולעלות ביותר מ100%',
      en: 'A stock can drop and rise by more than 100%',
    },
    optionA: { he: 'רק לעלות', en: 'Only rise' },
    optionB: { he: 'רק לרדת', en: 'Only drop' },
    correctIsB: false,
    feedbackCorrect: { he: 'יפה, רק העלייה אינסופית, ירידה עד 100%', en: 'Nice, only the rise is infinite, drop up to 100%' },
    feedbackWrong: { he: 'לא, רק העלייה אינסופית, ירידה עד 100%', en: 'No, only the rise is infinite, drop up to 100%' },
  },
  {
    question: {
      he: 'מנייה שעלתה ב50% ואז בעוד 50% עלתה בסה"כ',
      en: 'A stock that went up 50% then up another 50% went up in total',
    },
    optionA: { he: 'ב100%', en: 'By 100%' },
    optionB: { he: 'ב125%', en: 'By 125%' },
    correctIsB: true,
    feedbackCorrect: { he: 'כן! זו ריבית דריבית: עלייה אחרי שהמניה עלתה', en: 'Yes! This is compound interest: a rise after the stock already rose' },
    feedbackWrong: { he: 'לא! זו ריבית דריבית: עלייה אחרי שהמניה עלתה', en: 'No! This is compound interest: a rise after the stock already rose' },
  },
  {
    question: {
      he: 'מנייה שירדה ב50% ואז בעוד 50% ירדה בסה"כ',
      en: 'A stock that dropped 50% then dropped another 50% dropped in total',
    },
    optionA: { he: 'ב75%', en: 'By 75%' },
    optionB: { he: 'ב100%', en: 'By 100%' },
    correctIsB: false,
    feedbackCorrect: { he: 'נכון, הירידה השנייה היא מסכום נמוך יותר', en: 'Correct, the second drop is from a lower amount' },
    feedbackWrong: { he: 'לא, אין ירידה של 100%', en: 'No, there is no 100% drop' },
  },
];

// Stock knowledge quiz questions (StockQuizGame) - based on lessons learned
export const STOCK_QUESTIONS: QuizQuestion[] = [
  {
    question: { he: 'מה זה מניה?', en: 'What is a stock?' },
    optionA: { he: 'הלוואה לחברה', en: 'A loan to a company' },
    optionB: { he: 'חלק קטן מחברה', en: 'A small piece of a company' },
    correctIsB: true,
    feedbackCorrect: { he: 'נכון! מניה היא חלק בבעלות על חברה', en: 'Correct! A stock is a share of ownership in a company' },
    feedbackWrong: { he: 'לא, מניה היא חלק בבעלות על חברה', en: 'No, a stock is a share of ownership in a company' },
  },
  {
    question: { he: 'מה זה בורסה?', en: 'What is a stock exchange?' },
    optionA: { he: 'שוק למסחר במניות', en: 'A market for trading stocks' },
    optionB: { he: 'בנק גדול', en: 'A big bank' },
    correctIsB: false,
    feedbackCorrect: { he: 'נכון! הבורסה היא שוק לקנייה ומכירה של מניות', en: 'Correct! The exchange is a market for buying and selling stocks' },
    feedbackWrong: { he: 'לא, הבורסה היא שוק למסחר במניות', en: 'No, the exchange is a market for trading stocks' },
  },
  {
    question: { he: 'מה עושה וורן באפט?', en: 'What does Warren Buffett do?' },
    optionA: { he: 'הוא בנקאי', en: 'He is a banker' },
    optionB: { he: 'הוא משקיע מפורסם', en: 'He is a famous investor' },
    correctIsB: true,
    feedbackCorrect: { he: 'נכון! וורן באפט הוא אחד המשקיעים הגדולים בהיסטוריה', en: 'Correct! Warren Buffett is one of the greatest investors in history' },
    feedbackWrong: { he: 'לא, וורן באפט הוא משקיע מפורסם', en: 'No, Warren Buffett is a famous investor' },
  },
  {
    question: { he: 'מה זה פיזור סיכונים?', en: 'What is diversification?' },
    optionA: { he: 'מכירת כל המניות', en: 'Selling all stocks' },
    optionB: { he: 'השקעה בכמה חברות שונות', en: 'Investing in several different companies' },
    correctIsB: true,
    feedbackCorrect: { he: 'נכון! פיזור = לא לשים את כל הביצים בסל אחד', en: 'Correct! Diversification = don\'t put all eggs in one basket' },
    feedbackWrong: { he: 'לא, פיזור הוא השקעה בחברות שונות', en: 'No, diversification means investing in different companies' },
  },
  {
    question: { he: 'מה זה ריבית דריבית?', en: 'What is compound interest?' },
    optionA: { he: 'רווח על הרווח', en: 'Earning returns on returns' },
    optionB: { he: 'ריבית על הלוואה', en: 'Interest on a loan' },
    correctIsB: false,
    feedbackCorrect: { he: 'נכון! הרווח שלך מרוויח עוד רווח', en: 'Correct! Your returns earn more returns' },
    feedbackWrong: { he: 'לא, ריבית דריבית = רווח על הרווח', en: 'No, compound interest = returns on returns' },
  },
  {
    question: { he: 'הכלל הראשון של באפט?', en: 'Buffett\'s first rule?' },
    optionA: { he: 'אל תפסיד כסף', en: 'Don\'t lose money' },
    optionB: { he: 'קנה הרבה מניות', en: 'Buy lots of stocks' },
    correctIsB: false,
    feedbackCorrect: { he: 'נכון! והכלל השני: אל תשכח את הכלל הראשון', en: 'Correct! And rule two: don\'t forget rule one' },
    feedbackWrong: { he: 'לא, הכלל הראשון: אל תפסיד כסף!', en: 'No, the first rule: don\'t lose money!' },
  },
];
