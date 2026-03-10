import { server } from "@/redux/store";
import { CartItem } from "@/types/types";
import Link from "next/link";
import { FaTrash } from "react-icons/fa";

type CartItemProps = {
  cartItem: CartItem;                              
  incrementHandler: (cartItem: CartItem) => void;
  decrementHandler: (cartItem: CartItem) => void;
  removeHandler: (id: string) => void;             
};

const CartItemComponent = ({
  cartItem,
  incrementHandler, 
  decrementHandler,
  removeHandler,
}: CartItemProps) => {
  const { productId, photo, name, price, quantity } = cartItem;

  return (
    <div className="cart-item">
      <img src={`${server}/${photo}`} alt={name} />
      <article>
        <Link href={`/product/${productId}`}>{name}</Link>
        <span>₹{price.toLocaleString("en-IN")}</span>
      </article>
      <div>
        <button onClick={() => decrementHandler(cartItem)}>-</button>
        <span>{quantity}</span>
        <button onClick={() => incrementHandler(cartItem)}>+</button>
      </div>
      <button className="remove" onClick={() => removeHandler(productId)}>
        <FaTrash />
      </button>
    </div>
  );
};

export default CartItemComponent;