import axios from "axios";

export const fetchProducts = async () => {
  const response = await axios.get("http://localhost:4000/api/product/get");
  return response.data;
};

export const fetchProductById = async (id) => {
  const response = await axios.get(`http://localhost:4000/api/product/productById/${id}`);
  return response.data;
}; 