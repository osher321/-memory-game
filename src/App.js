// מייבא את קובץ העיצוב של האפליקציה
import './App.css';
// מייבא את הפונקציות לניהול מצבים ואפקטים מריאקט
import { useState, useEffect } from 'react';

// מערך של כל האותיות בעברית כולל סופיות
const letters = [
  'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט',
  'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ',
  'ק', 'ר', 'ש', 'ת',
  'ך', 'ם', 'ן', 'ף', 'ץ'
];

// יוצר מערך כפול מהאותיות ומערבב אותו באקראי
const shuffledCards = [...letters, ...letters].sort(() => Math.random() - 0.5);

  
function App() {
  // מצב של הקלפים הנוכחיים במשחק
  const [cards, setCards] = useState(shuffledCards);
  // קלפים שהשחקן הפך כרגע
  const [flipped, setFlipped] = useState([]);
  // קלפים שתואמו ונשארים פתוחים
  const [matched, setMatched] = useState([]);
  // האם חסומה אפשרות ללחוץ (כדי להמתין לפני סגירת קלפים)
  const [disabled, setDisabled] = useState(false);
  // מספר המהלכים שביצע השחקן
  const [moves, setMoves] = useState(0);
  // האם המשחק הסתיים (כל הקלפים תואמו)
  const [gameOver, setGameOver] = useState(false);

  const speakLetter = (letter) => {
   const letterNames = {
  'א': 'אָלֶף',
  'בֶּית': '',
  'ג': 'גִּימֵל',
  'ד': 'דָלֶת',
  'ה': 'הֵא',
  'ו': 'וָו',
  'ז': 'זַיִן',
  'ח': 'חֵית',
  'ט': 'טֵית',
  'י': 'יוֹד',
  'כ': 'כָּף',
  'ך': 'כָּף סוֹפִית',
  'ל': 'לָמֶד',
  'מ': 'מֵם',
  'ם': 'מֵם סוֹפִית',
  'נ': 'נוּן',
  'ן': 'נוּן סוֹפִית',
  'ס': 'סָמֶךְ',
  'ע': 'עַיִן',
  'פ': 'פֵּא',
  'ף': 'פֵּא סוֹפִית',
  'צ': 'צָדִי',
  'ץ': 'צָדִי סוֹפִית',
  'ק': 'קוֹף',
  'ר': 'רֵישׁ',
  'ש': 'שִׁין',
  'ת': 'תָּו'
};

  
    const name = letterNames[letter] || letter; // אם לא נמצא במילון – פשוט תגיד את האות
    const utterance = new SpeechSynthesisUtterance(name);
    utterance.lang = 'he-IL';
    speechSynthesis.speak(utterance);
  };
  

  // פונקציה שמתבצעת כששחקן לוחץ על קלף
  const handleClick = (index) => {
    // בודק אם לא ניתן ללחוץ או אם הקלף כבר פתוח
    if (disabled || flipped.includes(index) || matched.includes(index)) return;

    // מוסיף את הקלף לרשימת הקלפים שנפתחו
    setFlipped((prev) => [...prev, index]);

    speakLetter(cards[index]); // 🗣️ לקרוא את האות בקול


    // מעלה את מונה המהלכים
    setMoves((prev) => prev + 1);
  };

  // אפקט שמופעל כשיש שני קלפים פתוחים
  useEffect(() => {
    if (flipped.length === 2) {
      setDisabled(true); // חוסם לחיצות כדי לאפשר בדיקת התאמה

      const [first, second] = flipped;

      if (cards[first] === cards[second]) {
        // אם הקלפים זהים – מוסיף אותם לרשימת התואמים
        setMatched((prev) => [...prev, first, second]);
        setFlipped([]); // מאפס את flipped
        setDisabled(false); // מחזיר אפשרות לחיצה
      } else {
        // אם הקלפים לא זהים – סוגר אותם אחרי שנייה
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  }, [flipped, cards]);

  // אפקט שמופעל כאשר רשימת התואמים משתנה – לבדוק אם המשחק נגמר
  useEffect(() => {
    if (matched.length === cards.length) {
      setGameOver(true);
    }
  }, [matched, cards.length]);

  // מאתחל את המשחק מחדש
  const restartGame = () => {
    setCards([...shuffledCards].sort(() => Math.random() - 0.5)); // מערבב קלפים מחדש
    setFlipped([]);
    setMatched([]);
    setDisabled(false);
    setMoves(0);
    setGameOver(false);
  };

  return (
    <div className="App" dir="rtl"> {/* כיוון עברי לכל האפליקציה */}
      <h1>🎴 משחק זיכרון - אותיות א-ב מאת אושר אסולין</h1>

      {/* לוח המשחק */}
      <div className="grid">
        {cards.map((letter, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(index); // האם הקלף פתוח

          return (
            <div
              key={index}
              className={`card ${isFlipped ? 'flipped' : ''}`} // מוסיף class של flipped במידת הצורך
              onClick={() => handleClick(index)} // מתבצע בלחיצה על הקלף
            >
              {/* תוכן הקלף – צד קדמי ואחורי */}
              <div className="card-inner">
                <div className="card-back">?</div> {/* צד סגור */}
                <div className="card-front">{letter}</div> {/* צד פתוח */}
              </div>
            </div>
          );
        })}
      </div>

      {/* אזור מידע וכפתור אתחול */}
      <div className="info">
        {gameOver && <p>🎉 ניצחת! כל הקלפים תואמים! 🎉</p>}
        <button onClick={restartGame}>שחק מחדש</button>
      </div>
    </div>
  );
}

export default App; // מייצא את הקומפוננטה הראשית
