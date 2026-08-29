import { useState } from "react";
import { useSelector } from "react-redux";
import { addMessage } from "../API/Message.js";
import "./Contact_Us.css";

export default function Contact_Us() {
  const { user } = useSelector((state) => state.auth || {});

  const [formData, setFormData] = useState({
    subject: "",
    body: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // בדיקה שהמשתמש מחובר
    if (!user) {
      setError("יש להתחבר לפני שליחת הודעה.");
      setSuccess("");
      return;
    }

    // בדיקת נושא
    if (!formData.subject.trim()) {
      setError("יש להזין נושא להודעה.");
      setSuccess("");
      return;
    }

    // בדיקת תוכן ההודעה
    if (!formData.body.trim()) {
      setError("יש להזין טקסט הודעה.");
      setSuccess("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // לא שולחים userId!
      // השרת מזהה את המשתמש דרך ה-JWT
      await addMessage({
        subject: formData.subject.trim(),
        body: formData.body.trim()
      });

      setSuccess("ההודעה נשלחה בהצלחה!");

      // ניקוי הטופס
      setFormData({
        subject: "",
        body: ""
      });

    } catch (err) {
      console.error("Add message error:", err);

      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "אירעה שגיאה בשליחת ההודעה."
      );

      setSuccess("");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">

      {/* כותרת */}
      <div className="contact-header">
        <h1>צור קשר</h1>

        <p>
          יש לך שאלות או הערות? צור קשר עם הצוות שלנו!
        </p>
      </div>


      {/* תוכן הדף */}
      <div className="contact-content">

        {/* טופס יצירת קשר */}
        <div className="contact-form-section">

          <h2>שליחת הודעה</h2>

          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >

            {/* נושא */}
            <label htmlFor="subject">
              נושא:
            </label>

            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="לדוגמה: שאלה לגבי הזמנה"
              required
            />


            {/* הודעה */}
            <label htmlFor="body">
              הודעה:
            </label>

            <textarea
              id="body"
              name="body"
              value={formData.body}
              onChange={handleChange}
              placeholder="כתוב כאן את ההודעה שלך..."
              required
              rows="6"
            ></textarea>


            {/* הודעת שגיאה */}
            {error && (
              <p className="contact-error">
                {error}
              </p>
            )}


            {/* הודעת הצלחה */}
            {success && (
              <p className="contact-success">
                {success}
              </p>
            )}


            {/* כפתור */}
            <button
              type="submit"
              className="contact-submit"
              disabled={loading}
            >
              {loading ? "שולח..." : "שליחת הודעה"}
            </button>

          </form>

        </div>


        {/* מידע ליצירת קשר */}
        <div className="contact-info">

          <h2>פרטי התקשרות</h2>

          <div className="contact-info-item">
            <span className="contact-info-label">
              אימייל
            </span>

            <span className="contact-info-value">
              adminbestbrands@gmail.com
            </span>
          </div>


          <div className="contact-info-item">
            <span className="contact-info-label">
              טלפון
            </span>

            <span className="contact-info-value">
              03-1234567
            </span>
          </div>


          <div className="contact-info-item">
            <span className="contact-info-label">
              שעות פעילות
            </span>

            <span className="contact-info-value">
              א׳–ה׳, 09:00–17:00
            </span>
          </div>


          <div className="contact-info-item">
            <span className="contact-info-label">
              סיבת הפנייה
            </span>

            <span className="contact-info-value">
              שירות לקוחות, הזמנות ותמיכה
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}