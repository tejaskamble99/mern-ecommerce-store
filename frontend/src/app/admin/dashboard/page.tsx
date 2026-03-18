"use client";

import { BarChart, DoughnutChart } from "@/components/admin/Charts";
import DashboardTable from "@/components/admin/DashboardTable";
import { Skeleton } from "@/components/admin/Loader";
import { useStatsQuery } from "@/redux/api/dashboardApi";
import { RootState } from "@/redux/store";
import { CustomError } from "@/types/api-types";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { BiMaleFemale } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import { FaRegBell } from "react-icons/fa";
import { HiTrendingDown, HiTrendingUp } from "react-icons/hi";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const { isLoading, data, error, isError } = useStatsQuery(user?._id!, {
  skip: !user?._id,
});

  const stats = data?.stats!;

  useEffect(() => {
    if (isError) {
      const err = error as CustomError;
      toast.error(err.data.message);
    }
  }, [isError, error]);

  if (isLoading || !data?.stats) {
    return (
      <main className="dashboard">
        <Skeleton length={20} />
      </main>
    );
  }

  return (
    <main className="dashboard">
      {/* Search Bar */}
      <div className="bar">
        <BsSearch />
        <input type="text" placeholder="Search for data, users, docs" />
        <FaRegBell />
        <img
          src={
            user?.photo ||
            "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
          }
          alt={user?.name || "Admin"}
        />
      </div>

      {/* Widgets */}
      <section className="widget-container">
        <WidgetItem
          percent={stats.changePercent.revenue}
          amount={true}
          value={stats.count.revenue}
          heading="Revenue"
          color="rgb(0, 115, 255)"
        />
        <WidgetItem
          percent={stats.changePercent.user}
          value={stats.count.user}
          heading="Users"
          color="rgb(0 198 202)"
        />
        <WidgetItem
          percent={stats.changePercent.order}
          value={stats.count.order}
          heading="Transactions"
          color="rgb(255 196 0)"
        />
        <WidgetItem
          percent={stats.changePercent.product}
          value={stats.count.product}
          heading="Products"
          color="rgb(76 0 255)"
        />
      </section>

      {/* Graphs */}
      <section className="graph-container">
        <div className="revenue-chart">
          <h2>Revenue & Transaction</h2>
          <BarChart
            data_1={stats.chart.order}
            data_2={stats.chart.revenue}
            title_1="Revenue"
            title_2="Transaction"
            bgColor_1="rgb(0, 115, 255)"
            bgColor_2="rgba(53, 162, 235, 0.8)"
          />
        </div>

        <div className="dashboard-categories">
          <h2>Inventory</h2>
          <div>
            {stats.categoryCount.map((i) => {
              const [heading, value] = Object.entries(i)[0];

              return (
                <CategoryItem
                  key={heading}
                  value={value}
                  heading={heading}
                  // FIX 1: Added backticks here
                  color={`hsl(${value * 4}, ${value}%, 50%)`}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Transaction Table */}
      <section className="transaction-container">
        <div className="gender-chart">
          <h2>Gender Ratio</h2>
          <DoughnutChart
            labels={["Female", "Male"]}
            data={[stats.userRatio.female, stats.userRatio.male]}
            backgroundColor={["hsl(340, 82%, 56%)", "rgba(53, 162, 235, 0.8)"]}
            cutout={90}
          />
          <p>
            <BiMaleFemale />
          </p>
        </div>
        <DashboardTable data={stats.latestTransaction} />
      </section>
    </main>
  );
};

// --- SUB COMPONENTS ---

interface WidgetItemProps {
  heading: string;
  value: number;
  percent: number;
  color: string;
  amount?: boolean;
}

const WidgetItem = ({
  heading,
  value,
  percent,
  color,
  amount = false,
}: WidgetItemProps) => (
  <article className="widget">
    <div className="widget-info">
      <p>{heading}</p>
      <h4>{amount ? `₹${value.toLocaleString("en-IN")}` : value}</h4>
      {percent > 0 ? (
        <span className="green">
          <HiTrendingUp /> +{`${percent > 10000 ? 9999 : percent}%`}
        </span>
      ) : (
        <span className="red">
          <HiTrendingDown /> {`${percent < -10000 ? -9999 : percent}%`}
        </span>
      )}
    </div>

    <div
      className="widget-circle"
      style={{
        // FIX 2: Added backticks here
        background: `conic-gradient(
        ${color} ${(Math.abs(percent) / 100) * 360}deg,
        rgb(255, 255, 255) 0
      )`,
      }}
    >
      <span
        style={{
          color,
        }}
      >
        {Math.abs(percent) > 9999
          ? `${percent > 0 ? 9999 : -9999}%`
          : `${percent}%`}
      </span>
    </div>
  </article>
);

interface CategoryItemProps {
  color: string;
  value: number;
  heading: string;
}

const CategoryItem = ({ color, value, heading }: CategoryItemProps) => (
  <div className="category-item">
    <h5>{heading}</h5>
    <div>
      <div
        style={{
          backgroundColor: color,
          width: `${value}%`,
        }}
      ></div>
    </div>
    <span>{value}%</span>
  </div>
);

export default Dashboard;
