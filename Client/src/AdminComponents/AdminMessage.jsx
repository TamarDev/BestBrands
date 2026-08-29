import { useEffect, useState } from "react";

import {
  getAllMessages,
  deleteMessage,
  updateMessageStatus,
  markMessageAsRead,
} from "../API/Message.js";

import "./AdminStyle.css";

const AdminMessage = () => {
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] = useState(null);

  // =========================================
  // GET ALL MESSAGES
  // =========================================

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllMessages();

      setMessages(data);
    } catch (err) {
      console.error("Error loading messages:", err);

      setError(
        err?.response?.data?.message ||
        "אירעה שגיאה בטעינת ההודעות."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  // =========================================
  // MARK AS READ
  // =========================================

  const handleMarkAsRead = async (messageId) => {
    try {
      setUpdatingId(messageId);

      await markMessageAsRead(messageId);

      setMessages((prev) =>
        prev.map((message) =>
          message._id === messageId
            ? { ...message, isRead: true }
            : message
        )
      );
    } catch (err) {
      console.error("Error marking message as read:", err);

      setError(
        err?.response?.data?.message ||
        "אירעה שגיאה בסימון ההודעה."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================================
  // UPDATE STATUS
  // =========================================

  const handleStatusChange = async (messageId, status) => {
    try {
      setUpdatingId(messageId);

      await updateMessageStatus(messageId, status);

      setMessages((prev) =>
        prev.map((message) =>
          message._id === messageId
            ? { ...message, status }
            : message
        )
      );
    } catch (err) {
      console.error("Error updating message status:", err);

      setError(
        err?.response?.data?.message ||
        "אירעה שגיאה בעדכון הסטטוס."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================================
  // DELETE
  // =========================================

  const handleDelete = async (messageId) => {
    const confirmDelete = window.confirm(
      "האם אתה בטוח שברצונך למחוק את ההודעה?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setUpdatingId(messageId);

      await deleteMessage(messageId);

      setMessages((prev) =>
        prev.filter((message) => message._id !== messageId)
      );
    } catch (err) {
      console.error("Error deleting message:", err);

      setError(
        err?.response?.data?.message ||
        "אירעה שגיאה במחיקת ההודעה."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================================
  // STATUS TEXT
  // =========================================

  const getStatusText = (status) => {
    switch (status) {
      case "new":
        return "חדשה";

      case "inProgress":
        return "בטיפול";

      case "answered":
        return "נענתה";

      case "closed":
        return "סגורה";

      default:
        return status;
    }
  };

  // =========================================
  // STATUS CLASS
  // =========================================

  const getStatusClass = (status) => {
    switch (status) {
      case "new":
        return "ADMAIN-message-status-new";

      case "inProgress":
        return "ADMAIN-message-status-progress";

      case "answered":
        return "ADMAIN-message-status-answered";

      case "closed":
        return "ADMAIN-message-status-closed";

      default:
        return "";
    }
  };

  // =========================================
  // DATE
  // =========================================

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

  // =========================================
  // UNREAD COUNT
  // =========================================

  const unreadCount = messages.filter(
    (message) => !message.isRead
  ).length;

  return (
    <div className="ADMAIN-page">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="ADMAIN-header">

        <div>
          <span className="ADMAIN-page-label">
            ניהול פניות
          </span>

          <h1>הודעות לקוחות</h1>

          <p>
            כאן ניתן לצפות ולנהל את ההודעות שנשלחו מהלקוחות.
          </p>
        </div>

        <div className="ADMAIN-count">
          <span>{messages.length}</span>

          <small>הודעות</small>
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
            טוען הודעות...
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
                ✉
              </span>

              <div>
                <strong>{messages.length}</strong>
                <span>סה״כ הודעות</span>
              </div>

            </div>


            <div className="ADMAIN-message-summary-item">

              <span className="ADMAIN-message-summary-icon">
                ●
              </span>

              <div>
                <strong>{unreadCount}</strong>
                <span>הודעות חדשות</span>
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
                  כל ההודעות
                </h2>

                <p>
                  פניות אחרונות של לקוחות
                </p>
              </div>

              <span className="ADMAIN-section-count">
                {messages.length}
              </span>

            </div>


            {/* =========================================
                EMPTY
            ========================================= */}

            {messages.length === 0 ? (

              <div className="ADMAIN-list">

                <div className="ADMAIN-empty-state">

                  <div className="ADMAIN-empty-icon">
                    ✉
                  </div>

                  <h3>
                    אין הודעות
                  </h3>

                  <p>
                    עדיין לא התקבלו הודעות מלקוחות.
                  </p>

                </div>

              </div>

            ) : (

              <div className="ADMAIN-list ADMAIN-message-list">

                {messages.map((message) => (

                  <div
                    key={message._id}
                    className={`ADMAIN-item ADMAIN-message-item ${
                      !message.isRead
                        ? "ADMAIN-message-unread"
                        : ""
                    }`}
                  >

                    {/* =====================================
                        ICON
                    ===================================== */}

                    <div className="ADMAIN-message-icon">

                      <span>
                        {message.isRead ? "✉" : "●"}
                      </span>

                    </div>


                    {/* =====================================
                        INFORMATION
                    ===================================== */}

                    <div className="ADMAIN-item-info">

                      <div className="ADMAIN-item-name-row">

                        <h3>
                          {message.subject}
                        </h3>

                        {!message.isRead && (
                          <span className="ADMAIN-unread-label">
                            חדשה
                          </span>
                        )}

                      </div>


                      {/* USER DETAILS */}

                      <div className="ADMAIN-message-user">

                        <span>
                          <strong>לקוח:</strong>{" "}
                          {message.userId?.fullName ||
                            `${message.userId?.firstName || ""} ${
                              message.userId?.lastName || ""
                            }`.trim() ||
                            "משתמש"}
                        </span>

                        <span>
                          <strong>אימייל:</strong>{" "}
                          {message.userId?.email || "לא ידוע"}
                        </span>

                      </div>


                      {/* MESSAGE */}

                      <div className="ADMAIN-message-body">

                        <strong>הודעה:</strong>

                        <p>
                          {message.body}
                        </p>

                      </div>


                      {/* DATE + STATUS */}

                      <div className="ADMAIN-message-details">

                        <span>
                          <strong>נשלחה:</strong>{" "}
                          {formatDate(message.createdAt)}
                        </span>

                        <span>
                          <strong>סטטוס:</strong>

                          <span
                            className={`ADMAIN-message-status ${getStatusClass(
                              message.status
                            )}`}
                          >
                            {getStatusText(message.status)}
                          </span>

                        </span>

                      </div>

                    </div>


                    {/* =====================================
                        ACTIONS
                    ===================================== */}

                    <div className="ADMAIN-item-actions">

                      {/* STATUS */}

                      <select
                        className="ADMAIN-message-status-select"
                        value={message.status}
                        disabled={updatingId === message._id}
                        onChange={(e) =>
                          handleStatusChange(
                            message._id,
                            e.target.value
                          )
                        }
                      >

                        <option value="new">
                          חדשה
                        </option>

                        <option value="inProgress">
                          בטיפול
                        </option>

                        <option value="answered">
                          נענתה
                        </option>

                        <option value="closed">
                          סגורה
                        </option>

                      </select>


                      {/* READ */}

                      {!message.isRead && (

                        <button
                          className="ADMAIN-edit-button"
                          disabled={
                            updatingId === message._id
                          }
                          onClick={() =>
                            handleMarkAsRead(message._id)
                          }
                        >
                          <span>✓</span>
                          סמן כנקראה
                        </button>

                      )}


                      {/* DELETE */}

                      <button
                        className="ADMAIN-delete-button"
                        disabled={
                          updatingId === message._id
                        }
                        onClick={() =>
                          handleDelete(message._id)
                        }
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

export default AdminMessage;