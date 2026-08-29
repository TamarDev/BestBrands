// קרוסלת מותגים
import React from 'react';
// 1. ייבוא ה-Link לצורך ניווט ללא רענון דף
import { Link } from 'react-router-dom';
import './slider.css';
import { fetchBrands } from '../../store/slices/BrandSlice';
import { useEffect, useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';

export default function Slider() {

  const dispatch=useDispatch();
  const brands=useSelector((state)=> state.brands.items || []);

  useEffect(() => {dispatch(fetchBrands());}, [dispatch]);


  return (
    <>
             
         
    <div className="slider-container">

      <div className="slider-track">

        {
          // brands 
         [...brands, ...brands].map((brand, index) => (
            
            <div className="slide" key={index}>
              
              <Link  key={brand._id || brand.id || `${brand.name}-${index}`}
              to={`/brands/${encodeURIComponent(brand.name || '')}`}>
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