import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const ContactPage = () => {
  return (
    <div className="contact-page">
      <div className="contact-container">

        <h1>Contact Us</h1>
        <p className="contact-subtitle">
          Have questions? We&apos;re here to help.
        </p>

        <div className="contact-grid">

          {/* Contact Info */}
          <div className="contact-info">

            <div className="contact-item">
              <FaPhoneAlt />
              <div>
                <h4>Phone</h4>
                <p>+91 9222347777</p>
              </div>
            </div>

            <div className="contact-item">
              <FaEnvelope />
              <div>
                <h4>Email</h4>
                <p>services@barwa.in</p>
              </div>
            </div>

            <div className="contact-item">
              <FaMapMarkerAlt />
              <div>
                <h4>Location</h4>
                <iframe
  src="https://maps.google.com/maps?q=mahavir%20nagar%20kandivali%20west&t=&z=13&ie=UTF8&iwloc=&output=embed"
  width="100%"
  height="300"
  style={{ border: 0 }}
/>
              </div>
            </div>

          </div>

          {/* Contact Form */}
          <form className="contact-form">

            <input type="text" placeholder="Your Name" required />

            <input type="email" placeholder="Your Email" required />

            <textarea
              placeholder="Your Message"
              rows={5}
              required
            />

            <button type="submit">Send Message</button>

          </form>

        </div>

      </div>
    </div>
  );
};

export default ContactPage;