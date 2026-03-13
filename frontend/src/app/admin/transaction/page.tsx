"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import TableHOC from "@/components/admin/TableHOC";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "@/types/reducer-types";
import { useAllOrderQuery } from "@/redux/api/orderApi";
import { CustomError } from "@/types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/admin/Loader";



interface DataType {
  user: string;
  amount: number;
  discount: number;
  quantity: number;
  status: string; 
  _id: string;    
}

const columns: ColumnDef<DataType>[] = [
  {
    header: "User",
    accessorKey: "user",
  },
  {
    header: "Amount",
    accessorKey: "amount",
  },
  {
    header: "Discount",
    accessorKey: "discount",
  },
  {
    header: "Quantity",
    accessorKey: "quantity",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (info) => {
     
      const status = info.getValue<string>();
      let color = "red";
      if (status === "Shipped") color = "green";
      if (status === "Delivered") color = "purple";
      return <span className={color}>{status}</span>;
    },
  },
  {
    header: "Action",
    accessorKey: "_id",
    cell: (info) => (
      <Link href={`/admin/transaction/${info.getValue<string>()}`}>Manage</Link>
    ),
  },
];


export default function Transaction() {
  const { user } = useSelector(
      (state: { userReducer: UserReducerInitialState }) => state.userReducer
    );

     const { data, isLoading, isError, error } = useAllOrderQuery(
    user?._id ?? "",
    { skip: !user?._id }
  );

  useEffect(() => {
    if (isError) {
      const err = error as CustomError;
      toast.error(err.data.message);
    }
  }, [isError, error]);

  const rows = useMemo<DataType[]>(
    () =>
      data?.orders?.map((i) => ({
        user: i.user.name,
        amount: i.total,
        discount: i.discount,
        quantity: i.orderItems.length,
        status: i.status,
        _id: i._id,
      })) ?? [],
    [data]
  );

  
 
 
  const Table = useMemo(
    () =>
      TableHOC<DataType>(
        columns,
        rows,
        "dashboard-product-box",
        "Transactions",
        rows.length > 6
      ),
    [rows]
  );
 
  if (isLoading) return <p>Loading...</p>;

  return (
   
      <main className="dashboard-product-box">
        {isLoading ? <Skeleton width = "100%" length = {20}/> : <Table />}
      </main>
   
  );
}