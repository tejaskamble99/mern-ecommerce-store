"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useState } from "react";
import TableHOC from "@/components/admin/TableHOC";

// 1. Define Data Type (Keep it clean, no JSX here)
interface DataType {
  user: string;
  amount: number;
  discount: number;
  quantity: number;
  status: string; // Changed from ReactElement to string
  _id: string;    // Changed 'action' to ID for better URL building
}

// 2. The Mock Data (Raw Data only)
const arr: DataType[] = [
  {
    user: "Charas",
    amount: 4500,
    discount: 400,
    quantity: 3,
    status: "Processing",
    _id: "sajknaskd",
  },
  {
    user: "Xavirors",
    amount: 6999,
    discount: 400,
    quantity: 6,
    status: "Shipped",
    _id: "sajknaskd",
  },
  {
    user: "Xavirors",
    amount: 6999,
    discount: 400,
    quantity: 6,
    status: "Delivered",
    _id: "sajknaskd",
  },
];

export default function Transaction() {
  const [rows] = useState<DataType[]>(arr);

  // 3. Define Columns (Logic goes here)
  const columns: ColumnDef<DataType>[] = [
    {
      header: "Avatar",
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
      // Custom Renderer for Colors
      cell: (info) => {
        const status = info.getValue() as string;
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
        <Link href={`/admin/transaction/${info.getValue()}`}>Manage</Link>
      ),
    },
  ];

  // 4. Create Table Component
  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Transactions",
    rows.length > 6
  );

  return (
    <div className="admin-container">
      {/* Sidebar is handled by Layout, just render content */}
      <main className="dashboard-product-box">
        <Table />
      </main>
    </div>
  );
}