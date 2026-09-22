import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./shoppingcart.css";

import {
  fetchCart,
  removeCartItem,
  updateCartItemQuantity,
} from "../../store/slices/ShoppingCartSlice";


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
      dispatch(removeCartItem(itemData));
      return;
    }

    dispatch(
      updateCartItemQuantity({
        ...itemData,
        quantity: newQuantity,
      })
    );
  };

  const handleRemoveItem = (itemData) => {
    dispatch(removeCartItem(itemData));
  };

  if (loading && !cart) {
    return (
      <p className="cart-message">
        טוען את עגלת הקניות...
      </p>
    );
  }

  // An error that prevents loading the cart entirely; show a full error screen.
  if (error && !cart) {
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

      {/* Heading */}
      <div className="cart-header">
        <h1 className="cart-title">
          {totalItems} פריטים בסל
        </h1>

        <span className="cart-subtitle">
          עגלת הקניות שלי
        </span>
      </div>

      {/* Temporary action error, such as insufficient stock; keep the cart intact. */}
      {error && (
        <p className="cart-message cart-error">
          {error}
        </p>
      )}

      {/* Product list */}
      <div className="cart-container">

        {cart.items.map((item) => (
          <div
            key={`${item.product?._id}-${item.size ?? "no-size"}`}
            className="cart-item"
          >

            {/* Product image */}
            <div className="cart-product-image-wrapper">
              <img
                src={item.product?.image}
                alt={item.product?.name || "מוצר"}
                className="item-image"
              />
            </div>

            {/* Product details */}
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

            {/* Quantity */}
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

            {/* Price */}
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

            {/* Remove */}
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

      {/* Summary */}
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