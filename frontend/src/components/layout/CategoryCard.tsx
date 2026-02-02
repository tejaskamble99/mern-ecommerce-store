import Link from "next/link";

interface CategoriesProps {
  photo: string;
  name: string;
  count: number;
}

const CategoryCard = ({ photo, name, count }: CategoriesProps) => {
  return (
    // 1. Wrap in Link so it is clickable
    <Link href={`/search?category=${name.toLowerCase()}`} className="category-card">
      
      <img src={photo} alt={name} />

      {/* 2. Use 'cat-overlay' to match your SCSS styles */}
      <div className="cat-overlay">
        <h3>{name}</h3>
        {/* 3. Display the count */}
        <p>{count} Products</p>
      </div>

    </Link>
  );
};

export default CategoryCard;