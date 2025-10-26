import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Loading from "../../components/Base/Loading";
import ErrorMessage from "../../components/Base/ErrorMessage";
import SmilerMovie from "./SmilerMovie";
import TrailerPlayer from "../../components/Base/TrailerPlayer";

import AddToFavorite from "../../components/Favorite/Movie/FavoriteComponent";
import AddtoWatchList from "../../components/WatchList/Movie/MovieComponents";

const apiUrl = "https://api.themoviedb.org/3";
const api_key = "135659214988aec301827191f27aa1e2";
const language = "tr-TR";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTrailer, setShowTrailer] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatchListed, setIsWatchListed] = useState(false);

  

  useEffect(() => {
    async function getMovie() {
      try {
        const response = await fetch(
          `${apiUrl}/movie/${id}?api_key=${api_key}&language=${language}&append_to_response=credits`
        );

        if (!response.ok) {
          throw new Error("Film bilgisi alınamadı");
        }

        const data = await response.json();
        setMovie(data);
        setError("");
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    getMovie();
  }, [id]);

  useEffect(() => {
    const resetState = () => {
      setError("");
      setIsFavorite(false); // Favori durumunu varsayılana döndür (EN ÖNEMLİ KISIM)
      setShowTrailer(false); // Fragman oynatıcıyı kapat
    };
    resetState();
    if (!movie?.id) return; // movie boşsa veya id yoksa çalışmaz

    //* check if favorite

    <AddtoWatchList isWatchListed={isWatchListed} />;
    //check favorite()
    <AddToFavorite isFavorite={isFavorite} />;
  }, [movie?.id]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!movie) return null;

  // Yönetmen ve senarist bilgisi
  const director = movie.credits?.crew?.find((c) => c.job === "Director");
  const writers = movie.credits?.crew?.filter((c) => c.job === "Writer");

  
  console.log("Movie ID:", movie.id);

  return (
    <>
      <div
        className="w-100 text-white"
        style={{
          background: `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path}) no-repeat center center`,
          backgroundSize: "cover",
          minHeight: "500px",
        }}
      >
        <div className="bg-dark bg-opacity-50 h-100 py-4">
          <div className="container">
            <div className="row">
              {/* Poster */}
              <div className="col-md-3">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="img-fluid rounded shadow"
                />
              </div>

              {/* Detaylar */}
              <div className="col-md-9">
                <h2>
                  {movie.title}{" "}
                  <small className="text-muted">
                    ({movie.release_date?.slice(0, 4)})
                  </small>
                </h2>
                <p>
                  <strong>Çıkış Tarihi:</strong> {movie.release_date}
                </p>
                <p>
                  <strong>IMDB Puanı:</strong> {movie.vote_average?.toFixed(1)}
                </p>
                <p>
                  <strong>Süre:</strong> {movie.runtime} dakika
                </p>
                <p>
                  <strong>Yönetmen:</strong> {director?.name || "Bilgi yok"}
                </p>
                {writers?.length > 0 && (
                  <p>
                    <strong>Senaristler:</strong>{" "}
                    {writers.map((w) => w.name).join(", ")}
                  </p>
                )}

                {/* Butonlar */}
                <div className="mb-3">
                  <AddToFavorite
                    movie={movie}
                    isFavorite={isFavorite}
                    setIsFavorite={setIsFavorite}
                  />
                  <AddtoWatchList
                    movie={movie}
                    isWatchListed={isWatchListed}
                    setIsWatchListed={setIsWatchListed}
                  />
                  <button
                    className="btn btn-outline-light me-2"
                    onClick={() => setShowTrailer((prev) => !prev)}
                  >
                    <i className="bi bi-play"></i> Fragmanı Oynat
                  </button>
                  {showTrailer && <TrailerPlayer id={id} />}
                </div>

                {/* Özet */}
                <h5>Özet</h5>
                <p>{movie.overview}</p>

                {/* Türler */}
                <div className="mb-3">
                  {movie.genres?.map((genre) => (
                    <span
                      key={genre.id}
                      className="badge bg-primary me-2 mb-2 fs-6"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Oyuncular */}
            <div className="mt-5">
              <h4>Oyuncular</h4>
              <div className="col-6 col-md-4 col-lg-6">
                <div className="row g-3 img-fluid">
                  {movie.credits?.cast?.slice(0, 12).map((actor) => (
                    <div
                      className="col-4 col-md-2 mb-3 text-center"
                      key={actor.id}
                    >
                      <img
                        src={
                          actor.profile_path
                            ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                            : "https://via.placeholder.com/200x300?text=No+Image"
                        }
                        alt={actor.name}
                        className="img-fluid rounded-circle shadow"
                      />
                      <small className="d-block mt-1">{actor.name}</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-12 md-col-4 lg-col-8 g-3 img-fluid">
            <SmilerMovie movieId={id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieDetails;
