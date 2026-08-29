import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchBrands,
  addNewBrand,
  editBrand,
  removeBrand,
} from "../store/slices/BrandSlice.js";

import "./AdminStyle.css";

const emptyBrand = {
  name: "",
  description: "",
  image: null,
  imagePage: null,
  inventor: "",
};

const AdminBrands = () => {
  const dispatch = useDispatch();

  const { items, loading, error } = useSelector(
    (state) => state.brands
  );

  const [newBrand, setNewBrand] = useState(emptyBrand);
  const [editingId, setEditingId] = useState(null);
  const [editingBrand, setEditingBrand] = useState(emptyBrand);

  // ==========================
  // טעינת המותגים
  // ==========================

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);


  // ==========================
  // שינוי שדות הוספה
  // ==========================

  const handleNewBrandChange = (e) => {
    setNewBrand({
      ...newBrand,
      [e.target.name]: e.target.value,
    });
  };


  // ==========================
  // שינוי שדות עריכה
  // ==========================

  const handleEditChange = (e) => {
    setEditingBrand({
      ...editingBrand,
      [e.target.name]: e.target.value,
    });
  };


  // ==========================
  // הוספת מותג
  // ==========================

  const handleAddBrand = () => {
    if (!newBrand.name.trim()) return;

    dispatch(addNewBrand(newBrand)).then((res) => {
      console.log(res.payload);
    });

    setNewBrand(emptyBrand);
  };


  // ==========================
  // מחיקת מותג
  // ==========================

  const handleDelete = (id) => {
    if (window.confirm("למחוק את המותג?")) {
      dispatch(removeBrand(id));
    }
  };


  // ==========================
  // התחלת עריכה
  // ==========================

  const handleEdit = (brand) => {
    setEditingId(brand._id);

    setEditingBrand({
      name: brand.name || "",
      description: brand.description || "",
      image: brand.image || "",
      imagePage: brand.imagePage || "",
      inventor: brand.inventor || "",
    });
  };


  // ==========================
  // שמירת עריכה
  // ==========================

  const handleSave = () => {
    dispatch(
      editBrand({
        brandId: editingId,
        updatedData: editingBrand,
      })
    );

    setEditingId(null);
    setEditingBrand(emptyBrand);
  };


  // ==========================
  // ביטול עריכה
  // ==========================

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingBrand(emptyBrand);
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
            ניהול מותגים
          </h1>

          <p>
            הוספה, עריכה ומחיקה של מותגי האתר
          </p>

        </div>


        <div className="ADMAIN-count">

          <span>
            {items.length}
          </span>

          <small>
            מותגים
          </small>

        </div>

      </div>


      {/* ==========================
          LOADING / ERROR
      ========================== */}

      {loading && (

        <div className="ADMAIN-message ADMAIN-loading-message">

          <span className="ADMAIN-loader"></span>

          טוען מותגים...

        </div>

      )}


      {error && (

        <div className="ADMAIN-message ADMAIN-error-message">

          ⚠️ {error}

        </div>

      )}


      {/* ==========================
          ADD BRAND
      ========================== */}

      <section className="ADMAIN-form-card">

        <div className="ADMAIN-card-title">

          <div className="ADMAIN-title-icon">
            ＋
          </div>

          <div>

            <h2>
              הוספת מותג
            </h2>

            <p>
              הוסיפי מותג חדש לחנות
            </p>

          </div>

        </div>


        <div className="ADMAIN-form">

          {/* NAME */}

          <div className="ADMAIN-form-group">

            <label>
              שם המותג
            </label>

            <input
              name="name"
              placeholder="לדוגמה: Nike"
              value={newBrand.name}
              onChange={handleNewBrandChange}
            />

          </div>


          {/* DESCRIPTION */}

          <div className="ADMAIN-form-group">

            <label>
              תיאור
            </label>

            <input
              name="description"
              placeholder="תיאור קצר של המותג"
              value={newBrand.description}
              onChange={handleNewBrandChange}
            />

          </div>


          {/* IMAGE */}

          <div className="ADMAIN-form-group">

            <label>
              תמונת המותג
            </label>

            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) =>
                setNewBrand({
                  ...newBrand,
                  image: e.target.files[0],
                })
              }
            />

          </div>


          {/* IMAGE PAGE */}

          <div className="ADMAIN-form-group">

            <label>
              תמונת דף המותג
            </label>

            <input
              type="file"
              name="imagePage"
              accept="image/*"
              onChange={(e) =>
                setNewBrand({
                  ...newBrand,
                  imagePage: e.target.files[0],
                })
              }
            />

          </div>


          {/* INVENTOR */}

          <div className="ADMAIN-form-group">

            <label>
              ממציא / מייסד
            </label>

            <input
              name="inventor"
              placeholder="שם המייסד"
              value={newBrand.inventor}
              onChange={handleNewBrandChange}
            />

          </div>


          {/* ADD BUTTON */}

          <button
            className="ADMAIN-primary-button"
            onClick={handleAddBrand}
          >

            <span>
              ＋
            </span>

            הוסף מותג

          </button>

        </div>

      </section>


      {/* ==========================
          BRANDS LIST
      ========================== */}

      <section className="ADMAIN-section">

        <div className="ADMAIN-section-header">

          <div>

            <h2>
              רשימת מותגים
            </h2>

            <p>
              כל המותגים הקיימים באתר
            </p>

          </div>

          <span className="ADMAIN-section-count">
            {items.length}
          </span>

        </div>


        <div className="ADMAIN-list">

          {/* EMPTY */}

          {items.length === 0 && !loading && (

            <div className="ADMAIN-empty-state">

              <div className="ADMAIN-empty-icon">
                🏷️
              </div>

              <h3>
                אין עדיין מותגים
              </h3>

              <p>
                הוסיפי את המותג הראשון שלך באמצעות הטופס למעלה.
              </p>

            </div>

          )}


          {/* BRANDS */}

          {items.map((brand) => (

            <div
              className={`ADMAIN-item ${
                editingId === brand._id
                  ? "ADMAIN-editing"
                  : ""
              }`}
              key={brand._id}
            >

              {editingId === brand._id ? (

                /* ==========================
                   EDIT MODE
                ========================== */

                <div className="ADMAIN-edit-item">

                  <div className="ADMAIN-edit-header">

                    <div>

                      <span>
                        עריכת מותג
                      </span>

                      <h3>
                        {brand.name}
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

                    {/* NAME */}

                    <div className="ADMAIN-form-group">

                      <label>
                        שם המותג
                      </label>

                      <input
                        name="name"
                        value={editingBrand.name}
                        onChange={handleEditChange}
                        placeholder="שם"
                      />

                    </div>


                    {/* DESCRIPTION */}

                    <div className="ADMAIN-form-group">

                      <label>
                        תיאור
                      </label>

                      <input
                        name="description"
                        value={editingBrand.description}
                        onChange={handleEditChange}
                        placeholder="תיאור"
                      />

                    </div>


                    {/* IMAGE */}

                    <div className="ADMAIN-form-group">

                      <label>
                        תמונת המותג
                      </label>

                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={(e) =>
                          setEditingBrand({
                            ...editingBrand,
                            image: e.target.files[0],
                          })
                        }
                      />

                    </div>


                    {/* IMAGE PAGE */}

                    <div className="ADMAIN-form-group">

                      <label>
                        תמונת דף המותג
                      </label>

                      <input
                        type="file"
                        name="imagePage"
                        accept="image/*"
                        onChange={(e) =>
                          setEditingBrand({
                            ...editingBrand,
                            imagePage: e.target.files[0],
                          })
                        }
                      />

                    </div>


                    {/* INVENTOR */}

                    <div className="ADMAIN-form-group">

                      <label>
                        ממציא / מייסד
                      </label>

                      <input
                        name="inventor"
                        value={editingBrand.inventor}
                        onChange={handleEditChange}
                        placeholder="ממציא"
                      />

                    </div>


                    {/* ACTIONS */}

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

                  {/* BRAND IMAGE */}

                  <div className="ADMAIN-brand-image">

                    {brand.image ? (

                      <img
                        src={brand.image}
                        alt={brand.name}
                      />

                    ) : (

                      <div className="ADMAIN-no-image">
                        אין תמונה
                      </div>

                    )}

                  </div>


                  {/* BRAND INFORMATION */}

                  <div className="ADMAIN-item-info">

                    <div className="ADMAIN-item-name-row">

                      <h3>
                        {brand.name}
                      </h3>

                    </div>


                    <p className="ADMAIN-item-description">

                      {brand.description ||
                        "אין תיאור למותג"}

                    </p>


                    <div className="ADMAIN-brand-inventor">

                      <span>
                        מייסד
                      </span>

                      <strong>
                        {brand.inventor || "לא צוין"}
                      </strong>

                    </div>

                  </div>


                  {/* ACTIONS */}

                  <div className="ADMAIN-item-actions">

                    <button
                      className="ADMAIN-edit-button"
                      onClick={() =>
                        handleEdit(brand)
                      }
                    >

                      <span className="ADMAIN-edit-icon"></span>

                      עריכה

                    </button>


                    <button
                      className="ADMAIN-delete-button"
                      onClick={() =>
                        handleDelete(brand._id)
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

export default AdminBrands;