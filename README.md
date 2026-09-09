# BestBrands

אתר מסחר אלקטרוני בעברית (RTL): חנות מוצרים לפי מותגים, סל קניות, הזמנות ופאנל ניהול עם דשבורד סטטיסטי.

**Client** — React 19, Vite, Redux Toolkit, React Router 7, MUI, Axios, Recharts, Google OAuth
**Server** — Express 5, MongoDB (Mongoose), JWT, bcrypt, Multer + Cloudinary

---

## מבנה

```
Client/src/
  API/        שכבת HTTP (Axios instance משותף + מודול לכל ישות)
  store/      Redux: auth, brands, products, cart
  ComponentPages/  עמודי הלקוח      AdminComponents/  פאנל הניהול
  Components/ רכיבים משותפים (Nav, Filter, CartDrawer)

Server/
  Models/  Controllers/  Routers/    Utils/ (Cloudinary)   app.js
```

## הרצה

```bash
cd Server && npm install && node app.js     # http://localhost:1234
cd Client && npm install && npm run dev
```

**`Server/.env`** — `MONGO_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `CLOUD_NAME`, `API_KEY`, `API_SECRET`, `PORT` (אופציונלי, ברירת מחדל 1234)
**`Client/.env`** — `VITE_GOOGLE_CLIENT_ID`, `VITE_API_URL` (אם ריק — נופל לשרת הפרודקשן ב-Render)

> ללא שלושת משתני Cloudinary כל העלאת תמונה (מותג/מוצר) תיכשל.

## מודל הנתונים

| מודל | שדות עיקריים |
|------|---------------|
| **User** | `email` (unique), `password` (bcrypt; לא נדרש למשתמשי Google), `googleId`, `address`, `city`, `role`: `user`\|`admin` |
| **Brand** | `name` (unique), `image` (לוגו), `imagePage` (באנר), `description`, `inventor` |
| **Category** | `name` (unique) |
| **Product** | `name`, `price`, `image`, `color`, `brand`→Brand, `category`→Category, `sizes: [{size, stock}]` — **מלאי מנוהל לפי מידה** |
| **ShoppingCart** | `user` (unique — עגלה אחת למשתמש), `items: [{product, quantity, size}]`, `sum` |
| **Order** | `user`, `items`, `total`, `status`: `pending`\|`paid`\|`shipped`\|`cancelled`, `shippingAddress`, `orderDate` |
| **Message** | `userId`, `subject`, `body`, `isRead`, `status`: `new`\|`inProgress`\|`answered`\|`closed` |

## API

מקרא: 🌐 ציבורי · 🔒 מחובר · 👤 `role=user` · 👑 `role=admin`

| Base | Endpoints |
|------|-----------|
| `/Auth` | 🌐 `POST /register`, `/login`, `/google` · 🔒 `GET /me`, `POST /set-password` |
| `/Brands` | 🌐 `GET /`, `/GetById/:id`, `/GetByName/:name` · 👑 `POST /Add`, `PUT /Update/:id`, `DELETE /Delete/:id` |
| `/Category` | 🌐 `GET /`, `/GetById/:id` · 👑 `Add` / `Update/:id` / `Delete/:id` |
| `/Product` | 🌐 `GET /`, `/GetById/:id`, `/GetByBrand/:name` · 👑 `Add` / `Update/:id` / `Delete/:id` |
| `/Orders` | 👤 `POST /Add`, `GET /MyOrders` · 👑 `GET /`, `/GetById/:id`, `PUT /Update/:id`, `DELETE /Delete/:id` |
| `/ShoppingCart` | 👤 `GET /get`, `POST /addItem`, `PUT /updateItem`, `DELETE /removeItem`, `/clear` · 👑 `GET /`, `/GetById/:id`, `DELETE /Delete/:id` |
| `/User` | 🔒 `PUT\|PATCH /Update/:id` (רק את עצמך, אלא אם admin) · 👑 `GET /`, `/GetById/:id`, `DELETE /Delete/:id` |
| `/Message` | 🔒 `POST /Add` · 👑 `GET /`, `PUT /UpdateStatus/:id`, `/MarkAsRead/:id`, `DELETE /Delete/:id` |

העלאות תמונה נשלחות כ-`multipart/form-data` (במוצר `sizes` נשלח כמחרוזת JSON).

## אימות והרשאות

- JWT בתוקף יום, נשמר ב-`localStorage`. Axios Interceptor מצרף אותו לכל בקשה; בכל **401** הטוקן נמחק והמשתמש מנותב ל-`/login`.
- בריענון דף `App.jsx` קורא ל-`GET /Auth/me` ומשחזר את המשתמש. הדגל `authInitialized` מונע ניתוב שגוי של מנהל החוצה מ-`/admin` לפני שהשחזור הסתיים.
- בשרת: `AuthMiddleware` מאמת טוקן, `CheckRole(role)` דורש **התאמה מדויקת** של התפקיד — ולכן חשבון admin אינו משתמש בעגלה ובהזמנות. זו התנהגות מכוונת, והלקוח (`Nav`, `RequireAdmin`) תואם לה.
- Google: השרת מאמת את ה-ID Token מול Google. `mode` מפריד בין כפתור ההרשמה לכפתור ההתחברות; חשבון קיים מקושר אוטומטית ל-`googleId`.

## נתיבי הלקוח

`/` · `/brands` · `/brands/:brandName` · `/DetailisOfProduct/:id` · `/shoppingCart` · `/payment` · `/payment/success` · `/orders` · `/profile` · `/login` · `/register` · `/about` · `/conection`

`/admin` (מוגן ב-`RequireAdmin`, פריסה עם Sidebar) → דשבורד, `products`, `brands`, `categories`, `orders`, `carts`, `users`, `messages`

## לוגיקה עסקית מרכזית

- **נרמול מידות** — אחיד במוצר, בעגלה ובהזמנה: ללא רווחים, אותיות גדולות, ברירת מחדל `ONESIZE`. פריט בעגלה נבדל לפי **מוצר + מידה**.
- **סל קניות** — נשמר בשרת; מאמת מלאי (כולל הכמות המצטברת) ומחשב `sum` מהמחירים ב-DB.
- **יצירת הזמנה** — המחירים נלקחים תמיד מה-DB ולא מהלקוח; כל הפריטים עוברים ולידציה לפני ניכוי מלאי; הניכוי אטומי (`$elemMatch` על `stock >= quantity`) כדי למנוע מכירת יתר, ואם שלב כלשהו נכשל מתבצע rollback והחזרת `409`.

## פריסה

Client → **Vercel** (`vercel.json` עם rewrite ל-`index.html`) · Server → **Render** · DB → **MongoDB Atlas** · תמונות → **Cloudinary**
