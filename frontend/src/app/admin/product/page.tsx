"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FaPlus } from "react-icons/fa";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import TableHOC from "@/components/admin/TableHOC";
import { useAllAdminProductsQuery } from "@/redux/api/productApi";
import { server } from "@/redux/store";
import { CustomError } from "@/types/api-types";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "@/types/reducer-types";
import { Skeleton } from "@/components/admin/Loader";

interface DataType {
  photo: string;
  name: string;
  price: number;
  stock: number;
  _id: string;
}

const columns: ColumnDef<DataType>[] = [
  {
    header: "Photo",
    accessorKey: "photo",
    cell: (info) => <img src={info.getValue() as string} alt="Product" />,
  },
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Price",
    accessorKey: "price",
    cell: (info) =>
      (info.getValue() as number).toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }),
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

export default function Products() {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );

  const { data, isLoading, isError, error } = useAllAdminProductsQuery(user?._id!);

  
  const rows = useMemo<DataType[]>(
  () =>
    data?.products?.map((i) => ({   
      photo: `${server}/${i.photo}`,
      name: i.name,
      price: i.price,
      stock: i.stock,
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
        "Products",
        rows.length > 6
      ),
    [rows]
  );

  // FIX 1: useEffect above early returns — hooks must never be conditional
  useEffect(() => {
    if (isError) {
      const err = error as CustomError;
      toast.error(err.data.message);
    }
  }, [isError, error]);

  // Early returns come AFTER all hooks
  if (isError) return <h1>Something went wrong</h1>;

  return (
    <>
      <main className="dashboard-product-box">
       {isLoading ? <Skeleton width = "100%" length = {20}/> : <Table />} 
      </main>
      <Link href="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </>
  );
}