import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchBrands } from "../../store/slices/BrandSlice";
import "./AllBrands.css";



export default function AllBrands() {
  const dispatch = useDispatch();

  const brands = useSelector((state) => state.brands?.items || []);
  const loading = useSelector((state) => state.brands?.loading);
  const error = useSelector((state) => state.brands?.error);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  const filteredBrands = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return brands;

    return brands.filter((brand) =>
      brand.name?.toLowerCase().startsWith(term)
    );
  }, [brands, searchTerm]);

  if (loading) return <p className="loading">טוען מותגים...</p>;

  if (error) return <p className="error">שגיאה בטעינת המותגים.</p>;

  return (
    <div className="brands-page">
      <h1 className="brands-title">כל המותגים</h1>

      <input
        type="text"
        className="brand-search"
        placeholder="חפש מותג..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {searchTerm && filteredBrands.length === 0 && (
        <div className="no-results">
          <p>לא נמצאו תוצאות לחיפוש, אנא נסו שוב</p>
        </div>
      )}

      <div className="brands-grid">
        {filteredBrands.map((brand, index) => (
          <Link
            key={brand._id || brand.id || `${brand.name}-${index}`}
            to={`/brands/${encodeURIComponent(brand.name)}`}
            className="brand-link"
          >
            <div className="brand-card">
              {brand.image ? (
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="brand-image"
                />
              ) : (
                <div className="no-image">
                  אין תמונה
                </div>
              )}

              <h3 className="brand-name">{brand.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}