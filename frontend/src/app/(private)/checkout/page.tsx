"use client";

import { useNewOrderMutation } from "@/redux/api/orderApi";
import { resetCart } from "@/redux/reducer/cartReducer";

import { RootState, server } from "@/redux/store";

import { NewOrderRequest } from "@/types/api-types";

import { CartReducerInitialState } from "@/types/reducer-types";

import { responseToast } from "@/utils/features";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import { loadStripe, type StripeError } from "@stripe/stripe-js";

import axios from "axios";

import { FormEvent, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import toast from "react-hot-toast";

import { useRouter } from "next/navigation";

import { auth } from "@/firebase";
import { RazorpayOptions, RazorpayResponse } from "@/types/types";

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_KEY?.trim() ?? "";

const stripePromise = stripePublishableKey
  ? loadStripe(stripePublishableKey)
  : null;

type PaymentIntentResponse = { clientSecret?: string };

type PaymentElementLoadErrorEvent = {
  elementType: "payment";
  error: StripeError;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error))
    return error.response?.data?.message || error.message || fallback;

  if (error instanceof Error && error.message) return error.message;

  return fallback;
};

const CheckOutForm = () => {
  const stripe = useStripe();

  const elements = useElements();

  const router = useRouter();

  const dispatch = useDispatch();

  const {
    shippingInfo,
    cartItems,
    subtotal,
    tax,
    discount,
    shippingCharges,
    total,
  } = useSelector((state: RootState) => state.cartReducer);

  const [isProcessing, setIsProcessing] = useState(false);

  const [isPaymentElementReady, setIsPaymentElementReady] = useState(false);

  const [paymentElementError, setPaymentElementError] = useState<string | null>(
    null,
  );

  const [newOrder] = useNewOrderMutation();

  const paymentLoadErrorHandler = ({ error }: PaymentElementLoadErrorEvent) => {
    const message =
      error.message ||
      "Unable to load payment form. Check Stripe keys and try again.";

    setIsPaymentElementReady(false);

    setPaymentElementError(message);

    toast.error(message);
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (paymentElementError) return toast.error(paymentElementError);
    if (!stripe || !elements || !isPaymentElementReady) return;

    setIsProcessing(true);

    const orderData: NewOrderRequest = {
      shippingInfo,
      orderItems: cartItems,
      subtotal,
      tax,
      discount,
      shippingCharges,
      total,
      paymentMethod: "Stripe",
    };

    try {
      const { paymentIntent, error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
        redirect: "if_required",
      });

      if (error) {
        setIsProcessing(false);
        return toast.error(
          error.message || "Something went wrong with the payment.",
        );
      }

      if (paymentIntent?.status !== "succeeded") {
        setIsProcessing(false);
        return toast.error("Payment failed. Please try again.");
      }

      orderData.paymentInfo = {
        gateway: "Stripe",
        paymentId: paymentIntent.id,
        gatewayOrderId: paymentIntent.id,
        status: paymentIntent.status,
      };

      // 5. Create Order in Backend with Payment Info
      const res = await newOrder(orderData);

      if ("data" in res) {
        dispatch(resetCart());
        responseToast(res, router, "/dashboard/orders");
      } else {
  const err = res.error as FetchBaseQueryError;

  const message =
    "data" in err
      ? (err.data as { message?: string })?.message
      : "Order failed";

  toast.error(message || "Order failed");

      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Payment failed"));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={submitHandler} className="checkout-card">
      <PaymentElement
        onLoadError={paymentLoadErrorHandler}
        onReady={() => setIsPaymentElementReady(true)}
      />

      {paymentElementError && <p>{paymentElementError}</p>}

      <button
        type="submit"
        disabled={
          isProcessing ||
          !stripe ||
          !elements ||
          !isPaymentElementReady ||
          !!paymentElementError
        }
        className="submit-btn"
      >
        {isProcessing
          ? "Processing..."
          : `Pay ₹${total.toLocaleString("en-IN")}`}
      </button>
    </form>
  );
};

const RazorpayForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [newOrder] = useNewOrderMutation();
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    shippingInfo,
    cartItems,
    subtotal,
    tax,
    discount,
    shippingCharges,
    total,
  } = useSelector((state: RootState) => state.cartReducer);

  const razorpayHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const { data } = await axios.post(
        `${server}/api/v1/payment/razorpay/order`,
        { amount: total },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        name: "BARWA",
        description: "Electronics Purchase",
        order_id: data.order.id,
        handler: async (response: RazorpayResponse) => {
          try {
            const verifyRes = await axios.post(
              `${server}/api/v1/payment/razorpay/verify`,
              response,
              { headers: { Authorization: `Bearer ${token}` } },
            );
            if (verifyRes.data.success) {
              const res = await newOrder({
                shippingInfo,
                orderItems: cartItems,
                subtotal,
                tax,
                discount,
                shippingCharges,
                total,
                paymentMethod: "Razorpay",
                paymentInfo: {
                  gateway: "Razorpay",
                  paymentId: response.razorpay_payment_id,
                  gatewayOrderId: response.razorpay_order_id,
                  status: "paid",
                },
              });
              if ("data" in res) dispatch(resetCart());
              responseToast(res, router, "/dashboard/orders");
            }
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        theme: { color: "#000000" },
        modal: { ondismiss: () => setIsProcessing(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Failed to initialize Razorpay");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={razorpayHandler} className="checkout-card">
      <h3>Razorpay Payment</h3>
      <p>Pay ₹{total.toLocaleString("en-IN")} via UPI, GPay, or Net Banking.</p>
      <button type="submit" disabled={isProcessing} className="submit-btn">
        {isProcessing ? "Opening Secure Gateway..." : "Pay with Razorpay"}
      </button>
    </form>
  );
};

const CODForm = () => {
  const router = useRouter();

  const dispatch = useDispatch();

  const [newOrder] = useNewOrderMutation();

  const [isProcessing, setIsProcessing] = useState(false);

  const {
    shippingInfo,
    cartItems,
    subtotal,
    tax,
    discount,
    shippingCharges,
    total,
  } = useSelector((state: RootState) => state.cartReducer);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsProcessing(true);

    const orderData: NewOrderRequest = {
      shippingInfo,

      orderItems: cartItems,

      subtotal,

      tax,

      discount,

      shippingCharges,

      total,

      paymentMethod: "COD",
    };

    try {
      const res = await newOrder(orderData);

      if ("data" in res) dispatch(resetCart());

      responseToast(res, router, "/dashboard/orders");
    } catch (error) {
      toast.error("Failed to place COD order");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={submitHandler} className="checkout-card">
      <h3>Cash on Delivery</h3>

      <p>
        Pay <strong>₹{total.toLocaleString("en-IN")}</strong> in cash when your
        order arrives at your door.
      </p>

      <button type="submit" className="submit-btn" disabled={isProcessing}>
        {isProcessing ? "Placing Order..." : "Confirm COD Order"}
      </button>
    </form>
  );
};

const Checkout = () => {
  const [clientSecret, setClientSecret] = useState("");

  const [initializationError, setInitializationError] = useState<string | null>(
    null,
  );

  const [paymentMethod, setPaymentMethod] = useState<
    "Stripe" | "COD" | "Razorpay"
  >("COD");

  const { total } = useSelector(
    (state: { cartReducer: CartReducerInitialState }) => state.cartReducer,
  );

  useEffect(() => {
    if (!stripePromise) return setInitializationError("Stripe key missing.");

    if (!server) return setInitializationError("Server URL missing.");

    if (total <= 0)
      return setInitializationError("Cart total must be greater than 0.");

    let isActive = true;

    const createPaymentIntent = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();

        const { data } = await axios.post<PaymentIntentResponse>(
          `${server}/api/v1/payment/create`,

          { amount: total },

          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!data.clientSecret)
          throw new Error("Stripe did not return client secret.");

        if (isActive) setClientSecret(data.clientSecret);
      } catch (error) {
        if (isActive) {
          const msg = getErrorMessage(error, "Failed to initialize payment.");

          setInitializationError(msg);

          toast.error(msg);
        }
      }
    };

    if (paymentMethod === "Stripe" && !clientSecret) {
      createPaymentIntent();
    }

    return () => {
      isActive = false;
    };
  }, [total, paymentMethod, clientSecret]);

  if (initializationError)
    return (
      <p style={{ textAlign: "center", color: "red", padding: "2rem" }}>
        {initializationError}
      </p>
    );

  return (
    <div className="checkout-container">
      <div className="payment-tabs">
        <button
          className="tab-btn"
          type="button"
          onClick={() => setPaymentMethod("Stripe")}
        >
          💳 Pay using Stripe
        </button>

        <button
          className="tab-btn"
          type="button"
          onClick={() => setPaymentMethod("Razorpay")}
        >
          💳 Pay using Razorpay
        </button>

        <button
          className="tab-btn"
          type="button"
          onClick={() => setPaymentMethod("COD")}
        >
          💵 Cash on Delivery
        </button>
      </div>
      <div className="form-wrapper">
        {paymentMethod === "COD" && <CODForm />}
        {paymentMethod === "Razorpay" && <RazorpayForm />}
        {paymentMethod === "Stripe" &&
          (clientSecret && stripePromise ? (
            <Elements
              key={clientSecret}
              options={{ clientSecret }}
              stripe={stripePromise}
            >
              <CheckOutForm />
            </Elements>
          ) : (
            <div className="loader-container">Loading Payment...</div>
          ))}
      </div>
    </div>
  );
};

export default Checkout;
