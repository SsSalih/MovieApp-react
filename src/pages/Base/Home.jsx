import React from "react";
import SearchForm from "../../components/Base/SearchForm.jsx";
import "../../index.css";
import Movies from "../MoviePage/Movies.jsx";

const Home = () => {
  return (
    <>
      <div id="home">
        <div className="img-overley">
          <div className="container pt-5">
            <div className="row ">
              <div className="col-12 col-lg-6 col-md-4 text-center text-white my-auto mx-auto">
                <h2 className="h-5 ">Hos geldiniz!</h2>
                <p>kesfedillecek milyonlarca film</p>
                <SearchForm />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Movies />
    </>
  );
};

export default Home;
