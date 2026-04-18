import { TryCatch } from "../middleware/error.js";
import { Order } from "../models/order.js";
import { OrderStatus } from "../types/types.js";
import { delhiveryAPI } from "../utils/delhivery/delhivery.js";

export const trackShipment = TryCatch(async (req, res, next) => {
  try {
    const { waybill } = req.params;

    const response = await delhiveryAPI.get("/api/v1/packages/json/", {
      params: { waybill },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Tracking failed" });
  }
});

export const delhiveryWebhook = TryCatch(async (req, res) => {
  const data = req.body;

  const waybill = data?.waybill;
  const status = data?.status;

  if (!waybill) return res.sendStatus(200);

  const order = await Order.findOne({ trackingId: waybill });

  if (!order) return res.sendStatus(200);

  const statusMap: Record<string, OrderStatus> = {
    "In Transit": "Shipped",
    "Out for Delivery": "Out for Delivery",
    Delivered: "Delivered",
  };

  const newStatus: OrderStatus = statusMap[status] || "Processing";

  if (order.status === newStatus) return res.sendStatus(200);

  order.status = newStatus;

  order.timeline.push({
    status: newStatus,
    timestamp: new Date(),
  });

  await order.save();

  res.sendStatus(200);
});
