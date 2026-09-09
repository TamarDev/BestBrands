import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getOrdersByUser } from "../../API/OrderApi";
import "./Orders.css";

export default function Orders() {
  const { user, token, authInitialized } = useSelector(
    (state) => state.auth || {}
  );

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // טעינת ההזמנות
  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getOrdersByUser();

      setOrders(data || []);
    } catch (err) {
      console.error("Load orders error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "שגיאה בטעינת ההזמנות"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // טעינת ההזמנות ברגע שהעמוד נטען
  // ורק אחרי שההתחברות שוחזרה
  useEffect(() => {
    if (!authInitialized) return;

    if (!token || !user) {
      setOrders([]);
      setError("יש להתחבר כדי לראות הזמנות");
      return;
    }

    loadOrders();
  }, [authInitialized, token, user, loadOrders]);

  return (
    <section className="orders-page">

      <div className="orders-header">
        <h1 className="orders-title">
          ההזמנות שלי
        </h1>

        <span className="orders-subtitle">
          היסטוריית ההזמנות שלך
        </span>
      </div>

      {loading && (
        <p className="orders-message">
          טוען הזמנות...
        </p>
      )}

      {error && (
        <p className="orders-message orders-error">
          {error}
        </p>
      )}

      {!loading && !error && orders.length === 0 && (
        <p className="orders-message">
          אין הזמנות להצגה
        </p>
      )}

      <div className="orders-list">
        {orders.map((order) => (
          <article
            key={order._id}
            className="order-card"
          >

            <div className="order-header">

              <div>
                <span className="order-label">
                  הזמנה
                </span>

                <h3 className="order-number">
                  #{order._id}
                </h3>
              </div>

              <div className="order-status">
                {order.status || "-"}
              </div>

            </div>

            <div className="order-main-info">

              <div className="order-info-item">
                <span className="info-label">
                  לקוח
                </span>

                <span className="info-value">
                  {order.user?.firstName || ""}{" "}
                  {order.user?.lastName || ""}
                </span>
              </div>

              <div className="order-info-item">
                <span className="info-label">
                  אימייל
                </span>

                <span className="info-value">
                  {order.user?.email || "-"}
                </span>
              </div>

              <div className="order-info-item">
                <span className="info-label">
                  תאריך
                </span>

                <span className="info-value">
                  {order.orderDate
                    ? new Date(order.orderDate).toLocaleDateString()
                    : "-"}
                </span>
              </div>

              <div className="order-info-item order-total">
                <span className="info-label">
                  סה"כ
                </span>

                <span className="info-value">
                  ₪{order.total || 0}
                </span>
              </div>

            </div>

            <div className="order-content">

              <div className="order-section">

                <h4 className="section-title">
                  כתובת למשלוח
                </h4>

                {order.shippingAddress ? (
                  <div className="shipping-details">

                    <p>
                      <span>כתובת:</span>{" "}
                      {order.shippingAddress.address || "-"}
                    </p>

                    <p>
                      <span>עיר:</span>{" "}
                      {order.shippingAddress.city || "-"}
                    </p>

                    <p>
                      <span>מיקוד:</span>{" "}
                      {order.shippingAddress.zipCode || "-"}
                    </p>

                  </div>
                ) : (
                  <p className="empty-value">
                    -
                  </p>
                )}

              </div>

              <div className="order-section">

                <h4 className="section-title">
                  מוצרים
                </h4>

                <div className="order-products">

                  {(order.items || []).map((item, index) => (
                    <div
                      key={item._id || index}
                      className="order-product"
                    >

                      <span className="product-name">
                        {item.product?.name || "מוצר"}
                      </span>

                      <span className="product-quantity">
                        × {item.quantity}
                      </span>

                    </div>
                  ))}

                </div>

              </div>

            </div>

            <div className="order-note">

              <span className="note-label">
                הערה
              </span>

              <span className="note-value">
                {order.note || "-"}
              </span>

            </div>

          </article>
        ))}
      </div>

    </section>
  );
}
