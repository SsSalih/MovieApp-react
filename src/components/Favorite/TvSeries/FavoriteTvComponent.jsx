import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";

export default function AddToFavorite({ tvSeries }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState("");

  // 🧩 Token'dan userId çıkarma fonksiyonu
  const getUserId = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded._u || decoded.id || decoded.userId;
        return userId;
      } catch (error) {
        console.error("Token decode hatası:", error);
        return null;
      }
    }
    return null;
  };

  // 🧠 Dizi değiştiğinde state'i sıfırla ve favori kontrolü yap
  useEffect(() => {
    const resetState = () => {
      setError("");
      setIsFavorite(false);
    };

    resetState();

    if (!tvSeries?.id) return;
    checkIfFavorite();
  }, [tvSeries?.id]);

  // 💾 Favoriye ekleme
  const handleAddToFavorite = async (e) => {
    e.preventDefault();
    setError("");

    const userId = getUserId();
    if (!userId) {
      alert("Favorilere eklemek için giriş yapmalısınız.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const tvSeriesId =
        typeof tvSeries.id === "string" ? parseInt(tvSeries.id) : tvSeries.id;

      const requestBody = {
        userId: userId,
        mediaId: 0, // Backend bunu genelde ignore eder
        media: {
          externalApiId: tvSeriesId,
          mediaType: "tvSeries",
          title: tvSeries.name || tvSeries.title,
          posterPath: tvSeries.poster_path
            ? `https://image.tmdb.org/t/p/w500${tvSeries.poster_path}`
            : "",
          releaseYear: tvSeries.first_air_date
            ? parseInt(tvSeries.first_air_date.slice(0, 4))
            : 0,
        },
        externalApiId: tvSeriesId,
      };

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
      alert("Dizi favorilere eklendi!");
    } catch (error) {
      console.error("Hata:", error.response?.data || error);
      if (error.response?.status === 409) {
        alert("Bu dizi zaten favorilerinizde!");
      } else {
        alert("Favorilere eklenirken bir hata oluştu!");
      }
    }
  };

  // ❌ Favorilerden çıkarma
  const handleRemoveFavorite = async (e) => {
    e.preventDefault();
    setError("");

    const userId = getUserId();
    if (!userId) {
      alert("Kullanıcı bilgisi bulunamadı!");
      return;
    }

    try {
      const tvSeriesId =
        typeof tvSeries.id === "string" ? parseInt(tvSeries.id) : tvSeries.id;

      const token = localStorage.getItem("token");
      await axios.delete(
        `https://localhost:7112/api/addtolist/deletefav/${userId}/${tvSeriesId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setIsFavorite(false);
      alert("Dizi favorilerden çıkarıldı!");
    } catch (error) {
      console.error("Hata:", error);
      alert("Favorilerden çıkarılırken bir hata oluştu!");
    }
  };

  // 🔍 Favori kontrolü
  async function checkIfFavorite() {
    const userId = getUserId();
    if (!userId || !tvSeries) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://localhost:7112/api/addtolist/isFavorite/${userId}/${tvSeries.id}`,
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

  // 🖼️ Buton render kısmı
  return (
    <>
      {!isFavorite ? (
        <button
          className="btn btn-outline-light me-2"
          onClick={handleAddToFavorite}
        >
          <i className="bi bi-heart"></i> Favorilere Ekle
        </button>
      ) : (
        <button
          className="btn btn-danger me-2"
          onClick={handleRemoveFavorite}
        >
          <i className="bi bi-heart-fill"></i> Favorilerden Çıkar
        </button>
      )}
    </>
  );
}
