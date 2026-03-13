"use client";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CartReducerInitialState } from "@/types/reducer-types";
import { RootState, server } from "@/redux/store"; // FIX #2: from your store
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useNewOrderMutation } from "@/redux/api/orderApi";
import { NewOrderRequest } from "@/types/api-types";
import { responseToast } from "@/utils/features";
import { resetCart } from "@/redux/reducer/cartReducer";


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);
console.log("Stripe key:", process.env.NEXT_PUBLIC_STRIPE_KEY);

const CheckOutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const dispatch = useDispatch();

 
  const { user } = useSelector((state: RootState) => state.userReducer);

  const {
    shippingInfo,
    cartItems,
    subtotal,
    tax,
    discount,
    shippingCharges,
    total,
  } = useSelector((state: RootState) => state.cartReducer);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [newOrder] = useNewOrderMutation();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const orderData: NewOrderRequest = {
      shippingInfo,
      orderItems: cartItems,
      subtotal,
      tax,
      discount,
      shippingCharges,
      total,
      user: user?._id!,
    };

    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin },
      redirect: "if_required",
    });

    if (error) {
      setIsProcessing(false);
      return toast.error(error.message || "Something went wrong");
    }

    
    if (paymentIntent?.status === "succeeded") {
      const res = await newOrder(orderData);
      
      if ("data" in res) dispatch(resetCart());
      responseToast(res, router, "/orders");
    }

    setIsProcessing(false);
  };

  return (
    <div className="checkout-container">
      <form onSubmit={submitHandler}>
        <PaymentElement />
        
        <button type="submit" disabled={isProcessing || !stripe || !elements}>
          {isProcessing ? "Processing..." : "Pay"}
        </button>
      </form>
    </div>
  );
};


const Checkout = () => {
  const [clientSecret, setClientSecret] = useState<string>("");

  const { total } = useSelector(
    (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
  );

 
  useEffect(() => {
    if (!total) return;

    axios
  .post(`${server}/api/v1/payment/create`, { amount: total }, {
    headers: { "Content-Type": "application/json" },
  })
  .then((res) => {
    console.log("Backend response:", res.data);       
    console.log("clientSecret:", res.data.clientSecret); 
    setClientSecret(res.data.clientSecret);
  })
  .catch((err) => {
    console.error("Payment create error:", err);      
    toast.error("Failed to initialize payment.");
  });
  }, [total]);

  return clientSecret ? (
    <Elements options={{ clientSecret }} stripe={stripePromise}>
      <CheckOutForm />
    </Elements>
  ) : (
    <p>Initializing payment...</p>
  );
};

export default Checkout;