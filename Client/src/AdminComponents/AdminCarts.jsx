import { useEffect, useState } from "react";

import {
  getAllCartsAdmin,
  deleteCartAdmin,
} from "../API/ShoppingCartApi";

import "./AdminStyle.css";

const AdminCarts = () => {
  const [carts, setCarts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deletingId, setDeletingId] = useState(null);

  // =========================================
  // GET ALL CARTS
  // =========================================

  const loadCarts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllCartsAdmin();

      setCarts(data?.carts || []);
    } catch (err) {
      console.error("Error loading carts:", err);

      setError(
        err?.response?.data?.message ||
        "אירעה שגיאה בטעינת העגלות."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCarts();
  }, []);

  // =========================================
  // DELETE
  // =========================================

  const handleDelete = async (cartId) => {
    const confirmDelete = window.confirm(
      "האם אתה בטוח שברצונך למחוק את העגלה?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(cartId);

      await deleteCartAdmin(cartId);

      setCarts((prev) => prev.filter((cart) => cart._id !== cartId));
    } catch (err) {
      console.error("Error deleting cart:", err);

      setError(
        err?.response?.data?.message ||
        "אירעה שגיאה במחיקת העגלה."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================================
  // HELPERS
  // =========================================

  const getUserLabel = (user) => {
    if (!user) {
      return "משתמש לא ידוע";
    }

    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

    return fullName || user.email || "משתמש";
  };

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleDateString("he-IL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const totalItemsCount = carts.reduce(
    (sum, cart) =>
      sum + (cart.items?.reduce((s, item) => s + (item.quantity || 0), 0) || 0),
    0
  );

  return (
    <div className="ADMAIN-page">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="ADMAIN-header">

        <div>
          <span className="ADMAIN-page-label">
            ניהול עגלות
          </span>

          <h1>עגלות קניות</h1>

          <p>
            כאן ניתן לצפות בעגלות הקניות של כל הלקוחות ולמחוק עגלות.
          </p>
        </div>

        <div className="ADMAIN-count">
          <span>{carts.length}</span>

          <small>עגלות</small>
        </div>

      </div>


      {/* =========================================
          ERROR
      ========================================= */}

      {error && (
        <div className="ADMAIN-message ADMAIN-error-message">
          {error}
        </div>
      )}


      {/* =========================================
          LOADING
      ========================================= */}

      {loading && (
        <div className="ADMAIN-message ADMAIN-loading-message">

          <span className="ADMAIN-loader"></span>

          <span>
            טוען עגלות...
          </span>

        </div>
      )}


      {!loading && !error && (

        <>

          {/* =========================================
              SUMMARY
          ========================================= */}

          <div className="ADMAIN-message-summary">

            <div className="ADMAIN-message-summary-item">

              <span className="ADMAIN-message-summary-icon">
                🛒
              </span>

              <div>
                <strong>{carts.length}</strong>
                <span>סה״כ עגלות</span>
              </div>

            </div>


            <div className="ADMAIN-message-summary-item">

              <span className="ADMAIN-message-summary-icon">
                #
              </span>

              <div>
                <strong>{totalItemsCount}</strong>
                <span>פריטים בסך הכל</span>
              </div>

            </div>

          </div>


          {/* =========================================
              SECTION
          ========================================= */}

          <section className="ADMAIN-section">

            <div className="ADMAIN-section-header">

              <div>
                <h2>
                  כל העגלות
                </h2>

                <p>
                  עגלות הקניות הפעילות של הלקוחות
                </p>
              </div>

              <span className="ADMAIN-section-count">
                {carts.length}
              </span>

            </div>


            {/* =========================================
                EMPTY
            ========================================= */}

            {carts.length === 0 ? (

              <div className="ADMAIN-list">

                <div className="ADMAIN-empty-state">

                  <div className="ADMAIN-empty-icon">
                    🛒
                  </div>

                  <h3>
                    אין עגלות
                  </h3>

                  <p>
                    כרגע אין עגלות קניות פעילות במערכת.
                  </p>

                </div>

              </div>

            ) : (

              <div className="ADMAIN-list ADMAIN-message-list">

                {carts.map((cart) => (

                  <div
                    key={cart._id}
                    className="ADMAIN-item ADMAIN-message-item"
                  >

                    {/* =====================================
                        ICON
                    ===================================== */}

                    <div className="ADMAIN-message-icon">
                      <span>🛒</span>
                    </div>


                    {/* =====================================
                        INFORMATION
                    ===================================== */}

                    <div className="ADMAIN-item-info">

                      <div className="ADMAIN-item-name-row">
                        <h3>{getUserLabel(cart.user)}</h3>
                      </div>


                      {/* USER DETAILS */}

                      <div className="ADMAIN-message-user">

                        <span>
                          <strong>אימייל:</strong>{" "}
                          {cart.user?.email || "לא ידוע"}
                        </span>

                      </div>


                      {/* ITEMS */}

                      <div className="ADMAIN-message-body">

                        <strong>פריטים בעגלה:</strong>

                        {cart.items?.length ? (
                          <p>
                            {cart.items
                              .map(
                                (item) =>
                                  `${item.product?.name || "מוצר"} (מידה: ${
                                    item.size || "-"
                                  }, כמות: ${item.quantity})`
                              )
                              .join(" | ")}
                          </p>
                        ) : (
                          <p>העגלה ריקה</p>
                        )}

                      </div>


                      {/* DATE + SUM */}

                      <div className="ADMAIN-message-details">

                        <span>
                          <strong>עודכנה:</strong>{" "}
                          {formatDate(cart.updatedAt || cart.createdAt)}
                        </span>

                        <span>
                          <strong>סכום:</strong>{" "}
                          {cart.sum ?? 0} ₪
                        </span>

                      </div>

                    </div>


                    {/* =====================================
                        ACTIONS
                    ===================================== */}

                    <div className="ADMAIN-item-actions">

                      <button
                        className="ADMAIN-delete-button"
                        disabled={deletingId === cart._id}
                        onClick={() => handleDelete(cart._id)}
                      >

                        <span className="ADMAIN-delete-icon"></span>

                        מחיקה

                      </button>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>

        </>

      )}

    </div>
  );
};

export default AdminCarts;
