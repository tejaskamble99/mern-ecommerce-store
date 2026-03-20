import { server } from "@/redux/store";
import Link from "next/link";

interface CategoriesProps {
  photo: string;
  name: string;
}

const CategoryCard = ({ photo, name }: CategoriesProps) => {
  return (
    <div className="category-card">
      <Link
        href={`/search?category=${name.toLowerCase()}`}
      >
        <div className="card-img">
          <img
            src={photo?.startsWith("http") ? photo : `${server}/${photo}`}
            alt={name}
          />
        </div>

        <div className="card-body">
          <div className="row">
          <h3>{name}</h3>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CategoryCard;
