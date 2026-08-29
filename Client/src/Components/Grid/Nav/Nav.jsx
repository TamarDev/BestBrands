// import React, { useEffect, useState } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";

// import {
//   FaShoppingCart,
//   FaUser,
//   FaSignInAlt,
// } from "react-icons/fa";

// import { logout } from "../../../store/slices/AuthSlice";
// import {
//   fetchCart,
// } from "../../../store/slices/ShoppingCartSlice";

// import "./Nav.css";


// export default function Nav() {

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [showLoginPrompt, setShowLoginPrompt] = useState(false);

//   const { user, token } = useSelector((state) => state.auth);

//   const isAdmin = user?.role === "admin";

//   const isCustomer =
//     user?.role === "user" ||
//     user?.role === "customer" ||
//     user?.role === "client";

//   const { cart } = useSelector(
//     (state) => state.cart
//   );


//   // טעינת העגלה בעת כניסה למשתמש
//   useEffect(() => {

//     if (token && !isAdmin) {
//       dispatch(fetchCart());
//     }

//   }, [token, dispatch, isAdmin]);


//   const handleLogout = () => {

//     dispatch(logout());

//     navigate("/");

//   };


//   const isLoggedIn = Boolean(user || token);


//   useEffect(() => {

//     if (!showLoginPrompt) return;

//     const timer = setTimeout(() => {
//       setShowLoginPrompt(false);
//     }, 3000);

//     return () => clearTimeout(timer);

//   }, [showLoginPrompt]);


//   const handleCartClick = (event) => {

//     if (!isLoggedIn) {

//       event.preventDefault();

//       setShowLoginPrompt(true);

//       return;
//     }

//     setShowLoginPrompt(false);
//   };


//   // מספר הפריטים בעגלה
//   const itemCount =
//     cart?.items?.reduce(
//       (sum, item) =>
//         sum + (item.quantity || 0),
//       0
//     ) || 0;


//   return (

//     <nav className="navbar">


//       {/* לוגו */}

//       <div className="logo">

//         <NavLink to="/">
//           BRANDS
//         </NavLink>

//       </div>


//       {/* קישורים */}

//       <div className="nav-links">


//         <NavLink to="/">
//           בית
//         </NavLink>


//         <NavLink to="/brands">
//           מותגים
//         </NavLink>


//         <NavLink to="/about">
//           אודות
//         </NavLink>


//         <NavLink
//           to="/orders"
//           onClick={() => {
//             window.dispatchEvent(
//               new CustomEvent("refreshCustomerOrders")
//             );
//           }}
//         >
//           הזמנות
//         </NavLink>


//         <NavLink to="/conection">
//           צור קשר
//         </NavLink>


//         {isAdmin && (
//           <NavLink to="/admin">
//             פאנל ניהול
//           </NavLink>
//         )}


//       </div>


//       {/* אזור משתמש */}

//       <div className="nav-user">


//         {isLoggedIn ? (

//           <button
//             className="logout-btn"
//             onClick={handleLogout}
//           >
//             יציאה
//           </button>

//         ) : (

//           <>

//             <NavLink
//               className="login-btn"
//               to="/login"
//             >

//               <FaSignInAlt />

//               התחברות

//             </NavLink>


//             <NavLink
//               className="register-btn"
//               to="/register"
//             >

//               <FaUser />

//               הרשמה

//             </NavLink>

//           </>

//         )}


//         {/* עגלה */}

//         {!isAdmin && (

//           <div className="cart-wrapper">

//             <NavLink
//               className="cart-btn"
//               to="/shoppingCart"
//               onClick={handleCartClick}
//             >

//               <FaShoppingCart />

//             </NavLink>


//             {!isLoggedIn && showLoginPrompt && (

//               <div className="cart-login-prompt">

//                 <p>
//                   עליך להתחבר כדי לצפות בעגלה
//                 </p>

//                 <NavLink
//                   to="/login"
//                   onClick={() =>
//                     setShowLoginPrompt(false)
//                   }
//                 >
//                   להתחברות
//                 </NavLink>

//               </div>

//             )}


//             {isLoggedIn && itemCount > 0 && (

//               <span className="cart-badge">
//                 {itemCount}
//               </span>

//             )}

//           </div>

//         )}


//         {!isLoggedIn && showLoginPrompt && (

//           <div className="cart-login-prompt">

//             <p>
//               עליך להתחבר כדי לצפות בעגלה
//             </p>

//             <NavLink
//               to="/login"
//               onClick={() =>
//                 setShowLoginPrompt(false)
//               }
//             >
//               להתחברות
//             </NavLink>

//           </div>

//         )}


//       </div>


//     </nav>

//   );

// }

import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  FaShoppingCart,
  FaUser,
  FaSignInAlt,
} from "react-icons/fa";

import { logout } from "../../../store/slices/AuthSlice";
import {
  fetchCart,
} from "../../../store/slices/ShoppingCartSlice";

import "./Nav.css";


export default function Nav() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const { user, token } = useSelector((state) => state.auth);

  const isAdmin = user?.role === "admin";

  const isCustomer =
    user?.role === "user" ||
    user?.role === "customer" ||
    user?.role === "client";

  const { cart } = useSelector(
    (state) => state.cart
  );


  // טעינת העגלה בעת כניסה למשתמש
  useEffect(() => {

    if (token && !isAdmin) {
      dispatch(fetchCart());
    }

  }, [token, dispatch, isAdmin]);


  const handleLogout = () => {

    dispatch(logout());

    navigate("/");

  };


  const isLoggedIn = Boolean(user || token);


  useEffect(() => {

    if (!showLoginPrompt) return;

    const timer = setTimeout(() => {
      setShowLoginPrompt(false);
    }, 3000);

    return () => clearTimeout(timer);

  }, [showLoginPrompt]);


  const handleCartClick = (event) => {

    if (!isLoggedIn) {

      event.preventDefault();

      setShowLoginPrompt(true);

      return;
    }

    setShowLoginPrompt(false);
  };


  // מספר הפריטים בעגלה
  const itemCount =
    cart?.items?.reduce(
      (sum, item) =>
        sum + (item.quantity || 0),
      0
    ) || 0;


  return (

    <nav className="navbar">


      {/* לוגו */}

      <div className="logo">

        <NavLink to="/">
          BRANDS
        </NavLink>

      </div>


      {/* קישורים */}

      <div className="nav-links">

        <NavLink to="/">
          בית
        </NavLink>


        <NavLink to="/brands">
          מותגים
        </NavLink>


        <NavLink to="/about">
          אודות
        </NavLink>


        {/* <NavLink
          to="/orders"
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent("refreshCustomerOrders")
            );
          }}
        >
          הזמנות
        </NavLink> */}

        {!isAdmin && (
        <NavLink to="/conection">
          צור קשר
        </NavLink>
        )}


        {isAdmin && (
          <NavLink to="/admin">
            פאנל ניהול
          </NavLink>
        )}

      </div>


      {/* אזור משתמש */}

      <div className="nav-user">


        {isLoggedIn ? (

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            יציאה
          </button>

        ) : (

          <>

            <NavLink
              className="login-btn"
              to="/login"
            >

              <FaSignInAlt />

              התחברות

            </NavLink>


            <NavLink
              className="register-btn"
              to="/register"
            >

              <FaUser />

              הרשמה

            </NavLink>

          </>

        )}


        {/* ========================= */}
        {/* תפריט משתמש */}
        {/* ========================= */}

        {user?.role === "user" && (

          <div className="user-menu">

            <button
              className="user-icon-btn"
              aria-label="תפריט משתמש"
            >
              <FaUser />
            </button>


            <div className="user-dropdown">

              <NavLink
                to="/profile"
                className="user-dropdown-link"
              >
                הפרטים שלי
              </NavLink>


              <NavLink
                to="/orders"
                className="user-dropdown-link"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent("refreshCustomerOrders")
                  );
                }}
              >
                ההזמנות שלי
              </NavLink>

            </div>

          </div>

        )}


        {/* ========================= */}
        {/* עגלה */}
        {/* ========================= */}

        {!isAdmin && (

          <div className="cart-wrapper">

            <NavLink
              className="cart-btn"
              to="/shoppingCart"
              onClick={handleCartClick}
            >

              <FaShoppingCart />

            </NavLink>


            {isLoggedIn && itemCount > 0 && (

              <span className="cart-badge">
                {itemCount}
              </span>

            )}


            {!isLoggedIn && showLoginPrompt && (

              <div className="cart-login-prompt">

                <p>
                  עליך להתחבר כדי לצפות בעגלה
                </p>

                <NavLink
                  to="/login"
                  onClick={() =>
                    setShowLoginPrompt(false)
                  }
                >
                  להתחברות
                </NavLink>

              </div>

            )}

          </div>

        )}

      </div>


    </nav>

  );

}