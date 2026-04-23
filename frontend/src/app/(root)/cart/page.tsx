"use client";
import CartItemComponent from "@/components/cart-item";
import {
  decrementQuantity,
  incrementQuantity,
  removeCartItem,
  applyCoupon, 
} from "@/redux/reducer/cartReducer";
import { AppDispatch, server } from "@/redux/store";
import { CartReducerInitialState } from "@/types/reducer-types";
import { CartItem } from "@/types/types";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";

export default function Cart() {
  const { cartItems, subtotal, tax, total, shippingCharges, discount } =
    useSelector(
      (state: { cartReducer: CartReducerInitialState }) => state.cartReducer,
    );

  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();

 
  const couponChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    setCouponCode(val);

    if (val.length < 3) {
      dispatch(applyCoupon(undefined));
      setIsValidCouponCode(false);
    }
  };

  const incrementHandler = (cartItem: CartItem) => {
    dispatch(incrementQuantity(cartItem.productId));
  };

  const decrementHandler = (cartItem: CartItem) => {
    dispatch(decrementQuantity(cartItem.productId));
  };

  const removeHandler = (productId: string) => {
    dispatch(removeCartItem(productId));
    toast.success("Product removed successfully");
  };

  useEffect(() => {
    if (!couponCode || couponCode.length < 3 || cartItems.length === 0) {
      return; // Safe bailout
    }

    const { token, cancel } = axios.CancelToken.source();

    const timeOut = setTimeout(() => {
      axios
        .get(`${server}/api/v1/payment/discount?coupon=${couponCode}`, {
          cancelToken: token,
        })
        .then((res) => {
          setIsValidCouponCode(true);
          dispatch(applyCoupon(res.data.coupon)); 
        })
        .catch((err) => {
          if (axios.isCancel(err)) return;

          setIsValidCouponCode(false);
          dispatch(applyCoupon(undefined));
        });
    }, 800);

    return () => {
      clearTimeout(timeOut);
      cancel();
    };
  }, [couponCode, cartItems, dispatch]);

  return (
<div className="cart">
  <main>
    {cartItems.length > 0 ? (
      cartItems.map((i) => (
        <CartItemComponent
          key={i.productId}
          cartItem={i}
          incrementHandler={incrementHandler}
          decrementHandler={decrementHandler}
          removeHandler={removeHandler}
        />
      ))
    ) : (
      <div className="empty-cart">
        <h1> Your cart is empty</h1>
        <Link href="/">Start Shopping</Link>
      </div>
    )}
  </main>

  {cartItems.length > 0 && (
    <aside>
      <h3>Price Details</h3>

      <p><span>Subtotal</span><span>₹{subtotal}</span></p>
      <p><span>Shipping</span><span>₹{shippingCharges}</span></p>
      <p><span>Tax</span><span>₹{Math.round(tax)}</span></p>
      <p><span>Discount</span><span>-₹{discount}</span></p>

      <hr />

      <p className="total">
        <strong>Total</strong>
        <strong>₹{total}</strong>
      </p>

      <input
        type="text"
        placeholder="Apply Coupon"
        value={couponCode}
        onChange={couponChangeHandler}
      />

      {couponCode &&
        (isValidCouponCode ? (
          <span className="green">
            ₹{discount} off using <code>{couponCode}</code>
          </span>
        ) : (
          <span className="red">
            Invalid Coupon <VscError />
          </span>
        ))}

      <Link href="/shipping">Proceed to Checkout</Link>
    </aside>
  )}
</div>
  );
}