import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect } from "react";

export default function AddToFavorite({ movie }) {
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [error, setError] = React.useState("");

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

  useEffect(() => {
    if (movie && movie.id) checkIfFavorite();
  }, [movie?.id]);

  const handleAddToFavorites = async (e) => {
    e.preventDefault();
    setError("");

    const userId = getUserId();
    if (!userId) {
      alert("Favorilere eklemek için giriş yapmalısınız.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const movieId =
        typeof movie.id === "string" ? parseInt(movie.id) : movie.id;
      // DTO'ya uygun request body
      const requestBody = {
        userId: userId,
        media: {
          externalApiId: movieId,
          mediaType: "movie",
          title: movie.title,
          posterPath: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "",
          releaseYear: movie.release_date ? movie.release_date.slice(0, 4) : "",
        },
        externalApiId: movieId,
      };

      console.log("Favorilere ekleniyor:", requestBody);

      const response = await axios.post(
        "https://localhost:7112/api/addtolist/favorite",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Favorilere eklendi:", response.data);
      setIsFavorite(true);
      alert("Film favorilere eklendi!");
    } catch (error) {
      console.error("Hata:", error);
      if (error.response?.status === 409) {
        alert("Bu film zaten favorilerinizde!");
      } else {
        alert("Favorilere eklenirken bir hata oluştu!");
      }
    }
  };

  const handleRemoveFromFavorites = async (e) => {
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
        `https://localhost:7112/api/addtolist/deletefav/${userId}/${movieId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setIsFavorite(false);
      alert("Film favorilerden çıkarıldı!");
    } catch (error) {
      console.error("Hata:", error);
      alert("Favorilerden çıkarılırken bir hata oluştu!");
    }
  };

  async function checkIfFavorite() {
    const userId = getUserId();
    if (!userId || !movie) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://localhost:7112/api/addtolist/isFavorite/${userId}/${movie.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsFavorite(response.data);
    } catch (error) {
      console.error("Favori kontrol hatası:", error);
      if (error.response && error.response.status !== 404) {
        setIsFavorite(false);
      }
    }
  }

  return (
    <>
      {!isFavorite ? (
        <button
          className="btn btn-outline-light me-2"
          onClick={handleAddToFavorites}
        >
          <i className="bi bi-heart"></i> Favorilere Ekle
        </button>
      ) : (
        <button
          className="btn btn-danger me-2"
          onClick={handleRemoveFromFavorites}
        >
          <i className="bi bi-heart-fill"></i> Favorilerden Çıkar
        </button>
      )}
    </>
  );
}
