import { useEffect, useState } from "react";

import {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../API/CategoryApi";

import "./AdminStyle.css";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [newCategory, setNewCategory] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  // ==========================
  // Load all categories.
  // ==========================

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllCategories();

      setCategories(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // ==========================
  // Add a category.
  // ==========================

  const handleAdd = async () => {
    if (!newCategory.trim()) return;

    try {
      await addCategory({
        name: newCategory,
      });

      setNewCategory("");

      loadCategories();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  // ==========================
  // Start editing.
  // ==========================

  const handleEdit = (category) => {
    setEditingId(category._id);
    setEditingName(category.name);
  };

  // ==========================
  // Save edits.
  // ==========================

  const handleSave = async () => {
    if (!editingName.trim()) return;

    try {
      await updateCategory(editingId, {
        name: editingName,
      });

      setEditingId(null);
      setEditingName("");

      loadCategories();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  // ==========================
  // Cancel editing.
  // ==========================

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  // ==========================
  // Delete the category.
  // ==========================

  const handleDelete = async (id) => {
    if (!window.confirm("למחוק את הקטגוריה?")) return;

    try {
      await deleteCategory(id);

      loadCategories();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
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
            ניהול האתר
          </span>

          <h1>
            ניהול קטגוריות
          </h1>

          <p>
            הוספה, עריכה ומחיקה של קטגוריות המוצרים
          </p>
        </div>

        <div className="ADMAIN-count">
          <span>{categories.length}</span>
          <small>קטגוריות</small>
        </div>

      </div>


      {/* ==========================
          LOADING / ERROR
      ========================== */}

      {loading && (
        <div className="ADMAIN-message ADMAIN-loading-message">
          <span className="ADMAIN-loader"></span>
          טוען קטגוריות...
        </div>
      )}

      {error && (
        <div className="ADMAIN-message ADMAIN-error-message">
          ⚠️ {error}
        </div>
      )}


      {/* ==========================
          ADD CATEGORY
      ========================== */}

      <section className="ADMAIN-form-card">

        <div className="ADMAIN-card-title">

          <div className="ADMAIN-title-icon">
            ＋
          </div>

          <div>
            <h2>
              הוספת קטגוריה
            </h2>

            <p>
              הוסיפי קטגוריה חדשה לחנות
            </p>
          </div>

        </div>


        <div className="ADMAIN-form">

          <div className="ADMAIN-form-group">

            <label>
              שם הקטגוריה
            </label>

            <input
              placeholder="לדוגמה: חולצות"
              value={newCategory}
              onChange={(e) =>
                setNewCategory(e.target.value)
              }
            />

          </div>


          <button
            className="ADMAIN-primary-button"
            onClick={handleAdd}
          >
            <span>＋</span>
            הוסף קטגוריה
          </button>

        </div>

      </section>


      {/* ==========================
          CATEGORIES LIST
      ========================== */}

      <section className="ADMAIN-section">

        <div className="ADMAIN-section-header">

          <div>
            <h2>
              רשימת קטגוריות
            </h2>

            <p>
              כל הקטגוריות הקיימות באתר
            </p>
          </div>

          <span className="ADMAIN-section-count">
            {categories.length}
          </span>

        </div>


        <div className="ADMAIN-list">

          {categories.length === 0 && !loading && (

            <div className="ADMAIN-empty-state">

              <div className="ADMAIN-empty-icon">
                ◫
              </div>

              <h3>
                אין עדיין קטגוריות
              </h3>

              <p>
                הוסיפי את הקטגוריה הראשונה שלך באמצעות הטופס למעלה.
              </p>

            </div>

          )}


          {categories.map((category) => (

            <div
              className={`ADMAIN-item ${
                editingId === category._id
                  ? "ADMAIN-editing"
                  : ""
              }`}
              key={category._id}
            >

              {editingId === category._id ? (

                /* ==========================
                   EDIT MODE
                ========================== */

                <div className="ADMAIN-edit-item">

                  <div className="ADMAIN-edit-header">

                    <div>
                      <span>
                        עריכת קטגוריה
                      </span>

                      <h3>
                        {category.name}
                      </h3>
                    </div>

                    <button
                      className="ADMAIN-close-edit"
                      onClick={handleCancelEdit}
                    >
                      ×
                    </button>

                  </div>


                  <div className="ADMAIN-edit-form">

                    <div className="ADMAIN-form-group">

                      <label>
                        שם הקטגוריה
                      </label>

                      <input
                        value={editingName}
                        onChange={(e) =>
                          setEditingName(e.target.value)
                        }
                        placeholder="שם הקטגוריה"
                      />

                    </div>


                    <div className="ADMAIN-edit-actions">

                      <button
                        className="ADMAIN-save-button"
                        onClick={handleSave}
                      >
                        שמירת שינויים
                      </button>

                      <button
                        className="ADMAIN-cancel-button"
                        onClick={handleCancelEdit}
                      >
                        ביטול
                      </button>

                    </div>

                  </div>

                </div>

              ) : (

                /* ==========================
                   NORMAL MODE
                ========================== */

                <>

                  <div className="ADMAIN-category-icon">
                    ◫
                  </div>


                  <div className="ADMAIN-item-info">

                    <div className="ADMAIN-item-name-row">

                      <h3>
                        {category.name}
                      </h3>

                    </div>

                    <p className="ADMAIN-item-description">
                      קטגוריית מוצרים
                    </p>

                  </div>


                  <div className="ADMAIN-item-actions">

                    <button
                      className="ADMAIN-edit-button"
                      onClick={() =>
                        handleEdit(category)
                      }
                    >
                      <span className="ADMAIN-edit-icon"></span>
                      עריכה
                    </button>


                    <button
                      className="ADMAIN-delete-button"
                      onClick={() =>
                        handleDelete(category._id)
                      }
                    >
                      <span className="ADMAIN-delete-icon"></span>
                      מחיקה
                    </button>

                  </div>

                </>

              )}

            </div>

          ))}

        </div>

      </section>

    </div>
  );
};

export default AdminCategories;