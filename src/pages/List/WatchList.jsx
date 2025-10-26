import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import Loading from "../../components/Base/Loading";
import axios from "axios";

import WatchListMovie from "../../components/WatchList/Movie/WatchListMovie";
import WatchListTvSeries from "../../components/WatchList/TvSeries/WatchListTvSeries";

const apiUrl = "https://localhost:7112/api/addtolist";
const tmdbApiKey = "135659214988aec301827191f27aa1e2";
const tmdbBaseUrl = "https://api.themoviedb.org/3";

export default function WatchList() {
  const [loading, setLoading] = useState(true);
  const [WatchListMovies, setWatchListMovies] = useState([]);
  const [WatchListMoviesTv, setWatchListMoviesTv] = useState([]);

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
    async function getWatchList() {
      try {
        setLoading(true);

        // Doğru API URL yapısı
        const response = await axios.get(`${apiUrl}/getwatch/${userId}`);
        console.log("API Response:", response.data);

        if (response.data.data && response.data.data.length > 0) {
          const movies = [];
          const series = [];

          for (const item of response.data.data) {
            try {
              let tmdbResponse;

              if (item.media.mediaType === "movie") {
                console.log(
                  "Fetching movie with ID:",
                  item.media.externalApiId
                );
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
            } catch (error) {
              console.error("Watchlist öğesi yükleme hatası:", error);
            }
          }

          setWatchListMovies(movies);
          setWatchListMoviesTv(series);
        }
      } catch (error) {
        console.error("Watchlist yükleme hatası:", error);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      getWatchList();
    } else {
      setLoading(false);
    }
  }, [userId]);

  if (loading) {
    return <Loading />;
  }

  const totalItems = WatchListMovies.length + WatchListMoviesTv.length;

  if (totalItems === 0) {
    return (
      <div className="watchlist-empty" style={{ padding: 20 }}>
        <h2>İzleme Listeniz Boş</h2>
        <p>
          Film veya dizi eklemek için detay sayfasında "Watch" butonunu
          kullanın.
        </p>
        <Link to="/">Ana sayfaya dön</Link>
      </div>
    );
  }

  return (
    <div
      className="watchlist-container bg-dark text-light"
      style={{ padding: 20 }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2>İzleme Listesi ({totalItems})</h2>
      </div>
      <div className="card m-0">
        <div className="card-body bg-dark text-light">
          <h2>Filmler</h2>
          {/* Filmler Bölümü */}
          {WatchListMovies.length > 0 ? (
            <div className="card-body">
              <div className="row row-cols-3 row-cols-md-4 row-cols-lg-6 g-2">
                {WatchListMovies.map((movie, index) => (
                  <WatchListMovie
                    key={movie.externalApiId || index}
                    movieObj={movie}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="text-6xl mb-4">🎬</div>
              <h2 className="text-2xl font-semibold mb-2">
                Henüz daha sonra izle eklenmemiş
              </h2>
              <p className="text-gray-400">
                Beğendiğiniz filmleri daha sonra izle ekleyerek buradan kolayca
                ulaşabilirsiniz
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="card my-3">
        <div className="card-body bg-dark text-light">
          {/* Diziler Bölümü */}
          <h2>Diziler</h2>
          {WatchListMoviesTv.length > 0 ? (
            <div className="card-body">
              <div className="row row-cols-3 row-cols-md-4 row-cols-lg-6 g2">
                {WatchListMoviesTv.map((tv, index) => (
                  <WatchListTvSeries
                    key={tv.externalApiId || index}
                    tvObj={tv}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="text-6xl mb-4">🎬</div>
              <h2 className="text-2xl font-semibold mb-2">
                Henüz daha sonra izle eklenmemiş
              </h2>
              <p className="text-gray-400">
                Beğendiğiniz filmleri daha sonra izle ekleyerek buradan kolayca
                ulaşabilirsiniz
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
