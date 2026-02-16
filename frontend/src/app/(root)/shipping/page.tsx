"use client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState} from "react";
import { BiArrowBack } from "react-icons/bi";

const Shipping = () => {
  const navigate = useRouter();
  const [shippingInfo, setshippingInfo] = useState({
    address: "",
    fullName: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  });

  const changeHandeler = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    setshippingInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="shipping">
      <button className="back-btn" onClick={() => navigate.back()}>
        <BiArrowBack />
      </button>
     
      <form>
         <h1>Shipping Info</h1>
        <input
          required
          type="text"
          placeholder="Enter Address"
          name="address"
          value={shippingInfo.address}
          onChange={changeHandeler}
        />
        <input
          required
          type="text"
          placeholder="Enter FullName"
          name="fullName"
          value={shippingInfo.fullName}
          onChange={changeHandeler}
        />
        <input
          required
          type="text"
          placeholder="City"
          name="city"
          value={shippingInfo.city}
          onChange={changeHandeler}
        />
        <input
          required
          type="text"
          placeholder="Enter State"
          name="state"
          value={shippingInfo.state}
          onChange={changeHandeler}
        />
        <select
          name="country"
          required
          value={shippingInfo.country}
          onChange={changeHandeler}
        >
          <option value="">Country</option>
          <option value="India">India</option>
          <option value="USA">USA</option>
          <option value="UAE">UAE</option>
        </select>
        <input
          required
          type="number"
          placeholder="Enter PinCode"
          name="pinCode"
          value={shippingInfo.pinCode}
          onChange={changeHandeler}
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
