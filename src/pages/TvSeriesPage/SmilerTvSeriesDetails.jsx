import React, { useEffect } from "react";
import Loading from "..///../components/Base/Loading";
import ErrorMessage from "../../components/Base/ErrorMessage";
import TvSerie from "../../components/TvSeries/TvSerie";

const apiUrl = "https://api.themoviedb.org/3";
const api_key = "135659214988aec301827191f27aa1e2";

const language = "tr-TR";
const SmilerTvSeries = ({ tvSeriesId }) => {
  const [tvSeries, setTvSeries] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  useEffect(() => {
    async function getTvSeries() {
      try {
        const response = await fetch(
          `${apiUrl}/tv/${tvSeriesId}/similar?api_key=${api_key}&language=${language}&page=1`
        );

        if (!response.ok) {
          throw new Error("Hata oluştu");
        }

        const data = await response.json();
        setTvSeries(data.results || []);
        setError("");
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    getTvSeries();
  }, [tvSeriesId]);
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <>
      <div className="my-3">
        <div className="card bg-dark text-light">
          <div className="card-header ">
            <h2 className="title h5 mb-0 ">Benzer Diziler</h2>
          </div>
        
        <div className="card-body">
          {tvSeries.length === 0 ? (
            <div>Film bulunamadı</div>
          ) : (
            <div
              id="tvSeries-list"
              className="row row-cols-3 row-cols-md-4 row-cols-lg-6 g-2 "
            >
              {tvSeries.map((tv, index) => (
                <TvSerie key={index} tvObj={tv} />
              ))}
            </div>
          )}
        </div>
        </div>
      </div>
    </>
  );
};

export default SmilerTvSeries;
