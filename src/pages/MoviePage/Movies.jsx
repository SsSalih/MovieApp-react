import React, { useEffect, useState } from "react";
import Loading from "../../components/Base/Loading";
import ErrorMessage from "../../components/Base/ErrorMessage";
import Movie from "../../components/Movie/Movie";
import PagesButton from "../../components/Base/PagesButton";
import { useSearchParams } from "react-router";

const apiUrl = "https://api.themoviedb.org/3";
const api_key = "135659214988aec301827191f27aa1e2";

const language = "tr-TR";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);

  const page = searchParams?.get("page") || 1;

  useEffect(() => {
    async function getMovies() {
      try {
        const response = await fetch(
          `${apiUrl}/movie/popular?api_key=${api_key}&page=${page}&language=${language}`
        );

        if (!response.ok) {
          throw new Error("Hata oluştu");
        }

        const data = await response.json();

        if (data.results) {
          setMovies(data.results);
          setTotalPages(data.total_pages);
        }
        setError("");
      } catch (error) {
        setError(error.message);
      }

      setLoading(false);
    }

    getMovies();
  }, [searchParams]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <>
      <div className="my-0 ">
        <div className="card bg-dark text-light rounded-0">
          <div className="card-header">
            <h2 className="title h5 mb-0">Populer Filmler</h2>
          </div>
          <div className="card-body ">
            {movies.length == 0 ? (
              <div>Film bulunamadı</div>
            ) : (
              <div
                id="movie-list"
                className="row row-cols-3 row-cols-md-4 row-cols-lg-6 g-2"
              >
                {movies.map((m, index) => (
                  <Movie key={index} movieObj={m} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <PagesButton
        currentPage={parseInt(page)}
        totalPages={totalPages}
        onPageChange={(p) => setSearchParams({ page: p })}
      ></PagesButton>
    </>
  );
};

export default Movies;
