"use client";

import { useEffect, useState } from "react";

type TimelineItem = {
  status: string;
  timestamp: string;
};

type Order = {
  _id: string;
  status: string;
  timeline: TimelineItem[];
};

const steps = [
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

export default function OrderTracking({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await fetch(`/api/v1/order/${orderId}`);
      const data = await res.json();
      setOrder(data.order);
    };

    fetchOrder();
  }, [orderId]);

  if (!order) return <p>Loading...</p>;

  const currentIndex = steps.indexOf(order.status);

  return (
    <div className="tracking-container">
      <h2>Order Tracking</h2>

      {/* Progress Bar */}
      <div className="progress-bar">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`step ${index <= currentIndex ? "active" : ""}`}
          >
            <div className="circle">{index + 1}</div>
            <p>{step}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="timeline">
        {order.timeline.map((item, i) => (
          <div key={i} className="timeline-item">
            <div className="dot" />
            <div>
              <h4>{item.status}</h4>
              <p>{new Date(item.timestamp).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}