import { useLocation, Link } from "react-router-dom";

export default function PaymentSuccess() {
  const location = useLocation();
  const orderId = location?.state?.orderId;

  return (
    <div style={{
      maxWidth: "700px",
      margin: "80px auto",
      padding: "36px",
      textAlign: "center",
      direction: "rtl",
      border: "1px solid #ddd",
      borderRadius: "12px",
      background: "#f9f9f9",
    }}>
      <h1 style={{ marginBottom: "12px" }}>ההזמנה בוצעה בהצלחה</h1>

      <p style={{ fontSize: "18px", marginBottom: "20px" }}>
        תודה על ההזמנה!
      </p>

      <div style={{
        padding: "18px",
        background: "#fff",
        borderRadius: "10px",
        border: "1px solid #eee",
      }}>
        <strong>מספר הזמנה:</strong>{" "}
        <span>{orderId || "-"}</span>
      </div>

      <div style={{ marginTop: "24px" }}>
        <Link
          to="/"
          style={{
            display: "inline-block",
            padding: "12px 20px",
            background: "#111",
            color: "white",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          לחזרה לבית
        </Link>
      </div>
    </div>
  );
}
