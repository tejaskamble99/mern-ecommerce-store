"use client";

import { ChangeEvent, useState } from "react";
import { useNewProductsMutation } from "@/redux/api/productApi";
import { responseToast } from "@/utils/features";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";

const NewProduct = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(1000);
  const [salePrice, setSalePrice] = useState(0);
  const [stock, setStock] = useState(1);
  const [description, setDescription] = useState("");

  const [photoPrev, setPhotoPrev] = useState("");
  const [photo, setPhoto] = useState<File>();

  const [newProduct] = useNewProductsMutation();
  const router = useRouter();

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setPhotoPrev(reader.result);
        setPhoto(file);
      }
    };
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !price || !stock || !category || !description || !photo) {
      return toast.error("Please fill all fields including photo");
    }

    if (salePrice >= price) {
      return toast.error("Sale price must be less than price");
    }

    const formData = new FormData();

    formData.set("name", name);
    formData.set("price", String(price));
    formData.set("salePrice", String(salePrice));
    formData.set("stock", String(stock));
    formData.set("category", category);
    formData.set("description", description);
    formData.set("photo", photo);

    const res = await newProduct(formData);

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
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
            />
          </div>

          <div>
            <label>Sale Price</label>
            <input
              type="number"
              value={salePrice}
              onChange={(e) => setSalePrice(Number(e.target.value))}
            />
          </div>

          <div>
            <label>Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              required
            />
          </div>

          <div>
            <label>Category</label>
            <input
              type="text"
              placeholder="eg. laptop, camera etc"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Description</label>
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Photo</label>
            <input type="file" onChange={changeImageHandler} required />
          </div>

          {photoPrev && (
            <Image src={photoPrev} alt="Preview" width={150} height={150} />
          )}

          <button type="submit">Create Product</button>
        </form>
      </article>
    </main>
  );
};

export default NewProduct;