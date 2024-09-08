import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import CallbackPage from "./pages/CallbackPage.tsx";
import { Toaster } from "react-hot-toast";

import "./index.css";
// Supports weights 200-900
import "@fontsource-variable/inconsolata";
import Start from "./pages/Start.tsx";
import Home from "./pages/Home.tsx";
import Game from "./pages/Game.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Start />,
  },
  {
    path: "/game",
    element: <Game />,
  },
  {
    path: "/callback",
    element: <CallbackPage />,
  },
  {
    path: "/home",
    element: <Home />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </React.StrictMode>
);
