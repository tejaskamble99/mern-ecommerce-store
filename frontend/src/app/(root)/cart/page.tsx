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
          <h1>Cart is empty</h1>
        )}
      </main>

      {cartItems.length > 0 && (
        <aside>
         
          <p>Subtotal : ₹{(subtotal || 0).toLocaleString("en-IN")}</p>
          <p>Shipping Charges : ₹{(shippingCharges || 0).toLocaleString("en-IN")}</p>
          <p>Tax : ₹{Math.round(tax || 0).toLocaleString("en-IN")}</p>
          <p>
            Discount: <em className="red"> - ₹{(discount || 0).toLocaleString("en-IN")}</em>
          </p>
          <p>
            <b>Total : ₹{(total || 0).toLocaleString("en-IN")}</b>
          </p>

          <input
            id="coupon-code"
            name="couponCode"
            type="text"
            placeholder="Enter Promo Code"
            value={couponCode}
            onChange={couponChangeHandler}
          />

          {couponCode &&
            (isValidCouponCode ? (
              <span className="green">
                ₹{discount || 0} off using the <code>{couponCode}</code>
              </span>
            ) : (
              <span className="red">
                Invalid Coupon <VscError />
              </span>
            ))}

          <Link href="/shipping">Checkout</Link>
        </aside>
      )}
    </div>
  );
}