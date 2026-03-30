"use client"; // <--- 1. Mandatory for useState

import { ChangeEvent, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useNewProductsMutation } from "@/redux/api/productApi";
import { responseToast } from "@/utils/features";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";

const NewProduct = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<number>(1000);
  const [stock, setStock] = useState<number>(1);
  const [description, setDescription] = useState<string>("");
  const [photoPrev, setPhotoPrev] = useState<string>("");
  const [photo, setPhoto] = useState<File>();

  const [newProduct] = useNewProductsMutation();
  const router = useRouter();
  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotoPrev(reader.result);
          setPhoto(file);
        }
      };
    }
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !price || !stock || !category || !description || !photo)
      return toast.error("Please fill all fields including photo");

    const formData = new FormData();

    formData.set("name", name);
    formData.set("price", String(price));
    formData.set("stock", String(stock));
    formData.set("category", category);
    formData.set("description", description);
    formData.set("photo", photo);

    const userId = user?._id;

    const res = await newProduct({
      id: userId ?? "",
      formData,
    });

    responseToast(res, router, "/admin/product");
  };
  return (
    <main className="product-management">
      <article>
        <form onSubmit={submitHandler}>
          <h2>New Product</h2>
          <div>
            <label>Name</label>
            <input
              required
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label>Price</label>
            <input
              required
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>
          <div>
            <label>Stock</label>
            <input
              required
              type="number"
              placeholder="Stock"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
            />
          </div>

          <div>
            <label>Category</label>
            <input
              required
              type="text"
              placeholder="eg. laptop, camera etc"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div>
            <label>Description</label>
            <input
              required
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label>Photo</label>
            <input required type="file" onChange={changeImageHandler} />
          </div>

          {photoPrev && (
            <Image src={photoPrev} alt="New Image" width={150} height={150} />
          )}

          <button type="submit">Create</button>
        </form>
      </article>
    </main>
  );
};

export default NewProduct;
