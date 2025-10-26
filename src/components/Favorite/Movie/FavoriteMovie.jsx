import { Link } from "react-router";

export default function Favorite({ movie }) {
  const title = movie.title || movie.name || "Bilinmeyen Başlık";
  return (
    <div className="col">
      <div className="card movie position-relative h-100 bg-secondary text-light">
        <Link to={`/movies/${movie.id}`}>
          <div
            key={movie.id}
            className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "https://via.placeholder.com/500x750?text=No+Image"
              }
              alt={title}
              className="w-full h-auto"
            />
          </div>
        </Link>

        <div className="">
          <h2 className="h6 card-title">{}</h2>
          {movie.vote_average && (
            <small className="text-muted">
              ⭐ {movie.vote_average.toFixed(1)}
            </small>
          )}
        </div>
      </div>
    </div>
  );
}
