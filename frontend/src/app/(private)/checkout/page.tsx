"use client";

import { useNewOrderMutation } from "@/redux/api/orderApi";
import { resetCart } from "@/redux/reducer/cartReducer";
import { RootState, server } from "@/redux/store";
import { NewOrderRequest } from "@/types/api-types";
import { CartReducerInitialState } from "@/types/reducer-types";
import { responseToast } from "@/utils/features";

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
import { auth } from "@/firebase"; // ⭐ IMPORTANT

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_KEY?.trim() ?? "";

const stripePromise = stripePublishableKey
  ? loadStripe(stripePublishableKey)
  : null;

type PaymentIntentResponse = {
  clientSecret?: string;
};

type PaymentElementLoadErrorEvent = {
  elementType: "payment";
  error: StripeError;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

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
  const [paymentElementError, setPaymentElementError] =
    useState<string | null>(null);

  const [newOrder] = useNewOrderMutation();

  const paymentLoadErrorHandler = ({ error }: PaymentElementLoadErrorEvent) => {
    const message =
      error.message ||
      "Unable to load payment form. Check Stripe keys and try again.";

    setIsPaymentElementReady(false);
    setPaymentElementError(message);
    toast.error(message);
  };

  const paymentReadyHandler = () => {
    setIsPaymentElementReady(true);
    setPaymentElementError(null);
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (paymentElementError) {
      return toast.error(paymentElementError);
    }

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
    };

    try {
      const { paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: window.location.origin },
        redirect: "if_required",
      });

      if (paymentIntent?.status !== "succeeded") {
        return toast.error("Payment failed. Please try again.");
      }

      const res = await newOrder(orderData);

      if ("data" in res) {
        dispatch(resetCart());
      }

      responseToast(res, router, "/dashboard/orders");
    } catch (error) {
      toast.error(getErrorMessage(error, "Payment failed"));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-container">
      <form onSubmit={submitHandler}>
        <PaymentElement
          onLoadError={paymentLoadErrorHandler}
          onReady={paymentReadyHandler}
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
        >
          {isProcessing ? "Processing..." : "Pay"}
        </button>
      </form>
    </div>
  );
};

const Checkout = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [initializationError, setInitializationError] =
    useState<string | null>(null);

  const { total } = useSelector(
    (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
  );

  useEffect(() => {
    if (!stripePromise) {
      setInitializationError(
        "Stripe key missing. Add NEXT_PUBLIC_STRIPE_KEY."
      );
      return;
    }

    if (!server) {
      setInitializationError(
        "Server URL missing. Add NEXT_PUBLIC_SERVER_URL."
      );
      return;
    }

    if (total <= 0) {
      setInitializationError("Cart total must be greater than 0.");
      return;
    }

    let isActive = true;

    const createPaymentIntent = async () => {
      try {
        const token = await auth.currentUser?.getIdToken(); // ⭐ GET TOKEN

        const { data } = await axios.post<PaymentIntentResponse>(
          `${server}/api/v1/payment/create`,
          { amount: total },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // ⭐ SEND TOKEN
            },
          }
        );

        if (!data.clientSecret) {
          throw new Error("Stripe did not return client secret.");
        }

        if (isActive) setClientSecret(data.clientSecret);
      } catch (error) {
        const message = getErrorMessage(
          error,
          "Failed to initialize payment."
        );

        if (isActive) {
          setInitializationError(message);
          toast.error(message);
        }
      }
    };

    createPaymentIntent();

    return () => {
      isActive = false;
    };
  }, [total]);

  if (initializationError) return <p>{initializationError}</p>;

  return clientSecret && stripePromise ? (
    <Elements key={clientSecret} options={{ clientSecret }} stripe={stripePromise}>
      <CheckOutForm />
    </Elements>
  ) : (
    <p>Initializing payment...</p>
  );
};

export default Checkout;