import axios from 'axios';

const axiosInstance3 = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL2 || "http://localhost:8080",
  // baseURL: process.env.NEXT_PUBLIC_API_URL2 || "https://bluapi.aas.technology",
  headers: {
    'Content-Type': 'application/json'
  },
 withCredentials: true, 
});

export default axiosInstance3;

