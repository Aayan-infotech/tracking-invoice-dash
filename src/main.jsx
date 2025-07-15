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
