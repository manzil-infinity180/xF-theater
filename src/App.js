import { useEffect, useState } from "react";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState('');
  const [query, setQuery] = useState("");


  const KEY = 'd21d995b';
  const tempquery ='avengers';
  // this type of  code inside the render  logic will cause and infinite re-render of code and prevent for that we 
  // use ---> useEffect which contain the function and an dependency array 
  // fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=avengers`).then((res)=> res.json()).then((data)=> console.log(data));

  // useEffect - which takes 2 arguments first is function and second is dependency array 
  // here is [] means only run on first mount 
  useEffect(function(){
     console.log("A");
  },[]);
  useEffect(function(){
    console.log("B");
  });
  console.log("C");
  useEffect(function(){
    console.log("D")
  },[query]);

  useEffect(function(){
   

      async function fetchMovie(){
        try{
        setLoading(true);
        setError("");
        
        const res = await fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`);
        // internet connectivity (poor)
        if(!res.ok){
          throw new Error('Something went wrong with fetching movies');
        }
        

        const data = await res.json();
        // no movies found 
        if(data.Response ==='False') {
          throw new Error(data.Error);
        }
        setMovies(data.Search);
        console.log(data);
        
        // setLoading(false);
      }catch(err){
           console.error(err.message);
           setError(err.message);
      }finally{
        setLoading(false);
      }
    }
    if(query.length < 3){
      setMovies([]);
      setError("");
      return;
    }
    fetchMovie();
  },[query]);

  return (
    <>
      <Navbar>
          <Logo />
          <Search query={query} setQuery={setQuery}/>
          <NumResult movies={movies}/>
      </Navbar>

      <Main movies={movies}>
          <Box>
            {/* {loading? <Loader /> : <MovieList movies={movies} />} */}
            {loading && <Loader />}
            {! loading && !error && <MovieList movies={movies} />}
            {error && <ErrorMessage message={error}/>}
          </Box>

          <Box>
            <WatchedSummary watched={watched}/>
            <WatchedMovieList watched={watched} /> 
          </Box>
      </Main>

    </>
  );
}
function ErrorMessage({message}){
  return <p className="error">
    <span>{message}</span>
  </p>
}
function Loader(){
  return <p className="loader">Loading....</p>
}

function Navbar ({children}){
  return ( 
      <nav className="nav-bar">
          {children}
      </nav>
        );
  }
function Search({query,setQuery}){
  
  return <input
  className="search"
  type="text"
  placeholder="Search movies..."
  value={query}
  onChange={(e) => setQuery(e.target.value)}
/>
}
function Logo(){
  return <div className="logo">
  <span role="img">🍿</span>
  <h1>usePopcorn</h1>
</div>
}
function NumResult({movies}){
  return  <p className="num-results">
  Found <strong>{movies.length}</strong> results
</p>
}

function Main({children}){
  return <>
  <main className="main">
   {children}
      </main>
  </>
}
function Box({children}){
  const [isOpen, setIsOpen] = useState(true);
     return  <div className="box">
          <button
            className="btn-toggle"
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? "–" : "+"}
          </button>
          {isOpen && (
            children
          )}
        </div>
}

/* 
---> Component Composition 
--> WatchedList & ListBox have same pattern of code so 
we refractor it and make it usable for both 

function WatchedList({children}){
  const [isOpen2, setIsOpen2] = useState(true);
  return <div className="box">
  <button
    className="btn-toggle"
    onClick={() => setIsOpen2((open) => !open)}
  >
    {isOpen2 ? "–" : "+"}
  </button>
  {isOpen2 && (
    <>
      {children}
    </>
  )}
</div>
}
*/

function MovieList ({movies}){

  return <ul className="list">
  {movies?.map((movie) => (
   < MovieItem movie={movie} key={movie.imdbID}/>
  ))}
</ul>
}

function MovieItem ({movie}) {
  return  <>
  <li key={movie.imdbID}>
  <img src={movie.Poster} alt={`${movie.Title} poster`} />
  <h3>{movie.Title}</h3>
  <div>
    <p>
      <span>🗓</span>
      <span>{movie.Year}</span>
    </p>
  </div>
</li>
</>

}
function WatchedSummary ({watched}){
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return <div className="summary">
  <h2>Movies you watched</h2>
  <div>
    <p>
      <span>#️⃣</span>
      <span>{watched.length} movies</span>
    </p>
    <p>
      <span>⭐️</span>
      <span>{avgImdbRating}</span>
    </p>
    <p>
      <span>🌟</span>
      <span>{avgUserRating}</span>
    </p>
    <p>
      <span>⏳</span>
      <span>{avgRuntime} min</span>
    </p>
  </div>
</div>
}
function WatchedMovieList({watched}){
  return  <ul className="list">
  {watched.map((movie) => (
   <WatchList movie={movie}  key={movie.imdbID}/>
  ))}
</ul>
}

function WatchList({movie}){
  return <>
   <li key={movie.imdbID}>
                    <img src={movie.Poster} alt={`${movie.Title} poster`} />
                    <h3>{movie.Title}</h3>
                    <div>
                      <p>
                        <span>⭐️</span>
                        <span>{movie.imdbRating}</span>
                      </p>
                      <p>
                        <span>🌟</span>
                        <span>{movie.userRating}</span>
                      </p>
                      <p>
                        <span>⏳</span>
                        <span>{movie.runtime} min</span>
                      </p>
                    </div>
                  </li>
  </>
}