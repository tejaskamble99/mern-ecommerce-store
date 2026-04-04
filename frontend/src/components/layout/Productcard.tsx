import { server } from "@/redux/store";
import { CartItem } from "@/types/types";
import Image from "next/image";
import Link from "next/link";

type ProdctsProps = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  salePrice: number;
  stock: number;
  handler: (cartItem: CartItem) => string | undefined;
};

export default function ProductCard({
  productId,
  price,
  salePrice,
  stock,
  name,
  photo,
  handler,
}: ProdctsProps) {

  const isOutOfStock = stock < 1;

  const discount =
    salePrice && salePrice < price
      ? Math.round(((price - salePrice) / price) * 100)
      : 0;

  return (
    <div className="productcard">
      <Link href={`/product/${productId}`}>

        <div className="card-header">
          {discount > 0 && (
            <span className="product-discount-badge">
              {discount}%
            </span>
          )}

          <Image
            src={`${server}/${photo}`}
            alt={name}
            width={220}
            height={220}
            className="product-image"
          />
        </div>

        <div className="card-body">
          <h3 className="product-name">{name}</h3>

          <div className="price-row">
            {salePrice && salePrice < price ? (
              <>
                <span className="sale-price">
                  ₹{salePrice.toLocaleString("en-IN")}
                </span>

                <span className="original-price">
                  ₹{price.toLocaleString("en-IN")}
                </span>
              </>
            ) : (
              <span className="sale-price">
                ₹{price.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="card-footer">
        <button
          onClick={() =>
            handler({
              productId,
              photo,
              name,
              price: salePrice || price,
              quantity: 1,
              stock,
            })
          }
          disabled={isOutOfStock}
          className={isOutOfStock ? "disabled" : ""}
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}