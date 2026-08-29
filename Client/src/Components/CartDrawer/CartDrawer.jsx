import React from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  closeCartPreview,
  removeCartItem,
  removeLocalItem,
  updateCartItemQuantity,
  updateLocalQuantity,
} from "../../store/slices/ShoppingCartSlice.js";

import "./CartDrawer.css";

export default function CartDrawer() {
  const dispatch = useDispatch();

  const { cart, isCartPreviewOpen } = useSelector(
    (state) => state.cart
  );

  const itemCount =
    cart?.items?.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    ) || 0;

  const handleClose = () => {
    dispatch(closeCartPreview());
  };

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

  return (
    <>
      {/* רקע כהה */}
      {isCartPreviewOpen && (
        <div
          className="cart-drawer-overlay"
          onClick={handleClose}
        />
      )}

      {/* העגלה */}
      <aside
        className={`cart-drawer ${
          isCartPreviewOpen ? "open" : ""
        }`}
      >

        {/* כותרת */}
        <div className="cart-drawer-header">

          <h2>
            סל הקניות
          </h2>

          <button
            className="cart-drawer-close"
            onClick={handleClose}
          >
            ×
          </button>

        </div>


        {/* תוכן */}
        <div className="cart-drawer-content">

          <div className="cart-drawer-title">
            <strong>
              המשלוח שלך בחינם!
            </strong>

            <div className="free-shipping-line">
              <span></span>
            </div>
          </div>


          {cart?.items?.length ? (

            <div className="cart-drawer-items">

              {cart.items.map((item, index) => {

                const itemKey = item?._id
                  ? `${item._id}-${item.size ?? "no-size"}`
                  : `${item.product?._id ?? "product"}-${item.size ?? "no-size"}-${index}`;

                return (
                  <div
                    className="cart-drawer-item"
                    key={itemKey}
                  >

                    {/* תמונה */}
                    <div className="cart-drawer-image">
                      <img
                        src={item.product?.image}
                        alt={item.product?.name}
                      />
                    </div>


                    {/* פרטים */}
                    <div className="cart-drawer-info">

                      <h3>
                        {item.product?.name}
                      </h3>

                      <p>
                        צבע: {item.product?.color || "לא צוין"}
                      </p>

                      <p>
                        מידה: {item.size || "לא צוין"}
                      </p>

                      <div className="cart-drawer-bottom">

                        <span className="cart-drawer-price">
                          {item.product?.price}₪
                        </span>

                        <div className="cart-drawer-quantity">

                          <button
                            type="button"
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
                          >
                            +
                          </button>

                          <span>
                            {item.quantity}
                          </span>

                          <button
                            type="button"
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
                          >
                            −
                          </button>

                        </div>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

          ) : (

            <div className="cart-drawer-empty">
              העגלה שלך ריקה
            </div>

          )}

        </div>


        {/* תחתית */}
        <div className="cart-drawer-footer">

          <div className="cart-drawer-total">

            <span>
              סה"כ
            </span>

            <strong>
              {cart?.sum || 0}₪
            </strong>

          </div>


          <NavLink
            to="/shoppingCart"
            className="cart-drawer-checkout"
            onClick={handleClose}
          >
            מעבר לעגלה
          </NavLink>

        </div>

      </aside>
    </>
  );
}