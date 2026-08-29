
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-column">
          <h3>BRANDS</h3>
          <p>
            Discover the world's leading fashion brands.
            Premium quality, exclusive collections and
            modern shopping experience.
          </p>
        </div>

        <div className="footer-column">
          <h4>Shopping</h4>

          <Link to="/brands">Brands</Link>
          <a href="">New Arrivals</a>
         
        </div>

        <div className="footer-column">
          <h4>Customer Service</h4>

          <Link to="/about">About Us</Link>
          <Link to="/conection">Contact Us</Link>
         
        </div>

        <div className="footer-column">

          <h4>Follow Us</h4>

          <div className="social-icons">

            <a href=""><FaFacebookF /></a>

            <a href=""><FaInstagram /></a>

            <a href=""><FaTwitter /></a>

            <a href=""><FaYoutube /></a>

          </div>

        </div>

      </div>

      <div className="footer-bottom">
        © 2026 BRANDS. All Rights Reserved.
      </div>

    </footer>
  );
}