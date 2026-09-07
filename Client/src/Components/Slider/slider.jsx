// קרוסלת מותגים
// ייבוא ה-Link לצורך ניווט ללא רענון דף
import { Link } from 'react-router-dom';
import './slider.css';
import { fetchBrands } from '../../store/slices/BrandSlice';
import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

export default function Slider() {

  const dispatch = useDispatch();
  const brands = useSelector((state) => state.brands.items || []);

  useEffect(() => { dispatch(fetchBrands()); }, [dispatch]);

  // המערך משוכפל כדי ליצור אפקט קרוסלה רציפה; מחושב מחדש רק כש-brands משתנה
  const slides = useMemo(
    () =>
      [...brands, ...brands].map((brand, index) => ({
        brand,
        key: `${brand._id || brand.id || brand.name}-${index}`,
      })),
    [brands]
  );

  return (
    <>

    <div className="slider-container">

      <div className="slider-track">

        {
          slides.map(({ brand, key }) => (

            <div className="slide" key={key}>

              <Link to={`/brands/${encodeURIComponent(brand.name || '')}`}>
                <img
                  src={brand.image}
                  alt={brand.name || 'Brand'}
                  className="brand-slide-image"
                />
              </Link>

            </div>

          ))
        }

      </div>

    </div>

    </>
  );
}
