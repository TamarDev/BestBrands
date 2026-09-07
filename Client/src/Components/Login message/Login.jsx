import { Link } from "react-router-dom";
import "./LoginRequiredModal.css";

export default function LoginMessage({ onClose }) {

  return (
    <div
      className="login-required-overlay"
      onClick={onClose}
    >

      <div
        className="login-required-modal"
        onClick={(e) => e.stopPropagation()}
      >

        <h3>
          עדיין לא התחברת
        </h3>

        <p>
          כדי להוסיף מוצר לעגלה עליך להתחבר לחשבון.
        </p>

        <Link
          to="/login"
          className="login-required-link"
          onClick={onClose}
        >
          להתחברות
        </Link>

        <button
          className="login-required-close"
          onClick={onClose}
        >
          סגור
        </button>

      </div>

    </div>
  );
}