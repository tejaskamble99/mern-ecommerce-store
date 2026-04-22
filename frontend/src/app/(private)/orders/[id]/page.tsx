"use client";

import {
  useCancelOrderMutation,
  useOrderDetailsQuery,
} from "@/redux/api/orderApi";
import { server } from "@/redux/store";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/admin/Loader";
import { auth } from "@/firebase";
import OrderTracking from "@/components/layout/order/OrderTracking"; 

const OrderDetails = () => {
  const params = useParams();
  const id = params?.id as string;

  const router = useRouter();

  const { data, isLoading } = useOrderDetailsQuery(id, {
    skip: !id,
  });

  const [cancelOrder] = useCancelOrderMutation();

  if (isLoading) return <Skeleton width="100%" length={20} />;

  const order = data?.order;
  if (!order) return <p>Order not found</p>;

const cancelHandler = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
    
      const res = await cancelOrder(id).unwrap(); 
      toast.success(res.message);
      router.push("/orders");
    } catch {
      toast.error("Failed to cancel order");
    }
  };

  const downloadInvoice = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();

      const res = await fetch(`${server}/api/v1/order/invoice/${order._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to download invoice");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${order._id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      toast.error("Unable to download invoice");
    }
  };

  return (
    <main className="order-details-page">
      <h1>Order Details</h1>

      <p className="order-details-id">
        Order #{order._id.slice(-8).toUpperCase()}
      </p>

      <div className="order-status">
        Status{" "}
        <span className={`status status-${order.status.toLowerCase()}`}>
          {order.status}
        </span>
      </div>
      <div className="order-payment">
        Payment Method :-{" "}
        <span>
          {order.paymentMethod === "COD" ? "Cash on Delivery" : "Paid Online"}
        </span>
      </div>

      <div className="order-shipping">
        <h3>Delivery Address</h3>
        <p className="shipping-name">{order.shippingInfo.fullName}</p>
        <p>{order.shippingInfo.address}</p>
        
        <p>
          {order.shippingInfo.city}, {order.shippingInfo.state}
        </p>
        <p>
          {order.shippingInfo.country} — {order.shippingInfo.pinCode}
        </p>
        <p> Phone Number :- {order.shippingInfo.phone}</p>
      </div>

      <div className="order-items">
        <h3>Items</h3>

        {order.orderItems.map((item) => {
          const image =
            item.photo && item.photo.startsWith("http")
              ? item.photo
              : `${server}/${item.photo?.replace(/\\/g, "/")}`;

          return (
            <div key={item._id} className="order-item">
              <Image src={image} alt={item.name} width={70} height={70} />

              <div className="order-item-info">
                <h4>{item.name}</h4>

                <p>
                  ₹{item.price.toLocaleString("en-IN")} × {item.quantity}
                </p>

                <p className="order-item-total">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="order-summary">
        <h3>Price Summary</h3>

        <div className="summary-row">
          <span>Subtotal</span>
          <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
        </div>

        <div className="summary-row">
          <span>Tax</span>
          <span>₹{Math.round(order.tax).toLocaleString("en-IN")}</span>
        </div>

        <div className="summary-row">
          <span>Shipping</span>
          <span>
            {order.shippingCharges === 0
              ? "FREE"
              : `₹${order.shippingCharges.toLocaleString("en-IN")}`}
          </span>
        </div>

        {order.discount > 0 && (
          <div className="summary-row discount">
            <span>Discount</span>
            <span>- ₹{order.discount.toLocaleString("en-IN")}</span>
          </div>
        )}

        <div className="summary-row total">
          <span>Total</span>
          <span>₹{order.total.toLocaleString("en-IN")}</span>
        </div>
      </div>
      <div>
      <OrderTracking orderId={order._id} />
        </div>
      <button onClick={downloadInvoice} className="invoice-btn">
        Download Invoice
      </button>

      {order.status === "Processing" && (
        <button className="cancel-btn" onClick={cancelHandler}>
          Cancel Order
        </button>
      )}
    </main>
  );
};

export default OrderDetails;
