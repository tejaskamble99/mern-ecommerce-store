"use client";
import CartItem from "@/components/cart-item";
import Link from "next/link";
import { useEffect, useState } from "react";
import {VscError} from "react-icons/vsc"

const cartItems = [
  {
    productId : "abgsdjd",
    photo: "https://resource.logitech.com/w_692,c_lpad,ar_4:3,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-master-3s/gallery/mx-master-3s-mouse-top-view-graphite.png?v=1",
    name: "Mouse",
    price : 4000, 
    quantity : 2,
    stock: 10,
    }
];
const subtotal = 4000;
const tax = Math.round(subtotal * 0.18);
const shippingCharges = 100;
const discount = 400;
const total = subtotal + tax + shippingCharges;

export default function Cart() {
  const [couponCode, setCouponCode] = useState<string>("");
  const [isvalidcouponCode, setIsValidCouponCode] = useState<boolean>(false);

  useEffect(() =>{
     const timeOut = setTimeout(() =>{
      if(Math.random() > 0.5){
        setIsValidCouponCode(true);
      }else{
        setIsValidCouponCode(false);
      } 
     }, 1000);
    return () =>{
      clearTimeout(timeOut);
      setIsValidCouponCode(false);

    }
  }, [couponCode]);

  return (
    <div className="cart">
      <main>
        {
         cartItems.length > 0 ? cartItems.map((cartItem) => (
          <CartItem key={cartItem.productId} cartItem={cartItem} />
         )) : <h1>Cart is empty</h1>
        }
      </main>
      <aside>
        <p>Subtotal : ₹{subtotal}</p>
        <p>Shipping Charges : ₹{shippingCharges}</p>
        <p>tax : ₹{tax}</p>
        <p>
          Discount: <em className="red"> - ₹{discount}</em>
        </p>
        <p>
          <b> Total : ₹{total} </b>
        </p>

        <input
          type="text"
          placeholder="Promo Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        {couponCode && (isvalidcouponCode ? (
          <span className="green">
            ₹{discount} off using the <code>{couponCode}</code>
          </span>
        ) : (
          <span className="red">Invalid Coupon <VscError /></span>
        ))}

{
  cartItems.length > 0 && <Link href="/shipping">Checkout</Link>
}


      </aside>
    </div>
  );
}
