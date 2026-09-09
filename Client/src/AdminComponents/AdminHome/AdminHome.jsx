import { NavLink, Outlet } from "react-router-dom";
import "./AdminHome.css";

export default function AdminHome() {
  return (
    <div className="admin-layout">

      <aside className="admin-sidebar">

        <div className="admin-sidebar-header">
          <div className="admin-logo">
            A
          </div>

          <div>
            <h2>ניהול האתר</h2>
            <span>Admin Panel</span>
          </div>
        </div>

        <div className="admin-menu-title">
          תפריט ראשי
        </div>

        <nav className="admin-nav">

          <NavLink to="" end>
            <span className="admin-nav-icon">⌂</span>
            <span>דף הבית</span>
          </NavLink>

          <NavLink to="brands">
            <span className="admin-nav-icon">▦</span>
            <span>מותגים</span>
          </NavLink>

          <NavLink to="categories">
            <span className="admin-nav-icon">▤</span>
            <span>קטגוריות</span>
          </NavLink>

          <NavLink to="users">
            <span className="admin-nav-icon">♙</span>
            <span>משתמשים</span>
          </NavLink>

          <NavLink to="orders">
            <span className="admin-nav-icon">▣</span>
            <span>הזמנות</span>
          </NavLink>

          <NavLink to="carts">
            <span className="admin-nav-icon">🛒</span>
            <span>עגלות קניות</span>
          </NavLink>

          <NavLink to="products">
            <span className="admin-nav-icon">□</span>
            <span>מוצרים</span>
          </NavLink>

          <NavLink to="messages">
            <span className="admin-nav-icon">□</span>
            <span>הודעות</span>
          </NavLink>

        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-footer-line"></div>

          <div className="admin-status">
            <span className="admin-status-dot"></span>

            <div>
              <strong>מערכת פעילה</strong>
              <small>הכל תקין</small>
            </div>
          </div>
        </div>

      </aside>

      <main className="admin-content">
        <Outlet />
      </main>

    </div>
  );
}