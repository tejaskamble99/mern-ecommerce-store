"use client";

import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import Link from "next/link";
import { useParams } from "next/navigation"; // To access the ID from URL

// 1. Define Types locally (so it works immediately)
interface OrderItem {
  name: string;
  photo: string;
  _id: string;
  quantity: number;
  price: number;
  productId: string;
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
  orderItems: OrderItem[];
}

// 2. Mock Data
const img = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8&w=1000&q=804";

const mockOrderItems: OrderItem[] = [
  {
    name: "Puma Shoes",
    photo: img,
    _id: "asdsaasdas",
    productId: "product_id_123",
    quantity: 4,
    price: 2000,
  },
];

const TransactionManagement = () => {
  const params = useParams(); // Get ID from URL (e.g., /admin/transaction/123)

  const [order, setOrder] = useState<OrderType>({
    name: "Puma Shoes",
    address: "77 black street",
    city: "Neyword",
    state: "Nevada",
    country: "US",
    pinCode: 242433,
    status: "Processing",
    subtotal: 4000,
    discount: 1200,
    shippingCharges: 0,
    tax: 200,
    total: 4000 + 200 + 0 - 1200,
    orderItems: mockOrderItems,
  });

  // Destructure for cleaner JSX
  const {
    name,
    address,
    city,
    country,
    state,
    pinCode,
    subtotal,
    shippingCharges,
    tax,
    discount,
    total,
    status,
    orderItems,
  } = order;

  const updateHandler = (): void => {
    setOrder((prev) => ({
      ...prev,
      status: prev.status === "Processing" ? "Shipped" : "Delivered",
    }));
  };

  const deleteHandler = (): void => {
    console.log("Deleting Order ID:", params.id);
  };

  return (
    <div className="admin-container">
      {/* Sidebar removed (Layout handles it) */}
      
      <main className="product-management">
        <section style={{ padding: "2rem" }}>
          <h2>Order Items</h2>

          {orderItems.map((i) => (
            <ProductCard
              key={i._id}
              name={i.name}
              photo={i.photo}
              productId={i.productId}
              _id={i._id}
              quantity={i.quantity}
              price={i.price}
            />
          ))}
        </section>

        <article className="shipping-info-card">
          <button className="product-delete-btn" onClick={deleteHandler}>
            <FaTrash />
          </button>
          
          <h1>Order Info</h1>
          <h5>User Info</h5>
          <p>Name: {name}</p>
          <p>
            Address: {`${address}, ${city}, ${state}, ${country} ${pinCode}`}
          </p>
          
          <h5>Amount Info</h5>
          <p>Subtotal: {subtotal}</p>
          <p>Shipping Charges: {shippingCharges}</p>
          <p>Tax: {tax}</p>
          <p>Discount: {discount}</p>
          <p>Total: {total}</p>

          <h5>Status Info</h5>
          <p>
            Status:{" "}
            <span
              className={
                status === "Delivered"
                  ? "purple"
                  : status === "Shipped"
                  ? "green"
                  : "red"
              }
            >
              {status}
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

// Sub-Component for Order Item Card
const ProductCard = ({
  name,
  photo,
  price,
  quantity,
  productId,
}: OrderItem) => (
  <div className="transaction-product-card">
    <img src={photo} alt={name} />
    <Link href={`/product/${productId}`}>{name}</Link>
    <span>
      ₹{price} X {quantity} = ₹{price * quantity}
    </span>
  </div>
);

export default TransactionManagement;