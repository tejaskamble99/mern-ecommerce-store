"use client";

import { FormEvent, useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "@/redux/store";
import { auth } from "@/firebase";
import { CouponType } from "@/types/types";

const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const allNumbers = "1234567890";
const allSymbols = "!@#$%^&*()_+";

const Coupon = () => {
  const [size, setSize] = useState<number>(8);
  const [prefix, setPrefix] = useState<string>("");
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);
  const [includeCharacters, setIncludeCharacters] = useState<boolean>(false);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const [coupon, setCoupon] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [coupons, setCoupons] = useState<CouponType[]>([]);

  const [discountType, setDiscountType] = useState<"flat" | "percent">("flat");
  const [targetProductId, setTargetProductId] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingCoupon, setEditingCoupon] = useState<any>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEdit = (c: any) => {
    setEditingCoupon(c);
    setCoupon(c.coupon);
    setAmount(c.amount);
  };

  const handleDelete = async (id: string) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      await axios.delete(`${server}/api/v1/payment/coupon/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted");
      setCoupons((prev) => prev.filter((c) => c._id !== id));
    } catch {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${server}/api/v1/product/all`);
        setProducts(data.products);
      } catch {
        console.error("Failed to fetch products");
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const { data } = await axios.get(`${server}/api/v1/payment/coupon/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCoupons(data.coupons);
      } catch {
        toast.error("Failed to load coupons");
      }
    };
    fetchCoupons();
  }, []);

  const copyText = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const generateHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!includeNumbers && !includeCharacters && !includeSymbols)
      return toast.error("Please Select One At Least");

    let result: string = prefix || "";
    const loopLength: number = size - result.length;

    for (let i = 0; i < loopLength; i++) {
      let entireString: string = "";
      if (includeCharacters) entireString += allLetters;
      if (includeNumbers) entireString += allNumbers;
      if (includeSymbols) entireString += allSymbols;

      const randomNum = Math.floor(Math.random() * entireString.length);
      result += entireString[randomNum];
    }

    setCoupon(result);
  };

  const saveCouponHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const token = await auth.currentUser?.getIdToken();

      if (!token) {
        toast.error("Login required");
        return;
      }

      if (editingCoupon) {
        const { data } = await axios.put(
          `${server}/api/v1/payment/coupon/${editingCoupon._id}`,
          { coupon, amount, type: discountType, productId: targetProductId || null },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(data.message || "Coupon Updated");
        setCoupons((prev) =>
          prev.map((c) =>
            c._id === editingCoupon._id
              ? { ...c, coupon, amount, type: discountType }
              : c
          )
        );
        setEditingCoupon(null);
      } else {
        const { data } = await axios.post(
          `${server}/api/v1/payment/coupon/new`,
          { coupon, amount, type: discountType, productId: targetProductId || null },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(data.message || "Coupon Created");
      }

      setCoupon("");
      setAmount(0);
      setTargetProductId("");
    } catch {
      toast.error("Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="dashboard-app-container">
      <h1>Coupon Management</h1>
      <section>
        <form className="coupon-form" onSubmit={generateHandler}>
          <input
            type="text"
            placeholder="Text to include (e.g. SUMMER)"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            maxLength={size}
          />
          <input
            type="number"
            placeholder="Coupon Length"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            min={8}
            max={25}
          />
          <fieldset>
            <legend>Include</legend>
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={() => setIncludeNumbers((prev) => !prev)}
            />
            <span>Numbers</span>
            <input
              type="checkbox"
              checked={includeCharacters}
              onChange={() => setIncludeCharacters((prev) => !prev)}
            />
            <span>Characters</span>
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={() => setIncludeSymbols((prev) => !prev)}
            />
            <span>Symbols</span>
          </fieldset>
          <button type="submit">Generate Code</button>
        </form>

        {coupon && (
          <div style={{ marginTop: "2rem", padding: "1rem", borderTop: "1px solid #ddd" }}>
            <code>
              {coupon}{" "}
              <span
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => copyText(coupon)}
              >
                {isCopied ? "Copied!" : "Copy"}
              </span>
            </code>

            <form
              onSubmit={saveCouponHandler}
              style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as "flat" | "percent")}
                  style={{ padding: "0.5rem", flex: 1 }}
                >
                  <option value="flat">Flat Amount (₹)</option>
                  <option value="percent">Percentage (%)</option>
                </select>
                <input
                  type="number"
                  placeholder={discountType === "flat" ? "Discount Amount (₹)" : "Discount Percent (%)"}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  required
                  style={{ padding: "0.5rem", flex: 2 }}
                />
              </div>
              <select
                value={targetProductId}
                onChange={(e) => setTargetProductId(e.target.value)}
                style={{ padding: "0.5rem", width: "100%" }}
              >
                <option value="">Apply to Entire Cart</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    Apply to: {p.name}
                  </option>
                ))}
              </select>
              <button type="submit">
                {isLoading ? "Saving..." : editingCoupon ? "Update Coupon" : "Save Coupon"}
              </button>
            </form>
          </div>
        )}

        <section>
          <h2>All Coupons</h2>
          {coupons.map((c) => (
            <div key={c._id} className="coupon-row">
              <div>
                <strong>{c.coupon}</strong> —{" "}
                {c.type === "percent" ? `${c.amount}%` : `₹${c.amount}`}
              </div>
              <div>
                <button onClick={() => handleEdit(c)}>Edit</button>
                <button onClick={() => handleDelete(c._id)}>Delete</button>
              </div>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
};

export default Coupon;