import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

const apiUrl = "https://api.themoviedb.org/3";
const api_key = "135659214988aec301827191f27aa1e2";
const language = "en-US";

function TrailerPlayer({ id }) {
  const location = useLocation();

  const [videoKey, setVideoKey] = useState(null);
  const isMovieRoute = location.pathname.startsWith("/tvseries");
  const endPoint = isMovieRoute ? "/tv" : "/movie";

  useEffect(() => {
    async function getVideos() {
      try {
        const response = await fetch(
          `${apiUrl}${endPoint}/${id}/videos?api_key=${api_key}&language=${language}`
        );

        if (!response.ok) {
          throw new Error("Bir hata oluştu");
        }

        const data = await response.json();

        // YouTube fragmanı bul
        const trailer = data.results.find((v) => v.site === "YouTube");
        if (trailer) {
          setVideoKey(trailer.key);
        }
      } catch (err) {
        console.error(err);
      }
    }
    getVideos();
  }, [id, endPoint]);

  if (!videoKey)
    return (
      <>
        <p>Fragman bulunamadı</p>
      </>
    );

  return (
    <div className="ratio ratio-16x9 mt-3">
      <iframe
        src={`https://www.youtube.com/embed/${videoKey}`}
        title="Fragman"
        allowFullScreen
      ></iframe>
    </div>
  );
}

export default TrailerPlayer;
