export const orderEmailTemplate = (order: any, userEmail: string) => {
  const itemsHTML = order.orderItems
    .map(
      (item: any) => `
      <tr>
        <td style="padding:10px;border-bottom:1px solid #eee;">
          ${item.name}
        </td>
        <td style="padding:10px;border-bottom:1px solid #eee;">
          ${item.quantity}
        </td>
        <td style="padding:10px;border-bottom:1px solid #eee;">
          ₹${item.price}
        </td>
      </tr>
    `
    )
    .join("");

  return `
  <div style="font-family:Arial, sans-serif;max-width:600px;margin:auto;">
    
    <h2 style="color:#111;">Order Confirmed 🎉</h2>

    <p>Hi ${userEmail},</p>

    <p>Your order <b>#${order._id}</b> has been placed successfully.</p>

    <h3>Order Summary</h3>

    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr>
          <th style="text-align:left;padding:10px;border-bottom:2px solid #000;">Product</th>
          <th style="text-align:left;padding:10px;border-bottom:2px solid #000;">Qty</th>
          <th style="text-align:left;padding:10px;border-bottom:2px solid #000;">Price</th>
        </tr>
      </thead>

      <tbody>
        ${itemsHTML}
      </tbody>
    </table>

    <div style="margin-top:20px;">
      <p><b>Subtotal:</b> ₹${order.subtotal}</p>
      <p><b>Tax:</b> ₹${order.tax}</p>
      <p><b>Shipping:</b> ₹${order.shippingCharges}</p>
      ${
        order.discount > 0
          ? `<p><b>Discount:</b> -₹${order.discount}</p>`
          : ""
      }
      <h3>Total: ₹${order.total}</h3>
    </div>

    <hr/>

    <p style="font-size:12px;color:#777;">
      Thank you for shopping with Barwa.
    </p>

  </div>
  `;
};