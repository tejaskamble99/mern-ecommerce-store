"use client";
import CartItemComponent from "@/components/cart-item";
import Link from "next/link";
import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { CartReducerInitialState } from "@/types/reducer-types";
import { AppDispatch } from "@/redux/store";
import { CartItem } from "@/types/types";
import toast from "react-hot-toast";
import { addToCart } from "@/redux/reducer/cartReducer";




export default function Cart() {
  const { cartItems, subtotal , tax , total , shippingCharges , discount} = useSelector(
    (state: { cartReducer: CartReducerInitialState }) => state.cartReducer,
  );
  const [couponCode, setCouponCode] = useState<string>("");
  const [isvalidcouponCode, setIsValidCouponCode] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    
    dispatch(addToCart(cartItem));
    toast.success("Added to Cart");
  };

  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (Math.random() > 0.5) {
        setIsValidCouponCode(true);
      } else {
        setIsValidCouponCode(false);
      }
    }, 1000);
    return () => {
      clearTimeout(timeOut);
      setIsValidCouponCode(false);
    };
  }, [couponCode]);

  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((cartItem) => (
            <CartItemComponent key={cartItem.productId} cartItem={cartItem} />
          ))
        ) : (
          <h1>Cart is empty</h1>
        )}
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
        {couponCode &&
          (isvalidcouponCode ? (
            <span className="green">
              ₹{discount} off using the <code>{couponCode}</code>
            </span>
          ) : (
            <span className="red">
              Invalid Coupon <VscError />
            </span>
          ))}

        {cartItems.length > 0 && <Link href="/shipping">Checkout</Link>}
      </aside>
    </div>
  );
}
