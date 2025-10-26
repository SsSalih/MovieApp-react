import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect } from "react";


export default function AddtoWatchList({movie})
{
    const [isWatchListed, setIsWatchListed] = React.useState(false);
    const[error, setError] = React.useState("");


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

      useEffect(()=> {
        if(movie && movie.id) checkIfWatchListed();
      },[movie?.id]);

    const handleAddToWatchList = async (e) => {
    e.preventDefault();
    setError("");

    const userId = getUserId();
    if (!userId) {
      alert("İzlenecekler listesine eklemek için giriş yapmalısınız.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const movieId =
        typeof movie.id === "string" ? parseInt(movie.id) : movie.id;

      const requestBody = {
        UserId: userId,
        Media: {
          ExternalApiId: movieId,
          MediaType: "movie",
          Title: movie.title,
          PosterPath: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "",
          ReleaseYear: movie.release_date ? movie.release_date.slice(0, 4) : "",
        },
        ExternalApiId: movieId,
      };

      console.log("İzlenecekler listesine ekleniyor:", requestBody);

      const response = await axios.post(
        `https://localhost:7112/api/addtolist/watchlatter`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("İzlenecekler listesine eklendi:", response.data);
      setIsWatchListed(true);
      alert("Film izlenecekler listesine eklendi!");
    } catch (error) {
      console.error("Hata:", error);

      if (error.response?.status === 409) {
        alert("Bu film zaten izlenecekler listenizde!");
      } else {
        alert("İzlenecekler listesine eklenirken bir hata oluştu!");
      }
    }
  };

  const handleRemoveFromWatchList = async (e) => {
    e.preventDefault();
    setError("");
    const userId = getUserId();
    if (!userId) {
      alert("Kullanıcı bilgisi bulunamadı!");
      return;
    }
    try {
      const movieId =
        typeof movie.id === "string" ? parseInt(movie.id) : movie.id;

      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `https://localhost:7112/api/addtolist/deleteWatchlist/${userId}/${movieId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setIsWatchListed(false);
      alert("Film izlenecekler listesinden çıkarıldı!");
    } catch (error) {
      console.error("Hata:", error);
      alert("İzlenecekler listesinden çıkarılırken bir hata oluştu!");
    }
  };

  async function checkIfWatchListed() {
      const userId = getUserId();
      if (!userId || !movie) return;

      try {
        const token = localStorage.getItem("tekon");
        const response = await axios.get(
          `https://localhost:7112/api/addtolist/isWatchLatter/${userId}/${movie.id}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsWatchListed(response.data);
      } catch (error) {
        console.error("İzlenecekler listesi kontrol hatası:", error);
      }
      if (error.response && error.response.status !== 404) {
        setIsWatchListed(false);
      }
    };

    return(
        <>
        {!isWatchListed ? (
                    <button
                      className="btn btn-outline-light me-2"
                      onClick={handleAddToWatchList}
                    >
                      <i className="bi bi-bookmark"></i> İzlenecekler
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-light me-2"
                      onClick={handleRemoveFromWatchList}
                    >
                      <i className="bi bi-bookmark-fill"></i> İzleneceklerden
                      Cikar
                    </button>
                  )}
        </>
    )
}