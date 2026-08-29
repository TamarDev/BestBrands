import "./Auth.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, continueWithGoogle } from "../store/slices/AuthSlice";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

export default function Register() {

    const dispatch = useDispatch();

    const { loading, error, user } = useSelector(state => state.auth);

    const [formData,setFormData]=useState({

        firstName:"",
        lastName:"",
        email:"",
        password:""

    });

    const handleChange=(e)=>{

        setFormData({

            ...formData,

            [e.target.name]:e.target.value

        });

    };

    const handleSubmit=(e)=>{

        e.preventDefault();

        dispatch(registerUser(formData));

    };

    const handleGoogleSuccess = (credentialResponse) => {
        dispatch(continueWithGoogle({ credential: credentialResponse.credential, mode: "register" }));
    };

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
                        onError={() => console.log("Google signup failed")}
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

                    {user &&

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