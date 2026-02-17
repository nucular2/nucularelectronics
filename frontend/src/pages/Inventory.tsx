import { useEffect, useState } from "react";
import axios from "axios";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

export default function Inventory() {
  const [items, setItems] = useState<Product[]>([]);
  useEffect(() => {
    axios.get("/api/products/inventory").then((r: any) => setItems(r.data.items || []));
  }, []);
  return (
    <div>
      <h1>Каталог</h1>
      <ul>
        {items.map((i: Product) => (
          <li key={i.id}>
            <span>{i.name}</span>
            <span>{i.price}</span>
            <span>{i.stock}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
