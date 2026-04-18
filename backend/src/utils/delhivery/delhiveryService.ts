import { delhiveryAPI } from "./delhivery.js";

export const createShipment = async (order: any) => {
  try {
    const payload = {
      shipments: [
        {
          name: order.shippingInfo.fullName,
          add: order.shippingInfo.address,
          pin: String(order.shippingInfo.pinCode),
          city: order.shippingInfo.city,
          state: order.shippingInfo.state,
          country: "India",
          phone: order.shippingInfo.phone || "9876543210",

          order: order._id.toString(),

          payment_mode:
            order.paymentMethod === "COD" ? "COD" : "Prepaid",

          total_amount: order.total,
          cod_amount:
            order.paymentMethod === "COD" ? order.total : 0,

          products_desc: order.orderItems
            .map((i: any) => i.name)
            .join(", "),

          quantity: order.orderItems.length,

          weight: 0.5, // ✅ FIXED

          shipment_height: 10,
          shipment_width: 10,
          shipment_length: 10,
        },
      ],

      pickup_location: {
        name: "primary",
      },
    };

    console.log("🚀 Sending to Delhivery:", payload);

    const res = await delhiveryAPI.post(
      "/api/cmu/create.json",
      payload
    );

    console.log("✅ Delhivery Response:", res.data);

    const waybill =
      res.data?.packages?.[0]?.waybill ||
      res.data?.packages?.[0];

    return waybill;

  } catch (err: any) {
    console.error(
      "❌ Delhivery create error:",
      err?.response?.data || err.message
    );
    return null;
  }
};



export const cancelShipment = async (waybill: string) => {
  try {
    await delhiveryAPI.post("/api/p/edit", {
      waybill,
      cancellation: "true",
    });
  } catch (err) {
    console.error("Cancel shipment error");
  }
};






