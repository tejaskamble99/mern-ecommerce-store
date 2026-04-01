"use client";
import { useMyOrdersQuery } from "@/redux/api/orderApi";
import { RootState, server } from "@/redux/store";
import Image from "next/image";
import { useState } from "react";
import { useSelector } from "react-redux";
import { FaShoppingBag, FaRupeeSign, FaHeart } from "react-icons/fa";
import { Skeleton } from "@/components/admin/Loader";

const fallback =
  "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";

interface WidgetProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub: string;
  active?: boolean;
}

const Widget = ({ icon, label, value, sub, active }: WidgetProps) => (
  <div className="user-widget">
    <div className="user-widget-top">
      <span className="user-widget-icon">{icon}</span>
      {active && <span className="user-widget-badge">ACTIVE</span>}
    </div>
    <p className="user-widget-label">{label}</p>
    <h3 className="user-widget-value">{value}</h3>
    <p className="user-widget-sub">{sub}</p>
  </div>
);

const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const [src, setSrc] = useState(user?.photo || fallback);


  const { data: ordersData, isLoading } = useMyOrdersQuery();

  const orders = ordersData?.orders ?? [];

  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentOrders = orders.filter(
    (o) => new Date(o.createdAt ?? "") > thirtyDaysAgo,
  ).length;

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

  const activeOrders = orders.filter(
    (o) => o.status === "Processing" || o.status === "Shipped",
  ).length;

  if (isLoading) return <Skeleton width="100%" length={20} />;
  return (
    <main className="user-dashboard">
      <div className="user-profile">
        <Image
          src={src}
          alt={user?.name || "User"}
          width={60}
          height={60}
          className="user-avatar"
          onError={() => setSrc(fallback)}
          priority
        />
        <div>
          <h1>Hello, {user?.name} 👋</h1>
          <p>Manage your profile and orders</p>
        </div>
      </div>

      <section className="user-widget-container">
        <Widget
          icon={<FaShoppingBag />}
          label="Recent Orders"
          value={String(recentOrders).padStart(2, "0")}
          sub="Past 30 days"
          active={activeOrders > 0}
        />
        <Widget
          icon={<FaRupeeSign />}
          label="Total Spent"
          value={`₹${totalSpent.toLocaleString("en-IN")}`}
          sub="All time"
        />
        <Widget
          icon={<FaHeart />}
          label="Total Orders"
          value={String(orders.length).padStart(2, "0")}
          sub="All orders"
        />
      </section>
      <section className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead className="head">
              <tr>
                <th>Order ID</th>
                <th>product</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const item = o.orderItems[0];
                if (!item) return null;
                const image = item.photo?.startsWith("http")
                  ? item.photo
                  : `${server}/${item.photo.replace(/\\/g, "/")}`;
                return (
                  <tr key={o._id}>
                    <td data-label="Order ID">{o._id}</td>
                    <td data-label="Product" className="product-cell">
                      <Image
                        src={image}
                        alt={item.name}
                        width={40}
                        height={40}
                        style={{ borderRadius: "50%", objectFit: "cover" }}
                      />
                      <p className="product-name">{item.name.split("|")[0]}</p>
                    </td>
                    <td data-label="Date">
                      {o.createdAt
                        ? new Date(o.createdAt).toLocaleDateString("en-IN")
                        : "-"}
                    </td>
                    <td data-label="Amount">₹{o.total.toLocaleString("en-IN")}</td>
                    <td data-label="Status">{o.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
