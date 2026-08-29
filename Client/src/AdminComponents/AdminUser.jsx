// import { useEffect, useState } from "react";

// import {
//   getAllUsers,
//   updateUser,
//   deleteUser,
// } from "../API/UserApi";

// const AdminUsers = () => {
//   const [users, setUsers] = useState([]);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [editingId, setEditingId] = useState(null);

//   const [editingUser, setEditingUser] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     address: "",
//     city: "",
//     role: "",
//   });

//   // ==========================
//   // טעינת המשתמשים
//   // ==========================
//   const loadUsers = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const data = await getAllUsers();

//       setUsers(data);
//     } catch (err) {
//       setError(err.response?.data?.error || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadUsers();
//   }, []);

//   // ==========================
//   // התחלת עריכה
//   // ==========================
//   const handleEdit = (user) => {
//     setEditingId(user._id);

//     setEditingUser({
//       firstName: user.firstName || "",
//       lastName: user.lastName || "",
//       email: user.email || "",
//       address: user.address || "",
//       city: user.city || "",
//       role: user.role || "user",
//     });
//   };

//   // ==========================
//   // שינוי ערכים
//   // ==========================
//   const handleChange = (e) => {
//     setEditingUser({
//       ...editingUser,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // ==========================
//   // שמירה
//   // ==========================
//   const handleSave = async () => {
//     try {
//       await updateUser(editingId, editingUser);

//       setEditingId(null);

//       loadUsers();
//     } catch (err) {
//       alert(err.response?.data?.error || err.message);
//     }
//   };

//   // ==========================
//   // מחיקה
//   // ==========================
//   const handleDelete = async (id) => {
//     if (!window.confirm("למחוק את המשתמש?")) return;

//     try {
//       await deleteUser(id);

//       loadUsers();
//     } catch (err) {
//       alert(err.response?.data?.error || err.message);
//     }
//   };

//   return (
//     <div>
//       <h1>ניהול משתמשים</h1>

//       {loading && <p>טוען...</p>}

//       {error && <p>{error}</p>}

//       <hr />

//       {users.map((user) => (
//         <div
//           key={user._id}
//           style={{
//             border: "1px solid gray",
//             padding: "10px",
//             marginBottom: "10px",
//           }}
//         >
//           {editingId === user._id ? (
//             <>
//               <input
//                 name="firstName"
//                 placeholder="שם פרטי"
//                 value={editingUser.firstName}
//                 onChange={handleChange}
//               />

//               <input
//                 name="lastName"
//                 placeholder="שם משפחה"
//                 value={editingUser.lastName}
//                 onChange={handleChange}
//               />

//               <input
//                 name="email"
//                 placeholder="אימייל"
//                 value={editingUser.email}
//                 onChange={handleChange}
//               />

//               <input
//                 name="address"
//                 placeholder="כתובת"
//                 value={editingUser.address}
//                 onChange={handleChange}
//               />

//               <input
//                 name="city"
//                 placeholder="עיר"
//                 value={editingUser.city}
//                 onChange={handleChange}
//               />

//               <select
//                 name="role"
//                 value={editingUser.role}
//                 onChange={handleChange}
//               >
//                 <option value="user">User</option>
//                 <option value="admin">Admin</option>
//               </select>

//               <br />

//               <button onClick={handleSave}>
//                 שמור
//               </button>

//               <button
//                 onClick={() => {
//                   setEditingId(null);
//                 }}
//               >
//                 ביטול
//               </button>
//             </>
//           ) : (
//             <>
//               <h3>
//                 {user.firstName} {user.lastName}
//               </h3>

//               <p>
//                 <strong>אימייל:</strong> {user.email}
//               </p>

//               <p>
//                 <strong>כתובת:</strong> {user.address}
//               </p>

//               <p>
//                 <strong>עיר:</strong> {user.city}
//               </p>

//               <p>
//                 <strong>תפקיד:</strong> {user.role}
//               </p>

//               <button onClick={() => handleEdit(user)}>
//                 ערוך
//               </button>

//               <button
//                 onClick={() => handleDelete(user._id)}
//               >
//                 מחק
//               </button>
//             </>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default AdminUsers;

import { useEffect, useState } from "react";

import {
  getAllUsers,
  updateUser,
  deleteUser,
} from "../API/UserApi";

import "./AdminStyle.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [editingUser, setEditingUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    role: "",
  });


  // ==========================
  // טעינת המשתמשים
  // ==========================

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllUsers();

      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadUsers();
  }, []);


  // ==========================
  // התחלת עריכה
  // ==========================

  const handleEdit = (user) => {
    setEditingId(user._id);

    setEditingUser({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      address: user.address || "",
      city: user.city || "",
      role: user.role || "user",
    });
  };


  // ==========================
  // שינוי ערכים
  // ==========================

  const handleChange = (e) => {
    setEditingUser({
      ...editingUser,
      [e.target.name]: e.target.value,
    });
  };


  // ==========================
  // שמירה
  // ==========================

  const handleSave = async () => {
    try {
      await updateUser(editingId, editingUser);

      setEditingId(null);

      setEditingUser({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        city: "",
        role: "",
      });

      loadUsers();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };


  // ==========================
  // ביטול עריכה
  // ==========================

  const handleCancelEdit = () => {
    setEditingId(null);

    setEditingUser({
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      city: "",
      role: "",
    });
  };


  // ==========================
  // מחיקה
  // ==========================

  const handleDelete = async (id) => {
    if (!window.confirm("למחוק את המשתמש?")) return;

    try {
      await deleteUser(id);

      loadUsers();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };


  return (
    <div className="ADMAIN-page">


      {/* ==========================
          HEADER
      ========================== */}

      <div className="ADMAIN-header">

        <div>

          <span className="ADMAIN-page-label">
            ניהול האתר
          </span>

          <h1>
            ניהול משתמשים
          </h1>

          <p>
            צפייה, עריכה ומחיקה של משתמשי האתר
          </p>

        </div>


        <div className="ADMAIN-count">

          <span>
            {users.length}
          </span>

          <small>
            משתמשים
          </small>

        </div>

      </div>


      {/* ==========================
          LOADING / ERROR
      ========================== */}

      {loading && (

        <div className="ADMAIN-message ADMAIN-loading-message">

          <span className="ADMAIN-loader"></span>

          טוען משתמשים...

        </div>

      )}


      {error && (

        <div className="ADMAIN-message ADMAIN-error-message">

          ⚠️ {error}

        </div>

      )}


      {/* ==========================
          USERS SECTION
      ========================== */}

      <section className="ADMAIN-section">


        <div className="ADMAIN-section-header">

          <div>

            <h2>
              רשימת משתמשים
            </h2>

            <p>
              כל המשתמשים הרשומים באתר
            </p>

          </div>


          <span className="ADMAIN-section-count">
            {users.length}
          </span>

        </div>


        <div className="ADMAIN-list">


          {/* ==========================
              EMPTY
          ========================== */}

          {users.length === 0 && !loading && (

            <div className="ADMAIN-empty-state">

              <div className="ADMAIN-empty-icon">
                👤
              </div>

              <h3>
                אין עדיין משתמשים
              </h3>

              <p>
                לא נמצאו משתמשים במערכת.
              </p>

            </div>

          )}


          {/* ==========================
              USERS
          ========================== */}

          {users.map((user) => (

            <div
              className={`ADMAIN-item ADMAIN-user-item ${
                editingId === user._id
                  ? "ADMAIN-editing"
                  : ""
              }`}
              key={user._id}
            >


              {editingId === user._id ? (

                /* ==========================
                   EDIT MODE
                ========================== */

                <div className="ADMAIN-edit-item">


                  <div className="ADMAIN-edit-header">

                    <div>

                      <span>
                        עריכת משתמש
                      </span>

                      <h3>
                        {user.firstName} {user.lastName}
                      </h3>

                    </div>


                    <button
                      className="ADMAIN-close-edit"
                      onClick={handleCancelEdit}
                    >
                      ×
                    </button>

                  </div>


                  <div className="ADMAIN-user-edit-form">


                    <div className="ADMAIN-form-group">

                      <label>
                        שם פרטי
                      </label>

                      <input
                        name="firstName"
                        placeholder="שם פרטי"
                        value={editingUser.firstName}
                        onChange={handleChange}
                      />

                    </div>


                    <div className="ADMAIN-form-group">

                      <label>
                        שם משפחה
                      </label>

                      <input
                        name="lastName"
                        placeholder="שם משפחה"
                        value={editingUser.lastName}
                        onChange={handleChange}
                      />

                    </div>


                    <div className="ADMAIN-form-group">

                      <label>
                        אימייל
                      </label>

                      <input
                        name="email"
                        type="email"
                        placeholder="אימייל"
                        value={editingUser.email}
                        onChange={handleChange}
                      />

                    </div>


                    <div className="ADMAIN-form-group">

                      <label>
                        כתובת
                      </label>

                      <input
                        name="address"
                        placeholder="כתובת"
                        value={editingUser.address}
                        onChange={handleChange}
                      />

                    </div>


                    <div className="ADMAIN-form-group">

                      <label>
                        עיר
                      </label>

                      <input
                        name="city"
                        placeholder="עיר"
                        value={editingUser.city}
                        onChange={handleChange}
                      />

                    </div>


                    <div className="ADMAIN-form-group">

                      <label>
                        תפקיד
                      </label>

                      <select
                        name="role"
                        value={editingUser.role}
                        onChange={handleChange}
                      >

                        <option value="user">
                          User
                        </option>

                        <option value="admin">
                          Admin
                        </option>

                      </select>

                    </div>


                    <div className="ADMAIN-user-edit-actions">

                      <button
                        className="ADMAIN-save-button"
                        onClick={handleSave}
                      >
                        שמירת שינויים
                      </button>


                      <button
                        className="ADMAIN-cancel-button"
                        onClick={handleCancelEdit}
                      >
                        ביטול
                      </button>

                    </div>


                  </div>

                </div>

              ) : (

                /* ==========================
                   NORMAL MODE
                ========================== */

                <>


                  {/* USER ICON */}

                  <div className="ADMAIN-user-icon">
                    👤
                  </div>


                  {/* USER INFORMATION */}

                  <div className="ADMAIN-item-info">

                    <div className="ADMAIN-item-name-row">

                      <h3>
                        {user.firstName} {user.lastName}
                      </h3>

                      <span
                        className={`ADMAIN-role ADMAIN-role-${user.role}`}
                      >
                        {user.role}
                      </span>

                    </div>


                    <p className="ADMAIN-item-description">

                      <strong>
                        אימייל:
                      </strong>{" "}

                      {user.email}

                    </p>


                    <div className="ADMAIN-user-details">

                      <span>
                        <strong>כתובת:</strong>{" "}
                        {user.address || "לא צוינה"}
                      </span>

                      <span>
                        <strong>עיר:</strong>{" "}
                        {user.city || "לא צוינה"}
                      </span>

                    </div>

                  </div>


                  {/* ACTIONS */}

                  <div className="ADMAIN-item-actions">


                    <button
                      className="ADMAIN-edit-button"
                      onClick={() => handleEdit(user)}
                    >

                      <span className="ADMAIN-edit-icon"></span>

                      עריכה

                    </button>


                    <button
                      className="ADMAIN-delete-button"
                      onClick={() => handleDelete(user._id)}
                    >

                      <span className="ADMAIN-delete-icon"></span>

                      מחיקה

                    </button>


                  </div>


                </>

              )}

            </div>

          ))}

        </div>

      </section>

    </div>
  );
};

export default AdminUsers;