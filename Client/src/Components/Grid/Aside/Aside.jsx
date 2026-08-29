import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import "./Aside.css";

export default function Aside({
  categories = [],
  selectedCategory,
  setSelectedCategory,
}) {
  const [open, setOpen] = useState(true);

  return (
    <aside className="product-aside">

      <div
        className="filter-section-header"
        onClick={() => setOpen(!open)}
      >
        <span>קטגוריות</span>

        {open ? (
          <FiChevronUp size={20} />
        ) : (
          <FiChevronDown size={20} />
        )}
      </div>

      {open && (
        <div className="filter-section-content">

          <button
            className={`category-btn ${
              selectedCategory === "" ? "active" : ""
            }`}
            onClick={() => setSelectedCategory("")}
          >
            כל המוצרים
          </button>

          {categories.map((category) => (
            <button
              key={category._id}
              className={`category-btn ${
                selectedCategory === category._id ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category._id)}
            >
              {category.name}
            </button>
          ))}

        </div>
      )}
    </aside>
  );
}