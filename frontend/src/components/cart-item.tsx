import { server } from "@/redux/store";
import { CartItem } from "@/types/types";
import Image from "next/image";
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
    
      <Image src={`${server}/${photo}`} alt={name} width={100} height={100} />

     
      <article>
        <Link href={`/product/${productId}`}>{name}</Link>
        <span>₹{price}</span>
      </article>

  
      <div className="actions">
        <div className="qty">
          <button
            disabled={quantity <= 1}
            onClick={() => decrementHandler(cartItem)}
          >
            -
          </button>
          <span>{quantity}</span>
          <button onClick={() => incrementHandler(cartItem)}>+</button>
        </div>

        <button className="remove" onClick={() => removeHandler(productId)}>
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default CartItemComponent;
