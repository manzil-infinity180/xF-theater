import { useState,useEffect } from "react";
const KEY = 'd21d995b';

export function useMovie(query){

  const [movies, setMovies] = useState([]);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState('');

  useEffect(function(){
    const controller = new AbortController();
      async function fetchMovie(){
        try{
        setLoading(true);
        setError("");
        
        const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,{signal:controller.signal});
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
        console.log(data.Search);
        setError("");
        
        // setLoading(false);
      }catch(err){
           console.error(err.message);
           if(err !=='AbortError'){

             setError(err.message);
           }
      }finally{
        setLoading(false);
      }
    }
    if(query.length < 3){
      setMovies([]);
      setError("");
      return;
    }
    // used for closing the moviedDetail if going to search the new movie 

    // handleCloseMovie(); 
    
    fetchMovie();
    // abortController for cleanup the data fetching 
    return function(){
      controller.abort();
    };
  },[query]);

  return {movies,loading,error};
}