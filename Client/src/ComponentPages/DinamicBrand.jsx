
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductByBrand } from "../store/slices/ProductSlice";
import { fetchBrandByName } from "../store/slices/BrandSlice";
import "./DinamicBrand.css";
import Filter from "../Components/FilterSidebar/Filter";

export default function DinamicBrand() {
  const { brandName } = useParams();
  const dispatch = useDispatch();

  const products = useSelector((state) => state.products.products || []);
  const loading = useSelector((state) => state.products.loading);
  const error = useSelector((state) => state.products.error);
  const selectedBrand = useSelector((state) => state.brands?.selectedBrand);

  console.log("selectedBrand:", selectedBrand);
  useEffect(() => {
    if (brandName && brandName !== "undefined" && brandName.trim() !== "") {
      const decodedName = decodeURIComponent(brandName);
      dispatch(fetchProductByBrand(decodedName));
      dispatch(fetchBrandByName(decodedName));
    }
  }, [brandName, dispatch]);

  const title = brandName ? decodeURIComponent(brandName) : "";

  return (
    <div className="dinamic-brand-page">
      <div className="dinamic-brand-header">
        {selectedBrand?.imagePage && (
          <div className="brand-image-container">
            <img
              src={selectedBrand.imagePage}
              alt={title}
              className="brand-header-image"
            />
          </div>
        )}
       
      </div>

      <Filter
        products={products}
        title={title}
        loading={loading}
        error={error}
        showHeader={false}
      />
    </div>
  );
}

