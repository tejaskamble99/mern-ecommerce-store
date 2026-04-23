import { server } from "@/redux/store";
import Image from "next/image";
import Link from "next/link";

interface CategoriesProps {
  photo: string;
  name: string;
}

const CategoryCard = ({ photo, name }: CategoriesProps) => {
  return (
    <div className="category-card">
      <Link href={`/search?category=${name.toLowerCase()}`}>
        <div className="card-img">
          <Image
            src={photo?.startsWith("http") ? photo : `${server}/${photo}`}
            alt={name}
            width={200}
            height={200}
          />
        </div>
        <div className="category-name">
          <h3>{name.toUpperCase()}</h3>
        </div>
      </Link>
    </div>
  );
};

export default CategoryCard;