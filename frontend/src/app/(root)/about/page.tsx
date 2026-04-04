"use client";

import { FaShippingFast, FaLock, FaUndo } from "react-icons/fa";

export default function AboutPage() {
  return (
    <div className="about">

      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About Barwa</h1>
          <p>
            Barwa is committed to delivering high-quality mobile accessories
            and technology products that keep you connected, powered, and
            ahead in the digital world.
          </p>
        </div>
      </section>

      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          Our mission is to provide reliable technology products at affordable
          prices while delivering an exceptional shopping experience for our
          customers.
        </p>
      </section>

      <section className="about-section">
        <h2>What We Offer</h2>

        <div className="about-grid">
          <div className="about-card">
            <h3>Mobile Accessories</h3>
            <p>High-quality chargers, connectors and smart accessories.</p>
          </div>

          <div className="about-card">
            <h3>Audio Products</h3>
            <p>Bluetooth headsets, TWS devices and premium sound solutions.</p>
          </div>

          <div className="about-card">
            <h3>Power Solutions</h3>
            <p>Reliable power banks and fast charging devices.</p>
          </div>
        </div>
      </section>

      <section className="about-features">
        <div className="feature">
          <FaShippingFast />
          <div>
            <h4>Fast Shipping</h4>
            <p>Quick delivery across India</p>
          </div>
        </div>

        <div className="feature">
          <FaLock />
          <div>
            <h4>Secure Payments</h4>
            <p>Safe and encrypted transactions</p>
          </div>
        </div>

        <div className="feature">
          <FaUndo />
          <div>
            <h4>Easy Returns</h4>
            <p>30-day hassle-free returns</p>
          </div>
        </div>
      </section>

      <section className="about-contact">
        <h2>Contact Us</h2>
        <p>Email: services@barwa.in</p>
        <p>Phone: +91 9222347777</p>
      </section>

    </div>
  );
}