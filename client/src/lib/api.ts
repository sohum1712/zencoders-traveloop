import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('traveloop_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem('traveloop_token');
      localStorage.removeItem('traveloop_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
};

// Trips
export const tripsAPI = {
  getAll: () => api.get('/trips'),
  getById: (id: string) => api.get(`/trips/${id}`),
  create: (data: any) => api.post('/trips', data),
  update: (id: string, data: any) => api.put(`/trips/${id}`, data),
  delete: (id: string) => api.delete(`/trips/${id}`),
  addStop: (tripId: string, data: any) => api.post(`/trips/${tripId}/stops`, data),
  addExpense: (tripId: string, data: any) => api.post(`/trips/${tripId}/expenses`, data),
  addPackingItem: (tripId: string, data: any) => api.post(`/trips/${tripId}/packing`, data),
  addNote: (tripId: string, data: any) => api.post(`/trips/${tripId}/notes`, data),
  updateItinerary: (tripId: string, stops: any[]) => api.put(`/trips/${tripId}/itinerary`, { stops }),
};

// Cities & Activities
export const discoverAPI = {
  getCities: () => api.get('/cities'),
  searchCities: (params: Record<string, string>) => api.get('/cities/search', { params }),
  searchActivities: (params: Record<string, string>) => api.get('/activities/search', { params }),
};

// User
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data: any) => api.put('/user/profile', data),
  getSavedDestinations: () => api.get('/user/saved-destinations'),
  saveDestination: (cityId: number) => api.post('/user/saved-destinations', { cityId }),
  removeSavedDestination: (cityId: number) => api.delete(`/user/saved-destinations/${cityId}`),
};

// Packing
export const packingAPI = {
  updateItem: (itemId: string, data: any) => api.put(`/packing-items/${itemId}`, data),
};

export default api;
