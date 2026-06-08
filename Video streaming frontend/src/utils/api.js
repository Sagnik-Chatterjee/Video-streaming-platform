import axios from "axios";

const apiUrl = import.meta.env.VITE_API_BASE_URL;
const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark it so we don't cause an infinite loop

      try {
        console.log("Access token expired. Attempting silent refresh...");
        await axios.post(
          `${apiUrl}/users/refresh-token`, 
          {}, 
          { withCredentials: true }
        );

        console.log("Token refreshed successfully! Retrying original request...");
        return api(originalRequest); 
      } catch (refreshError) {
        console.error("Refresh token expired. Force logging out user...");
        

        localStorage.removeItem("isLoggedIn");
        
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;