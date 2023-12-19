import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import StarRating from './StarRating'
// function Test(){
//   const [movieRating,setMovieRating] = useState(0);
  
//   return (<div>
//     <StarRating color="red" maxRating={10} onSetMovieRating={setMovieRating}/>
//     <p>This movie have {movieRating} ratings</p>
//   </div>);
// }
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />

    // {/* <StarRating maxRating={5} message={['Very Bad','Bad','Okay','Good','Amazing']}/>
    // <StarRating color='#fcc419' size={48} className="test"/> */}
    // {/* <Test /> */}
);
