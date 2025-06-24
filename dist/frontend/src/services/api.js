"use strict";
// import axios from 'axios';
// const API_URL = 'http://localhost:7500/api/v1';
// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });
// // Add token to requests automatically
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });
// // Handle authentication errors
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       // Handle token expiration
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );
// export const authAPI = {
//   login: async (email: string, password: string) => {
//     const response = await api.post('/login-user', { email, password });
//     return response.data;
//   },
//   register: async (username: string, email: string, password: string) => {
//     const response = await api.post('/register-user', { username, email, password });
//     return response.data;
//   },
// };
// export const carsAPI = {
//   getAllCars: async () => {
//     const response = await api.get('/cars/cars');
//     return response.data;
//   },
//   createCar: async (carData: any) => {
//     const response = await api.post('/cars/create-car', carData);
//     return response.data;
//   },
//   updateCar: async (id: string, carData: any) => {
//     const response = await api.patch(`/cars/update-car/${id}`, carData);
//     return response.data;
//   },
//   deleteCar: async (id: string) => {
//     const response = await api.delete(`/cars/delete-car/${id}`);
//     return response.data;
//   },
// };
// export default api;
