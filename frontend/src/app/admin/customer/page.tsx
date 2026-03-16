"use client";
import { useAllUsersQuery, useDeleteUserMutation } from "@/redux/api/userApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import toast from "react-hot-toast";
import { useEffect, useMemo } from "react";
import { CustomError } from "@/types/api-types";
import { ColumnDef } from "@tanstack/react-table";
import { FaTrash } from "react-icons/fa";
import TableHOC from "@/components/admin/TableHOC";



interface DataType {
  avatar: string; 
  name: string;
  email: string;
  gender: string;
  role: string;
  action: string; 
}

export default function Customers() {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const { data, isLoading, isError, error } = useAllUsersQuery(user?._id!, {
    skip: !user?._id,
  });

  useEffect(() => {
    if (isError) {
      const err = error as CustomError;
      toast.error(err.data.message);
    }
  }, [isError, error]);

  const [deleteUser] = useDeleteUserMutation();

  const deleteHandler = async (userId: string) => {
    const confirmed = window.confirm("Delete this user?");
    if (!confirmed) return;
    try {
      await deleteUser({ userId, adminUserId: user?._id! }).unwrap();
      toast.success("User deleted");
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const rows = useMemo<DataType[]>(
  () =>
    data?.users?.map((u) => {
      const avatar = u.photo?.startsWith("http")
        ? u.photo
        : `${process.env.NEXT_PUBLIC_SERVER_URL}/${u.photo}`;
      return {
        avatar,
        name: u.name,
        email: u.email,
        gender: u.gender,
        role: u.role,
        action: u._id,
      };
    }) ?? [],
  [data]
);


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
      cell: (info) => (
        <button onClick={() => deleteHandler(info.getValue() as string)}>
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
    rows.length > 6,
  );

  if (isLoading) return <p>Loading...</p>;

  return (
    <main>
      <Table />
    </main>
  );
}
