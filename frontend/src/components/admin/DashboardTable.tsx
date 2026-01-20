"use client";

import { ColumnDef } from "@tanstack/react-table";
import TableHOC from "./TableHOC";

interface DataType {
  _id: string;
  quantity: number;
  discount: number;
  amount: number;
  status: string;
}

const columns: ColumnDef<DataType>[] = [
  { header: "Id", accessorKey: "_id" },
  { header: "Quantity", accessorKey: "quantity" },
  { header: "Discount", accessorKey: "discount" },
  { header: "Amount", accessorKey: "amount" },
  { header: "Status", accessorKey: "status" },
];

const DashboardTable = ({ data = [] }: { data: DataType[] }) => {
  // 1. Call the function to CREATE the component
  const Table = TableHOC<DataType>(
    columns,
    data,
    "transaction-box",
    "Top Transaction"
  );

  // 2. Render the RESULT as a Component
  return <Table />;
};

export default DashboardTable;