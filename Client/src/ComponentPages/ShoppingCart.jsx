import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./shoppingcart.css";

import {
  fetchCart,
  removeCartItem,
  updateCartItemQuantity,
  updateLocalQuantity,
  removeLocalItem,
} from "../store/slices/ShoppingCartSlice";


export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cart, loading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQuantityChange = (itemData, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;

    if (newQuantity < 1) {
      dispatch(removeLocalItem(itemData));
      dispatch(removeCartItem(itemData));
      return;
    }

    dispatch(
      updateLocalQuantity({
        ...itemData,
        quantity: newQuantity,
      })
    );

    dispatch(
      updateCartItemQuantity({
        ...itemData,
        quantity: newQuantity,
      })
    );
  };

  const handleRemoveItem = (itemData) => {
    dispatch(removeLocalItem(itemData));
    dispatch(removeCartItem(itemData));
  };

  if (loading && !cart) {
    return (
      <p className="cart-message">
        טוען את עגלת הקניות...
      </p>
    );
  }

  if (error) {
    return (
      <p className="cart-message cart-error">
        שגיאה: {error}
      </p>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <p className="cart-message">
        העגלה שלך ריקה בשלב זה 🛒
      </p>
    );
  }

  const totalPrice = cart.items.reduce(
    (total, item) =>
      total +
      (item.product?.price || 0) * (item.quantity || 0),
    0
  );

  const totalItems = cart.items.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  return (
    <div className="cart-page">

      {/* כותרת */}
      <div className="cart-header">
        <h1 className="cart-title">
          {totalItems} פריטים בסל
        </h1>

        <span className="cart-subtitle">
          עגלת הקניות שלי
        </span>
      </div>

      {/* רשימת המוצרים */}
      <div className="cart-container">

        {cart.items.map((item) => (
          <div
            key={`${item.product?._id}-${item.size ?? "no-size"}`}
            className="cart-item"
          >

            {/* תמונת המוצר */}
            <div className="cart-product-image-wrapper">
              <img
                src={item.product?.image}
                alt={item.product?.name || "מוצר"}
                className="item-image"
              />
            </div>

            {/* פרטי המוצר */}
            <div className="item-details">

              <h3 className="item-title">
                {item.product?.name}
              </h3>

              {item.size && (
                <p className="item-size">
                  מידה: {item.size}
                </p>
              )}

              <p className="item-code">
                מק"ט: {item.product?._id}
              </p>

            </div>

            {/* כמות */}
            <div className="quantity-section">

              <span className="quantity-label">
                כמות
              </span>

              <div className="qty-controls">

                <button
                  onClick={() =>
                    handleQuantityChange(
                      {
                        productId: item.product?._id,
                        size: item.size,
                      },
                      item.quantity,
                      -1
                    )
                  }
                  className="qty-btn"
                  aria-label="הפחת כמות"
                >
                  −
                </button>

                <span className="qty-value">
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    handleQuantityChange(
                      {
                        productId: item.product?._id,
                        size: item.size,
                      },
                      item.quantity,
                      1
                    )
                  }
                  className="qty-btn"
                  aria-label="הוסף כמות"
                >
                  +
                </button>

              </div>

            </div>

            {/* מחיר */}
            <div className="price-section">

              <span className="unit-price">
                ₪{item.product?.price}
              </span>

              <span className="item-total">
                ₪
                {(item.product?.price || 0) *
                  (item.quantity || 0)}
              </span>

            </div>

            {/* הסרה */}
            <button
              onClick={() =>
                handleRemoveItem({
                  productId: item.product?._id,
                  size: item.size,
                })
              }
              className="remove-btn"
            >
              הסר
            </button>

          </div>
        ))}

      </div>

      {/* סיכום */}
      <div className="cart-summary">

        <div className="summary-row">
          <span>סכום ביניים</span>

          <strong>
            ₪{totalPrice.toFixed(2)}
          </strong>
        </div>

        <div className="summary-divider"></div>

        <div className="summary-total">
          <span>סה"כ לתשלום</span>

          <strong>
            ₪{totalPrice.toFixed(2)}
          </strong>
        </div>

        <button
          onClick={() => navigate("/payment")}
          className="checkout-btn"
        >
          למעבר לתשלום
        </button>

      </div>

    </div>
  );
}