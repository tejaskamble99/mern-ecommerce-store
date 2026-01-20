"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import TableHOC from "@/components/admin/TableHOC";

// 1. Clean Data Type (No JSX, just strings)
interface DataType {
  avatar: string; // URL string only
  name: string;
  email: string;
  gender: string;
  role: string;
  action: string; // We can use the ID or role here if needed
}

// 2. Mock Data
const img1 = "https://randomuser.me/api/portraits/women/54.jpg";
const img2 = "https://randomuser.me/api/portraits/women/50.jpg";

const arr: DataType[] = [
  {
    avatar: img1,
    name: "Emily Palmer",
    email: "emily.palmer@example.com",
    gender: "female",
    role: "user",
    action: "delete",
  },
  {
    avatar: img2,
    name: "May Scoot",
    email: "aunt.may@example.com",
    gender: "female",
    role: "user",
    action: "delete",
  },
];

export default function Customers() {
  const [rows] = useState<DataType[]>(arr);

  // 3. Define Columns (Render images and buttons here)
  const columns: ColumnDef<DataType>[] = [
    {
      header: "Avatar",
      accessorKey: "avatar",
      cell: (info) => (
        <img
          style={{
            borderRadius: "50%",
            width: "40px",
            height: "40px",
          }}
          src={info.getValue() as string}
          alt="User Avatar"
        />
      ),
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Gender",
      accessorKey: "gender",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Role",
      accessorKey: "role",
    },
    {
      header: "Action",
      accessorKey: "action",
      cell: () => (
        <button onClick={() => console.log("Delete user")}>
          <FaTrash />
        </button>
      ),
    },
  ];

  // 4. Initialize Table
  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Customers",
    rows.length > 6
  );

  return (
    <div className="admin-container">
      <main>
        <Table />
      </main>
    </div>
  );
}