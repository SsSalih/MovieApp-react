import { Link } from "react-router";

export default function TvSerie({ tvObj }) {
  return (
    <div className="col">
      <div className="card position-relative h-100 bg-secondary rounded-3 p-0">
        <Link to={`/tvseries/${tvObj.id}`}>
          <img
            src={"https://image.tmdb.org/t/p/original/" + tvObj.poster_path}
            alt=""
            className="card-img-top p-2"
          />
        </Link>

        <div className="card-body">
          <h2 className="h6 card-title">{tvObj.name}</h2>
          {tvObj.vote_average && (
            <small className="text-muted">
              ⭐ {tvObj.vote_average.toFixed(1)}
            </small>)}
        </div>
      </div>
    </div>
  );
}
