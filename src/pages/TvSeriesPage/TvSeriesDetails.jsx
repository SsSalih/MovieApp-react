import { useEffect, useState } from "react";
import Loading from "../../components/Base/Loading";
import ErrorMessage from "../../components/Base/ErrorMessage";
import { useParams } from "react-router";
import SmilerTvSeriesDetails from "./SmilerTvSeriesDetails";
import TrailerPlayer from "../../components/Base/TrailerPlayer";
import FavoriteTvComponent from "../../components/Favorite/TvSeries/FavoriteTvComponent"
import TvSeriesComponents from "../../components/WatchList/TvSeries/TvSeriesComponent";

const apiUrl = "https://api.themoviedb.org/3";
const api_key = "135659214988aec301827191f27aa1e2";
const language = "tr-TR";

const TvSeriesDetails = () => {
  const { id } = useParams();
  const [error, setError] = useState("");
  const [tvSeriesDetails, setTvSeriesDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [IsWatchListed, setIsWatchListed] = useState(false);

  useEffect(() => {
    async function getTvSeriesDetails() {
      try {
        const response = await fetch(
          `${apiUrl}/tv/${id}?api_key=${api_key}&language=${language}&append_to_response=credits`
        );

        if (!response.ok) {
          throw new Error("Dizi bilgisi alınamadı");
        }

        const data = await response.json();
        setTvSeriesDetails(data);
        setError("");
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    getTvSeriesDetails();
  }, [id]);

   useEffect(() => {
    setError("");
    setTvSeriesDetails(null);
    setLoading(true);
    setShowTrailer(false);
    setIsFavorite(false);
    setIsWatchListed(false);
  }, [id]);
  useEffect(() => {
      const resetState = () => {
        setError("");
        setIsFavorite(false); // Favori durumunu varsayılana döndür (EN ÖNEMLİ KISIM)
        setShowTrailer(false); // Fragman oynatıcıyı kapat
      };
      resetState();
      if (!tvSeriesDetails?.id) return; // movie boşsa veya id yoksa çalışmaz
  
      //* check if favorite
  
      //<AddtoWatchList isWatchListed={isWatchListed} />;
      //check favorite()
      <FavoriteTvComponent isFavorite={isFavorite} />;
    }, [tvSeriesDetails?.id]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  return (
    <>
      <div
        className="w-100 text-white"
        style={{
          background: `url(https://image.tmdb.org/t/p/original/${tvSeriesDetails.backdrop_path}) no-repeat center center`,
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
                  src={`https://image.tmdb.org/t/p/w500${tvSeriesDetails.poster_path}`}
                  alt={tvSeriesDetails.title}
                  className="img-fluid rounded shadow"
                />
              </div>

              {/* Detaylar */}
              <div className="col-md-9">
                <h2>
                  {tvSeriesDetails.name}{" "}
                  <small className="text-muted">
                    ({tvSeriesDetails.first_air_date?.slice(0, 4)})
                  </small>
                </h2>
                <p>
                  <strong>Çıkış Tarihi:</strong>{" "}
                  {tvSeriesDetails.first_air_date}
                </p>
                <p>
                  <strong>IMDB Puanı:</strong>{" "}
                  {tvSeriesDetails.vote_average?.toFixed(1)}
                </p>
                <p>
                  <strong>Süre:</strong> {tvSeriesDetails.episode_run_time}{" "}
                  dakika
                </p>
                <p>
                  <strong>Yönetmen:</strong>{" "}
                  {tvSeriesDetails.credits?.crew?.find(
                    (person) => person.job === "Director"
                  )?.name || "Bilgi yok"}
                </p>
                {tvSeriesDetails.credits?.crew?.filter(
                  (person) =>
                    person.job === "Writer" || person.job === "Screenplay"
                ).length > 0 && (
                  <p>
                    <strong>Senaristler:</strong>{" "}
                    {tvSeriesDetails.credits.crew
                      .filter(
                        (person) =>
                          person.job === "Writer" || person.job === "Screenplay"
                      )
                      .map((w) => w.name)
                      .join(", ")}
                  </p>
                )}

                {/* Butonlar */}
                <div className="mb-3">
                  <FavoriteTvComponent
                  tvSeries={tvSeriesDetails}
                  isFavorite={isFavorite}
                  setIsFavorite= {setIsFavorite}

                  />
                  <TvSeriesComponents
                   tvSeries={tvSeriesDetails} 
                   isWatchListed={isFavorite}
                   setIsWatchListed = {setIsFavorite}
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
                <p>{tvSeriesDetails.overview}</p>

                {/* Türler */}
                <div className="mb-3">
                  {tvSeriesDetails.genres?.map((genre) => (
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
                  {tvSeriesDetails.credits?.cast?.slice(0, 12).map((actor) => (
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
            {<SmilerTvSeriesDetails tvSeriesId={id} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default TvSeriesDetails;
