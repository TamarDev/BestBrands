import "./Auth.css";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, continueWithGoogle } from "../store/slices/AuthSlice";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

export default function Register() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error } = useSelector(state => state.auth);

    const [formData,setFormData]=useState({

        firstName:"",
        lastName:"",
        email:"",
        password:""

    });

    const [registered, setRegistered] = useState(false);

    const goAfterAuth = useCallback((authedUser) => {
        setRegistered(true);
        navigate(authedUser?.role === "admin" ? "/admin" : "/");
    }, [navigate]);

    const handleChange=(e)=>{

        setFormData({

            ...formData,

            [e.target.name]:e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setRegistered(false);

        try {
            const data = await dispatch(registerUser(formData)).unwrap();
            goAfterAuth(data?.user);
        } catch {
            // השגיאה כבר משתקפת ב-error מה-store
        }

    };

    // מיוצב עם useCallback כדי ש-<GoogleLogin> לא יאתחל מחדש את google.accounts.id בכל render
    const handleGoogleSuccess = useCallback(async (credentialResponse) => {
        try {
            const data = await dispatch(continueWithGoogle({ credential: credentialResponse.credential, mode: "register" })).unwrap();
            goAfterAuth(data?.user);
        } catch {
            // השגיאה כבר משתקפת ב-error מה-store
        }
    }, [dispatch, goAfterAuth]);

    const handleGoogleError = useCallback(() => {
        console.log("Google signup failed");
    }, []);

    return(

        <div className="auth-page">

            <div className="auth-card">

                <h2>הרשמה</h2>

                <p className="subtitle">

                    צרו חשבון חדש

                </p>

                <div className="google-btn-wrapper">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        text="signup_with"
                        locale="he"
                    />
                </div>

                <div className="divider">

                    <span>או</span>

                </div>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        name="firstName"
                        placeholder="שם פרטי"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />

                       <input
                        type="text"
                        name="lastName"
                        placeholder="שם משפחה"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="כתובת אימייל"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="סיסמה"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit">

                        {loading ? "יוצר חשבון..." : "הרשמה"}

                    </button>

                    {registered &&

                        <p className="success">

                            נרשמת והתחברת בהצלחה!

                        </p>

                    }

                </form>

                {error &&

                    <p className="error">

                        {error}

                    </p>

                }

                <p className="bottom-text">

                    כבר יש לך חשבון?

                    <Link to="/login">

                        להתחברות

                    </Link>

                </p>

            </div>

        </div>

    );

}