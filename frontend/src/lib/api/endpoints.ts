export const API_BASE_URL = import.meta.env.API_URL || 'http://localhost/api';
const API_INVENTORY_URL = `${API_BASE_URL}/inventory`;

export const API_ENDPOINTS = {
  // Productos
  PRODUCTS: {
    BASE: `${API_INVENTORY_URL}/product`,
    BASE_GET: (page: number, limit: number, search?: string) => `${API_INVENTORY_URL}/product?page=${page}&limit=${limit}&search=${search}`, 
    BY_ID: (id: number) => `${API_INVENTORY_URL}/product/${id}`,
    UPDATE_STOCK: (id: number) => `${API_INVENTORY_URL}/product/${id}/stock`,
    CATEGORIES: `${API_INVENTORY_URL}/product/category`,
    CATEGORIES_BY_ID: (id: string) => `${API_BASE_URL}/product/category/${id}`,
    STORAGE_UNITS: `${API_BASE_URL}/product/storage-unit`,
    STORAGE_UNITS_BY_ID: (id: string) => `${API_BASE_URL}/product/storage-unit/${id}`,
  },
  // Proveedores
  SUPPLIERS: {
    BASE: `${API_INVENTORY_URL}/supplier`,
    BASE_GET: (page: number, limit: number, search?: string) => `${API_INVENTORY_URL}/supplier?page=${page}&limit=${limit}&search=${search}`, 
    BY_ID: (id: number) => `${API_INVENTORY_URL}/supplier/${id}`,
    UPDATE_STOCK: (id: number) => `${API_INVENTORY_URL}/supplier/${id}/stock`,
  },
  
  // Autenticación
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/local/signin`,
    REGISTER: `${API_BASE_URL}/auth/local/signup`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
  },
  
  // Usuarios
  USERS: {
    BASE: `${API_BASE_URL}/user`,
    UPDATE_AVATAR: (userId: string) => `${API_BASE_URL}/users/${userId}/avatar`,
  },
} as const; // "as const" para inferencia de tipos precisa