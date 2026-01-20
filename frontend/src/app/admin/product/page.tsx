"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FaPlus } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";
import TableHOC from "@/components/admin/TableHOC";

// 1. Define Data Type (Raw strings/numbers only, NO JSX)
interface DataType {
  photo: string; // Just the URL
  name: string;
  price: number;
  stock: number;
  _id: string;   // ID used for the action link
}

// 2. Mock Data (Clean Data)
const img1 = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8&w=1000&q=804";
const img2 = "https://m.media-amazon.com/images/I/514T0SvwkHL._SL1500_.jpg";

const arr: DataType[] = [
  {
    photo: img1,
    name: "Puma Shoes Air Jordan Cook 2023",
    price: 690,
    stock: 3,
    _id: "sajknaskd",
  },
  {
    photo: img2,
    name: "Macbook",
    price: 232223,
    stock: 213,
    _id: "sdaskdnkasjdn",
  },
];

export default function Products() {
  const [rows] = useState<DataType[]>(arr);

  // 3. Define Columns (Logic for Images and Links goes here)
  const columns: ColumnDef<DataType>[] = [
    {
      header: "Photo",
      accessorKey: "photo",
      cell: (info) => (
        <img src={info.getValue() as string} alt="Product" />
      ),
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: (info) => `₹${info.getValue()}`, // Add currency symbol
    },
    {
      header: "Stock",
      accessorKey: "stock",
    },
    {
      header: "Action",
      accessorKey: "_id",
      cell: (info) => (
        <Link href={`/admin/product/${info.getValue()}`}>Manage</Link>
      ),
    },
  ];

  // 4. Create the Table
  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Products",
    rows.length > 6
  );

  return (
    <>
      <main className="dashboard-product-box">
        <Table />
      </main>
      <Link href="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </>
  );
}