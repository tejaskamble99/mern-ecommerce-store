"use client";
import { useState } from "react";
import TableHOC from "@/components/admin/TableHOC"; 
import { ColumnDef } from '@tanstack/react-table';
import Link from "next/link";

type DataType = {
  _id: string;
  amount: number;
  quantity: number;
  discount: number;
  status: string;
  action: string;
};

const columns: ColumnDef<DataType>[] = [
  { header: "Id", accessorKey: "_id" },
  { header: "Quantity", accessorKey: "quantity" },
  { header: "Discount", accessorKey: "discount" },
  { header: "Amount", accessorKey: "amount" },
  { 
    header: "Status", 
    accessorKey: "status",
    cell: (info) => {
      const statusValue = info.getValue() as string;
      // Dynamically assign color based on the text
      const colorClass = statusValue === "Processing" ? "red" : "green";
      return <span className={colorClass}>{statusValue}</span>;
    }
  },
  {
    id: "action", // Use 'id' instead of 'accessorKey' for pure UI columns
    header: "Action",
    cell: (info) => {
      // info.row.original gives you access to every piece of data in this specific row
      const orderId = info.row.original._id; 
      
      return (
        <Link href={`/order/${orderId}`} className="manage-btn">
          Manage
        </Link>
      );
    },
  },
];

const Orders = () => {
  
  const [rows] = useState<DataType[]>([
    {
  _id: "dbchsd",
  amount: 20000,
  quantity: 23,
  discount: 5666,
  status: "Processing",
  action: "Manage",
},
  ]);
  const Table = TableHOC<DataType>(
    columns,
    rows, 
    "dashboard-product-box",
    "Orders",
  )();

  return (
    <div className="container">
      <h1>My Orders</h1>
      {Table}
    </div>
  );
};

export default Orders;