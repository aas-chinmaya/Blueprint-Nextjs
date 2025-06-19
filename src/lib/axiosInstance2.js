import axios from 'axios';

const axiosInstance2 = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://192.168.0.122:8080/api",
  headers: {
    'Content-Type': 'application/json'
  },
 
});

export default axiosInstance2;

