const server = "";
type ProdctsProps = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  stock: number;
  handler: () => void;
};

export default function ProductCard({
  productId,
  price,
  stock,
  name,
  photo,
  handler,
}: ProdctsProps) {
  return (
    <div className="productcard">
      <img src={photo}alt={name} />
      <p>{name}</p>
      <span>{price}</span>

      <div>
        <button onClick={() => handler()}>Add To Cart</button>
      </div>
    </div>
  );
}
