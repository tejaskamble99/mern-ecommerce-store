"use client";

import React from 'react';
import { FaWhatsapp } from 'react-icons/fa'; // Assuming you have react-icons installed

const WhatsAppButton = () => {

  const phoneNumber = "9930208155"; 
  const message = "Hello! I have a question about Barwa electronics.";

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float-btn"
      aria-label="Chat with us on WhatsApp"
    >
      <FaWhatsapp size={32} />
    </a>
  );
};

export default WhatsAppButton;