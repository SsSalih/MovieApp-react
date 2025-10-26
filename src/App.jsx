import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Base/Home";
import Movies from "./pages/MoviePage/Movies";
import MovieDetails from "./pages/MoviePage/MovieDetails";
import MainLayout from "./layouts/MainLayout";
import SearchResults from "./pages/Base/SearchResults";
import LoginPage from "./pages/Base/LoginPage";
import Register from "./pages/Base/Register";
import TvSeries from "./pages/TvSeriesPage/TvSeries";
import TvSeriesDetails from "./pages/TvSeriesPage/TvSeriesDetails";
import Footer from "./components/Base/Footer";
import Favorites from "./pages/List/Favorites";
import WatchList from "./pages/List/WatchList";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "movies", element: <Movies /> },
      { path: "movies/:id", element: <MovieDetails /> },
      { path: "tvseries", element: <TvSeries /> },
      { path: "tvseries/:id", element: <TvSeriesDetails /> },
      { path: "movies/search", element: <SearchResults /> },
      { path: "tvseries/search", element: <SearchResults /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <Register /> },
      { path: "favorites", element: <Favorites /> },
      { path: "watchlist", element: <WatchList /> },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={routes} />
      <Footer />
    </>
  );
}

export default App;
