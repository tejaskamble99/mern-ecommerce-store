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
      <div className="card-header">
        <img src={photo} alt={name} />
      </div>

      <div className="card-body">
        <div className="row">
          <h3>{name}</h3>
          <p>{price}</p>
        </div>
      </div>

      <div className="card-footer">
        <button
          onClick={() => handler()}
          disabled={stock < 1}
          className={stock < 1 ? "disabled" : ""}
        >
          {stock < 1 ? "Out of Stock" : "Add to Cart"}
        </button>
        
      </div>
    </div>
  );
}
