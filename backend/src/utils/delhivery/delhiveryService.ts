import { delhiveryAPI } from "./delhivery.js";

export const createShipment = async (order: any) => {
  try {
    if (process.env.DELHIVERY_ENABLED !== "true") {
      console.log("⚠️  Delhivery disabled — skipping shipment creation");
      return null;
    }
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

          payment_mode: order.paymentMethod === "COD" ? "COD" : "Prepaid",

          total_amount: order.total,
          cod_amount: order.paymentMethod === "COD" ? order.total : 0,

          products_desc: order.orderItems.map((i: any) => i.name).join(", "),

          quantity: order.orderItems.length,

          weight: 0.5,

          shipment_height: 10,
          shipment_width: 10,
          shipment_length: 10,
        },
      ],

      pickup_location: {
        name: process.env.DELHIVERY_PICKUP_NAME || "Barwa",
      },
    };

    console.log("🚀 Sending to Delhivery:", JSON.stringify(payload, null, 2));

    // ✅ CRITICAL FIX: Delhivery requires form-encoded body with a "data" key
    // NOT application/json
    const formData = new URLSearchParams();
    formData.append("data", JSON.stringify(payload));
    formData.append("format", "json");

    const res = await delhiveryAPI.post(
      "/api/cmu/create.json",
      formData.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    console.log("✅ Delhivery Response:", JSON.stringify(res.data, null, 2));

    if (!res.data.success || !res.data.packages?.length) {
      console.error("❌ Delhivery shipment failed:", res.data.rmk);
      return null;
    }

    const waybill = res.data.packages?.[0]?.waybill;
    return waybill || null;
  } catch (err: any) {
    console.error(
      "❌ Delhivery create error:",
      err?.response?.data || err.message,
    );
    return null;
  }
};

export const cancelShipment = async (waybill: string) => {
  try {
     if (process.env.DELHIVERY_ENABLED !== "true") return;
    const formData = new URLSearchParams();
    formData.append("waybill", waybill);
    formData.append("cancellation", "true");

    await delhiveryAPI.post("/api/p/edit", formData.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    console.log(`✅ Delhivery shipment ${waybill} cancelled`);
  } catch (err) {
    console.error("❌ Cancel shipment error:", err);
  }
};
