
export const orderEmailTemplate = (order: any, userName: string) => {
  const itemsHTML = order.orderItems
    .map(
      (item: any) => `
      <tr>
        <td style="padding: 12px 5px; border-bottom: 1px solid #eaeaea; color: #111827;">
          <strong style="display:block; font-size: 14px;">${item.name}</strong>
        </td>
        <td style="padding: 12px 5px; border-bottom: 1px solid #eaeaea; color: #4b5563; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px 5px; border-bottom: 1px solid #eaeaea; color: #111827; text-align: right;">
          ₹${(item.price * item.quantity).toLocaleString("en-IN")}
        </td>
      </tr>
    `
    )
    .join("");

  return `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 20px; color: #111827;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      
      <div style="background-color: #111111; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">BARWA</h1>
      </div>

      <div style="padding: 30px;">
        <h2 style="margin-top: 0; color: #111827; font-size: 22px;">Order Confirmed! 🎉</h2>
        <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Hi ${userName},</p>
        <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Thank you for your purchase. Your order <strong>#${String(order._id).slice(-8).toUpperCase()}</strong> has been received and is currently being processed.</p>

        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 25px 0;">
          <p style="margin: 0 0 10px 0; font-size: 14px;">
            <strong>Payment Method:</strong> ${order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Paid Online'}
          </p>
          <p style="margin: 0; font-size: 14px; line-height: 1.5;">
            <strong>Shipping To:</strong><br/>
            ${order.shippingInfo.fullName}<br/>
            ${order.shippingInfo.address}<br/>
            ${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.pinCode}
          </p>
        </div>

        <h3 style="border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 30px;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 10px 5px; border-bottom: 2px solid #111111; color: #111111; font-size: 14px;">Item</th>
              <th style="text-align: center; padding: 10px 5px; border-bottom: 2px solid #111111; color: #111111; font-size: 14px;">Qty</th>
              <th style="text-align: right; padding: 10px 5px; border-bottom: 2px solid #111111; color: #111111; font-size: 14px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>

        <div style="width: 100%; max-width: 300px; margin-left: auto;">
          <table style="width: 100%; font-size: 14px; color: #4b5563;">
            <tr>
              <td style="padding: 5px 0;">Subtotal:</td>
              <td style="text-align: right; padding: 5px 0;">₹${order.subtotal.toLocaleString("en-IN")}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0;">Tax (GST):</td>
              <td style="text-align: right; padding: 5px 0;">₹${Math.round(order.tax).toLocaleString("en-IN")}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0;">Shipping:</td>
              <td style="text-align: right; padding: 5px 0;">${order.shippingCharges === 0 ? 'FREE' : `₹${order.shippingCharges.toLocaleString("en-IN")}`}</td>
            </tr>
            ${order.discount > 0 ? `
            <tr>
              <td style="padding: 5px 0; color: #10b981;">Discount:</td>
              <td style="text-align: right; padding: 5px 0; color: #10b981;">-₹${order.discount.toLocaleString("en-IN")}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 15px 0 0 0; font-weight: bold; color: #111827; font-size: 18px; border-top: 2px solid #e5e7eb;">Total Paid:</td>
              <td style="text-align: right; padding: 15px 0 0 0; font-weight: bold; color: #111827; font-size: 18px; border-top: 2px solid #e5e7eb;">₹${order.total.toLocaleString("en-IN")}</td>
            </tr>
          </table>
        </div>
      </div>

      <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; font-size: 12px; color: #6b7280;">
          Thank you for shopping with <strong>Barwa</strong>.<br/>
          If you have any questions about your order, please reply to this email to contact our support team.
        </p>
      </div>
      
    </div>
  </div>
  `;
};

export const adminOrderEmailTemplate = (order: any, userData: any) => {
  const itemsHTML = order.orderItems
    .map(
      (item: any) => `
      <tr>
        <td style="padding: 12px 5px; border-bottom: 1px solid #eaeaea; color: #111827;">
          <strong style="display:block; font-size: 14px;">${item.name}</strong>
          <small style="color: #6b7280; font-size: 11px;">ID: ${item.productId}</small>
        </td>
        <td style="padding: 12px 5px; border-bottom: 1px solid #eaeaea; color: #4b5563; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px 5px; border-bottom: 1px solid #eaeaea; color: #111827; text-align: right;">
          ₹${(item.price * item.quantity).toLocaleString("en-IN")}
        </td>
      </tr>
    `
    )
    .join("");

  return `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #e5e7eb; padding: 20px; color: #111827;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      
      <div style="background-color: #1e3a8a; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px;">New Order Alert 🚨</h1>
      </div>

      <div style="padding: 30px;">
        <h2 style="margin-top: 0; color: #111827; font-size: 20px;">Order #${String(order._id).slice(-8).toUpperCase()}</h2>
        
        <div style="background-color: ${order.paymentMethod === 'COD' ? '#fef3c7' : '#d1fae5'}; border-left: 4px solid ${order.paymentMethod === 'COD' ? '#f59e0b' : '#10b981'}; padding: 12px; margin-bottom: 20px; border-radius: 4px;">
          <strong style="color: ${order.paymentMethod === 'COD' ? '#92400e' : '#065f46'};">Payment Method:</strong> 
          <span style="color: ${order.paymentMethod === 'COD' ? '#b45309' : '#047857'};">
            ${order.paymentMethod === 'COD' ? 'Cash on Delivery (Collect Cash)' : 'Paid Online'}
          </span>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
          <tr>
            <td style="vertical-align: top; width: 50%; padding-right: 10px;">
              <h3 style="font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 5px;">Customer Details</h3>
              <p style="margin: 0; font-size: 14px; line-height: 1.5;">
                <strong>${userData?.name || 'Guest User'}</strong><br/>
                <a href="mailto:${userData?.email}" style="color: #2563eb; text-decoration: none;">${userData?.email}</a>
              </p>
            </td>
            <td style="vertical-align: top; width: 50%; padding-left: 10px;">
              <h3 style="font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 5px;">Shipping Address</h3>
              <p style="margin: 0; font-size: 14px; line-height: 1.5;">
                <strong>${order.shippingInfo.fullName}</strong><br/>
                ${order.shippingInfo.address}<br/>
                ${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.pinCode}
              </p>
            </td>
          </tr>
        </table>

        <h3 style="border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 20px; font-size: 16px;">Items Ordered</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 10px 5px; border-bottom: 2px solid #111111; color: #111111; font-size: 14px;">Product</th>
              <th style="text-align: center; padding: 10px 5px; border-bottom: 2px solid #111111; color: #111111; font-size: 14px;">Qty</th>
              <th style="text-align: right; padding: 10px 5px; border-bottom: 2px solid #111111; color: #111111; font-size: 14px;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>

        <div style="width: 100%; max-width: 300px; margin-left: auto;">
          <table style="width: 100%; font-size: 14px; color: #4b5563;">
            <tr>
              <td style="padding: 5px 0;">Subtotal:</td>
              <td style="text-align: right; padding: 5px 0;">₹${order.subtotal.toLocaleString("en-IN")}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0;">Tax (GST):</td>
              <td style="text-align: right; padding: 5px 0;">₹${Math.round(order.tax).toLocaleString("en-IN")}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0;">Shipping:</td>
              <td style="text-align: right; padding: 5px 0;">${order.shippingCharges === 0 ? 'FREE' : `₹${order.shippingCharges.toLocaleString("en-IN")}`}</td>
            </tr>
            ${order.discount > 0 ? `
            <tr>
              <td style="padding: 5px 0; color: #10b981;">Discount:</td>
              <td style="text-align: right; padding: 5px 0; color: #10b981;">-₹${order.discount.toLocaleString("en-IN")}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 15px 0 0 0; font-weight: bold; color: #111827; font-size: 18px; border-top: 2px solid #e5e7eb;">Revenue:</td>
              <td style="text-align: right; padding: 15px 0 0 0; font-weight: bold; color: #10b981; font-size: 18px; border-top: 2px solid #e5e7eb;">₹${order.total.toLocaleString("en-IN")}</td>
            </tr>
          </table>
        </div>

      </div>
    </div>
  </div>
  `;
};


export const customerCancelEmailTemplate = (order: any, userName: string) => {
  // Determine refund message based on how they paid
  const refundMessage = order.paymentMethod === 'COD' 
    ? "Since you selected Cash on Delivery, no charges were made and no refund is necessary."
    : "Any applied charges will be refunded to your original payment method within 3-5 business days.";

  return `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 20px; color: #111827;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      
      <div style="background-color: #ef4444; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">Order Cancelled</h1>
      </div>

      <div style="padding: 30px;">
        <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Hi ${userName},</p>
        <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">As requested, your order <strong>#${String(order._id).slice(-8).toUpperCase()}</strong> has been successfully cancelled.</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #9ca3af;">
          <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #4b5563;">
            ${refundMessage}
          </p>
        </div>

        <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">We have updated our inventory and closed this order. We hope to see you shopping with us again soon!</p>
      </div>

      <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; font-size: 12px; color: #6b7280;">
          <strong>Barwa</strong><br/>
          If this cancellation was a mistake, please place a new order on our website.
        </p>
      </div>
      
    </div>
  </div>
  `;
};


export const adminCancelEmailTemplate = (order: any, userName: string, userEmail: string) => {
  return `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #e5e7eb; padding: 20px; color: #111827;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      
      <div style="background-color: #dc2626; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Order Cancelled Alert ⚠️</h1>
      </div>

      <div style="padding: 30px;">
        <h2 style="margin-top: 0; color: #111827; font-size: 20px;">Order #${String(order._id).slice(-8).toUpperCase()}</h2>
        
        <p style="color: #4b5563; font-size: 16px;">
          The customer has cancelled their order. <strong>Do not ship this package.</strong>
        </p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; border: 1px solid #e5e7eb;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280; width: 40%;">Customer</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">${userName} (${userEmail})</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Lost Revenue</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #dc2626;">₹${order.total.toLocaleString("en-IN")}</td>
          </tr>
          <tr>
            <td style="padding: 10px; color: #6b7280;">Payment Method</td>
            <td style="padding: 10px; font-weight: bold;">${order.paymentMethod || 'Online'}</td>
          </tr>
        </table>

        <p style="margin-top: 25px; font-size: 14px; color: #6b7280;">
          * Stock levels for these items have already been automatically restored in your database.
        </p>

      </div>
    </div>
  </div>
  `;
};