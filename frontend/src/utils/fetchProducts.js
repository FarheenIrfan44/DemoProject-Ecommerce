import axios from "axios";

export const fetchProducts = async () => {
  const response = await axios.get("http://localhost:4000/api/product/get");
  return response.data;
};