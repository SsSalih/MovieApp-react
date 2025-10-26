import React, { useEffect, useState } from "react";
import Loading from "../../components/Base/Loading.jsx";
import ErrorMessage from "../../components/Base/ErrorMessage.jsx";
import Movie from "../../components/Movie/Movie.jsx";
import { useSearchParams, useLocation } from "react-router";
import PagesButton from "../../components/Base/PagesButton.jsx";

const apiUrl = "https://api.themoviedb.org/3";
const api_key = "135659214988aec301827191f27aa1e2";
const language = "tr-TR";

const SearchParams = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);

  const query = searchParams.get("query");
  const page = searchParams.get("page") || 1;

  const [result, setResult] = useState();
  const location = useLocation();

  const isMovieRoute = location.pathname.startsWith("/movies");
  const endPoint = isMovieRoute ? "search/movie" : "search/tv";

  useEffect(() => {
    async function fetchResult() {
      try {
        const response = await fetch(
          `${apiUrl}/${endPoint}?api_key=${api_key}&query=${query}&page=${page}&language=${language}`
        );

        if (!response.ok) {
          throw new Error("Hata oluştu");
        }

        const data = await response.json();

        if (data.results) {
          setResult(data.results);
          setTotalPages(data.total_pages);
        }
        setError("");
      } catch (error) {
        setError(error.message);
      }

      setLoading(false);
    }

    fetchResult();
  }, [searchParams, endPoint]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <>
      <div className="my-3">
        <div className="card">
          <div className="card-header">
            <h2 className="title h5 mb-0">
              {isMovieRoute ? "Film Arama Sonuçları" : "Dizi Arama Sonuçları"}
            </h2>
          </div>
          <div className="card-body">
            {result.length === 0 ? (
              <div>Sonuç bulunamadı</div>
            ) : (
              <div className="row row-cols-3 row-cols-md-4 row-cols-lg-6 g-2">
                {result.map((item, index) => (
                  <Movie key={index} movieObj={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <PagesButton
        currentPage={parseInt(page)}
        totalPages={totalPages}
        onPageChange={(p) => setSearchParams({ query, page: p })}
      ></PagesButton>
    </>
  );
};

export default SearchParams;
