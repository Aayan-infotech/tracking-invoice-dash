import axios from "axios";
import { Navigate } from "react-router-dom";
import { links } from "../contstants";

export const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      `${links.BASE_URL}auth/refresh-token`,
      {
        refreshToken: localStorage.getItem("refreshToken"),
      }
    );

    const newToken = response.data.data.accessToken;
    localStorage.setItem("authToken", newToken);

    return newToken;
  } catch (error) {
    console.error("Refresh token failed", error);
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("profileImage");
    // Redirect to login page if refresh token fails
    window.location.href = "/"; 
    return null;
  }
};
