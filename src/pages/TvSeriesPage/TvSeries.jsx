import React, { useEffect } from "react";
import Loading from "../../components/Base/Loading";
import ErrorMessage from "../../components/Base/ErrorMessage";
import PagesButton from "../../components/Base/PagesButton";
import { useSearchParams } from "react-router";
import TvSerie from "../../components/TvSeries/TvSerie";

const apiUrl = "https://api.themoviedb.org/3";
const api_key = "135659214988aec301827191f27aa1e2";

const language = "tr-TR";
const TvSeries = () => {
  const [tvSeries, setTvSeries] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = React.useState(1);

  const page = searchParams?.get("page") || 1;

  useEffect(() => {
    async function getTvSeries() {
      try {
        const resposne = await fetch(
          `${apiUrl}/tv/popular?api_key=${api_key}&page=${page}&language=${language}`
        );
        if (!resposne.ok) {
          throw new Error("Hata oluştu");
        }
        const data = await resposne.json();

        if (data.results) {
          setTvSeries(data.results);
          setTotalPages(data.total_pages);
        }
        setError("");
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    }
    getTvSeries();
  }, [searchParams]);
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <>
      <div className="m-0 bg-dark">
        
          <div
            style={{ border: "0px" }}
            className="card-header bg-dark text-light p-4 "
          >
            <h2 className="title h5 mb-0 ">Popüler Diziler</h2>
          </div>
        
        <div className="card-body">
          <div className="container-fluid px-4">
            {tvSeries.length === 0 ? (
              <div>Film bulunamadı</div>
            ) : (
              <div
                id="movie-list"
                className="row row-cols-3 row-cols-md-4 row-cols-lg-6 g-2"
              >
                {tvSeries.map((tv, index) => (
                  <TvSerie key={index} tvObj={tv} />
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

export default TvSeries;
