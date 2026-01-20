export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center">
      <h1 className="text-3xl font-bold mb-4">
        Welcome to My Store
      </h1>

      <p className="text-gray-600 mb-6">
        Click below to view all products from FakeStore API
      </p>

      <a
        href="/products"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        View Products
      </a>
    </div>
  );
}
