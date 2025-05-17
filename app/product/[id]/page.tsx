import { notFound } from "next/navigation";
import Image from "next/image";

const products = [
  {
    id: 1,
    name: "Beehive 1",
    price: "Ksh 4,500",
    image: "/images/beehive1.jpeg",
    description: "A durable beehive made with sustainable materials.",
  },
  {
    id: 2,
    name: "Beehive 2",
    price: "Ksh 5,000",
    image: "/images/beehive2.jpeg",
    description: "An advanced hive designed for easy honey harvesting.",
  },
  {
    id: 3,
    name: "Beehive 3",
    price: "Ksh 4,200",
    image: "/images/beehive3.jpeg",
    description: "Compact and efficient beehive perfect for small gardens.",
  },
  {
    id: 4,
    name: "Beehive 4",
    price: "Ksh 4,000",
    image: "/images/beehive4.jpeg",
    description: "Simple and sturdy hive ideal for beginners.",
  },
];

const ProductPage = ({ params }: { params: { id: string } }) => {
  const product = products.find((p) => p.id === parseInt(params.id));

  if (!product) return notFound();

  return (
    <div className="max-w-4xl mx-auto p-6 font-poppins">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <Image
          src={product.image}
          alt={product.name}
          width={600}
          height={600}
          className="rounded-lg w-full h-auto object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold text-yellow-700">{product.name}</h1>
          <p className="text-lg text-gray-600 mt-4">{product.description}</p>
          <p className="text-2xl text-yellow-600 font-semibold mt-6">{product.price}</p>
          <button className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
