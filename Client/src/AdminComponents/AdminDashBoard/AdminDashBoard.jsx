import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { fetchBrands } from "../../store/slices/BrandSlice";
import { fetchProducts } from "../../store/slices/ProductSlice";

import { getAllCategories } from "../../API/CategoryApi";
import { getAllUsers } from "../../API/UserApi";
import { getAllOrders } from "../../API/OrderApi";
import { getAllMessages } from "../../API/Message.js";

import "./AdminDashBoard.css";


const HEBREW_MONTHS = [
  "ינו",
  "פבר",
  "מרץ",
  "אפר",
  "מאי",
  "יונ",
  "יול",
  "אוג",
  "ספט",
  "אוק",
  "נוב",
  "דצמ",
];


const STATUS_META = {
  pending: {
    label: "בטיפול",
    color: "#f59e0b",
  },

  paid: {
    label: "שולם",
    color: "#3b82f6",
  },

  shipped: {
    label: "נשלח",
    color: "#22c55e",
  },

  cancelled: {
    label: "בוטל",
    color: "#ef4444",
  },
};


// =========================================================
// בניית נתוני מגמת הזמנות
// 6 חודשים אחרונים
// =========================================================

function buildOrdersTrend(orders) {
  const now = new Date();

  const months = Array.from(
    { length: 6 },
    (_, i) => {
      const d = new Date(
        now.getFullYear(),
        now.getMonth() - (5 - i),
        1
      );

      return {
        key: `${d.getFullYear()}-${d.getMonth()}`,

        label: HEBREW_MONTHS[d.getMonth()],

        revenue: 0,

        orders: 0,
      };
    }
  );


  orders.forEach((order) => {
    if (!order.orderDate) {
      return;
    }

    const d = new Date(order.orderDate);

    const key = `${d.getFullYear()}-${d.getMonth()}`;

    const bucket = months.find(
      (m) => m.key === key
    );

    if (bucket) {
      bucket.revenue +=
        Number(order.total) || 0;

      bucket.orders += 1;
    }
  });


  return months;
}


// =========================================================
// בניית פילוח הזמנות לפי סטטוס
// =========================================================

function buildStatusBreakdown(orders) {
  const counts = {
    pending: 0,
    paid: 0,
    shipped: 0,
    cancelled: 0,
  };


  orders.forEach((order) => {
    const status =
      order.status || "pending";


    if (counts[status] !== undefined) {
      counts[status] += 1;
    }
  });


  return Object.entries(counts)

    .map(([key, value]) => ({
      key,
      value,
      ...STATUS_META[key],
    }))

    .filter(
      (item) => item.value > 0
    );
}


// =========================================================
// בניית פילוח מוצרים לפי מותג
// =========================================================

function buildBrandBreakdown(
  products,
  brands
) {
  const counts = {};


  products.forEach((product) => {
    const brandId =
      product.brand?._id ||
      product.brand;


    const brandName =
      product.brand?.name ||
      brands.find(
        (b) => b._id === brandId
      )?.name ||
      "לא ידוע";


    counts[brandName] =
      (counts[brandName] || 0) + 1;
  });


  return Object.entries(counts)

    .map(([name, count]) => ({
      name,
      count,
    }))

    .sort(
      (a, b) => b.count - a.count
    )

    .slice(0, 6);
}


// =========================================================
// בניית רשימת מוצרים במלאי נמוך
// =========================================================

function buildLowStock(products) {
  return products

    .map((product) => {
      const stock =
        (product.sizes || []).reduce(
          (sum, s) =>
            sum +
            (Number(s.stock) || 0),
          0
        );


      return {
        id: product._id,
        name: product.name,
        stock,
      };
    })

    .sort(
      (a, b) => a.stock - b.stock
    )

    .slice(0, 5);
}


// =========================================================
// בניית פילוח הודעות
// =========================================================

function buildMessagesBreakdown(messages) {

  const counts = {
    new: 0,
    inProgress: 0,
    answered: 0,
    closed: 0,
  };


  messages.forEach((message) => {

    const status =
      message.status || "new";


    if (
      counts[status] !== undefined
    ) {
      counts[status] += 1;
    }

  });


  return [
    {
      key: "new",
      label: "חדשות",
      value: counts.new,
      color: "#3b82f6",
    },

    {
      key: "inProgress",
      label: "בטיפול",
      value: counts.inProgress,
      color: "#f59e0b",
    },

    {
      key: "answered",
      label: "נענו",
      value: counts.answered,
      color: "#22c55e",
    },

    {
      key: "closed",
      label: "סגורות",
      value: counts.closed,
      color: "#6b7280",
    },
  ];
}


// =========================================================
// DASHBOARD
// =========================================================

export default function AdminDashboard() {

  const dispatch = useDispatch();


  // =========================================================
  // REDUX
  // =========================================================

  const {
    items: brands = [],
  } = useSelector(
    (state) => state.brands
  );


  const {
    products = [],
  } = useSelector(
    (state) => state.products
  );


  // =========================================================
  // API DATA
  // =========================================================

  const [orders, setOrders] =
    useState([]);


  const [categoriesCount, setCategoriesCount] =
    useState(null);


  const [usersCount, setUsersCount] =
    useState(null);


  // =========================================================
  // הודעות
  // =========================================================

  const [messages, setMessages] =
    useState([]);


  const [statsError, setStatsError] =
    useState("");


  // =========================================================
  // טעינת נתוני הדשבורד
  // =========================================================

  useEffect(() => {

    dispatch(fetchBrands());

    dispatch(fetchProducts());


    const loadStats = async () => {

      try {

        const [
          categories,
          users,
          ordersData,
          messagesData,
        ] = await Promise.all([

          getAllCategories(),

          getAllUsers(),

          getAllOrders(),

          getAllMessages(),

        ]);


        // נתונים קיימים

        setCategoriesCount(
          categories.length
        );


        setUsersCount(
          users.length
        );


        setOrders(
          ordersData
        );


        // הודעות

        setMessages(
          messagesData
        );


        setStatsError("");


      } catch (err) {

        console.error(
          "שגיאה בטעינת נתוני הדשבורד:",
          err
        );

        setStatsError(
          err.response?.data?.message ||
          err.response?.data?.error ||
          "שגיאה בטעינת נתוני הדשבורד"
        );

      }

    };


    loadStats();

  }, [dispatch]);


  // =========================================================
  // חישוב נתוני הדיאגרמות
  // =========================================================

  const ordersTrend = useMemo(
    () =>
      buildOrdersTrend(orders),
    [orders]
  );


  const statusBreakdown = useMemo(
    () =>
      buildStatusBreakdown(
        orders
      ),
    [orders]
  );


  const brandBreakdown = useMemo(
    () =>
      buildBrandBreakdown(
        products,
        brands
      ),
    [
      products,
      brands,
    ]
  );


  const lowStock = useMemo(
    () =>
      buildLowStock(
        products
      ),
    [products]
  );


  // =========================================================
  // פילוח הודעות
  // =========================================================

  const messagesBreakdown =
    useMemo(
      () =>
        buildMessagesBreakdown(
          messages
        ),
      [messages]
    );


  // =========================================================
  // הכנסות
  // =========================================================

  const totalRevenue =
    useMemo(
      () =>
        ordersTrend.reduce(
          (sum, m) =>
            sum + m.revenue,
          0
        ),
      [ordersTrend]
    );


  // =========================================================
  // הצגת נתון בזמן טעינה
  // =========================================================

  const show = (value) =>
    value === null
      ? "…"
      : value;


  return (

    <div
      className="dashboard-page"
      dir="rtl"
    >


      {/* =================================================
          HEADER
      ================================================= */}

      <header className="dashboard-header">

        <div>

          <span className="dashboard-label">
            ADMIN PANEL
          </span>


          <h1>
            פאנל ניהול
          </h1>


          <p>
            ניהול החנות, המוצרים,
            המשתמשים וההזמנות במקום אחד.
          </p>

        </div>


        <div className="dashboard-status">

          <span className="status-dot"></span>

          המערכת פעילה

        </div>

      </header>


      {statsError && (

        <div
          style={{
            background: "#fdecea",
            color: "#b3261e",
            padding: "10px 16px",
            borderRadius: "8px",
            fontWeight: 600,
            marginBottom: "20px",
          }}
        >
          ⚠️ {statsError}
        </div>

      )}


      {/* =================================================
          STATISTICS
      ================================================= */}

      <section className="dashboard-stats">


        <div className="stat-card">

          <div className="stat-icon">
            01
          </div>


          <div>

            <span>
              מוצרים
            </span>


            <strong>
              {show(products.length)}
              {" "}
              במערכת
            </strong>

          </div>


          <Link to="/admin/products">
            →
          </Link>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            02
          </div>


          <div>

            <span>
              הזמנות
            </span>


            <strong>
              {show(orders.length)}
              {" "}
              סה"כ
            </strong>

          </div>


          <Link to="/admin/orders">
            →
          </Link>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            03
          </div>


          <div>

            <span>
              משתמשים
            </span>


            <strong>
              {show(usersCount)}
              {" "}
              רשומים
            </strong>

          </div>


          <Link to="/admin/users">
            →
          </Link>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            04
          </div>


          <div>

            <span>
              מותגים
            </span>


            <strong>
              {show(brands.length)}
              {" "}
              פעילים
            </strong>

          </div>


          <Link to="/admin/brands">
            →
          </Link>

        </div>


      </section>


      {/* =================================================
          MESSAGES OVERVIEW
      ================================================= */}

      <section className="dashboard-section messages-dashboard-section">


        <div className="dashboard-section-header">

          <div>

            <h2>
              פניות לקוחות
            </h2>


            <p>
              תמונת מצב של הודעות הלקוחות במערכת
            </p>

          </div>


          <Link
            to="/admin/messages"
            className="messages-view-all"
          >
            ניהול הודעות ←
          </Link>

        </div>


        <div className="messages-dashboard-card">


          {/* =================================================
              DONUT
          ================================================= */}

          <div className="messages-donut-wrapper">

            <ResponsiveContainer
              width="100%"
              height={250}
            >

              <PieChart>

                <Pie
                  data={messagesBreakdown}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={4}
                  stroke="none"
                >

                  {messagesBreakdown.map(
                    (entry) => (

                      <Cell
                        key={entry.key}
                        fill={entry.color}
                      />

                    )
                  )}

                </Pie>


                <Tooltip
                  formatter={(
                    value,
                    name
                  ) => [
                    `${value} הודעות`,
                    name,
                  ]}
                  contentStyle={{
                    borderRadius: 8,
                    border:
                      "1px solid #e5e7eb",
                    fontSize: 12,
                    direction: "rtl",
                  }}
                />

              </PieChart>

            </ResponsiveContainer>


            {/* =================================================
                CENTER OF DONUT
            ================================================= */}

            <div className="messages-donut-center">

              <strong>
                {messages.length}
              </strong>


              <span>
                סה״כ הודעות
              </span>

            </div>

          </div>


          {/* =================================================
              MESSAGE STATUS SUMMARY
          ================================================= */}

          <div className="messages-status-summary">

            {messagesBreakdown.map(
              (item) => (

                <div
                  className="messages-status-item"
                  key={item.key}
                >

                  <div className="messages-status-title">

                    <span
                      className="messages-status-dot"
                      style={{
                        backgroundColor:
                          item.color,
                      }}
                    ></span>


                    <span>
                      {item.label}
                    </span>

                  </div>


                  <strong>
                    {item.value}
                  </strong>

                </div>

              )
            )}

          </div>

        </div>

      </section>


      {/* =================================================
          CHARTS
      ================================================= */}

      <section className="dashboard-section">


        <div className="dashboard-section-header">

          <div>

            <h2>
              תמונת מצב
            </h2>


            <p>
              מגמות מכירות, הזמנות ומלאי לאורך זמן
            </p>

          </div>

        </div>


        <div className="charts-grid">


          {/* =================================================
              REVENUE
          ================================================= */}

          <div className="chart-card chart-card-wide">

            <div className="chart-card-header">

              <div>

                <h3>
                  מגמת הכנסות
                </h3>


                <p>
                  סך הכנסות מהזמנות
                  ב-6 החודשים האחרונים
                </p>

              </div>


              <strong className="chart-card-value">

                ₪
                {totalRevenue.toLocaleString()}

              </strong>

            </div>


            {orders.length === 0 ? (

              <div className="chart-empty">
                אין עדיין נתוני הזמנות להצגה
              </div>

            ) : (

              <ResponsiveContainer
                width="100%"
                height={230}
              >

                <AreaChart
                  data={ordersTrend}
                >

                  <defs>

                    <linearGradient
                      id="revenueFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >

                      <stop
                        offset="0%"
                        stopColor="#111827"
                        stopOpacity={0.25}
                      />

                      <stop
                        offset="100%"
                        stopColor="#111827"
                        stopOpacity={0}
                      />

                    </linearGradient>

                  </defs>


                  <CartesianGrid
                    vertical={false}
                    stroke="#f0f1f3"
                  />


                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#9ca3af",
                      fontSize: 12,
                    }}
                  />


                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#9ca3af",
                      fontSize: 12,
                    }}
                    width={40}
                  />


                  <Tooltip
                    formatter={(value) => [
                      `₪${value.toLocaleString()}`,
                      "הכנסות",
                    ]}
                    contentStyle={{
                      borderRadius: 8,
                      border:
                        "1px solid #e5e7eb",
                      fontSize: 12,
                      direction: "rtl",
                    }}
                  />


                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#111827"
                    strokeWidth={2}
                    fill="url(#revenueFill)"
                  />

                </AreaChart>

              </ResponsiveContainer>

            )}

          </div>


          {/* =================================================
              ORDER STATUS
          ================================================= */}

          <div className="chart-card">

            <div className="chart-card-header">

              <div>

                <h3>
                  סטטוס הזמנות
                </h3>


                <p>
                  פילוח כלל ההזמנות
                </p>

              </div>

            </div>


            {statusBreakdown.length === 0 ? (

              <div className="chart-empty">
                אין עדיין נתוני הזמנות להצגה
              </div>

            ) : (

              <>

                <ResponsiveContainer
                  width="100%"
                  height={170}
                >

                  <PieChart>

                    <Pie
                      data={statusBreakdown}
                      dataKey="value"
                      nameKey="label"
                      innerRadius={48}
                      outerRadius={70}
                      paddingAngle={3}
                      stroke="none"
                    >

                      {statusBreakdown.map(
                        (entry) => (

                          <Cell
                            key={entry.key}
                            fill={entry.color}
                          />

                        )
                      )}

                    </Pie>


                    <Tooltip
                      formatter={(
                        value,
                        name
                      ) => [
                        `${value} הזמנות`,
                        name,
                      ]}
                      contentStyle={{
                        borderRadius: 8,
                        border:
                          "1px solid #e5e7eb",
                        fontSize: 12,
                        direction: "rtl",
                      }}
                    />

                  </PieChart>

                </ResponsiveContainer>


                <div className="status-legend">

                  {statusBreakdown.map(
                    (entry) => (

                      <div
                        className="status-legend-item"
                        key={entry.key}
                      >

                        <span
                          className="status-legend-dot"
                          style={{
                            background:
                              entry.color,
                          }}
                        ></span>


                        <span>
                          {entry.label}
                        </span>


                        <strong>
                          {entry.value}
                        </strong>

                      </div>

                    )
                  )}

                </div>

              </>

            )}

          </div>


          {/* =================================================
              PRODUCTS BY BRAND
          ================================================= */}

          <div className="chart-card">

            <div className="chart-card-header">

              <div>

                <h3>
                  מוצרים לפי מותג
                </h3>


                <p>
                  המותגים המובילים בכמות מוצרים
                </p>

              </div>

            </div>


            {brandBreakdown.length === 0 ? (

              <div className="chart-empty">
                אין עדיין נתוני מוצרים להצגה
              </div>

            ) : (

              <ResponsiveContainer
                width="100%"
                height={220}
              >

                <BarChart
                  data={brandBreakdown}
                >

                  <CartesianGrid
                    vertical={false}
                    stroke="#f0f1f3"
                  />


                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#9ca3af",
                      fontSize: 11,
                    }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                    height={45}
                  />


                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#9ca3af",
                      fontSize: 12,
                    }}
                    width={30}
                    allowDecimals={false}
                  />


                  <Tooltip
                    formatter={(value) => [
                      `${value} מוצרים`,
                      "כמות",
                    ]}
                    contentStyle={{
                      borderRadius: 8,
                      border:
                        "1px solid #e5e7eb",
                      fontSize: 12,
                      direction: "rtl",
                    }}
                  />


                  <Bar
                    dataKey="count"
                    fill="#111827"
                    radius={[
                      6,
                      6,
                      0,
                      0,
                    ]}
                    maxBarSize={34}
                  />

                </BarChart>

              </ResponsiveContainer>

            )}

          </div>


          {/* =================================================
              LOW STOCK
          ================================================= */}

          <div className="chart-card">

            <div className="chart-card-header">

              <div>

                <h3>
                  מלאי נמוך
                </h3>


                <p>
                  המוצרים עם הכי פחות יחידות במלאי
                </p>

              </div>

            </div>


            {lowStock.length === 0 ? (

              <div className="chart-empty">
                אין עדיין נתוני מלאי להצגה
              </div>

            ) : (

              <div className="low-stock-list">

                {lowStock.map(
                  (item) => {

                    const maxStock =
                      lowStock[
                        lowStock.length - 1
                      ]?.stock || 1;


                    const percent =
                      Math.min(
                        100,
                        Math.round(
                          (item.stock /
                            Math.max(
                              maxStock,
                              item.stock,
                              1
                            )) *
                            100
                        )
                      );


                    return (

                      <div
                        className="low-stock-item"
                        key={item.id}
                      >

                        <div className="low-stock-info">

                          <span>
                            {item.name}
                          </span>


                          <strong
                            className={
                              item.stock <= 3
                                ? "low-stock-critical"
                                : ""
                            }
                          >
                            {item.stock} יח'
                          </strong>

                        </div>


                        <div className="low-stock-bar">

                          <div
                            className={
                              "low-stock-bar-fill" +
                              (
                                item.stock <= 3
                                  ? " low-stock-bar-critical"
                                  : ""
                              )
                            }
                            style={{
                              width: `${Math.max(
                                percent,
                                6
                              )}%`,
                            }}
                          ></div>

                        </div>

                      </div>

                    );

                  }
                )}

              </div>

            )}

          </div>


        </div>

      </section>


      {/* =================================================
          MAIN MANAGEMENT
      ================================================= */}

      <section className="dashboard-section">


        <div className="dashboard-section-header">

          <div>

            <h2>
              ניהול החנות
            </h2>


            <p>
              גישה מהירה לכל אזורי הניהול במערכת
            </p>

          </div>

        </div>


        <div className="management-grid">


          <Link
            to="/admin/products"
            className="management-card"
          >

            <div className="management-number">
              01
            </div>


            <div className="management-content">

              <h3>
                מוצרים
              </h3>


              <p>
                הוספה, עריכה ומחיקה של מוצרים,
                מחירים, מידות ומלאי.
              </p>

            </div>


            <span className="management-arrow">
              ←
            </span>

          </Link>


          <Link
            to="/admin/orders"
            className="management-card"
          >

            <div className="management-number">
              02
            </div>


            <div className="management-content">

              <h3>
                הזמנות
              </h3>


              <p>
                צפייה בהזמנות, פרטי לקוחות,
                סטטוסים ופרטי משלוח.
              </p>

            </div>


            <span className="management-arrow">
              ←
            </span>

          </Link>


          <Link
            to="/admin/users"
            className="management-card"
          >

            <div className="management-number">
              03
            </div>


            <div className="management-content">

              <h3>
                משתמשים
              </h3>


              <p>
                ניהול משתמשים, פרטי חשבון
                והרשאות במערכת.
              </p>

            </div>


            <span className="management-arrow">
              ←
            </span>

          </Link>


          <Link
            to="/admin/categories"
            className="management-card"
          >

            <div className="management-number">
              04
            </div>


            <div className="management-content">

              <h3>
                קטגוריות
              </h3>


              <p>
                ניהול קטגוריות וסידור
                תוכן החנות.
              </p>

            </div>


            <span className="management-arrow">
              ←
            </span>

          </Link>


          <Link
            to="/admin/brands"
            className="management-card"
          >

            <div className="management-number">
              05
            </div>


            <div className="management-content">

              <h3>
                מותגים
              </h3>


              <p>
                ניהול המותגים המוצגים
                בחנות.
              </p>

            </div>


            <span className="management-arrow">
              ←
            </span>

          </Link>


        </div>

      </section>


      {/* =================================================
          QUICK ACTIONS
      ================================================= */}

      <section className="quick-section">


        <div className="dashboard-section-header">

          <div>

            <h2>
              פעולות מהירות
            </h2>


            <p>
              פעולות נפוצות לניהול החנות
            </p>

          </div>

        </div>


        <div className="quick-actions">


          <Link
            to="/admin/products"
            className="quick-action"
          >

            <span>
              +
            </span>


            <div>

              <strong>
                הוספת מוצר
              </strong>


              <small>
                יצירת מוצר חדש בחנות
              </small>

            </div>

          </Link>


          <Link
            to="/admin/brands"
            className="quick-action"
          >

            <span>
              +
            </span>


            <div>

              <strong>
                הוספת מותג
              </strong>


              <small>
                הוספת מותג חדש
              </small>

            </div>

          </Link>


          <Link
            to="/admin/categories"
            className="quick-action"
          >

            <span>
              +
            </span>


            <div>

              <strong>
                הוספת קטגוריה
              </strong>


              <small>
                יצירת קטגוריה חדשה
              </small>

            </div>

          </Link>


        </div>

      </section>


    </div>
  );
}