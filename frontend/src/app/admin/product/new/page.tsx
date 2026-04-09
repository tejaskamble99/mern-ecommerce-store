"use client";

import { ChangeEvent, useState } from "react";
import { useNewProductsMutation } from "@/redux/api/productApi";
import { responseToast } from "@/utils/features";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import RichTextEditor from "@/components/layout/RichTextEditor";

const NewProduct = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(1000);
  const [salePrice, setSalePrice] = useState<number | "">("");
  const [stock, setStock] = useState(1);
  const [description, setDescription] = useState("");

  /* ---------- SEO STATES ---------- */
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [keywords, setKeywords] = useState("");

  const [photosPrev, setPhotosPrev] = useState<string[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);

  const [newProduct] = useNewProductsMutation();
  const router = useRouter();

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setPhotos((prev) => [...prev, ...files]);

    const promises = files.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = () => {
          if (typeof reader.result === "string") resolve(reader.result);
        };
      });
    });

    Promise.all(promises).then((base64Strings) =>
      setPhotosPrev((prev) => [...prev, ...base64Strings]),
    );
  };

  const removeImage = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotosPrev((prev) => prev.filter((_, i) => i !== index));
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !name ||
      !price ||
      !stock ||
      !category ||
      !description ||
      photos.length === 0
    ) {
      return toast.error("Please fill all fields including photos");
    }

    if (salePrice !== "" && Number(salePrice) >= price) {
      return toast.error("Sale price must be less than the original price");
    }

    const formData = new FormData();
    formData.set("name", name);
    formData.set("price", String(price));
    if (salePrice !== "") formData.set("salePrice", String(salePrice));
    formData.set("stock", String(stock));
    formData.set("category", category);
    formData.set("description", description);
    
    // ✅ Append SEO Data
    formData.set("metaTitle", metaTitle);
    formData.set("metaDescription", metaDescription);
    formData.set("slug", slug);
    formData.set("keywords", keywords);

    photos.forEach((file) => {
      formData.append("photos", file);
    });

    const res = await newProduct(formData);
    responseToast(res, router, "/admin/product");
  };

  return (
    <main className="new-product-management">
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
            <label>Description</label>
            <RichTextEditor 
          value={description} 
          onChange={(value) => setDescription(value)} 
         
          
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
            <label>Sale Price (Optional)</label>
            <input
              type="number"
              placeholder="Leave blank for no sale"
              value={salePrice}
              onChange={(e) =>
                setSalePrice(e.target.value ? Number(e.target.value) : "")
              }
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

          {/* ---------- SEO SETTINGS ---------- */}
          <h2>SEO Settings</h2>

          <div>
            <label>Custom Slug (URL)</label>
            <input
              type="text"
              placeholder="Leave blank to auto-generate"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>

          <div>
            <label>Meta Title</label>
            <input
              type="text"
              placeholder="Max 60 chars"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
            />
          </div>

          <div>
            <label>Meta Description</label>
            <textarea
              placeholder="Max 160 chars"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
            />
          </div>

          <div>
            <label>Keywords</label>
            <input
              type="text"
              placeholder="Comma separated (e.g. laptop, gaming, rgb)"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>

          {/* ---------- IMAGES ---------- */}
          <h2>Images</h2>

          <div>
            <label>Photos (Select Multiple)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={changeImageHandler}
              required
            />
            
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginTop: "1rem",
              }}
            >
              {photosPrev.map((src, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <Image
                    src={src}
                    alt={`Preview ${index}`}
                    width={80}
                    height={80}
                    style={{ 
                      borderRadius: "8px", 
                      objectFit: "cover",
                      border: index === 0 ? "2px solid #006888" : "1px solid #ddd"
                    }}
                  />
                  {index === 0 && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        background: "#006888",
                        color: "#fff",
                        fontSize: "9px",
                        padding: "2px 4px",
                        borderRadius: "0 4px 0 8px",
                      }}
                    >
                      Cover
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    style={{
                      position: "absolute",
                      top: "-6px",
                      right: "-6px",
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      cursor: "pointer",
                      fontSize: "10px",
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button type="submit">Create Product</button>
        </form>
      </article>
    </main>
  );
};

export default NewProduct;