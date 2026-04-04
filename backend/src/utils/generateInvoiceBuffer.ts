import PDFDocument from "pdfkit";
import { Order } from "../models/order.js";

export const generateInvoiceBuffer = (order: any): Promise<Buffer> => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50 });

    const buffers: Buffer[] = [];

    doc.on("data", buffers.push.bind(buffers));

    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });

    // ── Header ──
    doc.fontSize(24).font("Helvetica-Bold").text("MyShop", { align: "left" });

    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#9ca3af")
      .text("Mobile Phone Accessories", { align: "left" });

    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .fillColor("#000")
      .text("INVOICE", { align: "right" });

    doc.moveDown();

    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#374151")
      .text(`Invoice #: ${String(order._id).slice(-8).toUpperCase()}`)
      .text(`Date: ${new Date().toLocaleDateString("en-IN")}`)
      .text(`Status: ${order.status}`);

    doc.moveDown();

    for (const item of order.orderItems) {
      doc.text(`${item.name} - ${item.quantity} × ₹${item.price}`);
    }

    doc.moveDown();

    doc.text(`Subtotal: ₹${order.subtotal}`);
    doc.text(`Tax: ₹${order.tax}`);
    doc.text(`Shipping: ₹${order.shippingCharges}`);
    doc.text(`Total: ₹${order.total}`);

    doc.end();
  });
};