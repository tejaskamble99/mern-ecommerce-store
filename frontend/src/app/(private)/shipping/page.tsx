"use client";
import { CartReducerInitialState } from "@/types/reducer-types";
import { useRouter } from "next/navigation";
import { ChangeEvent, use, useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { saveShippingInfo } from "@/redux/reducer/cartReducer";

const Shipping = () => {
  const { cartItems } = useSelector(
    (state: { cartReducer: CartReducerInitialState }) => state.cartReducer,
  );

  const navigate = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [shippingInfo, setshippingInfo] = useState({
    address: "",
    fullName: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  });

  useEffect(() => {
    if (cartItems.length <= 0) return navigate.push(`/cart`);
  }, [cartItems, navigate]);

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>,
  ) => {
    setshippingInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(saveShippingInfo(shippingInfo));
    navigate.push("/payment");
  };

  return (
    <div className="shipping">
      <button className="back-btn" onClick={() => navigate.back()}>
        <BiArrowBack />
      </button>

      <form onSubmit={submitHandler}>
        <h1>Shipping Info</h1>
        <input
          required
          type="text"
          placeholder="Enter Address"
          name="address"
          value={shippingInfo.address}
          onChange={changeHandler}
        />
        <input
          required
          type="text"
          placeholder="Enter FullName"
          name="fullName"
          value={shippingInfo.fullName}
          onChange={changeHandler}
        />
        <input
          required
          type="text"
          placeholder="City"
          name="city"
          value={shippingInfo.city}
          onChange={changeHandler}
        />
        <input
          required
          type="text"
          placeholder="Enter State"
          name="state"
          value={shippingInfo.state}
          onChange={changeHandler}
        />
        <select
          name="country"
          required
          value={shippingInfo.country}
          onChange={changeHandler}
        >
          <option value="">Country</option>
          <option value="India">India</option>
          <option value="USA">USA</option>
          <option value="UAE">UAE</option>
        </select>

        <input
          required
          type="text"
          inputMode="numeric"
          pattern="[0-9]"
          placeholder="Enter PinCode"
          name="pinCode"
          value={shippingInfo.pinCode}
          onChange={changeHandler}
        />
        <button
          type="button"
          onClick={() => {
            console.log(shippingInfo);
          }}
        >
          Use My Location
        </button>
        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
};

export default Shipping;
