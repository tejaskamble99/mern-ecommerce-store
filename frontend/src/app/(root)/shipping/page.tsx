"use client";
import { ChangeEvent, useState } from "react";
import { BiArrowBack } from "react-icons/bi";

const Shipping = () => {
  const [shippingInfo, setshippingInfo] = useState({
    address: "",
    fullName: "", 
    city: "",
    state: "",
    country: "",
    pinCode: "",
  });

  const changeHandeler = (e: ChangeEvent<HTMLInputElement>) => {
    setshippingInfo((prev)=> ({
...prev,
[e.target.name]:e.target.value,
    }));
  };

  

  return (
    <div className="shipping">
      <button>
        <BiArrowBack />
      </button>
      <form>
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
        <input
          required
          type="text"
          placeholder="Enter Country"
          name="country"
          value={shippingInfo.country}
          onChange={changeHandeler}
        />
        <input
          required
          type="number"
          placeholder="Enter PinCode"
          name="pinCode"
          value={shippingInfo.pinCode}
          onChange={changeHandeler}
        />
        <button type="button" onClick={()=>{console.log(shippingInfo)}}>
  Use My Location
</button>
      </form>
    </div>
  );
};

export default Shipping;
