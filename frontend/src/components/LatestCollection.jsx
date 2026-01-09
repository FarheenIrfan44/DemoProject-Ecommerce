import React from "react";
import Title from "./Title";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import ProductItem from "./ProductItem";
import { fetchProducts } from "../utils/fetchProducts";

const LatestCollection = () => {
  const [latestProduct, setLatestProduct] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
      // console.log(data)
      setLatestProduct(data.products);
    };

    loadProducts();
  }, []);
  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"Latest"} text2={"COLLECTION"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Shop the latest products at a reasonable price.
        </p>
      </div>
      {/* Products list */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {latestProduct.map((item) => (
          <ProductItem
            key={item._id}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;
