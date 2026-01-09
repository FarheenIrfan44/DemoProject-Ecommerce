import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductById } from "../utils/fetchProducts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { ShopContext } from "../context/ShopContext";
import { fetchComments } from "../utils/comment.utils";
import LatestCollection from "../components/LatestCollection";

const Product = () => {
  const { id } = useParams();
  const [productData, setProductData] = useState(null);
  const [image, setimage] = useState("");
  const { currency, addToCart } = useContext(ShopContext);
  const [comments, setComments] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      const data = await fetchProductById(id);
      setProductData(data.product);
      setimage(data.product.image[0]);
    };

    fetchProductData();
  }, [id]);

  useEffect(() => {
    const fetchCommentData = async (id) => {
      const commentData = await fetchComments(id);
      // console.log(commentData);
      setComments(commentData.data);
    };
    fetchCommentData(id);
  }, []);

  // 

  return productData ? (
    <div className="border-t-2 transition-opacity ease-in duration-500 opacity-100">
      {/* Prouduct data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item) => (
              <img
                onClick={() => {
                  setimage(item);
                }}
                src={item}
                key={item}
                alt="Product image here"
                className="w-[24%] sm:w-full sm:mb-3 shrink-0 cursor-pointer"
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt="" />
          </div>
        </div>
        {/* Product info */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <FontAwesomeIcon icon={faStar} style={{ color: "#FFD43B" }} />
            <FontAwesomeIcon icon={faStar} style={{ color: "#FFD43B" }} />
            <FontAwesomeIcon icon={faStar} style={{ color: "#FFD43B" }} />
            <FontAwesomeIcon icon={faStar} style={{ color: "#FFD43B" }} />
            <FontAwesomeIcon icon={faStar} style={{ color: "#FFD43B" }} />
            <p className="pl-2">{122}</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency} {productData.price}
          </p>
          <p className="mt-4 my-6 text-gray-500 md:w-4/5">
            {productData.description}
          </p>
           <button onClick={() => addToCart(productData._id)} className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700">
        ADD TO CART
      </button>
        </div>
      </div>
     
      <hr className="mt-8 sm:w-4/5" />
      <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
        <p>100 % Original</p>
        <p>Cash on delivery is available on this product</p>
        <p>Easy return and excahnge policy</p>
      </div>
      {/* Comment Section */}
      <div className="mt-20 ">
        <div className="flex">
          <p className="border px-6 py-3 text-sm">{comments?.length === 1 ? "Comment" : "Comments"} {comments?.length}</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          {/* <p>Login to see comments</p> */}
          {/* Comments */}
          {comments && comments.length > 0 ? (
            comments.map((item) => (
              <p
                key={item._id}
                className="border-b-2 py-2 text-black border-gray-400"
              >
                {item.content}
              </p>
            ))
          ) : (
            <p className="py-2 text-black border-gray-400">
              No comments for this post
            </p>
          )}
        </div>
      </div>
      {/* Display related products */}
      <LatestCollection />


    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
