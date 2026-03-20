"use client";

import { DoughnutChart, PieChart } from "@/components/admin/Charts";
import { Skeleton } from "@/components/admin/Loader";
import { usePieQuery } from "@/redux/api/dashboardApi";
import { RootState } from "@/redux/store";
import { CustomError } from "@/types/api-types";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import {categories} from "@/data/data.json";



const PieCharts = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

   const { isLoading, data, error, isError } = usePieQuery(user?._id!, {
    skip: !user?._id,
  });


 useEffect(() => {
    if (isError) {
      const err = error as CustomError;
      toast.error(err.data.message);
    }
  }, [isError, error]);

  if (isLoading || !data?.charts) {
    return (
      <main className="dashboard">
        <Skeleton length={20} />
      </main>
    );
  }



const productCategories = data.charts.productCategories;
const orders = data.charts.orderFullfillment;       
const revenue = data.charts.revenueDistribution;
const stocks = data.charts.stockAvailability;      
const ageGroup = data.charts.usersAgeGroup;
const adminCustomer = data.charts.adminCustomer;

  return (

      
      <main className="chart-container">
        <h1>Pie & Doughnut Charts</h1>
        
        <section>
          <div>
            <PieChart
              labels={["Processing", "Shipped", "Delivered"]}
              data={[orders.processing, orders.shipped, orders.delivered]}
              backgroundColor={[
                `hsl(110,80%, 80%)`,
                `hsl(110,80%, 50%)`,
                `hsl(110,40%, 50%)`,
              ]}
              offset={[0, 0, 50]}
            />
          </div>
          <h2>Order Fulfillment Ratio</h2>
        </section>

        <section>
          <div>

            
            <DoughnutChart
              labels={productCategories.map((i) => Object.keys(i)[0])}
              data={productCategories.map((i) => Object.values(i)[0])}
              backgroundColor={categories.map(
                (i) => `hsl(${i.value * 4}, ${i.value}%, 50%)`
              )}
              legends={false}
              offset={[0, 0, 0, 80]}
            />
          </div>
          <h2>Product Categories Ratio</h2>
        </section>

        <section>
          <div>
            <DoughnutChart
              labels={["In Stock", "Out Of Stock"]}
              data={[stocks.inStock, stocks.outOfStock]}
              backgroundColor={["hsl(269,80%,40%)", "rgb(53, 162, 255)"]}
              legends={false}
              offset={[0, 80]}
              cutout={"70%"}
            />
          </div>
          <h2> Stock Availability</h2>
        </section>

        <section>
          <div>
            <DoughnutChart
              labels={[
                "Marketing Cost",
                "Discount",
                "Burnt",
                "Production Cost",
                "Net Margin",
              ]}
              data={[
              revenue.marketingCost,
              revenue.discount,
              revenue.burnt,
              revenue.productionCost,
              revenue.netMargin,
            ]}
              backgroundColor={[
                "hsl(110,80%,40%)",
                "hsl(19,80%,40%)",
                "hsl(69,80%,40%)",
                "hsl(300,80%,40%)",
                "rgb(53, 162, 255)",
              ]}
              legends={false}
              offset={[20, 30, 20, 30, 80]}
            />
          </div>
          <h2>Revenue Distribution</h2>
        </section>

        <section>
          <div>
            <PieChart
              labels={[
                "Teenager(Below 20)",
                "Adult (20-40)",
                "Older (above 40)",
              ]}
              data={[ageGroup.teen, ageGroup.adult, ageGroup.old]}
              backgroundColor={[
                `hsl(10, ${80}%, 80%)`,
                `hsl(10, ${80}%, 50%)`,
                `hsl(10, ${40}%, 50%)`,
              ]}
              offset={[0, 0, 50]}
            />
          </div>
          <h2>Users Age Group</h2>
        </section>

        <section>
          <div>
            <DoughnutChart
              labels={["Admin", "Customers"]}
              data={[adminCustomer.admin, adminCustomer.customer]}
              backgroundColor={[`hsl(335, 100%, 38%)`, "hsl(44, 98%, 50%)"]}
              offset={[0, 50]}
            />
          </div>
        </section>
      </main>
   
  );
};

export default PieCharts;