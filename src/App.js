import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovie } from "./useMovie";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";
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
  
  const [query, setQuery] = useState("");
  const [selectedId,setSelectedId]=useState("");
  
  // const [watched, setWatched] = useState([]);
  // useState() with the callback function (must be a pure function with no argument function)

  // useLocalStorageState custom hooks 
  const [watched,setWatched] = useLocalStorageState([],'watched');

  
  const KEY = 'd21d995b';
  const tempquery ='avengers';
  // this type of  code inside the render  logic will cause and infinite re-render of code and prevent for that we 
  // use ---> useEffect which contain the function and an dependency array 
  // fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=avengers`).then((res)=> res.json()).then((data)=> console.log(data));

  // useEffect - which takes 2 arguments first is function and second is dependency array 
  // here is [] means only run on first mount 
  // * useEffect - with different ** Dependency array **
  /* 
  // on mount 
  useEffect(function(){
     console.log("A");
  },[]);

  useEffect(function(){
    console.log("B");
  });

  console.log("C");

   // on touching query 
  useEffect(function(){
    console.log("D")
  },[query]);

  Output : C A B D (first it will render and browser paint then Effect will trigger)
  */

  // custom hook (useMovie)
  const {movies,loading,error} = useMovie(query);

  function handleSelectedId(id){
   setSelectedId(selectedId => selectedId === id ? null : id);
  }
  function handleCloseMovie(){
    setSelectedId(null);
  }
  function handleWatchedMovie(movie){
    setWatched((watched)=> [...watched,movie]);
  }
  function handleDeleteId(id){
    setWatched((watched)=> watched.filter((movie)=>movie.imbdId!==id))
  }
  
  
  
 

  

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
            {! loading && !error && <MovieList movies={movies} onSelectedMovie={handleSelectedId} />}
            {error && <ErrorMessage message={error}/>}
          </Box>

          <Box>
            {
            selectedId ? <MovieDetails selectedId={selectedId} onCloseMovie={handleCloseMovie} 
            addWatchedMovie={handleWatchedMovie}
            watched={watched}/> :
            <>
            <WatchedSummary watched={watched}/>
            <WatchedMovieList watched={watched} onDeleteWatched={handleDeleteId} /> 
            </>
            }
          </Box>
      </Main>

    </>
  );
}

function MovieDetails({selectedId,onCloseMovie,addWatchedMovie,watched}){
  const [movie,setMovie] = useState({});
  const [loading,setLoading] = useState(false);
  const [userRating,setUserRating] = useState('');
  const isWatched = watched.map((movie)=> movie.imbdId).includes(selectedId);

  const countRef = useRef(0);

  useEffect(function(){
     countRef.current = countRef.current + 1;
  },[userRating]);

  const KEY = 'd21d995b'; // omdb api key 
  const {Title:title,
    Year:year,
    Poster: poster,Runtime: runtime,
    imdbRating,
    Plot:plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre} = movie;

function handleAddWatchedMovieList(){
  const watched = {
    imbdId : selectedId,
    title,
    year,
    poster,
    imdbRating : Number(imdbRating),
    runtime: Number(runtime.split(' ').at(0)),
    userRating,
    countRatingDecision: countRef.current,
  }
  addWatchedMovie(watched);
  onCloseMovie();
}
// Close the selected movie on key pressed -> escape key
 useKey('Escape',onCloseMovie);

// movie data fetching 
  useEffect(function(){
    async function fetchMovieDetails(){
      try{
        setLoading(true);
         const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
         const data = await res.json();
         console.log(data);
         setLoading(false);
         setMovie(data);
      }catch(err){
         console.log(err.message);
      }

    }
    fetchMovieDetails();

  },[selectedId])

  useEffect(function(){
    if(!title) return;
    document.title = `Movie | ${title}`;

    // cleanup function 
    return function(){
      document.title = 'XfThreater';
    }
    
  },[title]);

  

  return <div className="details">
    {loading ? <Loader /> : 
    <>
    <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
             
                {  !isWatched? <>
                  <StarRating
                  maxRating={10}
                  size={24}
                  onSetRating={setUserRating}
                />
                {/* {userRating > 0 && <button className="btn-add" onClick={handleAddWatchedMovieList} >+ Add to List</button>} */}
                <button className="btn-add" onClick={handleAddWatchedMovieList} >+ Add to List</button>
                </> : <p>You Already Rated!!!</p>}
                 </div>
             <p>   
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>

          </>}
  </div>
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

  const inputEl = useRef(null);
  useEffect(function(){
    inputEl.current.focus(); // DOM ele => inputEl.current
    console.log(inputEl);
    console.log(inputEl.current);
  },[]);

  // useEffect(function(){
  //   const el = document.querySelector('.search');
  //   el.focus();
  //   console.log(el);
  // },[]);
  
  // clicking enter key it will focus and delete the contain from the search bar 

  useKey('Enter',function(){
    if(document.activeElement === inputEl.current) return;
    setQuery("");
        inputEl.current.focus();
  })

  // useEffect(function(){
  //   function callBack(e){
  //     // selecting the active element (dom)
     
  //     if(e.code==='Enter'){
  //       if(document.activeElement === inputEl.current) return;
  //       setQuery("");
  //       inputEl.current.focus();
  //     }
  //   }
  //   document.addEventListener('keypress',callBack);

  //   return ()=>{
  //     document.removeEventListener('keypress',callBack);
  //   }

  // },[setQuery]);
  
  

  return <input
  className="search"
  type="text"
  placeholder="Search movies..."
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  ref={inputEl}
/>
}
function Logo(){
  return <div className="logo">
  <span role="img">🍿</span>
  <h1>Xf Threater</h1>
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

function MovieList ({movies,onSelectedMovie}){

  return <ul className="list list-movies">
  {movies?.map((movie) => (
   < MovieItem movie={movie} key={movie.imdbID} onSelectedMovie={onSelectedMovie}/>
  ))}
</ul>
}

function MovieItem ({movie,onSelectedMovie}) {
  return  <>
  <li key={movie.imdbID} onClick={()=> onSelectedMovie(movie.imdbID)}>
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
      <span>{avgImdbRating.toFixed(2)}</span>
    </p>
    <p>
      <span>🌟</span>
      <span>{avgUserRating.toFixed(2)}</span>
    </p>
    <p>
      <span>⏳</span>
      <span>{avgRuntime} min</span>
    </p>
  </div>
</div>
}
function WatchedMovieList({watched,onDeleteWatched}){
  return  <ul className="list">
  {watched.map((movie) => (
   <WatchList movie={movie}  key={movie.imdbID} onDeleteWatched={onDeleteWatched}/>
  ))}
</ul>
}

function WatchList({movie,onDeleteWatched}){
  return <>
   <li key={movie.imdbID}>
                    <img src={movie.poster} alt={`${movie.title} poster`} />
                    <h3>{movie.title}</h3>
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
                      <button className="btn-delete" onClick={()=>onDeleteWatched(movie.imbdId)}>X</button>
                    </div>
                  </li>
  </>
}