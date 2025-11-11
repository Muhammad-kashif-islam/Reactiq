import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from '@tanstack/react-query'; 
import queryClient from "./helpers/AsyncHandler";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";
const root = document.getElementById("root");
ReactDOM.createRoot(root).render(
  <QueryClientProvider client={queryClient}>
  <Toaster position="top-right" reverseOrder={false} />
    <App/>
  </QueryClientProvider>
);



