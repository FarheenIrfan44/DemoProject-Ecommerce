import axios from 'axios'

export const fetchComments = async (productId) => {
  //const token = localStorage.getItem("token");

  const res = await axios.get(
    `http://localhost:4000/api/comment/getComment/${productId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NWU0OThhODQ5MmI3MzRlODFlNWI0OCIsImlhdCI6MTc2Nzk1NTc1Mn0.9veAGURbNcDD3Q-JbCUkXTVvXyWMrndwaO2K8CUGlz4`
      },
    }
  );

  return res.data;
};
