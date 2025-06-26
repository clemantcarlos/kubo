export const API_BASE_URL = import.meta.env.API_URL || 'http://localhost/api';



export const API_ENDPOINTS = {
  // Productos
  PRODUCTS: {
    BASE: `${API_BASE_URL}/product`,
    BASE_GET: (page: number, limit: number) => `${API_BASE_URL}/product?page=${page}&limit=${limit}`,
    BY_ID: (id: number) => `${API_BASE_URL}/product/${id}`,
    UPDATE_STOCK: (id: number) => `${API_BASE_URL}/product/${id}/stock`,
  },
  
  // Categorías
  PRODUCT_CATEGORIES: {
    BASE: `${API_BASE_URL}/product-category`,
    BY_ID: (id: string) => `${API_BASE_URL}/product-category/${id}`,
  },

  // Unidades de almacenamiento
  PRODUCT_STORAGE_UNITS: {
    BASE: `${API_BASE_URL}/product-storage-unit`,
    BY_ID: (id: string) => `${API_BASE_URL}/product-storage-unit/${id}`,
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