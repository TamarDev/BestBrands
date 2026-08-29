import "./Auth.css";
import { loginUser, continueWithGoogle } from "../store/slices/AuthSlice";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {

    const dispatch = useDispatch();

    const { loading, error, user } = useSelector(state => state.auth);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginMode, setLoginMode] = useState("user");

    const handleLogin = (e) => {

        e.preventDefault();

        dispatch(loginUser({
            email,
            password,
            role: loginMode === "admin" ? "admin" : "user"
        }));

    };

    const handleGoogleSuccess = (credentialResponse) => {
        dispatch(continueWithGoogle({ credential: credentialResponse.credential, mode: "login" }));
    };

    return (

        <div className="auth-page">

            <div className="auth-card">

                <h2>התחברות</h2>

                <p className="subtitle">

                    ברוכים הבאים! התחברו לחשבון שלכם

                </p>


                <div className="google-btn-wrapper">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => console.log("Google login failed")}
                        text="continue_with"
                        locale="he"
                    />
                </div>


                <div className="divider">

                    <span>או</span>

                </div>

                <div className="mode-switch" role="tablist" aria-label="בחירת סוג התחברות">
                    <span className={`mode-indicator ${loginMode === "admin" ? "right" : "left"}`} />
                    <button
                        type="button"
                        className={`mode-option ${loginMode === "user" ? "active" : ""}`}
                        onClick={() => setLoginMode("user")}
                    >
                        לקוח
                    </button>
                    <button
                        type="button"
                        className={`mode-option ${loginMode === "admin" ? "active" : ""}`}
                        onClick={() => setLoginMode("admin")}
                    >
                        מנהל
                    </button>
                </div>

                <p className="mode-hint">
                    {loginMode === "admin" ? "התחברות לממשק ניהול" : "התחברות לאזור הלקוחות"}
                </p>

                <form onSubmit={handleLogin}>

                    <input
                        type="email"
                        placeholder="כתובת אימייל"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="סיסמה"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        required
                    />

                    <Link className="forgot" to="/forgot-password">

                        שכחת סיסמה?

                    </Link>

                    <button type="submit">

                        {loading ? "מתחבר..." : loginMode === "admin" ? "התחברות כמנהל" : "התחברות כלקוח"}

                    </button>

                    {error && <p className="error">{error}</p>}

                    {user &&

                        <p className="success">

                            התחברת בהצלחה!

                        </p>

                    }

                </form>

                <p className="bottom-text">

                    אין לך חשבון?

                    <Link to="/register">

                        להרשמה

                    </Link>

                </p>

            </div>

        </div>

    );

}