import Link from "next/link";
import { FaTrash } from 'react-icons/fa';

type CartItemProps ={
    cartItem : any
};

const CartItem = ({cartItem}: CartItemProps) => {
    const {productId,photo,name,price,quantity} = cartItem;
  return (
    <div className="cart-item">
        <img src={photo} alt={name}/>
        <article>
            <Link href={`/product/${productId}`}>{name}</Link>
            <span>₹{price}</span>
        </article>
        <div>
            <button>-</button>
            <span>{quantity}</span>
            <button>+</button>
        </div>
        <button className="remove"><FaTrash/></button>
    </div>
  )
}

export default CartItem