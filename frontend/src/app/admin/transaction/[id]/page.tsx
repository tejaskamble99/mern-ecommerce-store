"use client";

import {
  useDeleteOrderMutation,
  useOrderDetailsQuery,
  useUpdateOrderMutation,
} from "@/redux/api/orderApi";
import { CustomError } from "@/types/api-types";
import { UserReducerInitialState } from "@/types/reducer-types";
import { responseToast } from "@/utils/features";
import { Order, OrderItem } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";

const defaultData: Order = {
  shippingInfo: {
    fullName: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  },
  status: "",
  subtotal: 0,
  discount: 0,
  shippingCharges: 0,
  tax: 0,
  total: 0,
  orderItems: [],
  user: { name: "", _id: "" },
  _id: "",
};

const ProductCard = ({ name, photo, price, quantity, _id }: OrderItem) => {
  const photoUrl = photo?.startsWith("http")
    ? photo
    : `${process.env.NEXT_PUBLIC_SERVER_URL}/${photo}`;

  return (
    <div className="transaction-product-card">
      <Image
  src={photoUrl}
  alt={name}
  width={100}
  height={100}
  unoptimized={photoUrl.includes("localhost")}
/>
      <Link href={`/product/${_id}`}>{name}</Link>
      <span>
        ₹{price.toLocaleString("en-IN")} X {quantity} = ₹
        {(price * quantity).toLocaleString("en-IN")}
      </span>
    </div>
  );
};

const TransactionManagement = () => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer,
  );

  const params = useParams();
  const router = useRouter();

  const rawId = params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const { data, isLoading, isError, error } = useOrderDetailsQuery(id!, {
    skip: !id,
  });

  const {
    shippingInfo: { fullName, address, city, state, country, pinCode },
    orderItems,
    user: { name },
    status,
    tax,
    subtotal,
    total,
    discount,
    shippingCharges,
    _id: orderId,
  } = data?.order || defaultData;

  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  useEffect(() => {
    if (isError) {
      const err = error as CustomError;
      toast.error(err.data.message);
    }
  }, [isError, error]);

  const updateHandler = async () => {
    if (!user?._id || !orderId) return;

    const nextStatus = status === "Processing" ? "Shipped" : "Delivered";
    const confirmed = window.confirm(
      `Mark this order as ${nextStatus}? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await updateOrder({ userId: user._id, orderId }).unwrap();
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update order status");
    }
  };

  const deleteHandler = async () => {
    if (!user?._id || !orderId) return;

    const confirmed = window.confirm(
      "Delete this order? This cannot be undone."
    );
    if (!confirmed) return;

    try {
      const res = await deleteOrder({ userId: user._id, orderId });
      responseToast(res, router, "/admin/transaction");
    } catch {
      toast.error("Failed to delete order");
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <main className="product-management">
      <section style={{ padding: "2rem" }}>
        <h2>Order Items</h2>
        {orderItems.map((i) => (
          <ProductCard key={i._id} {...i} />
        ))}
      </section>

      <article className="shipping-info-card">
        <button className="product-delete-btn" onClick={deleteHandler}>
          <FaTrash />
        </button>

        <h1>Order Info</h1>

        <h5>User Info</h5>
        <p>Account Name: {name}</p>
        <p>Recipient: {fullName}</p>
        <p>Address: {`${address}, ${city}, ${state}, ${country} ${pinCode}`}</p>

        <h5>Amount Info</h5>
        <p>Subtotal: ₹{subtotal.toLocaleString("en-IN")}</p>
        <p>Shipping Charges: ₹{shippingCharges.toLocaleString("en-IN")}</p>
        <p>Tax: ₹{tax.toLocaleString("en-IN")}</p>
        <p>Discount: ₹{discount.toLocaleString("en-IN")}</p>
        <p>
          <b>Total: ₹{total.toLocaleString("en-IN")}</b>
        </p>

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

        {status !== "Delivered" && (
          <button className="shipping-btn" onClick={updateHandler}>
            Process Status
          </button>
        )}
      </article>
    </main>
  );
};

export default TransactionManagement;