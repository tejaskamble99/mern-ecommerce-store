"use client";

import { useEffect, useState } from "react";
import { server } from "@/redux/store";
import { auth } from "@/firebase";

type TimelineItem = {
  status: string;
  timestamp: string;
};

type Order = {
  _id: string;
  status: string;
  timeline: TimelineItem[];
};

const steps = ["Processing", "Shipped", "Out for Delivery", "Delivered"];

export default function OrderTracking({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {

        const token = await auth.currentUser?.getIdToken();

        const res = await fetch(`${server}/api/v1/order/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          setError(true);
          return;
        }

        const data = await res.json();
        setOrder(data.order);
      } catch {
        setError(true);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  if (error) return null; // fail silently — tracking is non-critical
  if (!order) return <p>Loading tracking...</p>;

  const currentIndex = steps.indexOf(order.status);

  return (
    <div className="tracking-container">
      <h2>Order Tracking</h2>

      {/* Progress Bar */}
      <div className="progress-bar">
        {steps.map((step, index) => (
          <div key={step} className={`step ${index <= currentIndex ? "active" : ""}`}>
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