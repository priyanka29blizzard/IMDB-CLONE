import React, { useEffect, useState } from "react";

import axios from "axios";

import Pagination from "./Pagination";

function Movies() {
  const [movies, setMovies] = useState([]);

  const [pageNum, setPageNum] = useState(1);

  const [watchList, setWatchList] = useState([]);

  const [hovered, setHovered] = useState("");

  //Pagination Methods
  const onNext = () => {
    setPageNum(pageNum + 1);
  };

  const onPrev = () => {
    if (pageNum > 1) {
      setPageNum(pageNum - 1);
    }
  };

  //WatchList Handlers

  const addToWatchList = (movie) => {
    const newWatchList = [...watchList, movie];
    setWatchList(newWatchList);
    localStorage.setItem("imdb", JSON.stringify(newWatchList));
  };

  const removeFromWatchList = (movie) => {
    const filteredWatchList = watchList.filter((m) => {
      return m.id !== movie.id;
    });

    setWatchList(filteredWatchList);
    localStorage.setItem("imdb", JSON.stringify(filteredWatchList));
  };

  //Hovering on movie card

  const showButton = (id) => {
    setHovered(id);
  };

  const hideButton = () => {
    setHovered("");
  };

  useEffect(() => {
    (function () {
      let moviesFromLS = localStorage.getItem("imdb");
      moviesFromLS = JSON.parse(moviesFromLS) || [];
      setWatchList(moviesFromLS);

      axios
        .get(
          ` https://api.themoviedb.org/3/trending/movie/day?api_key=d42223835804f3ae060b28700e90f6b6&page=${pageNum}`
        )
        .then((res) => {
          setMovies(res.data.results);
        });
    })();
  }, [pageNum]);

  //  console.log(movies)

  return (
    <div>
      <div className="text-2xl mb-8 font-bold text-center">Trending Movies</div>

      <div className="flex flex-wrap">
        {movies.map((movie) => {
          return (
            <div
              onMouseOver={() => showButton(movie.id)}
              onMouseLeave={() => hideButton()}
              key={movie.id}
              className="w-[200px] h-[35vh] bg-center bg-cover rounded-xl m-4 md:h[40vh] md:w[200px] hover:scale-110 duration-300 relative flex items-end "
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original/t/p/w500/${movie.poster_path})`,
              }}
            >
              <div
                className=" text-3xl p-1 absolute right-0  top-0 "
                style={{ display: hovered === movie.id ? "block" : "none" }}
              >
                {watchList.includes(movie) === false ? (
                  <div
                    onClick={() => {
                      addToWatchList(movie);
                    }}
                  >
                    {" "}
                    🤍
                  </div>
                ) : (
                  <div onClick={() => removeFromWatchList(movie)}>❤️</div>
                )}
              </div>

              <div className="text-white font-bold text-center w-full bg-gray-900 bg-opacity-60">
                {movie.title}
              </div>
            </div>
          );
        })}
      </div>

      <Pagination
        pageNumProp={pageNum}
        onNextProp={onNext}
        onPrevProp={onPrev}
      />
    </div>
  );
}

export default Movies;
