# נקודת חיבור · מפחד לאהבה בארבעה רבדים

קורס דיגיטלי בעברית (RTL) של המותג **נקודת חיבור**, שנבנה ב-React + Vite ומיועד
לפריסה כאתר סטטי ב-Render. ללא backend; כל ההתקדמות ונתוני התרגול נשמרים
ב-`localStorage` במכשיר של הלומדת בלבד.

## מבנה הקורס

שישה שיעורים: מבוא וארבעת הרבדים, מפת הדרכים (מבריחה לבחירה), החיבור בין הלב
לראש (קוהרנטיות), הגוף כמצפן, פרוטוקול עצירה וחיבור ללב, ותדר של אהבה (תרגול
יומי). לצידם מסך "התרגול שלי" לכתיבה אינטואיטיבית ומסך סיום.

## הרצה מקומית

דרוש Node.js 18 ומעלה.

```bash
npm install
npm run dev
```

האתר יעלה בכתובת שמודפסת בטרמינל (בדרך כלל http://localhost:5173).

## בנייה ל-production

```bash
npm run build      # יוצר את התיקייה dist/
npm run preview    # תצוגה מקדימה מקומית של הבנייה
```

## פריסה ב-Render

האתר מוגדר כ-Static Site. שתי דרכים:

**א. דרך קובץ ה-Blueprint (`render.yaml`):**

1. דחפו את הפרויקט ל-GitHub / GitLab.
2. ב-Render: **New → Blueprint**, בחרו את ה-repository. Render יקרא את
   `render.yaml` אוטומטית.

**ב. הגדרה ידנית:**

1. ב-Render: **New → Static Site**, חברו את ה-repository.
2. הגדרות:
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
3. הוסיפו Rewrite Rule כדי שהניווט הפנימי יעבוד:
   `Source: /*` → `Destination: /index.html`.

## עדכון סרטונים ואודיו

כל המדיה מנוהלת מקובץ אחד: [`public/data/videos.json`](public/data/videos.json).
האפליקציה טוענת אותו בעת עליית האתר, ולכל שיעור שולפת את הפריט לפי `sectionId`.

כל פריט כולל:

| שדה | פירוט |
|------|-------|
| `sectionId` | מזהה השיעור: `intro`, `roadmap`, `coherence`, `body-compass`, `heart-protocol`, `love-frequency` |
| `mediaKey` | אופציונלי. מבדיל בין שלושת כרטיסי התרגול היומי בשיעור 6: `breath-types`, `coherent-breath`, `love-meditation` |
| `title` | כותרת המדיה |
| `type` | `video` או `audio` |
| `provider` | `youtube`, `local` או `external` |
| `url` | כתובת המדיה (ראו למטה) |
| `description` | תיאור קצר |

### איפה מדביקים את הקישורים

ערכו את שדה ה-`url` של הפריט הרצוי:

- **YouTube** (`provider: "youtube"`): הדביקו קישור צפייה רגיל, למשל
  `https://www.youtube.com/watch?v=XXXX` או `https://youtu.be/XXXX`. ההמרה
  להטמעה נעשית אוטומטית.
- **אודיו / וידאו מקומי** (`provider: "local"`): שימו את הקובץ בתיקייה
  `public/` (למשל `public/audio/coherent-breath.mp3`) והדביקו נתיב מהשורש:
  `/audio/coherent-breath.mp3`.
- **קישור חיצוני** (`provider: "external"`): הדביקו כתובת מלאה לקובץ `.mp4`/`.mp3`.

כל עוד `url` ריק או לא תקין, השיעור יציג placeholder עדין ("הסרטון לשיעור זה
יתווסף בקרוב") ולא יישבר. אין צורך למלא הכל בבת אחת.

> אין צורך לבנות מחדש בעת שינוי הקישורים בסביבת פיתוח. ב-production הריצו שוב
> `npm run build` (או deploy ב-Render) כדי שהקובץ המעודכן יישלח.

## מבנה קבצים

```
public/
  brand/            סמלי המותג (icon/logo, חום/לבן)
  data/videos.json  ניהול המדיה לכל שיעור
src/
  main.jsx          נקודת הכניסה
  App.jsx           ניווט, מצב, טעינת המדיה, localStorage
  styles.css        מערכת העיצוב של המותג (RTL, נגישות, רספונסיביות)
  data/course.js    כל תוכן הקורס
  hooks/            useLocalStorage
  components/       Sidebar, ProgressBar, Home, Lesson, Practice, Completion,
                    MediaPlayer, exercises/
  assets/fonts/     גופן המותג RAGSans (מוטמע מקומית)
render.yaml         הגדרת הפריסה ב-Render
```

## הערות

- הקורס הוא חומר עזר לתרגול ואינו מחליף ייעוץ או טיפול אישי.
- הגופן RAGSans מוטמע מקומית ואינו נטען מ-CDN.
