import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchProducts,
  addProductThunk,
  updateProductThunk,
  deleteProductThunk,
} from "../store/slices/ProductSlice";

import { fetchBrands } from "../store/slices/BrandSlice";
import { getAllCategories } from "../API/CategoryApi";

import "./AdminStyle.css";


const emptyProduct = {
  name: "",
  description: "",
  image: null,
  price: "",
  brand: "",
  category: "",
  color: "",
  sizes: [],
};


const AdminProducts = () => {

  const dispatch = useDispatch();


  const {
    products,
    loading,
    error,
  } = useSelector((state) => state.products);


  const { items: brands } = useSelector(
    (state) => state.brands
  );


  const [categories, setCategories] = useState([]);
  

  const [newProduct, setNewProduct] = useState({
    ...emptyProduct,
    sizes: [
      {
        size: "",
        stock: 0,
      },
    ],
  });


  const [editingId, setEditingId] = useState(null);


  const [editingProduct, setEditingProduct] = useState({
    ...emptyProduct,
    sizes: [],
  });


  // ==========================
  // טעינת הנתונים
  // ==========================

  useEffect(() => {

    dispatch(fetchProducts());

    dispatch(fetchBrands());

    loadCategories();

  }, [dispatch]);


  const loadCategories = async () => {

    try {

      const data = await getAllCategories();

      setCategories(data);

    } catch (err) {

      console.log(err);

    }

  };


  // ==========================
  // שינוי שדות הוספה
  // ==========================

  const handleNewChange = (e) => {

    const value =
      e.target.name === "price"
        ? Number(e.target.value)
        : e.target.value;


    setNewProduct({
      ...newProduct,
      [e.target.name]: value,
    });

  };


  // ==========================
  // שינוי שדות עריכה
  // ==========================

  const handleEditChange = (e) => {

    const value =
      e.target.name === "price"
        ? Number(e.target.value)
        : e.target.value;


    setEditingProduct({
      ...editingProduct,
      [e.target.name]: value,
    });

  };


  // ==========================
  // שינוי מידה
  // ==========================

  const handleSizeChange = (
    productType,
    index,
    field,
    value
  ) => {

    const target =
      productType === "new"
        ? newProduct
        : editingProduct;


    const setter =
      productType === "new"
        ? setNewProduct
        : setEditingProduct;


    const updatedSizes = [
      ...(target.sizes || []),
    ];


    updatedSizes[index] = {
      ...updatedSizes[index],
      [field]:
        field === "stock"
          ? Number(value)
          : value,
    };


    setter({
      ...target,
      sizes: updatedSizes,
    });

  };


  // ==========================
  // הוספת מידה
  // ==========================

  const addSize = (productType) => {

    const newSize = {
      size: "",
      stock: 0,
    };


    if (productType === "new") {

      setNewProduct({
        ...newProduct,

        sizes: [
          ...(newProduct.sizes || []),
          newSize,
        ],
      });

    } else {

      setEditingProduct({
        ...editingProduct,

        sizes: [
          ...(editingProduct.sizes || []),
          newSize,
        ],
      });

    }

  };


  // ==========================
  // מחיקת מידה
  // ==========================

  const removeSize = (
    productType,
    index
  ) => {

    if (productType === "new") {

      const updatedSizes =
        newProduct.sizes.filter(
          (_, i) => i !== index
        );


      setNewProduct({
        ...newProduct,
        sizes: updatedSizes,
      });

    } else {

      const updatedSizes =
        editingProduct.sizes.filter(
          (_, i) => i !== index
        );


      setEditingProduct({
        ...editingProduct,
        sizes: updatedSizes,
      });

    }

  };


  // ==========================
  // הוספת מוצר
  // ==========================

  const handleAdd = () => {

    dispatch(
      addProductThunk(newProduct)
    );


    setNewProduct({
      ...emptyProduct,

      sizes: [
        {
          size: "",
          stock: 0,
        },
      ],
    });

  };


  // ==========================
  // התחלת עריכה
  // ==========================

  const handleEdit = (product) => {

    setEditingId(product._id);


    setEditingProduct({

      name: product.name || "",

      description:
        product.description || "",

      image:
        product.image || "",

      price:
        product.price || "",

      brand:
        product.brand?._id ||
        product.brand,

      category:
        product.category?._id ||
        product.category,

      color:
        product.color || "",

      sizes:
        Array.isArray(product.sizes)
          ? product.sizes
          : [],

    });

  };


  // ==========================
  // שמירת עריכה
  // ==========================

  const handleSave = () => {

    dispatch(
      updateProductThunk({

        id: editingId,

        data: editingProduct,

      })
    );


    setEditingId(null);


    setEditingProduct({

      ...emptyProduct,

      sizes: [],

    });

  };


  // ==========================
  // ביטול עריכה
  // ==========================

  const handleCancelEdit = () => {

    setEditingId(null);


    setEditingProduct({

      ...emptyProduct,

      sizes: [],

    });

  };


  // ==========================
  // מחיקה
  // ==========================

  const handleDelete = (id) => {

    if (
      window.confirm(
        "למחוק את המוצר?"
      )
    ) {

      dispatch(
        deleteProductThunk(id)
      );

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
            ניהול מוצרים
          </h1>


          <p>
            הוספה, עריכה ומחיקה של מוצרי החנות
          </p>

        </div>


        <div className="ADMAIN-count">

          <span>
            {products.length}
          </span>


          <small>
            מוצרים
          </small>

        </div>

      </div>


      {/* ==========================
          LOADING / ERROR
      ========================== */}

      {loading && (

        <div className="ADMAIN-message ADMAIN-loading-message">

          <span className="ADMAIN-loader"></span>

          טוען מוצרים...

        </div>

      )}


      {error && (

        <div className="ADMAIN-message ADMAIN-error-message">

          ⚠️ {error}

        </div>

      )}


      {/* ==========================
          ADD PRODUCT
      ========================== */}

      <section className="ADMAIN-form-card">


        <div className="ADMAIN-card-title">

          <div className="ADMAIN-title-icon">
            ＋
          </div>


          <div>

            <h2>
              הוספת מוצר
            </h2>


            <p>
              הוסיפי מוצר חדש לחנות
            </p>

          </div>

        </div>


        <div className="ADMAIN-product-form">


          <div className="ADMAIN-form-group">

            <label>
              שם המוצר
            </label>

            <input
              name="name"
              placeholder="לדוגמה: חולצת פולו"
              value={newProduct.name}
              onChange={handleNewChange}
            />

          </div>


          <div className="ADMAIN-form-group">

            <label>
              תיאור
            </label>

            <input
              name="description"
              placeholder="תיאור המוצר"
              value={newProduct.description}
              onChange={handleNewChange}
            />

          </div>


          <div className="ADMAIN-form-group">

            <label>
              קישור לתמונה
            </label>

            {/* <input
              name="image"
              placeholder="https://..."
              value={newProduct.image}
              onChange={handleNewChange}
            /> */}

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    image: e.target.files[0],
                  })
                }
              />
          </div>


          <div className="ADMAIN-form-group">

            <label>
              מחיר
            </label>

            <input
              type="number"
              name="price"
              placeholder="מחיר"
              value={newProduct.price}
              onChange={handleNewChange}
            />

          </div>


          <div className="ADMAIN-form-group">

            <label>
              צבע
            </label>

            <input
              name="color"
              placeholder="לדוגמה: שחור"
              value={newProduct.color}
              onChange={handleNewChange}
            />

          </div>


          <div className="ADMAIN-form-group">

            <label>
              מותג
            </label>

            <select
              name="brand"
              value={newProduct.brand}
              onChange={handleNewChange}
            >

              <option value="">
                בחר מותג
              </option>


              {brands.map((brand) => (

                <option
                  key={brand._id}
                  value={brand._id}
                >
                  {brand.name}
                </option>

              ))}

            </select>

          </div>


          <div className="ADMAIN-form-group">

            <label>
              קטגוריה
            </label>

            <select
              name="category"
              value={newProduct.category}
              onChange={handleNewChange}
            >

              <option value="">
                בחר קטגוריה
              </option>


              {categories.map((category) => (

                <option
                  key={category._id}
                  value={category._id}
                >
                  {category.name}
                </option>

              ))}

            </select>

          </div>


        </div>


        {/* ==========================
            SIZES
        ========================== */}

        <div className="ADMAIN-sizes-section">

          <div className="ADMAIN-sizes-header">

            <div>

              <h3>
                מידות ומלאי
              </h3>

              <p>
                הגדירי את המידות ואת כמות המלאי לכל מידה
              </p>

            </div>


            <button
              type="button"
              className="ADMAIN-add-size-button"
              onClick={() =>
                addSize("new")
              }
            >
              ＋ הוסף מידה
            </button>

          </div>


          <div className="ADMAIN-sizes-list">

            {(newProduct.sizes || []).map(
              (sizeRow, index) => (

                <div
                  className="ADMAIN-size-row"
                  key={index}
                >

                  <div className="ADMAIN-form-group">

                    <label>
                      מידה
                    </label>

                    <input
                      placeholder="לדוגמה: M"
                      value={sizeRow.size}
                      onChange={(e) =>
                        handleSizeChange(
                          "new",
                          index,
                          "size",
                          e.target.value
                        )
                      }
                    />

                  </div>


                  <div className="ADMAIN-form-group">

                    <label>
                      מלאי
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={sizeRow.stock}
                      onChange={(e) =>
                        handleSizeChange(
                          "new",
                          index,
                          "stock",
                          e.target.value
                        )
                      }
                    />

                  </div>


                  <button
                    type="button"
                    className="ADMAIN-remove-size-button"
                    onClick={() =>
                      removeSize(
                        "new",
                        index
                      )
                    }
                  >
                    מחק
                  </button>

                </div>

              )
            )}

          </div>

        </div>


        <button
          className="ADMAIN-primary-button ADMAIN-product-add-button"
          onClick={handleAdd}
        >

          <span>
            ＋
          </span>

          הוסף מוצר

        </button>


      </section>


      {/* ==========================
          PRODUCTS LIST
      ========================== */}

      <section className="ADMAIN-section">


        <div className="ADMAIN-section-header">

          <div>

            <h2>
              רשימת מוצרים
            </h2>

            <p>
              כל המוצרים הקיימים באתר
            </p>

          </div>


          <span className="ADMAIN-section-count">
            {products.length}
          </span>

        </div>


        <div className="ADMAIN-list">


          {/* EMPTY */}

          {products.length === 0 &&
            !loading && (

              <div className="ADMAIN-empty-state">

                <div className="ADMAIN-empty-icon">
                  🛍️
                </div>


                <h3>
                  אין עדיין מוצרים
                </h3>


                <p>
                  הוסיפי את המוצר הראשון שלך באמצעות הטופס למעלה.
                </p>

              </div>

            )}


          {/* PRODUCTS */}

          {products.map((product) => (

            <div
              key={product._id}
              className={`ADMAIN-item ADMAIN-product-item ${
                editingId === product._id
                  ? "ADMAIN-editing"
                  : ""
              }`}
            >


              {editingId === product._id ? (

                /* ==========================
                   EDIT MODE
                ========================== */

                <div className="ADMAIN-edit-item">


                  <div className="ADMAIN-edit-header">

                    <div>

                      <span>
                        עריכת מוצר
                      </span>


                      <h3>
                        {product.name}
                      </h3>

                    </div>


                    <button
                      className="ADMAIN-close-edit"
                      onClick={
                        handleCancelEdit
                      }
                    >
                      ×
                    </button>

                  </div>


                  <div className="ADMAIN-product-edit-form">


                    <div className="ADMAIN-form-group">

                      <label>
                        שם המוצר
                      </label>

                      <input
                        name="name"
                        value={
                          editingProduct.name
                        }
                        onChange={
                          handleEditChange
                        }
                      />

                    </div>


                    <div className="ADMAIN-form-group">

                      <label>
                        תיאור
                      </label>

                      <input
                        name="description"
                        value={
                          editingProduct.description
                        }
                        onChange={
                          handleEditChange
                        }
                      />

                    </div>


                    <div className="ADMAIN-form-group">

                      <label>
                        תמונה
                      </label>

                      {typeof editingProduct.image === "string" &&
                        editingProduct.image && (
                          <div className="ADMAIN-edit-image-preview">
                            <img
                              src={editingProduct.image}
                              alt={editingProduct.name}
                            />
                          </div>
                        )}

                      {editingProduct.image instanceof File && (
                        <div className="ADMAIN-edit-image-preview">
                          <img
                            src={URL.createObjectURL(
                              editingProduct.image
                            )}
                            alt={editingProduct.name}
                          />
                        </div>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            image: e.target.files[0],
                          })
                        }
                      />

                    </div>


                    <div className="ADMAIN-form-group">

                      <label>
                        מחיר
                      </label>

                      <input
                        type="number"
                        name="price"
                        value={
                          editingProduct.price
                        }
                        onChange={
                          handleEditChange
                        }
                      />

                    </div>


                    <div className="ADMAIN-form-group">

                      <label>
                        צבע
                      </label>

                      <input
                        name="color"
                        value={
                          editingProduct.color
                        }
                        onChange={
                          handleEditChange
                        }
                      />

                    </div>


                    <div className="ADMAIN-form-group">

                      <label>
                        מותג
                      </label>

                      <select
                        name="brand"
                        value={
                          editingProduct.brand
                        }
                        onChange={
                          handleEditChange
                        }
                      >

                        <option value="">
                          בחר מותג
                        </option>


                        {brands.map((brand) => (

                          <option
                            key={brand._id}
                            value={brand._id}
                          >
                            {brand.name}
                          </option>

                        ))}

                      </select>

                    </div>


                    <div className="ADMAIN-form-group">

                      <label>
                        קטגוריה
                      </label>

                      <select
                        name="category"
                        value={
                          editingProduct.category
                        }
                        onChange={
                          handleEditChange
                        }
                      >

                        <option value="">
                          בחר קטגוריה
                        </option>


                        {categories.map(
                          (category) => (

                            <option
                              key={
                                category._id
                              }
                              value={
                                category._id
                              }
                            >
                              {category.name}
                            </option>

                          )
                        )}

                      </select>

                    </div>


                  </div>


                  {/* EDIT SIZES */}

                  <div className="ADMAIN-sizes-section">

                    <div className="ADMAIN-sizes-header">

                      <div>

                        <h3>
                          מידות ומלאי
                        </h3>

                        <p>
                          ניהול המידות והמלאי של המוצר
                        </p>

                      </div>


                      <button
                        type="button"
                        className="ADMAIN-add-size-button"
                        onClick={() =>
                          addSize("edit")
                        }
                      >
                        ＋ הוסף מידה
                      </button>

                    </div>


                    <div className="ADMAIN-sizes-list">

                      {(editingProduct.sizes || []).map(
                        (sizeRow, index) => (

                          <div
                            className="ADMAIN-size-row"
                            key={index}
                          >

                            <div className="ADMAIN-form-group">

                              <label>
                                מידה
                              </label>

                              <input
                                value={
                                  sizeRow.size
                                }
                                onChange={(e) =>
                                  handleSizeChange(
                                    "edit",
                                    index,
                                    "size",
                                    e.target.value
                                  )
                                }
                              />

                            </div>


                            <div className="ADMAIN-form-group">

                              <label>
                                מלאי
                              </label>

                              <input
                                type="number"
                                min="0"
                                value={
                                  sizeRow.stock
                                }
                                onChange={(e) =>
                                  handleSizeChange(
                                    "edit",
                                    index,
                                    "stock",
                                    e.target.value
                                  )
                                }
                              />

                            </div>


                            <button
                              type="button"
                              className="ADMAIN-remove-size-button"
                              onClick={() =>
                                removeSize(
                                  "edit",
                                  index
                                )
                              }
                            >
                              מחק
                            </button>

                          </div>

                        )
                      )}

                    </div>

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
                      onClick={
                        handleCancelEdit
                      }
                    >
                      ביטול
                    </button>

                  </div>


                </div>

              ) : (

                /* ==========================
                   NORMAL MODE
                ========================== */

                <>

                  {/* PRODUCT IMAGE */}

                  <div className="ADMAIN-product-image">

                    {product.image ? (

                      <img
                        src={product.image}
                        alt={product.name}
                      />

                    ) : (

                      <div className="ADMAIN-no-image">
                        אין תמונה
                      </div>

                    )}

                  </div>


                  {/* PRODUCT INFO */}

                  <div className="ADMAIN-item-info">


                    <div className="ADMAIN-item-name-row">

                      <h3>
                        {product.name}
                      </h3>

                    </div>


                    <p className="ADMAIN-item-description">

                      {product.description ||
                        "אין תיאור למוצר"}

                    </p>


                    <div className="ADMAIN-product-details">

                      <span>
                        <strong>
                          מחיר:
                        </strong>{" "}
                        ₪{product.price}
                      </span>


                      <span>
                        <strong>
                          צבע:
                        </strong>{" "}
                        {product.color ||
                          "לא צוין"}
                      </span>


                      <span>
                        <strong>
                          מותג:
                        </strong>{" "}
                        {
                          product.brand?.name ||
                          product.brand ||
                          "לא צוין"
                        }
                      </span>


                      <span>
                        <strong>
                          קטגוריה:
                        </strong>{" "}
                        {
                          product.category?.name ||
                          product.category ||
                          "לא צוינה"
                        }
                      </span>

                    </div>


                    {/* SIZES */}

                    <div className="ADMAIN-product-sizes">

                      <span className="ADMAIN-sizes-label">
                        מידות:
                      </span>


                      <div className="ADMAIN-size-tags">

                        {Array.isArray(
                          product.sizes
                        ) &&
                        product.sizes.length > 0 ? (

                          product.sizes.map(
                            (size, index) => (

                              <span
                                className="ADMAIN-size-tag"
                                key={index}
                              >
                                {size.size}
                                {" "}
                                ({size.stock})
                              </span>

                            )

                          )

                        ) : (

                          <span>
                            אין מידות
                          </span>

                        )}

                      </div>

                    </div>

                  </div>


                  {/* ACTIONS */}

                  <div className="ADMAIN-item-actions">

                    <button
                      className="ADMAIN-edit-button"
                      onClick={() =>
                        handleEdit(product)
                      }
                    >

                      <span className="ADMAIN-edit-icon"></span>

                      עריכה

                    </button>


                    <button
                      className="ADMAIN-delete-button"
                      onClick={() =>
                        handleDelete(
                          product._id
                        )
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


export default AdminProducts;