import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store/index.js";
import links from "./contstants/links.js";
import axios from "axios";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { userActions } from "./store/reducers/userReducers.js";
// import { refreshAccessToken } from "./services/index/users.js";

axios.defaults.baseURL = links.BASE_URL;

// // Set up axios interceptors for error handling
// axios.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // call the refresh token endpoint
//       refreshAccessToken()
//         .then((newToken) => {
//           axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
//         })
//         .catch((refreshError) => {
//           console.error("Failed to refresh token:", refreshError);
//         });
//     } else {
//       // Handle other errors
//       console.error("API error:", error);
//     }
//     return Promise.reject(error);
//   }
// );

axios.interceptors.request.use(
  (request) => {
    const userInfo = JSON.parse(localStorage.getItem("account"));
    console.log(userInfo);
    const accessToken = userInfo?.accessToken;
    if (accessToken) {
      request.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return request;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const account = JSON.parse(localStorage.getItem("account"));
        const refreshToken = account?.refreshToken;

        if (refreshToken) {
          const response = await axios.post("auth/refresh-token", {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } =
            response.data?.data;

          if (!accessToken || !newRefreshToken) {
            throw new Error("Failed to refresh tokens");
          }

          const updatedAccount = {
            ...account,
            accessToken: accessToken,
            refreshToken: newRefreshToken,
          };
          console.log("Updated account:", updatedAccount);
          localStorage.setItem("account", JSON.stringify(updatedAccount));
          store.dispatch(userActions.setUserInfo(updatedAccount));

          // Update the authorization header for the original request
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

          return axios(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        console.error("Logging out user due to token refresh failure");
        localStorage.removeItem("account");
        store.dispatch(userActions.resetUserInfo());
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
