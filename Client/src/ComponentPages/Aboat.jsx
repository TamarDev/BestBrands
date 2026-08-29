
import "./Aboat.css";

export default function Aboat() {
  return (
    <div className="about-page" dir="rtl">

      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-label">ABOUT US</span>

          <h1>אודותינו</h1>

          <div className="about-line"></div>

          <p>
            איכות, סטייל וחוויית קנייה מושלמת במקום אחד.
          </p>
        </div>
      </section>

      <section className="about-card">
        <span className="section-label">הסיפור שלנו</span>

        <h2>מי אנחנו?</h2>

        <p>
          ברוכים הבאים לחנות המותגים שלנו. אנו מתמחים בייבוא ובמכירה של
          מותגי אופנה מובילים, תוך הקפדה על איכות בלתי מתפשרת, שירות אישי
          וחוויית קנייה מתקדמת.
        </p>

        <p>
          החנות נוסדה מתוך מטרה להנגיש ללקוחות בישראל מוצרים מקוריים של
          המותגים המובילים בעולם, במחירים הוגנים ובשירות מקצועי.
        </p>

        <p>
          אצלנו תוכלו למצוא בגדים, נעליים ואקססוריז לנשים, גברים וילדים,
          ממותגים בינלאומיים מובילים.
        </p>
      </section>

      <section className="features">

        <div className="feature-box">
          <div className="feature-number">01</div>
          <h3>איכות ללא פשרות</h3>
          <p>
            מוצרים מקוריים ואיכותיים ממבחר מותגים מובילים מרחבי העולם.
          </p>
        </div>

        <div className="feature-box">
          <div className="feature-number">02</div>
          <h3>משלוח מהיר</h3>
          <p>
            אנו דואגים שההזמנה שלכם תגיע במהירות וביעילות לכל רחבי הארץ.
          </p>
        </div>

        <div className="feature-box">
          <div className="feature-number">03</div>
          <h3>שירות אישי</h3>
          <p>
            צוות מקצועי וזמין שמלווה אתכם ומסייע בכל שלב בדרך.
          </p>
        </div>

      </section>

    </div>
  );
}

