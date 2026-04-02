import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-newsletter">
          <h3>Join the family</h3>
          <p>Signup up for update for our newsletter</p>

          <div className="newsletter-input">
            <input type="email" placeholder="Enter your address" />
            <button>➜</button>
          </div>
        </div>

        <div className="footer-links">
          <h4>Help Desk</h4>
          <Link href="/about">About Us</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/service">Customer Service</Link>
          <Link href="/blog">Blog</Link>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <Link href="/">Home</Link>
          <Link href="/about">About us</Link>
          <Link href="/contact">Contact Us</Link>
          <Link href="/terms">Terms & Condition</Link>
        </div>

        <div className="footer-links">
          <h4>Contact Us</h4>

          <div className="footer-social">
            <a href="https://facebook.com" target="_blank">
              <FaFacebookF />
            </a>

            <a href="https://instagram.com" target="_blank">
              <FaInstagram />
            </a>

            <a href="https://youtube.com" target="_blank">
              <FaYoutube />
            </a>

            <a href="https://linkedin.com" target="_blank">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © Copyright Barwa Moblink LLP 2024
        <span>All Rights Reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;