import "./Auth.css";
import { loginUser, continueWithGoogle } from "../store/slices/AuthSlice";
import { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error } = useSelector(state => state.auth);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginMode, setLoginMode] = useState("user");
    const [loggedIn, setLoggedIn] = useState(false);

    const goAfterLogin = useCallback((loggedInUser) => {
        setLoggedIn(true);
        navigate(loggedInUser?.role === "admin" ? "/admin" : "/");
    }, [navigate]);

    const handleLogin = async (e) => {

        e.preventDefault();
        setLoggedIn(false);

        try {
            const data = await dispatch(loginUser({
                email,
                password,
                role: loginMode === "admin" ? "admin" : "user"
            })).unwrap();

            goAfterLogin(data?.user);
        } catch {
            // The error is already exposed through the store's error state.
        }

    };

    // Stabilize with useCallback so <GoogleLogin> does not reinitialize google.accounts.id on every render.
    const handleGoogleSuccess = useCallback(async (credentialResponse) => {
        try {
            const data = await dispatch(continueWithGoogle({ credential: credentialResponse.credential, mode: "login" })).unwrap();
            goAfterLogin(data?.user);
        } catch {
            // The error is already exposed through the store's error state.
        }
    }, [dispatch, goAfterLogin]);

    const handleGoogleError = useCallback(() => {
        console.log("Google login failed");
    }, []);

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
                        onError={handleGoogleError}
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

                 

                    <button type="submit">

                        {loading ? "מתחבר..." : loginMode === "admin" ? "התחברות כמנהל" : "התחברות כלקוח"}

                    </button>

                    {error && <p className="error">{error}</p>}

                    {loggedIn &&

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