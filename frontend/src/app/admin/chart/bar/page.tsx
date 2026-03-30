"use client";

import { BarChart } from "@/components/admin/Charts"; // Use @ alias
import { Skeleton } from "@/components/admin/Loader";
import { useBarQuery } from "@/redux/api/dashboardApi";
import { RootState } from "@/redux/store";
import { CustomError } from "@/types/api-types";
import { getLastMonths } from "@/utils/features";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";



const {last12Months, last6Months} = getLastMonths();

const Barcharts = () => {

    const { user } = useSelector((state: RootState) => state.userReducer);

const userId = user?._id;

const { isLoading, data, error, isError } = useBarQuery(userId ?? "", {
  skip: !userId,
});

  

  
  



 useEffect(() => {
    if (isError) {
      const err = error as CustomError;
      toast.error(err?.data?.message || "Something went wrong");
    }
  }, [isError, error]);

  if (isLoading || !data?.charts) {
    return (
      <main className="dashboard">
        <Skeleton length={20} />
      </main>
    );
  }

  const products  = data?.charts.products || [];
  const orders  = data?.charts.orders || [];
  const users  = data?.charts.users || [];





  return (
    
      
      <main className="chart-container">
        <h1>Bar Charts</h1>
        <section>
          <BarChart
            data_2={products}
            data_1={users}
            labels={last6Months}
            title_1="Products"
            title_2="Users"
            bgColor_1={`hsl(260, 50%, 30%)`}
            bgColor_2={`hsl(360, 90%, 90%)`}
          />
          <h2>Top Products & Top Customers</h2>
        </section>

        <section>
          <BarChart
            horizontal={true}
            data_1={orders}
            data_2={[]}
            title_1="Orders"
            title_2=""
            bgColor_1={`hsl(180, 40%, 50%)`}
            bgColor_2=""
            labels={last12Months}
          />
          <h2>Orders throughout the year</h2>
        </section>
      </main>
    
  );
};

export default Barcharts;