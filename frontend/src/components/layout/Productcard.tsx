import { server } from "@/redux/store";
import { CartItem } from "@/types/types";

type ProdctsProps = {
  productId: string;
  photo: string;
  name: string;
  price: number;
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
      <div className="card-header">
        <img src={`${server}/${photo}`} alt={name} />
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
