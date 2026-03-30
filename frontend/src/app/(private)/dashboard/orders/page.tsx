"use client";

import { Skeleton } from "@/components/admin/Loader";
import { useMyOrderQuery } from "@/redux/api/orderApi";
import { RootState, server } from "@/redux/store";
import Image from "next/image"; // FIX #2: import added
import Link from "next/link";
import { useSelector } from "react-redux";

const OrdersPage = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const userId = user?._id;

  const { data, isLoading } = useMyOrderQuery(userId!, {
    skip: !userId,
  });

  const orders = data?.orders ?? [];

  if (isLoading) return <Skeleton width="100%" length={20} />;

  return (
    <main className="order-page">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <p className="empty-state">
          No orders yet. <Link href="/search">Start shopping</Link>
        </p>
      ) : (
        <div className="order-list">
          {orders.map((o) => {
            const item = o.orderItems[0];
            const image = item.photo?.startsWith("http")
              ? item.photo
              : `${server}/${item.photo.replace(/\\/g, "/")}`;

            return (
              <Link key={o._id} href={`/orders/${o._id}`} className="order-card">
                <Image src={image} alt={item.name} width={60} height={60} />

                <div className="order-info">
                  <h3>{item.name.split("|")[0]}</h3>

                  <p>
                    {new Date(o.createdAt ?? "").toLocaleDateString("en-IN")}
                  </p>
                  <span className={`status status-${o.status.toLowerCase()}`}>
                    {o.status}
                  </span>
                </div>

                {/* FIX #4: formatted total */}
                <div className="order-price">
                  ₹{o.total.toLocaleString("en-IN")}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default OrdersPage;
