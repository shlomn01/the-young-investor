// Warren Buffett guru dialogue - 12-turn conversation
// Based on original GDevelop game data

export interface DialogueLine {
  speaker: 'guru' | 'player';
  text: { he: string; en: string };
}

export const GURU_DIALOGUE: DialogueLine[] = [
  {
    speaker: 'player',
    text: {
      he: 'היי וורן, תן לי טיפ של אלופים',
      en: 'Hey Warren, give me a champion\'s tip',
    },
  },
  {
    speaker: 'guru',
    text: {
      he: 'שלום בן, איך אני יכול לעזור?',
      en: 'Hello son, how can I help?',
    },
  },
  {
    speaker: 'player',
    text: {
      he: 'כן, אני רוצה להשקיע ולהרוויח, כמוך',
      en: 'Yes, I want to invest and make money, like you',
    },
  },
  {
    speaker: 'guru',
    text: {
      he: 'אהה...טוב. כלל ראשון: אל תפסיד כסף',
      en: 'Ahh...okay. Rule number one: don\'t lose money',
    },
  },
  {
    speaker: 'player',
    text: {
      he: 'חח, רציני? ברור שלא',
      en: 'Haha, seriously? Obviously not',
    },
  },
  {
    speaker: 'guru',
    text: {
      he: 'לא כזה ברור, אנשים נוטים להסתכן',
      en: 'Not so obvious, people tend to take risks',
    },
  },
  {
    speaker: 'player',
    text: {
      he: 'אפשר לא להסתכן בהשקעות?',
      en: 'Is it possible not to take risks in investments?',
    },
  },
  {
    speaker: 'guru',
    text: {
      he: 'בוודאי! כלל ראשון: אל תשקיע במה שאינך מאמין בו',
      en: 'Of course! First rule: don\'t invest in what you don\'t believe in',
    },
  },
  {
    speaker: 'player',
    text: {
      he: 'אבל אני לא מבין כלום, איך להאמין?',
      en: 'But I don\'t understand anything, how can I believe?',
    },
  },
  {
    speaker: 'guru',
    text: {
      he: 'מצויין! זו כבר התחלה טובה',
      en: 'Excellent! That\'s already a good start',
    },
  },
  {
    speaker: 'player',
    text: {
      he: 'מה? שאני לא מבין',
      en: 'What? That I don\'t understand?',
    },
  },
  {
    speaker: 'guru',
    text: {
      he: 'כן. ועכשיו צריך להתחיל לקרוא כדי להבין',
      en: 'Yes. And now you need to start reading to understand',
    },
  },
  {
    speaker: 'player',
    text: {
      he: 'אוקיי, קראתי כתבות בספריה',
      en: 'Okay, I read articles at the library',
    },
  },
  {
    speaker: 'guru',
    text: {
      he: 'יפה, זה לא רע בכלל',
      en: 'Nice, that\'s not bad at all',
    },
  },
  {
    speaker: 'player',
    text: {
      he: 'ומה עוד חוץ מכתבות בעיתונים?',
      en: 'And what else besides newspaper articles?',
    },
  },
  {
    speaker: 'guru',
    text: {
      he: 'ספרים ורשתות חברתיות בנושא, אפילו סרטונים',
      en: 'Books and social media on the topic, even videos',
    },
  },
  {
    speaker: 'player',
    text: {
      he: 'לעקוב אחרי כל אחד, וכל תוכן?',
      en: 'Follow anyone and any content?',
    },
  },
  {
    speaker: 'guru',
    text: {
      he: 'חס וחלילה. ספרים רציניים, כמו של ג\'ואל גרינבלט',
      en: 'God forbid. Serious books, like Joel Greenblatt\'s',
    },
  },
  {
    speaker: 'player',
    text: {
      he: 'ומה עוד? אחרי מי לעקוב למשל?',
      en: 'And what else? Who to follow, for example?',
    },
  },
  {
    speaker: 'guru',
    text: {
      he: 'למשל בטלגרם "תשואת יתר", וכל תוכן שמסביר דברים',
      en: 'For example on Telegram "Excess Returns", and any content that explains things',
    },
  },
  {
    speaker: 'player',
    text: {
      he: 'מעניין. בטח גם בטוויטר יש צייצנים לעקוב אחריהם',
      en: 'Interesting. I bet there are also Twitter accounts to follow',
    },
  },
  {
    speaker: 'guru',
    text: {
      he: 'בהחלט, ועוד דבר קטן: תיזהר מ"המלצות". יש לפעמים לממליצים אינטרסים זרים',
      en: 'Absolutely, and one more thing: beware of "recommendations". Recommenders sometimes have hidden interests',
    },
  },
  {
    speaker: 'player',
    text: {
      he: 'אוקיי, נתת לי כיוונים חשובים, ממש תודה',
      en: 'Okay, you gave me important directions, thank you so much',
    },
  },
  {
    speaker: 'guru',
    text: {
      he: 'בהצלחה! תזכור - סבלנות היא המפתח להשקעה מוצלחת.',
      en: 'Good luck! Remember - patience is the key to successful investing.',
    },
  },
];
