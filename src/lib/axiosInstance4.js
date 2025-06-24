import axios from 'axios';

const axiosInstance4 = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://198.168.0.122:8080/api",
  // baseURL: process.env.NEXT_PUBLIC_API_URL2 || "https://bluapi.aas.technology",
  headers: {
    'Content-Type': 'application/json'
  },
 withCredentials: true, 
});

export default axiosInstance4;

