import express from "express";
import { trackShipment } from "../controllers/shippingController.js";
import { delhiveryWebhook } from "../controllers/shippingController.js";



const router = express.Router();

router.get("/track/:waybill", trackShipment);



router.post("/webhook", delhiveryWebhook);

export default router;