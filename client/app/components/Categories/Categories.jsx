import { FaBaby, FaPuzzlePiece, FaSpa } from "react-icons/fa";

export default function Categories() {
  const categories = [
    { name: "Baby Products", icon: <FaBaby />, link: "/category/baby-products" },
    { name: "Toys", icon: <FaPuzzlePiece />, link: "/category/toys" },
    { name: "Beauty Products", icon: <FaSpa />, link: "/category/beauty" },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          Shop by Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {categories.map((cat, index) => (
            <a
              key={index}
              href={cat.link}
              className="flex flex-col items-center p-6 bg-white shadow-lg rounded-2xl hover:shadow-xl transition"
            >
              <div className="text-5xl text-[#59abab] mb-4">{cat.icon}</div>
              <h3 className="text-lg font-semibold">{cat.name}</h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
