import axios from 'axios';

const axiosInstance5 = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  // baseURL: process.env.NEXT_PUBLIC_API_URL || "http://192.168.0.141:8000/api",
  // baseURL: process.env.NEXT_PUBLIC_API_URL2 || "https://bluapi.aas.technology",
  headers: {
    'Content-Type': 'application/json'
  },
//  withCredentials: true, 
});

export default axiosInstance5;

