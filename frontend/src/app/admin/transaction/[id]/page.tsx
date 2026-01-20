"use client";

import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation"; // Hook to get [id]

// 1. Types
interface OrderItemType {
  name: string;
  photo: string;
  price: number;
  quantity: number;
  _id: string;
}

interface OrderType {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: number;
  status: "Processing" | "Shipped" | "Delivered";
  subtotal: number;
  discount: number;
  shippingCharges: number;
  tax: number;
  total: number;
  orderItems: OrderItemType[];
  _id: string;
}

// 2. Mock Data (Replace with API fetch later)
const orderItems: OrderItemType[] = [
  {
    name: "Macbook",
    photo: "https://m.media-amazon.com/images/I/71TPda7cwUL._SX679_.jpg",
    price: 120000,
    quantity: 1,
    _id: "asdnasjdn",
  },
];

const mockOrder: OrderType = {
  name: "Abhishek Singh",
  address: "77 Black Street",
  city: "Neyword",
  state: "Nevada",
  country: "US",
  pinCode: 2434341,
  status: "Processing",
  subtotal: 4000,
  discount: 1200,
  shippingCharges: 0,
  tax: 200,
  total: 4000 + 200 + 0 - 1200,
  orderItems,
  _id: "asdnasjdn",
};

const TransactionManagement = () => {
  const params = useParams(); // Get the ID from URL
  const [order, setOrder] = useState<OrderType>(mockOrder);

  const updateHandler = () => {
    setOrder((prev) => ({
      ...prev,
      status: prev.status === "Processing" ? "Shipped" : "Delivered",
    }));
  };

  const deleteHandler = () => {
    console.log("Delete Order");
    // Implementation for delete
  };

  return (
    <div className="admin-container">
      <main className="product-management">
        {/* LEFT SIDE: ORDER ITEMS */}
        <section
          style={{
            padding: "2rem",
          }}
        >
          <h2>Order Items</h2>

          {order.orderItems.map((i) => (
            <ProductCard
              key={i._id}
              name={i.name}
              photo={i.photo}
              productId={i._id}
              _id={i._id}
              quantity={i.quantity}
              price={i.price}
            />
          ))}
        </section>

        {/* RIGHT SIDE: ORDER INFO */}
        <article className="shipping-info-card">
          <button className="product-delete-btn" onClick={deleteHandler}>
            <FaTrash />
          </button>

          <h1>Order Info</h1>
          <h5>User Info</h5>
          <p>Name: {order.name}</p>
          <p>
            Address: {`${order.address}, ${order.city}, ${order.state}, ${order.country} ${order.pinCode}`}
          </p>

          <h5>Amount Info</h5>
          <p>Subtotal: {order.subtotal}</p>
          <p>Shipping Charges: {order.shippingCharges}</p>
          <p>Tax: {order.tax}</p>
          <p>Discount: {order.discount}</p>
          <p>Total: {order.total}</p>

          <h5>Status Info</h5>
          <p>
            Status:{" "}
            <span
              className={
                order.status === "Delivered"
                  ? "purple"
                  : order.status === "Shipped"
                  ? "green"
                  : "red"
              }
            >
              {order.status}
            </span>
          </p>

          <button className="shipping-btn" onClick={updateHandler}>
            Process Status
          </button>
        </article>
      </main>
    </div>
  );
};

// Sub-Component for individual items
const ProductCard = ({
  name,
  photo,
  price,
  quantity,
  productId,
}: OrderItemType & { productId: string }) => (
  <div className="transaction-product-card">
    <Image src={photo} alt={name} width={100} height={100} />
    <Link href={`/product/${productId}`}>{name}</Link>
    <span>
      ₹{price} X {quantity} = ₹{price * quantity}
    </span>
  </div>
);

export default TransactionManagement;