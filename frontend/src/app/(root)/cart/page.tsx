"use client";
import CartItemComponent from "@/components/cart-item";
import {
  decrementQuantity,
  discountApplied,
  incrementQuantity,
  removeCartItem,
  saveCoupon,
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
      dispatch(discountApplied(0));
      dispatch(saveCoupon(undefined));
      return;
    }

    const { token, cancel } = axios.CancelToken.source();

    const timeOut = setTimeout(() => {
      axios
        .get(`${server}/api/v1/payment/discount?coupon=${couponCode}`, {
          cancelToken: token,
        })
        .then((res) => {
          setIsValidCouponCode(true);
          dispatch(discountApplied(res.data.discount));
          dispatch(saveCoupon(couponCode));
        })
        .catch((err) => {
          if (axios.isCancel(err)) return;

          setIsValidCouponCode(false);
          dispatch(discountApplied(0));
          dispatch(saveCoupon(undefined));
        });
    }, 800);

    return () => {
      clearTimeout(timeOut);
      cancel();
    };
  }, [couponCode, cartItems.length, dispatch]);

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
          <h1>Cart is empty</h1>
        )}
      </main>

      <aside>
        <p>Subtotal : ₹{subtotal.toLocaleString("en-IN")}</p>
        <p>Shipping Charges : ₹{shippingCharges.toLocaleString("en-IN")}</p>
        {/* FIX #3: Math.round prevents float display e.g. ₹180.000000002 */}
        <p>Tax : ₹{Math.round(tax).toLocaleString("en-IN")}</p>
        <p>
          Discount:{" "}
          <em className="red"> - ₹{discount.toLocaleString("en-IN")}</em>
        </p>
        <p>
          <b>Total : ₹{total.toLocaleString("en-IN")}</b>
        </p>

        <input
          id="coupon-code"
          name="couponCode"
          type="text"
          placeholder="Enter Promo Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
        />

        {couponCode &&
          (isValidCouponCode ? (
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
