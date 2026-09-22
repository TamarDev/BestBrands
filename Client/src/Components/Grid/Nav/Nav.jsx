import { useEffect, useState } from "react";
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

  const { cart } = useSelector(
    (state) => state.cart
  );


  // Load the cart when the user signs in.
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


  // Number of items in the cart.
  const itemCount =
    cart?.items?.reduce(
      (sum, item) =>
        sum + (item.quantity || 0),
      0
    ) || 0;


  return (

    <nav className="navbar">


      {/* Logo */}

      <div className="logo">

        <NavLink to="/">
          BRANDS
        </NavLink>

      </div>


      {/* Links */}

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


      {/* User area */}

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
        {/* User menu */}
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
        {/* Cart */}
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