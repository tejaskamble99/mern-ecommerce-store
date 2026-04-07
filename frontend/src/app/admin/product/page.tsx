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
import Image from "next/image";

// ✅ 1. Added salePrice to your DataType interface
interface DataType {
  photo: string;
  name: string;
  price: number;
  salePrice?: number; 
  stock: number;
  _id: string;
}

const columns: ColumnDef<DataType>[] = [
  {
    header: "Photo",
    accessorKey: "photo",
    cell: (info) => (
      <Image
        src={info.getValue() as string}
        alt="Product"
        width={50}
        height={50}
        style={{ borderRadius: "4px", objectFit: "cover" }}
      />
    ),
  },
  {
    header: "Name",
    accessorKey: "name",
  },
  // ✅ 2. Upgraded Price Column to show Sales!
  {
    header: "Price",
    accessorKey: "price",
    cell: (info) => {
      const price = info.getValue() as number;
      const salePrice = info.row.original.salePrice; // Access the full row data

      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {salePrice && salePrice < price ? (
            <>
              <span style={{ fontWeight: "bold", color: "#111827" }}>
                {salePrice.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                })}
              </span>
              <span style={{ textDecoration: "line-through", color: "#9ca3af", fontSize: "0.85rem" }}>
                {price.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                })}
              </span>
            </>
          ) : (
            <span style={{ fontWeight: "bold", color: "#111827" }}>
              {price.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              })}
            </span>
          )}
        </div>
      );
    },
  },
  {
    header: "Stock",
    accessorKey: "stock",
    cell: (info) => {
      const stock = info.getValue() as number;
      return (
        <span style={{ color: stock < 1 ? "#ef4444" : "inherit", fontWeight: stock < 1 ? "bold" : "normal" }}>
          {stock < 1 ? "Out of Stock" : stock}
        </span>
      );
    }
  },
  {
    header: "Action",
    accessorKey: "_id",
    cell: (info) => (
      <Link href={`/admin/product/${info.getValue()}`} style={{ color: "#3b82f6", fontWeight: "600" }}>
        Manage
      </Link>
    ),
  },
];

export default function Products() {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer,
  );

  const userId = user?._id;

  const { data, isLoading, isError, error } = useAllAdminProductsQuery();

  const rows = useMemo<DataType[]>(
    () =>
      data?.products?.map((i) => ({
        photo: `${server}/${i.photo}`,
        name: i.name,
        price: i.price,
        salePrice: i.salePrice, // ✅ 3. Extract salePrice from the API response
        stock: i.stock,
        _id: i._id,
      })) ?? [],
    [data],
  );

  const Table = useMemo(
    () =>
      TableHOC<DataType>(
        columns,
        rows,
        "dashboard-product-box",
        "Products",
        rows.length > 6,
      ),
    [rows],
  );

  useEffect(() => {
    if (isError) {
      const err = error as CustomError;
      toast.error(err?.data?.message || "Something went wrong");
    }
  }, [isError, error]);

  if (isError) return <h1>Something went wrong</h1>;

  return (
    <>
      <main className="dashboard-product-box">
        {isLoading ? <Skeleton width="100%" length={20} /> : <Table />}
      </main>
      <Link href="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </>
  );
}