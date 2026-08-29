import { useEffect, useState } from 'react'
import Slider from '../Components/Slider/slider.jsx'
import './Home.css'

export default function Home()
{
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <div className="home-container">

      <section className={`home-hero ${loaded ? 'is-visible' : ''}`}>
        <img
          src={"https://res.cloudinary.com/rwm6azyq/image/upload/v1787230864/homepage.png"}
          alt="Home"
          className="home-hero-image"
        />
        <div className="home-hero-fade" />
      </section>

      {/* <div className="home-perks">
        <div className="perk">
          <svg className="perk-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M2 8h11v8H2z"/><path d="M13 11h4l3 3v2h-7z"/>
            <circle cx="6.5" cy="18" r="1.6"/><circle cx="16.5" cy="18" r="1.6"/>
          </svg>
          <span className="perk-text">משלוח חינם מעל 300 ₪</span>
        </div>
        <div className="perk-divider" />
        <div className="perk">
          <svg className="perk-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>
          </svg>
          <span className="perk-text">החזרות עד 30 יום</span>
        </div>
        <div className="perk-divider" />
        <div className="perk">
          <svg className="perk-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>
          </svg>
          <span className="perk-text">עד 12 תשלומים ללא ריבית</span>
        </div>
        <div className="perk-divider" />
        <div className="perk">
          <svg className="perk-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/>
          </svg>
          <span className="perk-text">מוצרים מקוריים ומובטחים</span>
        </div>
      </div> */}

      <section className="home-brands-section">
        {/* <div className="home-section-head">
          <span className="home-eyebrow">קולקציה נבחרת</span>
          <h2 className="home-section-title">המותגים שלנו</h2>
        </div> */}
        <Slider/>
      </section>

      <section className="home-promotions-section">
        <div className="home-promotions-glow" />
        <div className="home-promotions-inner">
          <span className="home-promotions-eyebrow">לזמן מוגבל</span>
          <p className="home-promotions">מבצעים</p>
          <p className="home-promotions-text">הנחות בלעדיות על המותגים האהובים עליכם, כל שבוע מבצעים חדשים</p>
          <button className="home-promotions-cta">לכל המבצעים ←</button>
        </div>
      </section>

    </div>
  )
}
