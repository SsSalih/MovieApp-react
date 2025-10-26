import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect } from "react";

export default function TvSeriesComponents({ tvSeries }) {
  const [isWatchListed, setIsWatchListed] = React.useState(false);
  const [error, setError] = React.useState("");

  const getUserId = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decode = jwtDecode(token);
        const userId = decode._u;

        return userId;
      } catch (error) {
        console.error("Token cozumleme hatasi", error);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    if (tvSeries && tvSeries.id) checkIfWatchListed();
  }, [tvSeries?.id]);

  const handleAddToWatchList = async (e) => {
    e.preventDefault();
    setError("");

    const userId = getUserId();

    if (!userId) {
      alert("izlenecek listesine eklemek icin giris yapmalisiniz");
      return;
    }

    try {
      const token = localStorage.getItem("tekon");
      const tvSeriesId =
        typeof tvSeries.id === "string" ? parseInt(tvSeries.id) : tvSeries.id;

      const requestBody = {
        UserId: userId,
        MediaId: 0,
        Media: {
          ExternalApiId: tvSeriesId,
          MediaType: "tvSeries",
          Title: tvSeries.title || tvSeries.name || "Unknown", // ✅ Title eklendi
          PosterPath: tvSeries.poster_path
            ? `https://image.tmdb.org/t/p/w500${tvSeries.poster_path}`
            : "",
          ReleaseYear: tvSeries.release_date
            ? parseInt(tvSeries.release_date.slice(0, 4))
            : 0,
        },
        ExternalApiId: tvSeriesId,
      };

      console.log("📤 Request Body:", JSON.stringify(requestBody, null, 2));
      console.log("📝 UserId:", userId);
      console.log("🎬 TvSeriesId:", tvSeriesId);

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

      console.log("Request Body:", JSON.stringify(requestBody, null, 2));

      console.log("İzlenecekler listesine eklendi:", response.data);
      setIsWatchListed(true);
      alert("eklendi");
    } catch (error) {
      alert("hata", error);
      console.error("❌ Error:", error);
      console.error("📋 Error Response:", error.response?.data);
      console.error("📊 Error Status:", error.response?.status);
      return;
    }
  };

  const hendleRemoveWatchList = async (e) => {
    e.preventDefault();

    const UserId = getUserId();
    if (!UserId) {
      alert("giris yapmalisiniz");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const tvSeriesId =
        typeof tvSeries.id === "string" ? parseInt(tvSeries.id) : tvSeries.id;

      const response = await axios.delete(
        `https://localhost:7112/api/addtolist/deleteWatchlist/${UserId}/${tvSeriesId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setIsWatchListed(false);
      alert("listeden cikaritldi");
    } catch (error) {
      console.error("Hata:", error);
      alert("İzlenecekler listesinden çıkarılırken bir hata oluştu!");
    }
  };

  async function checkIfWatchListed() {
    const userId = getUserId();
    if (!userId || !tvSeries) {
      alert("giris yapalisiniz");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `https://localhost:7112/api/addtolist/isWatchLatter/${userId}/${tvSeries.id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsWatchListed(response.data);
    } catch (error) {
      console.log("kontrol hatasi", error);
    }
    if (error.response && error.response.status !== 404) {
      setIsWatchListed(false);
    }
  }

  return (
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
          onClick={hendleRemoveWatchList}
        >
          <i className="bi bi-bookmark-fill"></i> İzleneceklerden Cikar
        </button>
      )}
    </>
  );
}
