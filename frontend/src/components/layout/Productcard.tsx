import { server } from "@/redux/store";
import { CartItem } from "@/types/types";
import Image from "next/image";
import Link from "next/link";

type ProdctsProps = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  salePrice?: number;
  stock: number;
  handler: (cartItem: CartItem) => string | undefined;
};

export default function ProductCard({
  productId,
  price,
  stock,
  name,
  photo,
  handler,
}: ProdctsProps) {
  const isOutOfStock = stock < 1;
  return (
    <div className="productcard">
      <Link href={`/product/${productId}`}>
      <div className="card-header">
        <Image src={`${server}/${photo}`} alt={name} width={200} height={200} />
        
      </div>

      <div className="card-body">
        <div className="row">
          <h3>{name}</h3>
          <p>
            {price.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            })}
          </p>
        </div>
      </div>
      </Link>

      <div className="card-footer">
        <button
          onClick={() => handler({ productId, photo, name, price, quantity: 1, stock })}
          disabled={isOutOfStock}
          className={isOutOfStock ? "disabled" : ""}
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
        
      </div>
    </div>
  );
}
