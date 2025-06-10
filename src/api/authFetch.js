// src/api/authAxios.js
import axios from "axios";
import { refreshAccessToken } from "./refreshToken";

export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("authToken");

  try {
    const response = await axios({
      ...options,
      url,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        try {
          const retryResponse = await axios({
            ...options,
            url,
            headers: {
              ...(options.headers || {}),
              Authorization: `Bearer ${newToken}`,
            },
          });
          return retryResponse;
        } catch (error) {
          window.location.href = "/";
        }
      }
    }
    throw error;
  }
};
