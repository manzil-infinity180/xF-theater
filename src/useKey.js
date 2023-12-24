import { useEffect } from "react";
export function useKey(key,Closefunction){
  useEffect(function(){
    function callBack(e){
      if(e.code.toLowerCase()===key.toLowerCase()){
        // onCloseMovie();
        Closefunction();
        console.log("Closing..."+e.code)
      }
    }
    // addEventListener and removeEventListener 
    // useEffect 
    document.addEventListener('keydown',callBack);
   // clean up function 
    return function(){
      document.removeEventListener('keydown',callBack);
    }
  },[Closefunction,key]);
}