"use client";

import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "@/redux/store"; // Adjust this import based on your store file

const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const allNumbers = "1234567890";
const allSymbols = "!@#$%^&*()_+";

const Coupon = () => {
  // Generator States
  const [size, setSize] = useState<number>(8);
  const [prefix, setPrefix] = useState<string>("");
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);
  const [includeCharacters, setIncludeCharacters] = useState<boolean>(false);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  
  const [coupon, setCoupon] = useState<string>("");


  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const copyText = async (coupon: string) => {
    await navigator.clipboard.writeText(coupon);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
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
    if (!coupon) return toast.error("Please generate a coupon first");
    if (amount <= 0) return toast.error("Enter a valid discount amount");

    try {
      setIsLoading(true);
      
      const { data } = await axios.post(
        `${server}/api/v1/payment/coupon/new`,
        { coupon, amount },
        {
          withCredentials: true,
        }
      );

      toast.success(data.message || `Coupon ${coupon} created successfully!`);
      setAmount(0); 
      
    } catch (error: unknown) { 
    
     
      if (axios.isAxiosError(error)) {
      
        toast.error(error.response?.data?.message || "Failed to create coupon");
      } else {
      
        toast.error("Failed to create coupon");
      }
      
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
              <span style={{ cursor: "pointer", color: "blue" }} onClick={() => copyText(coupon)}>
                {isCopied ? "Copied!" : "Copy"}
              </span>
            </code>

            <form onSubmit={saveCouponHandler} style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
              <input
                type="number"
                placeholder="Discount Amount (₹)"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
                style={{ padding: "0.5rem" }}
              />
              <button type="submit" disabled={isLoading} style={{ padding: "0.5rem 1rem", background: "black", color: "white" }}>
                {isLoading ? "Saving..." : "Save to Database"}
              </button>
            </form>
          </div>
        )}
      </section>
    </main>
  );
};

export default Coupon;