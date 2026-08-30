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

      <section className="home-brands-section">

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
