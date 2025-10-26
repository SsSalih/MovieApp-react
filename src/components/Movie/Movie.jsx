import { Link, useLocation } from "react-router";

export default function Movie({ movieObj }) {
  const location = useLocation();

  const isMovieRoute = location.pathname.startsWith("/tvseries");
  const endPoint = isMovieRoute ? "/tvseries" : "/movies";

  const title = movieObj.title || movieObj.name;
  return (
    <div className="col">
      <div className="card movie position-relative h-100  bg-secondary text-light rounded-3 p-0">
        <Link to={`${endPoint}/${movieObj.id}`}>
          <img
            src={
              movieObj.poster_path
                ? `https://image.tmdb.org/t/p/w500${movieObj.poster_path}`
                : "https://via.placeholder.com/500x750?text=No+Image"
            }
            alt={title}
            className="card-img-top p-2"
          />
        </Link>

        <div className="card-body">
          <h2 className="h6 card-title">{title}</h2>
          {movieObj.vote_average && (
            <small className=" text-light">
              ⭐ {movieObj.vote_average.toFixed(1)}
            </small>
          )}
        </div>
      </div>
    </div>
  );
}
