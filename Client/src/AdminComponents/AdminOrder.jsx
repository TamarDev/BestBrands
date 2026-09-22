import { useEffect, useState } from "react";

import {
  getAllOrders,
  updateOrder,
  deleteOrder,
} from "../API/OrderApi";

import "./AdminStyle.css";

const emptyShippingAddress = {
  fullName: "",
  email: "",
  address: "",
  city: "",
  zipCode: "",
};

const emptyOrder = {
  status: "pending",
  shippingAddress: emptyShippingAddress,
  note: "",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingOrder, setEditingOrder] = useState(emptyOrder);

  // ==========================
  // Load orders.
  // ==========================
  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllOrders();

      setOrders(data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "שגיאה בטעינת ההזמנות"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // ==========================
  // Start editing.
  // ==========================
  const handleEdit = (order) => {
    setEditingId(order._id);

    setEditingOrder({
      status: order.status || "pending",

      shippingAddress: {
        fullName:
          order.shippingAddress?.fullName || "",
        email:
          order.shippingAddress?.email || "",
        address:
          order.shippingAddress?.address || "",
        city:
          order.shippingAddress?.city || "",
        zipCode:
          order.shippingAddress?.zipCode || "",
      },

      note: order.note || "",
    });
  };

  // ==========================
  // Change the status or note.
  // ==========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditingOrder((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================
  // Change the address.
  // ==========================
  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setEditingOrder((prev) => ({
      ...prev,

      shippingAddress: {
        ...prev.shippingAddress,
        [name]: value,
      },
    }));
  };

  // ==========================
  // Save changes.
  // ==========================
  const handleSave = async () => {
    try {
      await updateOrder(editingId, editingOrder);

      setEditingId(null);
      setEditingOrder(emptyOrder);

      await loadOrders();
    } catch (err) {
      alert(
        err.response?.data?.error ||
          err.message ||
          "שגיאה בעדכון ההזמנה"
      );
    }
  };

  // ==========================
  // Cancel editing.
  // ==========================
  const handleCancel = () => {
    setEditingId(null);
    setEditingOrder(emptyOrder);
  };

  // ==========================
  // Delete the order.
  // ==========================
  const handleDelete = async (id) => {
    if (!window.confirm("למחוק את ההזמנה?")) {
      return;
    }

    try {
      await deleteOrder(id);

      await loadOrders();
    } catch (err) {
      alert(
        err.response?.data?.error ||
          err.message ||
          "שגיאה במחיקת ההזמנה"
      );
    }
  };

  // ==========================
  // Display status labels.
  // ==========================
  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "ממתינה";

      case "paid":
        return "שולמה";

      case "shipped":
        return "נשלחה";

      case "cancelled":
        return "בוטלה";

      default:
        return status || "לא ידוע";
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
            ניהול חנות
          </span>

          <h1>ניהול הזמנות</h1>

          <p>
            צפייה וניהול של הזמנות הלקוחות
          </p>
        </div>

        <div className="ADMAIN-count">
          <span>{orders.length}</span>
          <small>הזמנות</small>
        </div>

      </div>

      {/* ==========================
          LOADING
      ========================== */}
      {loading && (
        <div className="ADMAIN-message ADMAIN-loading-message">
          <span className="ADMAIN-loader"></span>
          טוען הזמנות...
        </div>
      )}

      {/* ==========================
          ERROR
      ========================== */}
      {error && (
        <div className="ADMAIN-message ADMAIN-error-message">
          {error}
        </div>
      )}

      {/* ==========================
          SECTION
      ========================== */}
      {!loading && !error && (
        <section className="ADMAIN-section">

          <div className="ADMAIN-section-header">

            <div>
              <h2>רשימת הזמנות</h2>

              <p>
                כל ההזמנות שהתקבלו במערכת
              </p>
            </div>

            <div className="ADMAIN-section-count">
              {orders.length}
            </div>

          </div>

          {/* ==========================
              EMPTY
          ========================== */}
          {orders.length === 0 ? (
            <div className="ADMAIN-list">

              <div className="ADMAIN-empty-state">

                <div className="ADMAIN-empty-icon">
                  📦
                </div>

                <h3>
                  אין הזמנות
                </h3>

                <p>
                  עדיין לא התקבלו הזמנות במערכת
                </p>

              </div>

            </div>
          ) : (

            /* ==========================
               ORDERS LIST
            ========================== */
            <div className="ADMAIN-list">

              {orders.map((order) => (

                <div
                  key={order._id}
                  className={`ADMAIN-item ADMAIN-order-item ${
                    editingId === order._id
                      ? "ADMAIN-editing"
                      : ""
                  }`}
                >

                  {editingId === order._id ? (

                    /* ==========================
                       EDIT MODE
                    ========================== */
                    <div className="ADMAIN-edit-item">

                      <div className="ADMAIN-edit-header">

                        <div>
                          <span>
                            עריכת הזמנה
                          </span>

                          <h3>
                            #{order._id}
                          </h3>
                        </div>

                        <button
                          className="ADMAIN-close-edit"
                          onClick={handleCancel}
                        >
                          ×
                        </button>

                      </div>

                      <div className="ADMAIN-order-edit-form">

                        {/* Status */}
                        <div className="ADMAIN-form-group">

                          <label>
                            סטטוס הזמנה
                          </label>

                          <select
                            name="status"
                            value={
                              editingOrder.status
                            }
                            onChange={handleChange}
                          >
                            <option value="pending">
                              ממתינה
                            </option>

                            <option value="paid">
                              שולמה
                            </option>

                            <option value="shipped">
                              נשלחה
                            </option>

                            <option value="cancelled">
                              בוטלה
                            </option>
                          </select>

                        </div>

                        {/* Full name */}
                        <div className="ADMAIN-form-group">

                          <label>
                            שם מלא
                          </label>

                          <input
                            name="fullName"
                            value={
                              editingOrder
                                .shippingAddress
                                .fullName
                            }
                            onChange={
                              handleAddressChange
                            }
                          />

                        </div>

                        {/* Email */}
                        <div className="ADMAIN-form-group">

                          <label>
                            אימייל
                          </label>

                          <input
                            type="email"
                            name="email"
                            value={
                              editingOrder
                                .shippingAddress
                                .email
                            }
                            onChange={
                              handleAddressChange
                            }
                          />

                        </div>

                        {/* Address */}
                        <div className="ADMAIN-form-group">

                          <label>
                            כתובת
                          </label>

                          <input
                            name="address"
                            value={
                              editingOrder
                                .shippingAddress
                                .address
                            }
                            onChange={
                              handleAddressChange
                            }
                          />

                        </div>

                        {/* City */}
                        <div className="ADMAIN-form-group">

                          <label>
                            עיר
                          </label>

                          <input
                            name="city"
                            value={
                              editingOrder
                                .shippingAddress
                                .city
                            }
                            onChange={
                              handleAddressChange
                            }
                          />

                        </div>

                        {/* Postal code */}
                        <div className="ADMAIN-form-group">

                          <label>
                            מיקוד
                          </label>

                          <input
                            name="zipCode"
                            value={
                              editingOrder
                                .shippingAddress
                                .zipCode
                            }
                            onChange={
                              handleAddressChange
                            }
                          />

                        </div>

                        {/* Note */}
                        <div className="ADMAIN-form-group">

                          <label>
                            הערה
                          </label>

                          <textarea
                            name="note"
                            value={
                              editingOrder.note
                            }
                            onChange={handleChange}
                          />

                        </div>

                        {/* Actions */}
                        <div className="ADMAIN-order-edit-actions">

                          <button
                            className="ADMAIN-save-button"
                            onClick={handleSave}
                          >
                            שמור שינויים
                          </button>

                          <button
                            className="ADMAIN-cancel-button"
                            onClick={handleCancel}
                          >
                            ביטול
                          </button>

                        </div>

                      </div>

                    </div>

                  ) : (

                    /* ==========================
                       DISPLAY MODE
                    ========================== */
                    <>
                      {/* Left side - icon */}
                      <div className="ADMAIN-order-icon">
                        📦
                      </div>

                      {/* Information */}
                      <div className="ADMAIN-item-info">

                        <div className="ADMAIN-item-name-row">

                          <h3>
                            הזמנה #{order._id}
                          </h3>

                          <span
                            className={`ADMAIN-order-status ADMAIN-status-${order.status}`}
                          >
                            {getStatusText(
                              order.status
                            )}
                          </span>

                        </div>

                        <div className="ADMAIN-order-details">

                          <span>
                            <strong>לקוח:</strong>{" "}
                            {order.user?.firstName}{" "}
                            {order.user?.lastName}
                          </span>

                          <span>
                            <strong>אימייל:</strong>{" "}
                            {order.user?.email || "-"}
                          </span>

                          <span>
                            <strong>סה״כ:</strong>{" "}
                            ₪{order.total}
                          </span>

                          <span>
                            <strong>תאריך:</strong>{" "}
                            {order.orderDate
                              ? new Date(
                                  order.orderDate
                                ).toLocaleDateString(
                                  "he-IL"
                                )
                              : "-"}
                          </span>

                        </div>

                        {/* Address */}
                        <div className="ADMAIN-order-address">

                          <span className="ADMAIN-order-subtitle">
                            כתובת משלוח
                          </span>

                          <div>
                            {order.shippingAddress
                              ?.fullName}{" "}
                            |{" "}
                            {order.shippingAddress
                              ?.address}{" "}
                            |{" "}
                            {order.shippingAddress
                              ?.city}{" "}
                            |{" "}
                            {order.shippingAddress
                              ?.zipCode}
                          </div>

                        </div>

                        {/* Products */}
                        <div className="ADMAIN-order-products">

                          <span className="ADMAIN-order-subtitle">
                            מוצרים
                          </span>

                          {order.items?.map(
                            (item, index) => (

                              <div
                                className="ADMAIN-order-product"
                                key={
                                  item._id ||
                                  index
                                }
                              >

                                <span>
                                  {item.product
                                    ?.name ||
                                    item.product ||
                                    "מוצר לא ידוע"}
                                </span>

                                <span>
                                  כמות:{" "}
                                  {item.quantity}
                                </span>

                                <span>
                                  מידה:{" "}
                                  {item.size ||
                                    "לא נבחרה"}
                                </span>

                              </div>

                            )
                          )}

                        </div>

                        {/* Note */}
                        {order.note && (
                          <div className="ADMAIN-order-note">

                            <strong>
                              הערה:
                            </strong>{" "}
                            {order.note}

                          </div>
                        )}

                      </div>

                      {/* Actions */}
                      <div className="ADMAIN-item-actions">

                        <button
                          className="ADMAIN-edit-button"
                          onClick={() =>
                            handleEdit(order)
                          }
                        >
                          <span className="ADMAIN-edit-icon"></span>
                          ערוך
                        </button>

                        <button
                          className="ADMAIN-delete-button"
                          onClick={() =>
                            handleDelete(
                              order._id
                            )
                          }
                        >
                          <span className="ADMAIN-delete-icon"></span>
                          מחק
                        </button>

                      </div>

                    </>
                  )}

                </div>

              ))}

            </div>

          )}

        </section>
      )}

    </div>
  );
};

export default AdminOrders;

