import React, { useEffect, useState } from "react";
import axios from "axios";
import Movie from "../../components/Movie/Movie";
import { jwtDecode } from "jwt-decode";

import FavoriteMovie from "../../components/Favorite/Movie/FavoriteMovie"
import FavoriteTvSeries from "../../components/Favorite/TvSeries/FavoriteTvSeries"

const apiUrl = "https://localhost:7112/api/addtolist/getfav";
const tmdbApiKey = "135659214988aec301827191f27aa1e2"; // TMDB API anahtarınızı buraya ekleyin
const tmdbBaseUrl = "https://api.themoviedb.org/3";

const Favorites = () => {
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [favoriteSeries, setFavoriteSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getUserId = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded._u || decoded.id || decoded.userId;
        console.log("Token decoded:", decoded);
        console.log("UserId extracted:", userId);
        return userId;
      } catch (error) {
        console.error("Token decode hatası:", error);
        return null;
      }
    }
    console.log("Token bulunamadı");
    return null;
  };

  const userId = getUserId();
  useEffect(() => {
    async function getFavorites() {
      try {
        setLoading(true);

        // Backend'den kullanıcının favorilerini al
        const response = await axios.get(`${apiUrl}/${userId}`);

        if (response.data.data && response.data.data.length > 0) {
          const movies = [];
          const series = [];

          // Her favori için TMDB'den detaylı bilgi al
          for (const item of response.data.data) {
            try {
              let tmdbResponse;

              if (item.media.mediaType === "movie") {
                console.log(
                  "Fetching movie with ID:",
                  item.media.externalApiId
                ); // BURAYA BAKIN
                tmdbResponse = await axios.get(
                  `${tmdbBaseUrl}/movie/${item.media.externalApiId}?api_key=${tmdbApiKey}&language=tr-TR`
                );

                movies.push(tmdbResponse.data);
              } else if (item.media.mediaType === "tvSeries") {
                tmdbResponse = await axios.get(
                  `${tmdbBaseUrl}/tv/${item.media.externalApiId}?api_key=${tmdbApiKey}&language=tr-TR`
                );
                series.push(tmdbResponse.data);
              }
            } catch (tmdbError) {
              console.error(
                `TMDB veri çekme hatası (${item.externalApiId}):`,
                tmdbError
              );
            }
          }

          setFavoriteMovies(movies);
          setFavoriteSeries(series);
        }

        setError("");
      } catch (error) {
        console.error("Favoriler yüklenirken hata:", error);
        setError("Favoriler yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      getFavorites();
    }
  }, [userId]);

  // Error durumu
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  // Normal render
  return (
    <div className="bg-dark">
      <div className="py-4 bg-dark">
        <div className="card m-3 bg-dark text-light border">
          {/* Header */}
          <div className="card-header">
            <h1 className="title h5 mb-0">Favori Filmler</h1>
            <p className="text-gray-400">
              {favoriteMovies.length} film listeleniyor
            </p>
          </div>

          {/* Film Grid veya Boş Durum */}
          {favoriteMovies.length > 0 ? (
            <div className="card-body m-2">
              <div className="row row-cols-3 row-cols-md-4 row-cols-lg-6 g-2 bg-dark">
                {favoriteMovies.map((movie, index) => (
                  <FavoriteMovie key={movie.externalApiId || index} movie={movie} />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-dark">
              <div className="text-6xl mb-4">🎬</div>
              <h2 className="text-2xl font-semibold mb-2">
                Henüz favori eklenmemiş
              </h2>
              <p className="text-gray-400">
                Beğendiğiniz filmleri favorilere ekleyerek buradan kolayca
                ulaşabilirsiniz
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="py-4">
        <div className="card m-3  bg-dark text-light border">
          {/* Header */}
          <div className="card-header">
            <h1 className="title h5 mb-0">Favori Diziler</h1>
            <p className="text-gray-400">
              {favoriteMovies.length} diziler listeleniyor
            </p>
          </div>

          {/* Film Grid veya Boş Durum */}
          {favoriteSeries.length > 0 ? (
            <div className="card-body m-2">
              <div className="row row-cols-3 row-cols-md-4 row-cols-lg-6 g-2">
                {favoriteSeries.map((movie, index) => (
                  <FavoriteTvSeries key={movie.externalApiId || index} movie={movie} />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="text-6xl mb-4">🎬</div>
              <h2 className="text-2xl font-semibold mb-2">
                Henüz favori eklenmemiş
              </h2>
              <p className="text-gray-400">
                Beğendiğiniz filmleri favorilere ekleyerek buradan kolayca
                ulaşabilirsiniz
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
