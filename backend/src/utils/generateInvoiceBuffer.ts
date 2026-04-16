import PDFDocument from "pdfkit";

export const generateInvoiceBuffer = (order: any): Promise<Buffer> => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const buffers: Buffer[] = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });


    doc.fontSize(28).font("Helvetica-Bold").fillColor("#111111").text("BARWA", 50, 50);
    doc.fontSize(10).font("Helvetica").fillColor("#6b7280").text("Next-Gen Electronics", 50, 82);


    doc.fontSize(24).font("Helvetica-Bold").fillColor("#111827").text("INVOICE", 400, 50, { align: "right" });
    doc.fontSize(10).font("Helvetica").fillColor("#4b5563")
      .text(`Invoice #: ${String(order._id).slice(-8).toUpperCase()}`, 400, 80, { align: "right" })
      .text(`Date: ${new Date().toLocaleDateString("en-IN")}`, 400, 95, { align: "right" })
      .text(`Status: ${order.status}`, 400, 110, { align: "right" });

    doc.moveDown(3);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#e5e7eb").stroke();
    doc.moveDown(1);


    doc.fontSize(12).font("Helvetica-Bold").fillColor("#111827").text("Billed & Shipped To:", 50, doc.y);
    doc.moveDown(0.5);
    doc.fontSize(10).font("Helvetica").fillColor("#4b5563")
      .text(order.shippingInfo?.fullName || "Customer")
      .text(order.shippingInfo?.address ?? "")
      .text(`${order.shippingInfo?.city ?? ""}, ${order.shippingInfo?.state ?? ""}`)
      .text(`${order.shippingInfo?.country ?? ""} — ${order.shippingInfo?.pinCode ?? ""}`);

    doc.fontSize(10).font("Helvetica-Bold").fillColor("#111827")
      .text("Payment Method: ", 400, doc.y - 45)
      .font("Helvetica").fillColor("#4b5563")
      .text(order.paymentMethod === "COD" ? "Cash on Delivery" : "Paid Online", 400, doc.y + 2);

    doc.moveDown(3);


    const tableTop = doc.y;
    doc.rect(50, tableTop, 495, 25).fill("#f3f4f6");
    doc.fillColor("#111827").font("Helvetica-Bold").fontSize(10);
    doc.text("ITEM", 60, tableTop + 8, { width: 230 });
    doc.text("QTY", 300, tableTop + 8, { width: 50, align: "center" });
    doc.text("PRICE", 370, tableTop + 8, { width: 70, align: "right" });
    doc.text("TOTAL", 460, tableTop + 8, { width: 75, align: "right" });

    doc.moveDown(1.5);


    let yPosition = doc.y;
    doc.font("Helvetica").fontSize(10).fillColor("#4b5563");

    for (const item of order.orderItems) {
      doc.text(item.name, 60, yPosition, { width: 230 });
      doc.text(String(item.quantity), 300, yPosition, { width: 50, align: "center" });
      doc.text(`Rs. ${item.price.toLocaleString("en-IN")}`, 370, yPosition, { width: 70, align: "right" });
      doc.text(`Rs. ${(item.price * item.quantity).toLocaleString("en-IN")}`, 460, yPosition, { width: 75, align: "right" });
      yPosition += 25;
      doc.moveTo(50, yPosition - 10).lineTo(545, yPosition - 10).strokeColor("#f3f4f6").stroke();
    }

    doc.y = yPosition + 10;


    const summaryLeft = 360;
    const summaryRow = (label: string, value: string, isBold = false) => {
      const y = doc.y;
      doc.font(isBold ? "Helvetica-Bold" : "Helvetica").fontSize(10).fillColor(isBold ? "#111827" : "#4b5563")
        .text(label, summaryLeft, y, { width: 100 })
        .text(value, 460, y, { width: 85, align: "right" });
      doc.moveDown(0.6);
    };

    summaryRow("Subtotal:", `Rs. ${order.subtotal.toLocaleString("en-IN")}`);
    summaryRow("Tax (GST):", `Rs. ${Math.round(order.tax).toLocaleString("en-IN")}`);
    summaryRow("Shipping:", order.shippingCharges === 0 ? "FREE" : `Rs. ${order.shippingCharges.toLocaleString("en-IN")}`);
    if (order.discount > 0) summaryRow("Discount:", `- Rs. ${order.discount.toLocaleString("en-IN")}`);

    doc.moveDown(0.5);
    doc.moveTo(360, doc.y).lineTo(545, doc.y).strokeColor("#111827").stroke();
    doc.moveDown(0.5);

    doc.fontSize(14);
    summaryRow("Total:", `Rs. ${order.total.toLocaleString("en-IN")}`, true);

    doc.moveDown(4);
    doc.fontSize(10).font("Helvetica").fillColor("#9ca3af")
      .text("Thank you for shopping with Barwa!", { align: "center" })
      .text("For support, email us at: support@barwa.com", { align: "center" });

    doc.end();
  });
};