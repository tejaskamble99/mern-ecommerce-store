"use client";
import { Skeleton } from "@/components/admin/Loader";
import TableHOC from "@/components/admin/TableHOC";
import { useMyOrderQuery } from "@/redux/api/orderApi";
import { CustomError } from "@/types/api-types";
import { UserReducerInitialState } from "@/types/reducer-types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

type DataType = {
  _id: string;
  amount: number;
  quantity: number;
  discount: number;
  status: string;
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

      const colorClass =
        statusValue === "Delivered"
          ? "purple"
          : statusValue === "Shipped"
            ? "green"
            : "red";
      return <span className={colorClass}>{statusValue}</span>;
    },
  },
  {
    id: "action",
    header: "Action",
    cell: (info) => {
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
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer,
  );

  const { data, isLoading, isError, error } = useMyOrderQuery(user?._id!, {
    skip: !user?._id,
  });

  useEffect(() => {
    if (isError) {
      const err = error as CustomError;
      toast.error(err.data.message);
    }
  }, [isError, error]);

  const rows = useMemo<DataType[]>(
    () =>
      data?.orders?.map((i) => ({
        _id: i._id,
        amount: i.total,
        quantity: i.orderItems.length,
        discount: i.discount,
        status: i.status,
      })) ?? [],
    [data],
  );

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Orders",
  );

  if (isLoading) return <p>Loading orders...</p>;
  return (
    <div className="container">
      <h1>My Orders</h1>
      {isLoading ? <Skeleton width="100%" length={20} /> : <Table />}
    </div>
  );
};

export default Orders;
