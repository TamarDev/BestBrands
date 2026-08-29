
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCurrentUser } from "../store/slices/AuthSlice";
import { updateUser } from "../API/UserApi";
import { setPassword as setPasswordRequest } from "../API/AuthApi";
import "./DetailisUser.css";

export default function DetailisUser() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, token, loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [passwordData, setPasswordData] = useState({ password: "", confirmPassword: "" });
  const [settingPassword, setSettingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // אם אין משתמש מחובר - מעבר להתחברות
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!user) {
      dispatch(fetchCurrentUser());
    }
  }, [token, user, dispatch, navigate]);

  // הכנסת פרטי המשתמש לטופס
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        address: user.address || "",
        city: user.city || "",
      });
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      setError("לא נמצא משתמש מחובר");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const userId = user._id || user.id || user.userId;

      if (!userId) {
        throw new Error("לא נמצא מזהה משתמש");
      }

      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        address: formData.address.trim(),
        city: formData.city.trim(),
      };

      // עדכון המשתמש המחובר בלבד
      await updateUser(userId, payload);

      // טעינת הנתונים המעודכנים
      await dispatch(fetchCurrentUser());

      setMessage("הפרטים עודכנו בהצלחה");
    } catch (err) {
      console.error("Update user error:", err);

      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "לא ניתן לעדכן את הפרטים"
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSetPassword = async (event) => {
    event.preventDefault();

    setPasswordError("");
    setPasswordMessage("");

    if (passwordData.password.length < 6) {
      setPasswordError("הסיסמה חייבת להכיל לפחות 6 תווים");
      return;
    }

    if (passwordData.password !== passwordData.confirmPassword) {
      setPasswordError("הסיסמאות אינן תואמות");
      return;
    }

    setSettingPassword(true);

    try {
      await setPasswordRequest(passwordData.password);

      await dispatch(fetchCurrentUser());

      setPasswordData({ password: "", confirmPassword: "" });
      setPasswordMessage("הסיסמה הוגדרה בהצלחה");
    } catch (err) {
      console.error("Set password error:", err);

      setPasswordError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "לא ניתן להגדיר סיסמה"
      );
    } finally {
      setSettingPassword(false);
    }
  };

  if (!token || loading) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="user-profile-page" dir="rtl">
      <div className="user-profile-card">

        <h2>פרטי המשתמש</h2>

        <div className="user-profile-header">
          <div className="user-avatar">
            {(user.firstName || "U").charAt(0).toUpperCase()}
          </div>

          <p>
            {user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : "עדכון פרטי חשבון"}
          </p>
        </div>

        <form
          className="user-profile-form"
          onSubmit={handleSubmit}
        >

          <label>
            שם פרטי
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            שם משפחה
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </label>

          <label className="full-width">
            אימייל
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            עיר
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="הזן עיר"
            />
          </label>

          <label>
            כתובת
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="הזן כתובת"
            />
          </label>

          <div className="user-profile-actions full-width">
            <button
              type="submit"
              className="user-profile-btn"
              disabled={saving}
            >
              {saving ? "מעדכן..." : "שמירת פרטים"}
            </button>
          </div>

        </form>

        {message && (
          <p className="user-message success">
            {message}
          </p>
        )}

        {error && (
          <p className="user-message error">
            {error}
          </p>
        )}

        {user.hasPassword === false && (
          <div className="user-profile-password">

            <h3>הגדרת סיסמה</h3>

            <p className="mode-hint">
              החשבון שלך נרשם דרך Google. אפשר להגדיר סיסמה כדי שתוכל/י להתחבר גם בלי Google.
            </p>

            <form
              className="user-profile-form"
              onSubmit={handleSetPassword}
            >

              <label>
                סיסמה חדשה
                <input
                  type="password"
                  name="password"
                  value={passwordData.password}
                  onChange={handlePasswordChange}
                  required
                />
              </label>

              <label>
                אימות סיסמה
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </label>

              <div className="user-profile-actions full-width">
                <button
                  type="submit"
                  className="user-profile-btn"
                  disabled={settingPassword}
                >
                  {settingPassword ? "מגדיר..." : "הגדרת סיסמה"}
                </button>
              </div>

            </form>

            {passwordMessage && (
              <p className="user-message success">
                {passwordMessage}
              </p>
            )}

            {passwordError && (
              <p className="user-message error">
                {passwordError}
              </p>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

