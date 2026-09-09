import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { OAuth2Client } from 'google-auth-library'
import { JWT_SECRET, GOOGLE_CLIENT_ID } from '../config.js'
import Users from '../Models/Users.js'

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID)

const signUserToken = (user) => jwt.sign(
    {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
    },
    JWT_SECRET,
    { expiresIn: '1d' }
);

const buildUserResponse = (user) => ({
    userId: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    address: user.address,
    city: user.city,
    hasPassword: !!user.password
});

export const AuthMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: "Token is required" });
        }
        
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}

export const CheckRole = (requiredRole) => {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        if (req.user.role !== requiredRole) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        next();
    }
}

export const Register = async (req, res) => {
    try {
        // בדיקת תקינות קלט
        
        const { firstName, lastName, email, password } = req.body;
        
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // בדיקה אם המשתמש כבר קיים
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }
        
        // יצירת משתמש חדש
        const newUser = new Users({
            firstName,
            lastName,
            email,
            password,

            // isActive: true
        });
        
        await newUser.save();

        const token = signUserToken(newUser);

        // החזרת תגובה מוצלחת - מחברים את המשתמש אוטומטית
        return res.status(201).json({
            message: "User registered successfully",
            token,
            user: buildUserResponse(newUser),
            expiresIn: '1d'
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export const Login = async (req, res) => {
    try {
        // בדיקת תקינות קלט
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        
        // חיפוש המשתמש בDB
        const user = await Users.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // משתמש שנרשם רק דרך גוגל ולא הגדיר סיסמה
        if (!user.password) {
            return res.status(401).json({
                message: "החשבון הזה נרשם דרך Google. התחברו עם כפתור Google, או הגדירו סיסמה מהעמוד האישי לאחר ההתחברות."
            });
        }

        // בדיקת סיסמה מוצפנת
        const passwordMatches = await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        // יצירת טוקן עם פרטים מה-DB
        const token = signUserToken(user);

        // החזרת תגובה מוצלחת עם הטוקן
        return res.status(200).json({
            message: "Login successful",
            token,
            user: buildUserResponse(user),
            expiresIn: '1d'
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

//התחברות/הרשמה דרך גוגל - מתחברת לחשבון קיים או יוצרת חשבון חדש אוטומטית אם עדיין אין
export const GoogleAuth = async (req, res) => {
    try {
        const { credential, mode } = req.body;

        if (!credential) {
            return res.status(400).json({ message: "Google credential is required" });
        }

        let ticket;
        try {
            ticket = await googleClient.verifyIdToken({
                idToken: credential,
                audience: GOOGLE_CLIENT_ID,
            });
        } catch (verifyErr) {
            return res.status(401).json({ error: "Invalid Google credential" });
        }

        const payload = ticket.getPayload();
        const { sub: googleId, email, given_name, family_name } = payload;

        let user = await Users.findOne({ $or: [{ googleId }, { email }] });

        // הפרדה בין הכפתור בעמוד ההרשמה לכפתור בעמוד ההתחברות
        if (mode === "register" && user) {
            return res.status(409).json({
                message: "כבר נרשמתם עברו לההתחברות."
            });
        }

        if (mode === "login" && !user) {
            return res.status(404).json({
                message: "עוד לא נרשמתם עברו להרשמה"
            });
        }

        if (!user) {
            // אין חשבון קיים - יוצרים משתמש חדש
            user = new Users({
                firstName: given_name || '',
                lastName: family_name || '',
                email,
                googleId,
            });
            await user.save();
        } else if (!user.googleId) {
            // משתמש קיים שנרשם עם מייל+סיסמה - מקשרים את חשבון הגוגל אליו
            user.googleId = googleId;
            await user.save();
        }

        const token = signUserToken(user);

        return res.status(200).json({
            message: "Login successful",
            token,
            user: buildUserResponse(user),
            expiresIn: '1d'
        });
    } catch (err) {
        console.error("GoogleAuth error:", err);
        return res.status(500).json({ error: err.message });
    }
}

//קבלת המשתמש עפי הטוקן ברענון הדף
export const GetMe = async (req, res) => {
  try {
    const user = await Users.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user: {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        hasPassword: !!user.password,
      },
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

// הגדרת סיסמה למשתמש שנרשם דרך גוגל ועדיין אין לו סיסמה
export const SetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = await Users.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password) {
      return res.status(409).json({ message: "Password already set" });
    }

    user.password = password;
    await user.save();

    return res.status(200).json({ message: "Password set successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};