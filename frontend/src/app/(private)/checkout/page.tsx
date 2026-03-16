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

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_KEY?.trim() ?? "";
const stripePromise = stripePublishableKey
  ? loadStripe(stripePublishableKey)
  : null;

type PaymentIntentResponse = {
  clientSecret?: string;
  message?: string;
  success?: boolean;
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
  const [isPaymentElementReady, setIsPaymentElementReady] =
    useState<boolean>(false);
  const [paymentElementError, setPaymentElementError] = useState<string | null>(
    null,
  );
  const [newOrder] = useNewOrderMutation();

  const paymentLoadErrorHandler = ({ error }: PaymentElementLoadErrorEvent) => {
    const message =
      error.message ||
      "Unable to load the payment form. Check that both Stripe keys belong to the same account and try again.";

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
    if (!user?._id) {
      return toast.error("Please sign in to place your order.");
    }

    setIsProcessing(true);

    const orderData: NewOrderRequest = {
      shippingInfo,
      orderItems: cartItems,
      subtotal,
      tax,
      discount,
      shippingCharges,
      total,
      user: user._id,
    };

    try {
      const { paymentIntent, error } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: window.location.origin },
        redirect: "if_required",
      });

      if (paymentIntent?.status !== "succeeded") {
  return toast.error("Payment could not be completed. Please try again.");
}

console.log("Payment succeeded — placing order...");
const res = await newOrder(orderData);
console.log("Order response:", res); 

if ("data" in res) {
  console.log("Order placed:", res.data);
  dispatch(resetCart());
} else {
  console.error("Order failed:", res.error); 
}
responseToast(res, router, "/orders");
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

        {paymentElementError ? (
          <p role="alert">{paymentElementError}</p>
        ) : null}

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
  const [clientSecret, setClientSecret] = useState<string>("");
  const [initializationError, setInitializationError] = useState<string | null>(
    null,
  );

  const { total } = useSelector(
    (state: { cartReducer: CartReducerInitialState }) => state.cartReducer,
  );

  useEffect(() => {
    if (!stripePromise) {
      setInitializationError(
        "Stripe publishable key is missing. Add NEXT_PUBLIC_STRIPE_KEY and reload the app.",
      );
      return;
    }

    if (!server) {
      setInitializationError(
        "Server URL is missing. Add NEXT_PUBLIC_SERVER_URL and reload the app.",
      );
      return;
    }

    if (total <= 0) {
      setInitializationError(
        "Your cart total must be greater than 0 before checkout.",
      );
      return;
    }

    let isActive = true;

    setClientSecret("");
    setInitializationError(null);

    const createPaymentIntent = async () => {
      try {
        const { data } = await axios.post<PaymentIntentResponse>(
          `${server}/api/v1/payment/create`,
          { amount: total },
          {
            headers: { "Content-Type": "application/json" },
          },
        );

        if (!data.clientSecret) {
          throw new Error(
            "Stripe did not return a client secret for this payment.",
          );
        }

        if (isActive) {
          setClientSecret(data.clientSecret);
        }
      } catch (error) {
        const message = getErrorMessage(
          error,
          "Failed to initialize payment.",
        );

        if (isActive) {
          setInitializationError(message);
          toast.error(message);
        }
      }
    };

    void createPaymentIntent();

    return () => {
      isActive = false;
    };
  }, [total]);

  if (initializationError) {
    return <p role="alert">{initializationError}</p>;
  }

  return clientSecret && stripePromise ? (
    <Elements key={clientSecret} options={{ clientSecret }} stripe={stripePromise}>
      <CheckOutForm />
    </Elements>
  ) : (
    <p>Initializing payment...</p>
  );
};

export default Checkout;
