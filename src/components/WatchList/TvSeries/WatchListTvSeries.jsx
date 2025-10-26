import { Link } from "react-router";

export default function WatchListTvSeries({tvObj}){
     return (
    <div className="col">
      <div className="card position-relative h-100 bg-secondary text-light">
        <Link to={`/tvSeries/${tvObj.id}`}>
          <div
            key={tvObj.id}
            className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            <img
              src={
                tvObj.poster_path
                  ? `https://image.tmdb.org/t/p/w500${tvObj.poster_path}`
                  : "https://via.placeholder.com/500x750?text=No+Image"
              }
              alt="daha sonra izle favorileri"
              className="w-full h-auto"
            />
          </div>
        </Link>
        <div className="">
          <h2 className="h6 card-title">{}</h2>
          {tvObj.vote_average && (
            <small className="text-muted">
              ⭐ {tvObj.vote_average.toFixed(1)}
            </small>
          )}
        </div>
      </div>
    </div>
  );
}