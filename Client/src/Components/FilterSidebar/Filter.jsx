import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import "./Filter.css";

export default function Filter({
  products = [],
  title = "סינון מוצרים",
  loading = false,
  error = null,
  showHeader = true,
}) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  // טווח מחיר קבוע: 10 - 2000
  const MIN_PRICE = 10;
  const MAX_PRICE = 2000;

  const [minPrice, setMinPrice] = useState(MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);

  // קטגוריות
  const categories = useMemo(() => {
    if (!Array.isArray(products)) return [];

    return Array.from(
      new Map(
        products
          .filter((product) => product?.category)
          .map((product) => [
            product.category._id,
            product.category,
          ])
      ).values()
    );
  }, [products]);

  // צבעים
  const colors = useMemo(() => {
    if (!Array.isArray(products)) return [];

    return Array.from(
      new Set(
        products
          .map((product) => product?.color)
          .filter(Boolean)
      )
    );
  }, [products]);

  // סינון המוצרים
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    return products.filter((product) => {
      const matchesCategory =
        !selectedCategory ||
        product.category?._id === selectedCategory;

      const matchesColor =
        !selectedColor ||
        product.color === selectedColor;

      const productPrice = Number(product.price);

      const matchesPrice =
        productPrice >= minPrice &&
        productPrice <= maxPrice;

      return (
        matchesCategory &&
        matchesColor &&
        matchesPrice
      );
    });
  }, [
    products,
    selectedCategory,
    selectedColor,
    minPrice,
    maxPrice,
  ]);

  // איפוס סינון
  const resetFilters = () => {
    setSelectedCategory("");
    setSelectedColor("");
    setMinPrice(MIN_PRICE);
    setMaxPrice(MAX_PRICE);
  };

  return (
    <div className="filter-page">

      {/* כותרת */}
      {showHeader && (
        <div className="filter-header">
          <h2>{title}</h2>
        </div>
      )}

      {/* טעינה */}
      {loading && (
        <div className="filter-status">
          <FaSpinner
            className="spinner"
            size={40}
          />
        </div>
      )}

      {/* שגיאה */}
      {error && (
        <div className="filter-status error">
          שגיאה: {error}
        </div>
      )}

      {!loading && !error && (
        <div className="filter-content">

          {/* SIDEBAR */}
          <aside className="filter-sidebar">

            {/* קטגוריות */}
            <div className="filter-section">
              <h3>קטגוריות</h3>

              <button
                className={`filter-chip ${
                  selectedCategory === ""
                    ? "active"
                    : ""
                }`}
                onClick={() => setSelectedCategory("")}
              >
                כל המוצרים
              </button>

              {categories.map((category) => (
                <button
                  key={category._id}
                  className={`filter-chip ${
                    selectedCategory === category._id
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedCategory(category._id)
                  }
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* צבע */}
            <div className="filter-section">
              <h3>צבע</h3>

              <button
                className={`filter-chip ${
                  selectedColor === ""
                    ? "active"
                    : ""
                }`}
                onClick={() => setSelectedColor("")}
              >
                כל הצבעים
              </button>

              {colors.map((color) => (
                <button
                  key={color}
                  className={`filter-chip ${
                    selectedColor === color
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedColor(color)
                  }
                >
                  {color}
                </button>
              ))}
            </div>

            {/* טווח מחיר */}
            <div className="filter-section price-filter">
              <h3>טווח מחיר</h3>

              <div className="price-values">
                <span>₪ {minPrice}</span>
                <span>₪ {maxPrice}</span>
              </div>

              <div className="range-container">

                {/* מחיר מינימלי */}
                <input
                  type="range"
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                  value={minPrice}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    if (value <= maxPrice) {
                      setMinPrice(value);
                    }
                  }}
                  className="range-slider"
                />

                {/* מחיר מקסימלי */}
                <input
                  type="range"
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                  value={maxPrice}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    if (value >= minPrice) {
                      setMaxPrice(value);
                    }
                  }}
                  className="range-slider"
                />

              </div>
            </div>

            {/* איפוס */}
            <button
              className="reset-btn"
              onClick={resetFilters}
            >
              איפוס סינון
            </button>

          </aside>

          {/* PRODUCTS */}
          <div className="filter-products-area">

            {filteredProducts.length === 0 ? (
              <div className="filter-status empty">
                אין מוצרים להצגה
              </div>
            ) : (
              <div className="filter-products-grid">

                {filteredProducts.map((product) => (
                  <Link
                    key={product._id || product.id}
                    to={`/DetailisOfProduct/${
                      product._id || product.id
                    }`}
                    className="product-card"
                  >

                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                    />

                    <div className="product-info">

                      <h3 className="product-title">
                        {product.name}
                      </h3>

                      <p className="product-description">
                        {product.description ||
                          "מוצר איכותי ומעוצב במיוחד."}
                      </p>

                      <div className="product-footer">

                        <span className="product-price">
                          ₪ {product.price}
                        </span>

                        {product.color && (
                          <span className="product-color">
                            {product.color}
                          </span>
                        )}

                      </div>

                    </div>

                  </Link>
                ))}

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}