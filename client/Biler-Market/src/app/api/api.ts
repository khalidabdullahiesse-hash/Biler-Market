import axios, { AxiosRequestConfig } from "axios";

const API_BASE_URL = "https://biler-market-8qfd.vercel.app/";

if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined. Check your .env file.");
}

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// ✅ Request interceptor (typed)
api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization =
      `Bearer ${token}`;
  }

  return config;
});

// ✅ Response interceptor for handling 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  },
);

export interface Product {
  _id?: string;
  product: string;
  price: number;
  owner: string;
}

export interface User {
  _id?: string;
  name: string;
  email: string;
}

export interface Loan {
  _id?: string;
  totalAmount: number;
  paidAmount: number;
  remainAmount: number;
  owner: string;
  createdAt?: string;
}

export const getProducts = () => api.get<Product[]>("/products");

export const getProductTotal = () =>
  api.get<{ total: number }>("/products/total");

export const createProduct = (productData: Product) =>
  api.post<Product>("/products", productData);

export const updateProduct = (id: string, productData: Partial<Product>) =>
  api.patch<Product>(`/products/${id}`, productData);

export const deleteProduct = (id: string) => api.delete(`/products/${id}`);

export const registerUser = (userData: {
  name: string;
  email: string;
  password: string;
}) => api.post<{ user: User; token: string }>("/users", userData);

export const loginUser = (userData: { email: string; password: string }) =>
  api.post<{ user: User; token: string }>("/users/login", userData);

export const getMe = () => api.get<User>("/users/me");

export const getAllUsers = () => api.get<User[]>("/users");

export const updateMe = (userData: Partial<User>) =>
  api.patch<User>("/users/me", userData);

export const deleteMe = () => api.delete("/users/me");

export const getAllLoans = () => api.get<Loan[]>("/loans");

export const createLoan = (loanData: Loan) =>
  api.post<Loan>("/loans", loanData);

export const updateLoanPayment = (
  id: string,
  paymentData: { amount: number },
) => api.patch<Loan>(`/loans/${id}/pay`, paymentData);

export const deleteLoan = (id: string) => api.delete(`/loans/${id}`);

export default api;
