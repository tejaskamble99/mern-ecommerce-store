type Props = {
  title: string;
  image: string;
  price: number;
};

export default function ProductCard({ title, image, price }: Props) {
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition">
      <img
        src={image}
        alt={title}
        className="w-full h-40 object-contain mb-3"
      />
      <h2 className="font-semibold text-lg line-clamp-2">{title}</h2>
      <p className="text-blue-600 font-bold mt-2">₹{price}</p>
    </div>
  );
}
